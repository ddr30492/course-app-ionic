import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';

@Component({
  selector: 'app-location-placed',
  templateUrl: './location-placed.component.html',
  styleUrls: ['./location-placed.component.scss'],
})
export class LocationPlacedComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onPickLocation(){
    this.modalCtrl.create({
      component: MapModalComponent,
    }).then(modalEle => {
      modalEle.present();
    });
  }

}
