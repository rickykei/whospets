import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import 'rxjs/Rx';

import { FeedModel, DataModel,FeedPostModel} from './feed.model';
import { FeedService } from './feed.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AddpetPage } from '../addpet/addpet';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';

@Component({
  selector: 'feed-page',
  templateUrl: 'feed.html'
})
export class FeedPage {
  feed: FeedModel = new FeedModel();
  feeddata : DataModel = new DataModel();
  details: Array<FeedPostModel>;
  user_id:number;

  constructor(
    public nav: NavController,
    public feedService: FeedService,
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public socialSharing: SocialSharing
  ) {
    this.feed.category = navParams.get('category');
 
  }


  ionViewDidLoad() {
  console.log('feed.ts');
    this.feedService
      .getPosts(this.feed.category.catid)
      .then(posts => {
	   console.log('feed.ts.getpost');
      //  this.feed.posts = posts;
		this.feed.success =  posts.success;
        this.feed.data = posts.data;
        this.feeddata = posts.data;
        this.details = posts.data.pets;

        console.log('post :' + this.feed.success);
      });

      this.nativeStorage.getItem('profile_user_id')
      .then(data => {
          this.user_id = data.profile_user_id;
           console.log(data.profile_user_id);
        });
  }

  goToProfile(event, item) {
    this.nav.push(ProfilePage, {
      user: item
    });
  }

  setPet()
  {
    this.nav.push(AddpetPage, {profile:this.user_id});
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
}
