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
import { FacebookUserModel } from '../facebook-login/facebook-user.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ResponseModel } from '../profile/profile.model';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: FormGroup;
  main_page: { component: any };
  loading: any;
  success: string;
  postResponse:ResponseModel;

  fb_email : string;
  fb_uid: string;
  username: AbstractControl;
  fbusermodel: FacebookUserModel = new FacebookUserModel();

  constructor(
    public nav: NavController,
    public modal: ModalController,
    public facebookLoginService: FacebookLoginService,
    public nativeStorage: NativeStorage,
    public googleLoginService: GoogleLoginService,
    public twitterLoginService: TwitterLoginService,
    public http: HttpClient,  
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

  doSignup()
  {
    let data = this.signup.value;
    this.goSignup('normal',data.email,'',data.password,'','');
  }

  // doFacebookSignup() {
  //     this.loading = this.loadingCtrl.create();
  //     // Here we will check if the user is already logged in
  //     // because we don't want to ask users to log in each time they open the app
  
  //     this.facebookLoginService.getFacebookUser()
  //     .then((data) => {
  //        // user is previously logged with FB and we have his data we will let him access the app
  //       console.log("data.email:"+data.email);
  //       console.log("data.userid:"+data.userId);
  //       console.log("data.name:"+data.name);
  //       this.goSignup('fb',data.email,data.userId,'',data.firstname,data.lastname);

  //     }, function(error){
  //           //we don't have the user data so we will ask him to log in
  //           this.facebookLoginService.doFacebookLogin()
  //           .then(function(res){
  //             this.loading.dismiss();
  //            // env.nav.setRoot(env.main_page.component);
  //           }, function(err){
  //             console.log("Facebook Login error", err);
  //             this.loading.dismiss();
  //           });
  //         });
  //   }
 
  goSignup(_logintype:string, email:string, userId:string, password:string, firstname:string, lastname:string) {

    this.loading = this.loadingCtrl.create();


        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
              
        let data=JSON.stringify({logintype:_logintype,username:email,uid:userId,password:password,
          firstname:firstname,lastname:lastname});
         
        this.http.post("http://api.whospets.com/api/users/signup.php",data, { headers: headers })
        .subscribe((res:ResponseModel) => { 
          this.postResponse = res; 
        
        console.log("VALUE RECEIVED: "+this.postResponse.success);
        this.loading.dismiss();

        if(this.postResponse.success==='true')
        {
          console.log('inside true');
          this.nav.setRoot(LoginPage); 
          this.loading.dismiss();
        }
        else
        {
          alert("Fail to sign up.")
          this.loading.dismiss();
        }

      }, (err) => {
        this.loading.dismiss();
        alert("Fail to sign up, please try it later.")
      }, () =>
      {
        this.loading.dismiss();
      });
    
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }





 // doSignup(){
  //   let data = this.signup.value;
 
  //   console.log('-------------------doSignup');
  //   //http://api.whospets.com/api/users/signup.php?logintype=fb&username=rickykei@yahoo.com.hk&password=1234
  //    var url = 'http://api.whospets.com/api/users/signup.php?logintype=normal&username=' + data.email + '&password='+data.password ;
  //    console.log(url);

  //    this.http.get(url).map(res => res.json()).subscribe(data2 => {
 
  //       console.log(data2.success);
    
  //         this.success = data2.success;
  //         console.log(this.success);
    
  //         if(this.success=='true')
  //         {
  //           console.log('inside true');
  //           this.nav.setRoot(LoginPage);    
  //         }
  //         else
  //         {
  //           console.log('inside false'); 
  //         }
  //       });
  //   this.nav.setRoot(LoginPage);
  // }

  // doFacebookSignup() {
  //   this.loading = this.loadingCtrl.create();
  //   // Here we will check if the user is already logged in
  //   // because we don't want to ask users to log in each time they open the app
  //   let env = this;

  //   this.facebookLoginService.getFacebookUser()
  //   .then(data => {
    
  //     console.log('-------------------doSignup');
  //     //http://api.whospets.com/api/users/signup.php?logintype=fb&username=rickykei@yahoo.com.hk&password=1234
  //      var url = 'http://api.whospets.com/api/users/signup.php?logintype=fb&username=' + data.email + '&uid='+ data.userId+ '&firstname='+data.firstname+ '&lastname='+data.lastname ;
  //      console.log(url);
  //      this.http.get(url).map(res => res.json()).subscribe(data2 => {
 
  //       console.log(data2.success);
    
  //         this.success = data2.success;
  //         console.log(this.success);
    
  //         if(this.success=='true')
  //         {
  //           console.log('inside true');
  //           this.nav.setRoot(LoginPage);    
  //         }
  //         else
  //         {
  //           console.log('inside false'); 
  //         }
  //       });
  //       env.nav.setRoot(LoginPage);
  //      // user is previously logged with FB and we have his data we will let him access the app
  //   }, function(error){
  //     //we don't have the user data so we will ask him to log in
  //     env.facebookLoginService.doFacebookLogin()
  //     .then(function(res){
  //       env.loading.dismiss();
  //      // env.nav.setRoot(env.main_page.component);
  //     }, function(err){
  //       console.log("Facebook Login error", err);
  //       env.loading.dismiss();
  //     });

      
  //   });
  // }


  doFacebookSignup() {
    console.log('-------------------doFacebookSignup ');

    this.loading = this.loadingCtrl.create();
    // Here we will check if the user is already logged in
    // because we don't want to ask users to log in each time they open the app
    let env = this;

    this.facebookLoginService.getFacebookUser()
    .then(data => {
    
      this.fbusermodel.email =data.email;
      this.fbusermodel.first_name = data.first_name;
      this.fbusermodel.last_name = data.last_name;
      console.log('-------------------doSignup , data.email :' + data.email);
      console.log('-------------------doSignup , data.firstname :' + data.first_name);
      console.log('-------------------doSignup , data.lastname :' + data.last_name);

      this.goSignup('fb',data.email,data.userId,data.password,data.first_name,data.last_name);
      
    }, function(error){
      //we don't have the user data so we will ask him to log in
      env.facebookLoginService.doFacebookLogin()
      .then(function(res){
        env.loading.dismiss();
       // env.nav.setRoot(env.main_page.component);
      }, function(err){
        console.log("Facebook Login error 3", err);
        env.loading.dismiss();
      });

      
    });
  }
}
