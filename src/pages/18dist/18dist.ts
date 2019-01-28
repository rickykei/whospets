import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ListingItemModel } from '../listing/listing.model';
import { ProfileService } from '../profile/profile.service';
import { FeedPostModel } from '../feed/feed.model';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PetinfoPage } from '../petinfo/petinfo';
import { NativeStorage } from '@ionic-native/native-storage';
import { CommentpetPage } from '../commentpet/commentpet';

/**
 * Generated class for the 18distPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-18dist',
  templateUrl: '18dist.html',
})
export class Dist18Page {

  _popular : ListingItemModel;
  status:string;
  details: Array<FeedPostModel> = new Array<FeedPostModel>() ;
  user_id: string;
  user_name: string;
  likevalue : number;
  dislikevalue : number;

  
  constructor(public nav: NavController
    , public navParams: NavParams
    , public profileService: ProfileService
    ,public PagesDisplayServiceProvider:PagesDisplayServiceProvider
    ,public socialSharing: SocialSharing
    ,public nativeStorage:NativeStorage
    ) {
    this._popular = this.navParams.get('popular');
    console.log("array1: "+ this._popular.group_ids[0]);
    console.log("array1 , length: "+ this._popular.group_ids.length);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad 18distPage');
    this.nativeStorage.getItem('profile_user_id')
  .then(data => {
      this.user_id = data.profile_user_id;
      this.user_name = data.profile_user_name;
       console.log(data.profile_user_id);
       console.log(data.profile_user_name);
    });

  this.getContent();
  }

  getContent()
 {

   this.profileService.getPopularData(this._popular.group_ids, this._popular.group_ids.length,10,0)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);

      this.status = data2.success;
      if(this.status=='true')
      {
        this.details = data2.data.pets;
      }

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
      this.profileService.getPopularData(this._popular.group_ids,this._popular.group_ids.length,10,this.details.length)
	  .then(posts => {
		console.log('feed.ts.getpost');
		console.log(posts.data.pets.length);
		//this.feed.success =  posts.success;
		 for(let i=0; i<posts.data.pets.length; i++) {
			console.log('postdata looop'+i); 
			this.details.push(posts.data.pets[i]);
		}
		//console.log('post :' + this.feed.success);
	  });

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
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

  commentPost(post)
 {
   this.nav.push( CommentpetPage, {product_id:post.product_id})
 }

//  ionViewWillLeave()
//   {
//     this.loading.dismiss();
//   }

}
