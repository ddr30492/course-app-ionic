import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
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
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    ) { }

  ngOnInit() {
  }

  /* login method for loading controller crrate and dismis on timeout */
  authenticate(email: string, password: string){
    this.isLoading = true;
    this.authService.onLogin();
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Logging In...'})
    .then(loadingEl => {
      loadingEl.present();
      this.authService.onSignUp(email, password).subscribe((resData) => {
        console.log(resData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tab-places/discover');
      }, errRes => {
        this.loadingCtrl.dismiss();
        const code = errRes.error.error.message;
        let message = 'Could not sign you up, please try again later';
        if(code === 'EMAIL_EXISTS'){
          message = 'This email address exists already';
        }
        this.showAlert(message);
      });
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

    this.authenticate(email, password);
  }

  private showAlert(message: string){
    this.alertCtrl.create({
      header: 'Authetication Failed!',
      message,
      buttons: ['Okay']
    }).then(alertEle => alertEle.present());
  }
}
