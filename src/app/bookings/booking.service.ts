import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({providedIn: 'root'})

export class BookingService{

  private _bookingDetails: Booking[] = [
    new Booking('xyz', 'r1', 'user-1', 'The Monsoon Palace', 4),
    new Booking('abc', 'r2', 'user-2', 'The Paris Palace', 4)
  ];

  constructor(){}

  get bookingDetails(){
    // eslint-disable-next-line no-underscore-dangle
    return [...this._bookingDetails];
  }
}
