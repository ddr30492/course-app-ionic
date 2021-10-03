import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAutheticateUser = true;
  private _userID = 'xyz';

  get userID(){
    // eslint-disable-next-line no-underscore-dangle
    return this._userID;
  }

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
