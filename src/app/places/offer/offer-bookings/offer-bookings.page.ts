import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import {Place} from '../../place.model';
import {PlacesService} from '../../places.service';
@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

  place: Place;
  private placeSub: Subscription;

  constructor( private route: ActivatedRoute, private navCtrl: NavController, private placeServices: PlacesService) { }

  ngOnInit() {
   this.route.paramMap.subscribe(paramMap => {
     if(!paramMap.has('placeId')){
       this.navCtrl.navigateBack('/places/tab-places/offer');
       return;
     }
    //  this.place = this.placeServices.getPlacesId(paramMap.get('placeId'));
    this.placeSub = this.placeServices.getPlacesId(paramMap.get('placeId')).subscribe(placeOB => this.place = placeOB);
   });
  }
  //it is temporary not using
  offerBook(){
    this.navCtrl.navigateBack('/places/tab-places/offer');
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }
}
