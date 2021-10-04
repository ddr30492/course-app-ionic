import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import  { map, tap } from 'rxjs/operators';
import { Storage } from '@Capacitor/storage';
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


  autoLogin(){
    return from(Storage.get({key: 'authdata'})).pipe(
      map(storeData => {
        if(!storeData || !storeData.value){
          return null;
        }
        const parsedData = JSON.parse(storeData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if(expirationTime <= new Date()){
          return null;
        }
        const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
        return user;
      }),
      tap(user => {
        if(user){
          // eslint-disable-next-line no-underscore-dangle
          this._user.next(user);
        }
      }),
      map(user => !!user)
    );
  }

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
       password,
       returnSecureToken: true
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
    Storage.remove({key: 'authdata'});
  }

  private setUserData(userData: AuthResponseData){
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));
    // eslint-disable-next-line no-underscore-dangle
    this._user.next(new User(userData.localId, userData.email, userData.idToken, expirationTime));

    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string){
    // eslint-disable-next-line object-shorthand
    const data = JSON.stringify({userId: userId, token: token, tokenExpirationDate: tokenExpirationDate, email: email});
    Storage.set({key: 'authdata', value: data});
  }
}
