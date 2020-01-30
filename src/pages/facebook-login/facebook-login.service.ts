import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { FacebookUserModel } from './facebook-user.model';
// import { environment } from '../../environment/environment';

@Injectable()
export class FacebookLoginService {

  constructor(
    public http: Http,
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public platform: Platform
  ){
    // this.fb.browserInit(environment.facebook_app_id, "v2.8");
  }

  // doFacebookLoginFirebase(){
  //   return new Promise<FacebookUserModel>((resolve, reject) => {
  //     //["public_profile"] is the array of permissions, you can add more if you need
  //     this.fb.login(["public_profile"]).then((response) => {
  //       //Getting name and gender properties
  //       this.fb.api("/me?fields=name,gender,firstname,lastname,email", [])
  //       .then((user) => {
  //         this.setFacebookUserFirebase(user)
  //         .then((res) => {
  //           resolve(res);
  //         });
  //       });
  //     },(err) => {
  //       reject(err);
  //     });
  //   });
  // }

  // setFacebookUserFirebase(user: any)
  // {
  //   return new Promise<FacebookUserModel>((resolve, reject) => {
  //     this.getFriendsFakeData()
  //     .then(data => {
  //       resolve({
  //         userId: user.id,
  //         name: user.name,
  //         gender: user.gender,
  //         firstname : user.firstname,
  //         lastname : user.lastname,
  //         email: user.email,
  //         image: "https://graph.facebook.com/" + user.id + "/picture?type=large",
  //         friends: data.friends,
  //         photos: data.photos
  //       })
  //     });
  //   });
  // }

  doFacebookLogin()
  {
    return new Promise<FacebookUserModel>((resolve, reject) => {
      //["public_profile"] is the array of permissions, you can add more if you need

      this.fb.login(["public_profile", "email"]).then((response) => {
        var id = response.authResponse.userID;

        //Getting name and gender properties
        this.fb.api("/"+id+"/?fields=name,gender,email", []) //first_name,last_name //['public_profile', 'user_friends', 'email']
        .then((user) => {
          //now we have the users info, let's save it in the NativeStorage
          this.setFacebookUser(user)
          .then((res) => {
              resolve(res);
          });
        })
      }, (err) => {
        reject(err);
      });
    });
  }

  doFacebookLogout()
  {
    return new Promise((resolve, reject) => {
      this.fb.logout()
      .then((res) => {
        //user logged out so we will remove him from the NativeStorage
        this.nativeStorage.remove('facebook_user');
        this.nativeStorage.remove('email_user');
        this.nativeStorage.remove('profile_user_id');

        resolve();
      }, (err) => {
        reject();
      });
    });
  }

  getFacebookUser()
  {
    return this.nativeStorage.getItem('facebook_user');
  }

  setFacebookUser(user: any)
  {
    this.nativeStorage.setItem('email_user',
    {       
      email: user.email,
      password: '',
      uid : user.id
    })
    .then(
      () =>  console.log(' what Stored item!, '+ user.email ),
      error => console.error('Error storing item')
    );

    return new Promise<FacebookUserModel>((resolve, reject) => {
      this.getFriendsFakeData()
      .then(data => {
        resolve(this.nativeStorage.setItem('facebook_user',
          {
            userId: user.id,
            name: user.name,
	          email: user.email,
            gender: user.gender,
            first_name: user.first_name,
            last_name: user.last_name,
            image: "https://graph.facebook.com/" + user.id + "/picture?type=large",
            friends: data.friends,
            photos: data.photos
          })
        );
      });

    });
  }

  getFriendsFakeData(): Promise<FacebookUserModel> {
    return this.http.get('./assets/example_data/social_integrations.json')
     .toPromise()
     .then(response => response.json() as FacebookUserModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
