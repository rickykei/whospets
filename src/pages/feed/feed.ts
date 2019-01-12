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
  user_id: number;
  user_name: string;

  constructor(
    public nav: NavController,
    public feedService: FeedService,
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public socialSharing: SocialSharing
  ) {
    this.feed.category = navParams.get('category');
 
  }

  ionViewDidEnter()
  {
    this.getContent();
  }

  ionViewDidLoad() {
  console.log('feed.ts');
   
  //this.getContent();

      this.nativeStorage.getItem('profile_user_id')
      .then(data => {
          this.user_id = data.profile_user_id;
          this.user_name = data.profile_user_name;

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
    this.nav.push(AddpetPage, {user_id:this.user_id, user_name:this.user_name});
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

 getContent()
 {
  this.feedService
  .getPosts(this.feed.category.catid,10,0)
  .then(posts => {
   console.log('feed.ts.getpost');
   //  this.feed.posts = posts;
   this.feed.success =  posts.success;
    //this.feed.data = posts.data;
    //this.feeddata = posts.data;
    this.details=posts.data.pets;

    console.log('post :' + this.feed.success);
  });
 }
 
 doRefresh(refresher) {
  console.log('Begin async operation', refresher);
  this.getContent();

  setTimeout(() => {
    console.log('Async operation has ended');
    refresher.complete();
  }, 2000);
 }

 doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.feedService
	  .getPosts(this.feed.category.catid,10,this.details.length)
	  .then(posts => {
		console.log('feed.ts.getpost');
		console.log(posts.data.pets.length);
		this.feed.success =  posts.success;
		 for(let i=0; i<posts.data.pets.length; i++) {
			console.log('postdata looop'+i); 
			this.details.push(posts.data.pets[i]);
		}
		console.log('post :' + this.feed.success);
	  });

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }
}
