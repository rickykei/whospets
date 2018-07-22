import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FirebaseSignupPage } from '../firebase-signup/firebase-signup';
import { FirebaseTabsNavigationPage } from '../firebase-tabs-navigation/firebase-tabs-navigation';
import { FirebaseAuthService } from '../firebase-auth.service';

@Component({
  selector: 'firebase-login-page',
  templateUrl: 'firebase-login.html'
})
export class FirebaseLoginPage {
  login: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public fAuthService: FirebaseAuthService
  ) {
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
  }

  doLogin(value){
    this.fAuthService.doLogin(value)
    .then(res =>{
      this.nav.push(FirebaseTabsNavigationPage);
    }, err => this.errorMessage = err.message)
  }

  doFacebookLogin() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doFacebookLogin()
    .then((res) => {
      this.nav.push(FirebaseTabsNavigationPage);
      this.loading.dismiss();
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  doGoogleLogin() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doGoogleLogin()
    .then((data) => {
       this.nav.push(FirebaseTabsNavigationPage);
       this.loading.dismiss();
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  doTwitterLogin(){
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doTwitterLogin()
    .then((data) => {
      this.nav.push(FirebaseTabsNavigationPage);
      this.loading.dismiss();
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  goToSignup() {
    this.nav.push(FirebaseSignupPage);
  }
}
