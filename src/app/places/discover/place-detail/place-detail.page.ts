import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placeServices: PlacesService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navController.navigateBack('/places/tab-places/discover');
        return;
      }
      this.place = this.placeServices.getPlacesId(paramMap.get('placeId'));
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  OnBookingPlace(){
    // this.navController.navigateBack('/places/tab-places/discover');
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps:{ selectedPlace: this.place}
    }).then(modalEle => {
      modalEle.present();
      return modalEle.onDidDismiss();
    }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if(resultData.role === 'confirm'){
        console.log('booked');
      }
    });
  }

}
