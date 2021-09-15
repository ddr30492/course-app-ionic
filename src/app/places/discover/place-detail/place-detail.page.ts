import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  constructor(private navController: NavController) { }

  ngOnInit() {
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  OnBookingPlace(){
    this.navController.navigateBack('/places/tab-places/discover');
  }

}
