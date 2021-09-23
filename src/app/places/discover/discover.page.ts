import { Component, OnDestroy, OnInit } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];
  private placeSub: Subscription;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
   this.placeSub = this.placesService.places.subscribe(places =>
    this.loadedPlaces = places
  );
  //  this.loadedPlaces =  this.placesService.places;
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

}
