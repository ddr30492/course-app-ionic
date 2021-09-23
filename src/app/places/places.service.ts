import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the New York city',
      'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
      300,
      new Date('01 January 2021 14:48 UTC'),
      new Date('31 December 2021 14:48 UTC'),
      'abc',
      ),
    new Place(
      'p2',
      'L\'Amour Toujou',
      'In the Paris city',
      'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
      200,
      new Date('01 January 2021 14:48 UTC'),
      new Date('31 December 2021 14:48 UTC'),
      'abc',
      ),
    new Place(
      'p3',
      'The Paris Junction',
      'In the Paris city near by Effile Tower',
      'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
      200,
      new Date('01 January 2021 14:48 UTC'),
      new Date('31 December 2021 14:48 UTC'),
      'abc',
      ),
  ]);

  get places(){
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
    // return[...this._places];
  }

  constructor(private authService: AuthService) { }

  getPlacesId(id: string){
    return this.places.pipe(take(1), map((placesss) => ({...placesss.find(p => p.id === id)})));
  }

  //create new dynamic methodfor add services
  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date){
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userID
    );
    // this._places.push(newPlace);
    return this.places.pipe(take(1), delay(1000), tap((placesss) => {
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(placesss.concat(newPlace));
    }));
  }

  updatePlaces(placeID: string, title: string, description: string,){
    return this.places.pipe(take(1), delay(1000), tap(placesE => {
      const updatePlaceIndex = placesE.findIndex(pl => pl.id === placeID);
      console.log(updatePlaceIndex);
      const updatedPlaces = [...placesE];
      console.log(updatedPlaces);
      const oldPlace = updatedPlaces[updatePlaceIndex];
      updatedPlaces[updatePlaceIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageURL,
        oldPlace.price,
        oldPlace.availabelFrom,
        oldPlace.availableTo,
        oldPlace.userID
        );

        // eslint-disable-next-line no-underscore-dangle
        this._places.next(updatedPlaces);
    }));

  }
}
