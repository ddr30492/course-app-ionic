import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPlacedComponent } from './placed/location-placed/location-placed.component';
import { MapModalComponent} from './map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [LocationPlacedComponent, MapModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [LocationPlacedComponent, MapModalComponent],
  entryComponents: [MapModalComponent]
})

export class SharedModule{}
