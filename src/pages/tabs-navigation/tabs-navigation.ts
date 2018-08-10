import { Component } from '@angular/core';

import { ListingPage } from '../listing/listing';
import { ProfilePage } from '../profile/profile';
import { NotificationsPage } from '../notifications/notifications';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { NavController } from 'ionic-angular';

import { Http } from '@angular/http';

import 'rxjs/add/operator/map';


@Component({
  selector: 'tabs-navigation',
  templateUrl: 'tabs-navigation.html'
})
export class TabsNavigationPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  posts : any;

  constructor(    
    public nav: NavController,
    public nativeStorage:NativeStorage,
    public http: Http,
    public facebookLoginService: FacebookLoginService
  ) {
    this.tab1Root = ListingPage;
    this.tab2Root = ProfilePage;
    this.tab3Root = NotificationsPage;
  }

   // 1st log into this page, check is it logged user before
   ionViewWillEnter() {    
    if(!this.isLogged()){
      this.nav.setRoot(LoginPage);
    }
  }

  isLogged(){

    //debugging
   // return true;      
 
   this.nativeStorage.getItem('email_user')
   .then(function (data) {
       
    console.log(data.email);
    //http://api.whospets.com/api/users/login.php?username=rickykei@yahoo.com&logintype=normal&password=1234


    var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + data.email + '&login&password='+data.password ;
    console.log(url);

    this.http.get(url).subscribe(data => {
      console.log(data);
    });

    return false;
  });
  }
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