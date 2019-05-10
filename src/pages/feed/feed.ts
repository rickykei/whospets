import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import 'rxjs/Rx';

import { FeedModel, DataModel,FeedPostModel} from './feed.model';
import { FeedService } from './feed.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AddpetPage } from '../addpet/addpet';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetinfoPage } from '../petinfo/petinfo';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { CommentpetPage } from '../commentpet/commentpet';

@Component({
  selector: 'feed-page',
  templateUrl: 'feed.html'
})
export class FeedPage {
  feed: FeedModel = new FeedModel();
  feeddata : DataModel = new DataModel();
  details: Array<FeedPostModel> = new Array<FeedPostModel>() ;
  user_id: string;
  user_name: string;
  loading:any;
  likevalue : number;
  dislikevalue : number;

  constructor(
    public nav: NavController,
    public feedService: FeedService,
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public socialSharing: SocialSharing,
    public loadingCtrl: LoadingController,
    public events:Events) {   
     
      events.subscribe('user:back', () =>
    {    
      console.log('user:back');   
      this.getContent();
    });
    this.feed.category = navParams.get('category');
    this.likevalue = 0;
    this.dislikevalue = 0;
  }

  ionViewDidLoad() {
  console.log('feed.ts');
  
  this.nativeStorage.getItem('profile_user_id')
  .then(data => {
      this.user_id = data.profile_user_id;
      this.user_name = data.profile_user_name;
       console.log(data.profile_user_id);
       console.log(data.profile_user_name);
    });

    this.getContent();
  }

  goToProfile(item) {
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
   this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/products/'+post.product_id)
   .then(() => {
     console.log('Success!');
   })
   .catch(() => {
      console.log('Error');
   });
 }

 getContent()
 {
  
   this.showLoader();
  this.feedService
  .getPosts(this.feed.category.catid,this.user_id,100,0)
  .then(response => {
  this.details = response.data.pets;
  this.dismissLoading();

  });
  
 }

 detailPost(pet)
 {
   this.nav.push(PetinfoPage, {pet:pet} );
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
	  .getPosts(this.feed.category.catid,this.user_id,100,this.details.length)
	  .then(posts => {
		console.log('feed.ts.getpost');
		console.log(posts.data.pets.length);
    this.feed.success =  posts.success;
    if(posts.success==='true')
        {
		 for(let i=0; i<posts.data.pets.length; i++) {
			console.log('postdata looop'+i); 
			this.details.push(posts.data.pets[i]);
    }
  }
		console.log('post :' + this.feed.success);
	  });

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  showLoader(){
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.dismissLoading();

  }

  dismissLoading()
  {
    setTimeout(() => {
      this.loading.dismiss();//显示多久消失
  }, 2000);
  }


  likePost(post)
  {
    if(post.ownlike==0)
    {
    this.PagesDisplayServiceProvider.setlike(this.user_id, post.product_id, 'shop_products')
      .then(response => {
        if(response.success==='true')
        {
          this.likevalue = post.likecnt;
          this.likevalue ++;
          post.likecnt = this.likevalue;
          post.ownlike = 1;
        }
      });
    }else{
      this.PagesDisplayServiceProvider.setdislike(this.user_id, post.product_id, 'shop_products')
      .then(response => {
        if(response.success==='true')
        {
          this.dislikevalue = post.likecnt;
          this.dislikevalue --;
          post.likecnt = this.dislikevalue;
          post.ownlike = 0;
        }
      });
    }
  }


  commentPost(post)
 {
   this.nav.push( CommentpetPage, {product_id:post.product_id})
 }

//  ionViewWillLeave()
//   {
//     this.loading.dismiss();
//   }
  
}
