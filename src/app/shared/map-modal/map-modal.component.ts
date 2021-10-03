import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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
  @Input() center = [-122.43877, 37.75152];
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';

  map: mapboxgl.Map;
  message = 'Hello World!';
  style = 'mapbox://styles/mapbox/streets-v11';
  // eslint-disable-next-line @typescript-eslint/ban-types

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
      center: [this.center[0], this.center[1]], // starting position
      zoom: 12 // starting zoom
    });
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl());
    console.log(this.map);
    if(this.selectable){
      this.map.on('click', event => {
        const selectCoords = {
          lat: event.lngLat.lat,
          lng: event.lngLat.lng
        };
        console.log(selectCoords.lat, selectCoords.lng);
        this.modalEtrl.dismiss(selectCoords);
      });
    }
    // else{
    //   const marker = new mapboxgl.Marker() // initialize a new marker
    //   .setLngLat([this.center[0], this.center[1]]) // Marker [lng, lat] coordinates
    //   .addTo(this.map); // Add the marker to the map
    //   console.log(marker);
    // }
    // this.map.on('load', () => {
    //   this.map.resize();
    // });
  }

}
