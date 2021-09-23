import { Component, OnDestroy, OnInit } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private placeSub: Subscription;

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
   this.placeSub = this.placesService.places.subscribe(places => {
    this.loadedPlaces = places;
    this.relevantPlaces = this.loadedPlaces;
    this.listedLoadedPlaces = this.relevantPlaces.slice(1);
   }
  );
  //  this.loadedPlaces =  this.placesService.places;
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
    if(event.detail.value === 'all'){
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }else{
      this.relevantPlaces = this.loadedPlaces.filter(place => place.userID !== this.authService.userID);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    }
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

}
