import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import  { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

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

  private _user = new BehaviorSubject<User>(null);
  get userID(){
    // eslint-disable-next-line no-underscore-dangle
    return this._user.asObservable().pipe(
      map(user => {
        if(user){
          return user.id;
        } else{
          return null;
        }
      })
    );
  }

  get isUserAuthenticated(){
    // eslint-disable-next-line no-underscore-dangle
    return this._user.asObservable().pipe(
      map(user => {
        if(user){
          return !!user.token;
        } else{
          return false;
        }
      })
    );
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
    ).pipe(
      tap(
        this.setUserData.bind(this)
      )
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
    ).pipe(
      tap(
        this.setUserData.bind(this)
      )
    );
  }

  onLogOut(){
    // eslint-disable-next-line no-underscore-dangle
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData){
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    // eslint-disable-next-line no-underscore-dangle
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));
  }
}
