import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  constructor(private modalEtrl: ModalController) { }

  ngOnInit() {}

  ngAfterViewInit(){
    this.getMapBoxMap();
  }

  onCancel(){
    this.modalEtrl.dismiss();
  }

  private getMapBoxMap(){
    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js';
    const linkCss = document.createElement('link');
    linkCss.rel = 'stylesheet';
    linkCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css';
    document.head.appendChild(linkCss);
    document.body.appendChild(script);
  }
}
