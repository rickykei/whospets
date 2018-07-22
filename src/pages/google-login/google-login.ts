import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { GoogleUserModel } from './google-user.model';
import { GoogleLoginService } from './google-login.service';

@Component({
  selector: 'google-login-page',
  templateUrl: 'google-login.html'
})
export class GoogleLoginPage {
  user: GoogleUserModel = new GoogleUserModel();
  loading: any;

  constructor(
    public navCtrl: NavController,
    public googleLoginService: GoogleLoginService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad(){
    this.loading.present();

    this.googleLoginService.getGoogleUser()
    .then((user) => {
      this.user = user;
      this.loading.dismiss();
    }, (error) => {
      console.log(error);
      this.loading.dismiss();
    });
  }

  doGoogleLogout(){
    this.googleLoginService.doGoogleLogout()
    .then((res) => {
      this.user = new GoogleUserModel();
    }, (error) => {
      console.log("Google logout error", error);
    });
  }

  doGoogleLogin() {
    this.googleLoginService.doGoogleLogin()
    .then((user) => {
      this.user = user;
    }, (err) => {
      console.log("Google Login error", err);
    });
  }
}
