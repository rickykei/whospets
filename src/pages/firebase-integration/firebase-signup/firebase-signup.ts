import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { FirebaseTabsNavigationPage } from '../firebase-tabs-navigation/firebase-tabs-navigation';
import { FirebaseAuthService } from '../firebase-auth.service';

@Component({
  selector: 'firebase-signup-page',
  templateUrl: 'firebase-signup.html'
})
export class FirebaseSignupPage {
  signup: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public fAuthService: FirebaseAuthService
  ) {

    this.signup = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('test', Validators.required)
    });
  }

  doSignup(value){
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doRegister(value)
    .then(res => {
      this.fAuthService.doLogin(value)
      .then(res => {
        this.nav.push(FirebaseTabsNavigationPage);
        this.loading.dismiss();
      }, error => this.errorMessage = error.message)
    }, err => this.errorMessage = err.message)
  }

  doFacebookSignup() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doFacebookLogin()
    .then((res) => {
      this.nav.push(FirebaseTabsNavigationPage);
      this.loading.dismiss();
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  doGoogleSignup() {
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doGoogleLogin()
    .then((data) => {
       this.nav.push(FirebaseTabsNavigationPage);
       this.loading.dismiss();
    }, (err) => {
        this.errorMessage = err.message;
    });
  }

  doTwitterSignup(){
    this.loading = this.loadingCtrl.create();
    this.fAuthService.doTwitterLogin()
    .then((data) => {
      this.nav.push(FirebaseTabsNavigationPage);
      this.loading.dismiss();
    }, (err) => {
        this.errorMessage = err.message;
    });
  }

}
