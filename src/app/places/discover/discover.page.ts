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
  isLoading = false;
  private placeSub: Subscription;

  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placeSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      console.log('loaded places', this.loadedPlaces);
      this.relevantPlaces = this.loadedPlaces;
      console.log('relevant places', this.relevantPlaces);
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      console.log('liste loaded places', this.listedLoadedPlaces);
    }
    );
    //  this.loadedPlaces =  this.placesService.places;
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  segmentChanged(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
    this.authService.userID.pipe(take(1)).subscribe(userId => {
      if(event.detail.value === 'all'){
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }else{
        this.relevantPlaces = this.loadedPlaces.filter(place => place.userID !== userId);
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

  ngOnDestroy(){
    if(this.placeSub){
      this.placeSub.unsubscribe();
    }
  }

}
