import { Component, OnDestroy, OnInit } from '@angular/core';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
   this.bookingSub = this.bookingService.bookingDetails.subscribe(bookings => this.loadedBookings = bookings);
  }

  ionViewWillEnter(){
    this.bookingService.fetchBookingDetails().subscribe();
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding){
    slidingBooking.close();
    this.loadingCtrl.create({
      message: 'Canceled Place...'
    }).then(loadingEle => {
      loadingEle.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEle.dismiss();
      });
    });
  }

  ngOnDestroy(){
    if(this.bookingSub){
      this.bookingSub.unsubscribe();
    }
  }

}
