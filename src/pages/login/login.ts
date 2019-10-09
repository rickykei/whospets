import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

import { NativeStorage } from '@ionic-native/native-storage';

import { ProfileService } from '../profile/profile.service';
import { LoginModel } from '../profile/profile.model';
import { LanguageModel } from '../../providers/language/language.model';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../providers/language/language.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  email : AbstractControl;
  password : AbstractControl;
  userId :string;
 success: string;
 message: string;
 status: string;
 languages: Array<LanguageModel>;
 language:LanguageModel;

 loginInfo: LoginModel = new LoginModel();

 token:string;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
	  public nativeStorage:NativeStorage,
    public profileService: ProfileService,
    public translate: TranslateService,
    public languageService: LanguageService,
    public loadingCtrl: LoadingController
  ) {
    this.languages = this.languageService.getLanguages();

    this.main_page = { component: TabsNavigationPage }; 

    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.email = this.login.controls['email'];
    this.password = this.login.controls['password'];
  }

  doLogin(){
    let data = this.login.value;
    
    this.nativeStorage.getItem('firebase_token')
    .then(tokendata => {
       this.token = tokendata.token;

   console.log('-------------------doLogin');
    var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + data.email + '&password='+data.password + '&device_id='+this.token;
    console.log(url);

    this.profileService.getLoginData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);

      this.status = data2.success;
      if(this.status=='true')
      {
        this.loginInfo.data.id = data2.data.id; 
        this.loginInfo.data.username = data2.data.username;
        this.loginInfo.data.image = data2.data.image;
        this.loginInfo.data.message = data2.data.message;
        this.loginInfo.data.language = data2.data.language;
        this.language = (data2.data.language == 'en'? this.languages[0]:this.languages[1]);

        this.setEmailUser(this.email.value, this.password.value, '');
        this.setProfileUserId(data2.data.id +'',data2.data.language+'', false) ;
        this.setLanguage(this.language);
        

        this.nav.push(TabsNavigationPage);//ProfilePage);

      }
      else{
        this.removeEmailUser();
         //this.nav.setRoot(SignupPage);
         //alert("Email/Password Fail!");
         alert(data2.data.message);
      }
    });
  
    //get token end;
    });

    }

    setLanguage(lang: LanguageModel){
      let language_to_set = this.translate.getDefaultLang();
  
      if(lang){
        language_to_set = lang.code;
      }
      this.translate.setDefaultLang(language_to_set);
      this.translate.use(language_to_set);
    }

    setProfileUserId( _userid : string, _language:string, isFBLogin:boolean )
    {
      console.log('profile_user_id :' + _userid);

      this.nativeStorage.setItem('profile_user_id',
      {
        profile_user_id : _userid,
        profile_language: _language,
        profile_isFBuser : isFBLogin
      })
      .then(
        () =>  console.log('profile_user_id ： Stored item!'),
        error => console.error('profile_user_id : Error storing item')
      );
    }
  
  removeEmailUser(){
    this.nativeStorage.remove('email_user');
    this.nativeStorage.remove('profile_user_id');
  }

  setEmailUser(_email :string, _password:string, _uid : string)
  {
    this.nativeStorage.setItem('email_user',
    {
      email: _email,
      password: _password,
      uid : _uid
    })
    .then(
      () =>  console.log('EMAIL ： Stored item!'),
      error => console.error('Error storing item')
    );

  }

  doFacebookLogin() {
    this.loading = this.loadingCtrl.create();

    // Here we will check if the user is already logged in because we don't want to ask users to log in each time they open the app
    // let this = this;

    this.facebookLoginService.getFacebookUser()
    .then((data) => {
       // user is previously logged with FB and we have his data we will let him access the app
      console.log("data.email:"+data.email);
      console.log("data.userid:"+data.userId);
      console.log("data.name:"+data.name);
      this.language = (data.language == 'en'? this.languages[0]:this.languages[1]);

      this.setProfileUserId(data.userId +'', data.language, true);
      this.setLanguage(this.language);

       this.setEmailUser(data.email, '', data.userId);
      this.nav.setRoot(this.main_page.component);
    }, (error) => {
      //we don't have the user data so we will ask him to log in
      this.facebookLoginService.doFacebookLogin()
      .then((res) => {
        this.loading.dismiss();
        this.nav.setRoot(this.main_page.component);
      }, (err) => {
        console.log("Facebook Login error 2 ", err);
      });
    });
  }


  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }

}
