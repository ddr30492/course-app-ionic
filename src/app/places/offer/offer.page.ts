import { Component, OnInit } from '@angular/core';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit {

  loadOffers: Place[];

  constructor(private offerServices: PlacesService, private router: Router) { }

  ngOnInit() {
    this.loadOffers = this.offerServices.places;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding){
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tab-places', 'offer', 'edit-offer', offerId]);
    console.log('current offer is is', offerId);
  }

}
