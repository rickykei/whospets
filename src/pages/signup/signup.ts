import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { GoogleLoginService } from '../google-login/google-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';


import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { LoginPage } from '../login/login';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: FormGroup;
  main_page: { component: any };
  loading: any;
  success: string;
  

  fb_email : string;
  fb_uid: string;
  username: AbstractControl;

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public facebookLoginService: FacebookLoginService,
    public googleLoginService: GoogleLoginService,
    public twitterLoginService: TwitterLoginService,
    private http: Http,
    public loadingCtrl: LoadingController
  ) {
    this.main_page = { component: TabsNavigationPage };

    this.signup = new FormGroup({
      username : new FormControl(''),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
    });

    this.username =  this.signup.controls['username'];
  }

  doSignup(){
    let data = this.signup.value;
 
    console.log('-------------------doSignup');
    //http://api.whospets.com/api/users/signup.php?logintype=fb&username=rickykei@yahoo.com.hk&password=1234
     var url = 'http://api.whospets.com/api/users/signup.php?logintype=normal&username=' + data.email + '&password='+data.password ;
     console.log(url);

     this.http.get(url).map(res => res.json()).subscribe(data2 => {
 
        console.log(data2.success);
    
          this.success = data2.success;
          console.log(this.success);
    
          if(this.success=='true')
          {
            console.log('inside true');
            this.nav.setRoot(LoginPage);    
          }
          else
          {
            console.log('inside false'); 
          }
        });
    this.nav.setRoot(LoginPage);
  }

  doFacebookSignup() {
    this.loading = this.loadingCtrl.create();
    // Here we will check if the user is already logged in
    // because we don't want to ask users to log in each time they open the app
    let env = this;

    this.facebookLoginService.getFacebookUser()
    .then(data => {
    
      console.log('-------------------doSignup');
      //http://api.whospets.com/api/users/signup.php?logintype=fb&username=rickykei@yahoo.com.hk&password=1234
       var url = 'http://api.whospets.com/api/users/signup.php?logintype=fb&username=' + data.email + '&uid='+ data.userId+ '&firstname='+data.firstname+ '&lastname='+data.lastname ;
       console.log(url);
       this.http.get(url).map(res => res.json()).subscribe(data2 => {
 
        console.log(data2.success);
    
          this.success = data2.success;
          console.log(this.success);
    
          if(this.success=='true')
          {
            console.log('inside true');
            this.nav.setRoot(LoginPage);    
          }
          else
          {
            console.log('inside false'); 
          }
        });
        env.nav.setRoot(LoginPage);
       // user is previously logged with FB and we have his data we will let him access the app
    }, function(error){
      //we don't have the user data so we will ask him to log in
      env.facebookLoginService.doFacebookLogin()
      .then(function(res){
        env.loading.dismiss();
       // env.nav.setRoot(env.main_page.component);
      }, function(err){
        console.log("Facebook Login error", err);
        env.loading.dismiss();
      });

      
    });
  }

  // doTwitterSignup() {
  //   this.loading = this.loadingCtrl.create();
  //   // Here we will check if the user is already logged in
  //   // because we don't want to ask users to log in each time they open the app
  //   let env = this;

  //   this.twitterLoginService.getTwitterUser()
  //   .then(function(data) {
  //      // user is previously logged with FB and we have his data we will let him access the app
  //     env.nav.setRoot(env.main_page.component);
  //   }, function(error){
  //     //we don't have the user data so we will ask him to log in
  //     env.twitterLoginService.doTwitterLogin()
  //     .then(function(res){
  //       env.loading.dismiss();
  //       env.nav.setRoot(env.main_page.component);
  //     }, function(err){
  //       console.log("Facebook Login error", err);
  //       env.loading.dismiss();
  //     });
  //   });
  // }

  // doGoogleSignup() {
  //   this.loading = this.loadingCtrl.create();

  //   // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
  //   let env = this;

  //   this.googleLoginService.trySilentLogin()
  //   .then(function(data) {
  //      // user is previously logged with Google and we have his data we will let him access the app
  //     env.nav.setRoot(env.main_page.component);
  //   }, function(error){
  //     //we don't have the user data so we will ask him to log in
  //     env.googleLoginService.doGoogleLogin()
  //     .then(function(res){
  //       env.loading.dismiss();
  //       env.nav.setRoot(env.main_page.component);
  //     }, function(err){
  //       console.log("Google Login error", err);
  //       env.loading.dismiss();
  //     });
  //   });
  // }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

}
