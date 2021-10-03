import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { MapModalService } from './map-modal-service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  @ViewChild('map') mapEle: ElementRef;

  map: mapboxgl.Map;
  lat = -122.43877;
  lng = 37.75152;
  message = 'Hello World!';
  style= 'mapbox://styles/mapbox/streets-v11';

  constructor(private modalEtrl: ModalController, private mapService: MapModalService, private http: HttpClient) { }

  ngOnInit() {
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.mapbox.accessToken);
  }

  ngAfterViewInit(){
    this.getMapBoxMap();
  }

  onCancel(){
    this.modalEtrl.dismiss();
  }

  private getMapBoxMap(){
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      center: [this.lat, this.lng], // starting position
      zoom: 12 // starting zoom
    });
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
    console.log(this.map);
    this.map.on('click', event => {
      const selectCoords = {
        lat: event.lngLat.lat,
        lng: event.lngLat.lng
      };
      console.log(selectCoords.lat, selectCoords.lng);
      this.modalEtrl.dismiss(selectCoords);
    });
  }
}
