import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places: Place[] = [
    new Place('p1','Manhattan Mansion', 'In the New York city',
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg', 300),
    new Place('p2','L\'Amour Toujou', 'In the Paris city',
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg', 200),
  ];

  get places(){
    // eslint-disable-next-line no-underscore-dangle
    return[...this._places];
  }

  constructor() { }
}
