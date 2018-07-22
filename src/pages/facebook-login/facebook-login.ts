import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { FacebookUserModel } from './facebook-user.model';
import { FacebookLoginService } from './facebook-login.service';

@Component({
  selector: 'facebook-login-page',
  templateUrl: 'facebook-login.html'
})
export class FacebookLoginPage {
  user: FacebookUserModel = new FacebookUserModel();
  loading: any;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad(){
    this.loading.present();

    this.facebookLoginService.getFacebookUser()
    .then((user) => {
      this.user = user;
      this.loading.dismiss();
    }, (error) => {
      console.log(error);
      this.loading.dismiss();
    });
  }

  doFacebookLogout(){
    this.facebookLoginService.doFacebookLogout()
    .then((res) => {
      this.user = new FacebookUserModel();
    }, (error) => {
      console.log("Facebook logout error", error);
    });
  }

  doFacebookLogin() {
    this.facebookLoginService.doFacebookLogin()
    .then((user) => {
      this.user = user;
    }, (err) => {
      console.log("Facebook Login error", err);
    });
  }
}
