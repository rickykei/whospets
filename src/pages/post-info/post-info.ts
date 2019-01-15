import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the PostInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post-info',
  templateUrl: 'post-info.html',
})
export class PostInfoPage {

  post: PetDetailsModel = new PetDetailsModel();
  user_id:string;
  
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public PagesDisplayServiceProvider: PagesDisplayServiceProvider,
     public socialSharing: SocialSharing,
     public nativeStorage: NativeStorage
    ) {
    this.post = navParams.get('post'); 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostInfoPage');

    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log(data.profile_user_id);
      });
  }

  sharePost(post) {
    //this code is to use the social sharing plugin
    // message, subject, file, url
    this.socialSharing.share(post.description, post.title, post.image, null)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }

  likePost(post)
  {
    this.PagesDisplayServiceProvider.setlike(this.user_id, post.id, 'app_post')
      .then(response => {
        if(response.success==='true')
        {
          this.post.likecnt = this.post.likecnt+1;
        }
      });
  }
}
