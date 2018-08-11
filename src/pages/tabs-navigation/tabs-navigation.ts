import { Component } from '@angular/core';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { NavController } from 'ionic-angular';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

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

  posts: LoginModel = new LoginModel();
  logindata : LoginContentModel = new LoginContentModel();

  login : boolean;

  constructor(    
    public nav: NavController,
    public tabsNavigationService: TabsNavigationService,
    public nativeStorage:NativeStorage,
    public facebookLoginService: FacebookLoginService
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
          () =>  console.log('Stored item!'),
          error => console.error('Error storing item')
        );
        });
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





  // is1stLogin(){

  //   this.nativeStorage.getItem('1stLogin')
  //   .then(data => {
  //     // if there is not 1st login, do nothings
  //     return false;
  //    }, error =>
  //    {
  //     this.nav.setRoot(WalkthroughPage);

  //     this.nativeStorage.setItem('1stLogin',
  //     {       
  //       login: true,
  //     })
  //     .then(
  //       () =>  console.log('Stored item!'),
  //       error => console.error('Error storing item')
  //     );
  //     });
  //     return true;
  //   }
  


   // 1st log into this page, check is it logged user before
  //  ionViewWillEnter() {    
  //   if(!this.isLogged()){
  //     this.nav.setRoot(LoginPage);
  //   }
  // }

  // isLogged(){

  //   //debugging
  //  // return true;      
 
  //  this.nativeStorage.getItem('email_user')
  //  .then(function (data) {
       
  //   console.log(data.email);
  //   //http://api.whospets.com/api/users/login.php?username=rickykei@yahoo.com&logintype=normal&password=1234


  //   //var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + data.email + '&login&password='+data.password ;
  //   var url ='https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  //   console.log(url);

  //   this.http.get(url).subscribe(data => {
  //     console.log(data);
  //   });

  //   return false;
  // });
  // }
}
  

  //   var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + data.email + '&login&password='+data.password ;
  //   console.log(url);
  //   var response = this.http.get(url).map(res => res.json());
  //   console.log(response);

  //   response.subscribe(data => {
  //     this.posts = data.data;
  //     if(this.posts == 'true')
  //             return true;
  //     else
  //       return false;
  //   });
  //  }, function (error) {
  //      console.log(error);
  //      return false;
  //  });
   
    //  this.facebookLoginService.getFacebookUser().then((data) => {
    //   var url = 'http://api.whospets.com/api/users/login.php?logintype=fb&username=' + data.email;
    //   console.log(url);
    //   var response2 = this.http.get(url).map(res => res.json());
    //   response2.subscribe(data => {
    //       this.posts = data.data;
    //       console.log(data.data);
    //       if(this.posts == 'true')
    //       return true;
    //     else
    //       return false;
    //   });
    // }, function(error)
    // {
    //   console.log(error);
    //   return false;
    // });