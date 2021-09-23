import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({providedIn: 'root'})

export class BookingService{

  private _bookingDetails = new BehaviorSubject<Booking[]>([

  ]);

  constructor(private authService: AuthService){}

  get bookingDetails(){
    // eslint-disable-next-line no-underscore-dangle
    return this._bookingDetails.asObservable();
  }

  addBooking(
    placeID: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date)
    {
      const newBooking= new Booking(
        Math.random().toString(),
        placeID,
        this.authService.userID,
        placeImage,
        firstName,
        lastName,
        placeTitle,
        guestNumber,
        dateFrom,
        dateTo
      );
      return this.bookingDetails.pipe(take(1), delay(1000), tap(bookings => {
        // eslint-disable-next-line no-underscore-dangle
        this._bookingDetails.next(bookings.concat(newBooking));
      }));
    }

  cancelBooking(bookingId: string){
    return this.bookingDetails.pipe(take(1), delay(1000), tap(bookings => {
      // eslint-disable-next-line no-underscore-dangle
      this._bookingDetails.next(bookings.filter(b => b.id !== bookingId));
    }));
  }
}
