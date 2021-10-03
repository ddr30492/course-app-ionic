import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { delay, map, take, tap, switchMap, retryWhen } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { PlaceLocation } from './location.model';

// new Place(
//   'p1',
//   'Manhattan Mansion',
//   'In the New York city',
//   'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
//   300,
//   new Date('01 January 2021 14:48 UTC'),
//   new Date('31 December 2021 14:48 UTC'),
//   'abc',
//   ),
// new Place(
//   'p2',
//   'L\'Amour Toujou',
//   'In the Paris city',
//   'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
//   200,
//   new Date('01 January 2021 14:48 UTC'),
//   new Date('31 December 2021 14:48 UTC'),
//   'abc',
//   ),
// new Place(
//   'p3',
//   'The Paris Junction',
//   'In the Paris city near by Effile Tower',
//   'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
//   200,
//   new Date('01 January 2021 14:48 UTC'),
//   new Date('31 December 2021 14:48 UTC'),
//   'abc',
//   ),

interface PlaceData {
  availabelFrom: string;
  availableTo: string;
  description: string;
  imageURL: string;
  price: number;
  title: string;
  userID: string;
  location: PlaceLocation;
}
@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

  get places(){
    // eslint-disable-next-line no-underscore-dangle
    return this._places.asObservable();
    // return[...this._places];
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces(){
    return this.http
      .get<{[key: string]: PlaceData}>('https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/offered-place.json')
      .pipe(map(resData => {
        console.log(resData);
        const places = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key)){
            const resMData = places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageURL,
              resData[key].price,
              new Date(resData[key].availabelFrom),
              new Date(resData[key].availableTo),
              resData[key].userID,
              resData[key].location
            ));
          }
        }
        return places;
        // return [];
      }),
      tap(places => {
        console.log(places);
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(places);
      })
    );
  }

  getPlacesId(id: string){
    // return this.places.pipe(take(1), map((placesss) => ({...placesss.find(p => p.id === id)})));
    return this.http
    .get<PlaceData>(`https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/offered-place/${id}.json`)
    .pipe(map(placeData => new Place(
        id,
        placeData.title,
        placeData.description,
        placeData.imageURL,
        placeData.price,
        new Date(placeData.availabelFrom),
        new Date(placeData.availableTo),
        placeData.userID,
        placeData.location
    )));
  }

  //create new dynamic methodfor add services
  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation){
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://upload.wikimedia.org/wikipedia/commons/f/fc/2014_Morris-Jumel_Mansion_from_southwest.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userID,
      location
    );
    // this._places.push(newPlace);
    return this.http
    .post<{name: string}>('https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/offered-place.json',
      {
        ...newPlace,
        id: null
      })
      .pipe(
        switchMap(resData => {
          console.log(resData);
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((placesss) => {
          newPlace.id = generatedId;
          // eslint-disable-next-line no-underscore-dangle
          this._places.next(placesss.concat(newPlace));
        })
      );
    // return this.places.pipe(take(1), delay(1000), tap((placesss) => {
    //     // eslint-disable-next-line no-underscore-dangle
    //     this._places.next(placesss.concat(newPlace));
    // }));
  }

  updatePlaces(placeID: string, title: string, description: string,){
    console.log(placeID);
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((placesE) => {
        if(!placesE || placesE.length <= 0){
          return this.fetchPlaces();
        }else{
          return of(placesE);
        }
      }),
      switchMap((places) => {
        const updatePlaceIndex = places.findIndex(pl => pl.id === placeID);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatePlaceIndex];
        console.log(oldPlace);
        updatedPlaces[updatePlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageURL,
          oldPlace.price,
          oldPlace.availabelFrom,
          oldPlace.availableTo,
          oldPlace.userID,
          oldPlace.location
          );
        return this.http.put(`https://ionic-angular-bnb-3a453-default-rtdb.firebaseio.com/offered-place/${placeID}.json`,
          { ...updatedPlaces[updatePlaceIndex], id: null}
        );
      }),
      tap(() => {
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(updatedPlaces);
    }));

  }
}
