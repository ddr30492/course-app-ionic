import { Component, OnDestroy, OnInit } from '@angular/core';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit, OnDestroy {

  loadOffers: Place[];
  isLoading = false;
  private placeSub: Subscription;

  constructor(private offerServices: PlacesService, private router: Router) { }

  ionViewWillEnter(){
    this.isLoading = true;
    this.offerServices.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.placeSub = this.offerServices.places.subscribe((places) => this.loadOffers = places);
  }

  onEdit(offerId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tab-places', 'offer', 'edit-offer', offerId]);
    console.log('current offer is is', offerId);
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

}
