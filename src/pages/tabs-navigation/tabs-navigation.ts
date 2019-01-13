import { Component, ViewChild } from '@angular/core';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { NavController, NavParams, Tabs } from 'ionic-angular';

import { LoginModel, LoginContentModel } from './tabs-navigation.model';
import { TabsNavigationService } from './tabs-navigation.service';

import 'rxjs/Rx';
import { WalkthroughPage } from '../walkthrough/walkthrough';



@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  @ViewChild('myTab') tabRef: Tabs;
 
  posts: LoginModel = new LoginModel();
  logindata : LoginContentModel = new LoginContentModel();

  login : boolean;
  tabs: number;

  constructor(    
    public nav: NavController,
    public tabsNavigationService: TabsNavigationService,
    public nativeStorage:NativeStorage,
    public facebookLoginService: FacebookLoginService,
    public navParams: NavParams
    ) {
    this.tab1Root = ListingPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = NotificationsPage;
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
        this.tabRef.select(0);
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