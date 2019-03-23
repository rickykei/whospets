import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FeedService } from '../feed/feed.service';
import { FeedPostModel } from '../feed/feed.model';
import { PetinfoPage } from '../petinfo/petinfo';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { CommentpetPage } from '../commentpet/commentpet';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  details: Array<FeedPostModel> = new Array<FeedPostModel>() ;
  loading: any;
  user_id: string;

  likevalue : number;
  dislikevalue : number;

  constructor(public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public feedService: FeedService,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public socialSharing: SocialSharing,
    public nativeStorage:NativeStorage,
    public navParams: NavParams) {

      this.likevalue = 0;
      this.dislikevalue = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');

    this.nativeStorage.getItem('profile_user_id')
  .then(data => {
      this.user_id = data.profile_user_id;
    });

  }

  onSearch(event){
    console.info(event.target.value);
    var url ='http://api.whospets.com/api/categories/get_pets.php?keyword='+event.target.value;
    this.getContent(url);
  }

  getContent(url:string)
 {  
    this.showLoader();
    this.feedService
    .getSearchFeeds(url)
    .then(response => {
      if(response.success === 'true')
      {
        this.details = response.data.pets;
        this.loading.dismiss();
      }
      else
      {
        this.loading.dismiss();
        alert("No related record, please try again.")
      }
    });  
 }

  detailPost(pet)
  {
    this.navCtrl.push(PetinfoPage, {pet:pet} );
  }
  
  onCancel(event)
  {
    console.info('onCancel: '+event.target.value);
      this.refreshFeed();
  }

  clearSearch(event){
    console.info('clearSearch: '+event.target.value);
    this.refreshFeed();
  }

  refreshFeed()
  {  
    this.details = new Array<FeedPostModel>() ;
  }

  showLoader(){
	  this.loading = this.loadingCtrl.create({
		 // content: 'Loading...'
	  });

	  this.loading.present();
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
   this.navCtrl.push( CommentpetPage, {product_id:post.product_id})
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
}
