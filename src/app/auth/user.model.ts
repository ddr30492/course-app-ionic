export class User{
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date,
  ){}

  get token(){
    if(!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()){
      return null;
    }
    // eslint-disable-next-line no-underscore-dangle
    return this._token;
  }

  get tokenDuration(){
    if(!this.token){
      return 0;
    }
    // return 10000;
    console.log(this.tokenExpirationDate.getTime() - new Date().getTime());
    return this.tokenExpirationDate.getTime() - new Date().getTime();
  }
}
