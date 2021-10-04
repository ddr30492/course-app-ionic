import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

interface BookingData {
  bookedFrom: string;
  bookedTo: string;
  firstName: string;
  guestNumber: number;
  imageUrl: string;
  lastName: string;
  placeId: string;
  placeTitle: string;
  userId: string;
}
@Injectable({providedIn: 'root'})

export class BookingService{

  private _bookingDetails = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService, private http: HttpClient){}

  get bookingDetails(){
    // eslint-disable-next-line no-underscore-dangle
    console.log(this._bookingDetails);
    // eslint-disable-next-line no-underscore-dangle
    return this._bookingDetails.asObservable();
  }

  fetchBookingDetails(){
    return this.authService.userID.pipe(take(1), switchMap(userId => {
      console.log(userId);
        if(!userId){
          throw new Error('User not found!!!');
        }
        return this.http
        .get<{[key: string]: BookingData}>(
          `https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/booked-place.json?userId="${userId}"`);
        }),map((resData) => {
          console.log(resData);
          const bookings = [];
          console.log(resData);
          for(const key in resData){
            if(resData.hasOwnProperty(key)){
              console.log(resData[key].userId);
              bookings.push(new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].imageUrl,
                  resData[key].firstName,
                  resData[key].lastName,
                  resData[key].placeTitle,
                  resData[key].guestNumber,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo),
                ));
            }
          }
          return bookings;
        }),
        // eslint-disable-next-line no-underscore-dangle
        tap(bookings => this._bookingDetails.next(bookings))
      );
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
      let generatedId: string;
      let newBooking: Booking;
      return this.authService.userID.pipe(
        take(1),
        switchMap(userId => {
          if(!userId){
            throw new Error('No user id found!!!');
          }
          newBooking= new Booking(
            Math.random().toString(),
            placeID,
            userId,
            placeImage,
            firstName,
            lastName,
            placeTitle,
            guestNumber,
            dateFrom,
            dateTo
          );
          return this.http
          .post<{name: string}>('https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/booked-place.json', {
            ...newBooking, id:null
          });
        }),
        switchMap(resData => {
          console.log(resData);
          generatedId = resData.name;
          return this.bookingDetails;
        }),
        take(1),
        tap(bookings => {
          newBooking.id = generatedId;
          // eslint-disable-next-line no-underscore-dangle
          this._bookingDetails.next(bookings.concat(newBooking));
        })
      );
      // return this.bookingDetails.pipe(take(1), delay(1000), tap(bookings => {
      //   // eslint-disable-next-line no-underscore-dangle
      //   this._bookingDetails.next(bookings.concat(newBooking));
      // }));
    }

  cancelBooking(bookingId: string){
    return this.http
      .delete(`https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/booked-place/${bookingId}.json`)
      .pipe(
        switchMap(() => this.bookingDetails),
        take(1),
        tap(bookings => {
          // eslint-disable-next-line no-underscore-dangle
          this._bookingDetails.next(bookings.filter(b => b.id !== bookingId));
        })
      );
    // return this.bookingDetails.pipe(take(1), delay(1000), tap(bookings => {
    //   // eslint-disable-next-line no-underscore-dangle
    //   this._bookingDetails.next(bookings.filter(b => b.id !== bookingId));
    // }));
  }
}
