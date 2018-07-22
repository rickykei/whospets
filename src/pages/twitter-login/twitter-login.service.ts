import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { TwitterUserModel } from './twitter-user.model';


@Injectable()
export class TwitterLoginService {
  constructor(
    public http: Http,
    public nativeStorage: NativeStorage,
    public twitter: TwitterConnect
  ){}

  doTwitterLogin()
  {
    return new Promise<TwitterUserModel>((resolve, reject) => {
      this.twitter.login().then((resp) => {
        //Getting user data
        this.twitter.showUser().then((user) => {
          //now we have the users info, let's save it in the NativeStorage
          this.setTwitterUser(user).then((res) => {
            resolve(res);
          });
        })
      }, (error) => {
        reject(error);
      });
    });
  }

  doTwitterLogout(){
    return new Promise((resolve, reject) => {
      this.twitter.logout().then((res) => {
        //user logged out so we will remove him from the NativeStorage
        this.nativeStorage.remove('twitter_user');
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  getTwitterUser()
  {
    return this.nativeStorage.getItem('twitter_user');
  }

  setTwitterUser(user: any)
  {
    console.log(user);
    return new Promise<TwitterUserModel>((resolve, reject) => {
      resolve(this.nativeStorage.setItem('twitter_user',
        {
          name: user.name,
          image: (user.profile_image_url).replace("_normal", ""),
          userId: user.id_str,
          following: user.friends_count,
          followers: user.followers_count,
          location: user.location,
          description: user.description,
          screenName: user.screen_name
        })
      );
    });
  }

}
