import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  /* login method for loading controller crrate and dismis on timeout */
  onLogin(){
    this.isLoading = true;
    this.authService.onLogin();
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Logging In...'})
    .then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tab-places/discover');
      }, 2000);
    });
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }

  //on submit form ngform
  onSubmit(form: NgForm){
    if(!form.valid){
      return true;
    }

    const email = form.value.email;
    const password = form.value.password;

    if(this.isLogin){
      //send request to the login server
      console.log('in if');
    }else{
      console.log('in else');
      //send request to the signup server
      this.authService.onSignUp(email, password).subscribe((resData) => {
        console.log(resData);
      });
    }
  }
}
