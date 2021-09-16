import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAutheticateUser = false;

  get isUserAuthenticated(){
    // eslint-disable-next-line no-underscore-dangle
    return this._isAutheticateUser;
  }

  constructor() { }

  onLogin(){
    // eslint-disable-next-line no-underscore-dangle
    this._isAutheticateUser = true;
  }

  onLogOut(){
    // eslint-disable-next-line no-underscore-dangle
    this._isAutheticateUser = false;
  }
}