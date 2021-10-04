import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AuthResponseData{
  kind: string;
  idToken: string;
  email: string;
  refreshToken:	string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAutheticateUser = false;
  private _userID = null;

  get userID(){
    // eslint-disable-next-line no-underscore-dangle
    return this._userID;
  }

  get isUserAuthenticated(){
    // eslint-disable-next-line no-underscore-dangle
    return this._isAutheticateUser;
  }

  constructor(private http: HttpClient) { }

  onSignUp(email: string, password: string){
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireBaseAPIKey}`,{
        // eslint-disable-next-line object-shorthand
        email:email,
        // eslint-disable-next-line object-shorthand
        password:password,
        returnSecureToken: true
      }
    );
  }

  onLogin(email: string, password: string){
    // eslint-disable-next-line no-underscore-dangle
    // this._isAutheticateUser = true;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseAPIKey}`, {
       email,
       password
      }
    );
  }

  onLogOut(){
    // eslint-disable-next-line no-underscore-dangle
    this._isAutheticateUser = false;
  }
}
