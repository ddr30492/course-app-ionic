import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Place;

  constructor(private route: ActivatedRoute, private navController: NavController, private placeServices: PlacesService) { }

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
    this.navController.navigateBack('/places/tab-places/discover');
  }

}
