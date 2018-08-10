import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
 message: string;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
   // public googleLoginService: GoogleLoginService,
    //public twitterLoginService: TwitterLoginService,
	 private http: Http,
    public loadingCtrl: LoadingController
  ) {
	  
	   
    this.main_page = { component: TabsNavigationPage };

	  
    this.login = new FormGroup({
      email: new FormControl('rickykei@yahoo.com', Validators.required),
      password: new FormControl('1234', Validators.required)
    });
  }

  doLogin(){
	  let data = this.login.value;
 
   console.log('-------------------doLogin');
    var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + data.email + '&password='+data.password ;
    console.log(url);
	 
	 this.http.get(url).map(res => res.json()).subscribe(data2 => {
     
		console.log(data2.data);
		console.log(data2.success);
    });
	
	
	
    this.nav.setRoot(this.main_page.component);
  }

  doFacebookLogin() {
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    // let this = this;

    this.facebookLoginService.getFacebookUser()
    .then((data) => {
       // user is previously logged with FB and we have his data we will let him access the app
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.facebookLoginService.doFacebookLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log("Facebook Login error", err);
      });
    });
  }
/*
  doGoogleLogin() {
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app

    this.googleLoginService.trySilentLogin()
    .then((data) => {
       // user is previously logged with Google and we have his data we will let him access the app
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.googleLoginService.doGoogleLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log("Google Login error", err);
      });
    });
  }

  doTwitterLogin(){
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app

    this.twitterLoginService.getTwitterUser()
    .then((data) => {
       // user is previously logged with FB and we have his data we will let him access the app
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.twitterLoginService.doTwitterLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log("Twitter Login error", err);
      });
    });
  }*/

  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

}
