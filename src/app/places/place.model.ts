import { PlaceLocation } from './location.model';

export class Place{
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageURL: string,
    public price: number,
    public availabelFrom: Date,
    public availableTo: Date,
    public userID: string,
    public location: PlaceLocation
  ){};
}
