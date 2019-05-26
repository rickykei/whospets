import { Component, ViewChild } from '@angular/core';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { DisplayfollowerPage } from '../displayfollower/displayfollower';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { NavController, NavParams, Tabs, ToastController } from 'ionic-angular';

import { LoginModel, LoginContentModel } from './tabs-navigation.model';
import { TabsNavigationService } from './tabs-navigation.service';

import 'rxjs/Rx';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { UserModel } from '../profile/profile.model';
import { LanguageModel } from '../../providers/language/language.model';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../providers/language/language.service';
import { FcmProvider } from '../../providers/fcm/fcm';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;
  languages: Array<LanguageModel>;
  language:LanguageModel;

  @ViewChild('myTab') tabRef: Tabs;
 
  posts: LoginModel = new LoginModel();
  logindata : LoginContentModel = new LoginContentModel();
  profile: UserModel= new UserModel();

  login : boolean;
  tabs: number;

  constructor(    
    public nav: NavController,
    public tabsNavigationService: TabsNavigationService,
    public nativeStorage:NativeStorage,
    public translate: TranslateService,
    public languageService: LanguageService,
    public facebookLoginService: FacebookLoginService,
    public navParams: NavParams
    , public fcm :FcmProvider
    , public toastCtrl: ToastController
    ) {
    this.tab1Root = ListingPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = DisplayfollowerPage;
    this.languages = this.languageService.getLanguages();

  }
 
  ionViewDidLoad() {
    this.nativeStorage.getItem('1stLogin')
      .then(data => {
        // if there is not 1st login, do nothings
        this.checkLogged();
       }, error =>
       {
        this.nav.setRoot(WalkthroughPage);

        this.nativeStorage.setItem('1stLogin',
        {       
          login: true,
        })
        .then(
          () =>  console.log('1sr login , Stored item!'),
          error => console.error('Error storing item')
        );
        });             
     //   this.tabRef.select(0);

     //FCM
     this.fcm.getToken();
     this.fcm.listenToNotifications().pipe(
       tap(msg => {
        const toast = this.toastCtrl.create({
          message: msg.body,
          duration:3000
        });
        toast.present();
       })
     ).subscribe();
  }


  checkLogged(){

    this.nativeStorage.getItem('email_user')
    .then(data => {
      console.log(data.email);
      console.log(data.password);

      this.logindata.email = data.email;
      this.logindata.password = data.password;
      this.logindata.uid = data.uid;
      console.log('thislogindata : ' + this.logindata.email);

      this.checkNormalLogin(this.logindata.email, this.logindata.password , this.logindata.uid);

     }, error =>
     {
       console.log(error);
       this.nav.setRoot(LoginPage);    
      });
  }
 
  setProfileUserId( _userid : string , _language:string)
  {
    console.log('profile_user_id :' + _userid);

    this.nativeStorage.setItem('profile_user_id',
    {
      profile_user_id : _userid,
      profile_language: _language

    })
    .then(
      () =>  console.log('profile_user_id ： Stored item!'),
      error => console.error('profile_user_id : Error storing item')
    );
  }

  checkNormalLogin(email :string, password: string, uid :string) {
    console.log('1'+ email);
     console.log('1' + password);
     console.log('1' + uid);

     if(password=='')
     {
      this.tabsNavigationService
      .getFBData(email, uid)
      .then(data2 => {
        console.log(data2.success);
        this.posts.success = data2.success;
      if(this.posts.success=='true')
      {
        this.profile = data2.data;
        this.setProfileUserId(data2.data.id+"", data2.data.language);
        this.language = (data2.data.language == 'en'? this.languages[0]:this.languages[1]);
        this.setLanguage(this.language);

      }
      else
      {
        this.nav.setRoot(LoginPage);
      }  
      }, error =>
      {
        console.log(error);
      });
     }
    else
    {
      this.tabsNavigationService
      .getData(email, password)
      .then(data2 => {
        console.log(data2.success);
        this.posts.success = data2.success;
      if(this.posts.success=='true')
      {
        this.profile = data2.data;
        this.language = (data2.data.language == 'en'? this.languages[0]:this.languages[1]);

        this.setProfileUserId(data2.data.id+"", data2.data.language);
        this.setLanguage(this.language);
      }
      else
      {
        this.nav.setRoot(LoginPage);
      }  
      }, error =>
      {
        console.log(error);
      });
    }
    
    }

    setLanguage(lang: LanguageModel){
      let language_to_set = this.translate.getDefaultLang();
  
      if(lang){
        language_to_set = lang.code;
      }
      this.translate.setDefaultLang(language_to_set);
      this.translate.use(language_to_set);
    }
 
}
  


 
   // 1st log into this page, check is it logged user before
  //  ionViewWillEnter() {    
  //   if(!this.isLogged()){
  //    // this.nav.setRoot(LoginPage);
  //   }
  // }

  // isLogged(){
     
  //  this.nativeStorage.getItem('email_user')
  //  .then(function (data) {
       
  //   console.log(data.email);
  //   var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + data.email + '&login&password='+data.password ;
  //   console.log(url);

  //   this.http.get(url).subscribe(data => {
  //     console.log(data);
  //   });

  //   return true;
  // });
  // }