import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { TwitterUserModel } from './twitter-user.model';
import { TwitterLoginService } from './twitter-login.service';

@Component({
  selector: 'twitter-login-page',
  templateUrl: 'twitter-login.html'
})
export class TwitterLoginPage {
  user: TwitterUserModel = new TwitterUserModel();
  loading: any;

  constructor(
    public navCtrl: NavController,
    public twitterLoginService: TwitterLoginService,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad(){
    this.loading.present();

    this.twitterLoginService.getTwitterUser()
    .then((user) => {
      this.user = user;
      this.loading.dismiss();
    }, (err) => {
      console.log(err);
      this.loading.dismiss();
    });
  }

  doTwitterLogout(){
    this.twitterLoginService.doTwitterLogout()
    .then((res) => {
      this.user = new TwitterUserModel();
    }, (err) => {
      console.log("Twitter logout error", err);
    });
  }

  doTwitterLogin() {
    this.twitterLoginService.doTwitterLogin()
    .then((user) => {
      this.user = user;
    }, (err) => {
      console.log("Twitter Login error", err);
    });
  }
}
