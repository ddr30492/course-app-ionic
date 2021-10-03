import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { PlaceLocation } from '../../../places/location.model';
import { environment } from '../../../../environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-location-placed',
  templateUrl: './location-placed.component.html',
  styleUrls: ['./location-placed.component.scss'],
})
export class LocationPlacedComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  isLoading = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {}

  onPickLocation(){
    this.modalCtrl.create({
      component: MapModalComponent,
    }).then(modalEle => {
      modalEle.onDidDismiss().then(modalData => {
        console.log('modal data', modalData);
        if(!modalData){
          return;
        }
        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        };
        this.isLoading = true;
        this.getElevation(modalData.data.lat, modalData.data.lng).pipe(
          switchMap((address) => {
            console.log(address);
            pickedLocation.address = address;
            return of(this.getImageMap(pickedLocation.lat, pickedLocation.lng, 14));
          })
        ).subscribe(staticMapImageUrl => {
          pickedLocation.staticMapImageUrl  = staticMapImageUrl;
          this.selectedLocationImage = staticMapImageUrl;
          this.isLoading = false;
          this.locationPick.emit(pickedLocation);
        });
      });
      modalEle.present();
    });
  }

  private getElevation(lat: number, lng: number){
    return this.http.
    get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},
    ${lat}.json?access_token=${environment.mapbox.accessToken}`).
    pipe(
      map(geoData => {
        console.log('geodata', geoData);
        if(!geoData || !geoData.features || geoData.features.length === 0){
          return null;
        }
        return geoData.features[0].place_name;
      })
    );
  }

  private getImageMap(lat: number, lng: number, zoom: number){
    // eslint-disable-next-line max-len
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/pin-s-l+ff0000(${lng},${lat})/${lng},${lat},${zoom}/500x300?access_token=${environment.mapbox.accessToken}`;
  }

}

