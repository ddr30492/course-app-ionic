import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit {

  loadOffers: Place[];

  constructor(private offerServices: PlacesService) { }

  ngOnInit() {
    this.loadOffers = this.offerServices.places;
  }

}
