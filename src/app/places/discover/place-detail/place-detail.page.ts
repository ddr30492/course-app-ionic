import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Place;
  private placeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placeServices: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navController.navigateBack('/places/tab-places/discover');
        return;
      }
      // this.place = this.placeServices.getPlacesId(paramMap.get('placeId'));
      this.placeSub = this.placeServices.getPlacesId(paramMap.get('placeId')).subscribe(place1 => this.place = place1);

    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  OnBookingPlace(){
    // this.navController.navigateBack('/places/tab-places/discover');
    this.actionSheetCtrl.create({
      header:'Choose an Action',
      buttons:[
        {
          text: 'Select Date',
          handler: () => this.onActionSheetCtrl('select')
        },
        {
          text: 'Random Date',
          handler: () => this.onActionSheetCtrl('random')
        },
        {
          text: 'Cancel',
          role: 'destructive'
        }
      ]
    }).then(actionsheetEle => {
      actionsheetEle.present();
    });
  }

  onActionSheetCtrl(mode: 'select' | 'random'){
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps:{ selectedPlace: this.place, selectedMode: mode}
    }).then(modalEle => {
      console.log(mode);
      modalEle.present();
      return modalEle.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if(resultData.role === 'confirm'){
        this.loadingCtrl.create({
          message: 'Booking Place...'
        }).then(loadingEle => {
          loadingEle.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageURL,
            data.firstName,
            data.lastName,
            data.guests,
            data.fromDate,
            data.toDate,
          ).subscribe(() => {
            loadingEle.dismiss();
          });
        });
        // console.log('booked');
      }
    });
    console.log(mode);
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
