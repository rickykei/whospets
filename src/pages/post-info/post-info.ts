import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { NativeStorage } from '@ionic-native/native-storage';
import { CommentPage } from '../comment/comment';

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
  tablename:string;
  
  likevalue : number;
  dislikevalue : number;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public PagesDisplayServiceProvider: PagesDisplayServiceProvider,
     public socialSharing: SocialSharing,
     public nativeStorage: NativeStorage
    ) {
    this.post = navParams.get('post'); 
    this.tablename  =  navParams.get('tablename');
    
    this.likevalue = 0;
    this.dislikevalue = 0;
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
    if(post.app_table==='SELL')
    {
      this.tablename = 'sell'
    }
    else if(post.app_table==='LIFESTYLE')
    {
      this.tablename = 'lifestyle'
    }
    else if(post.app_table==='QNA')
    {
      this.tablename = 'qna'
    }
    this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/'+this.tablename+'/'+post.id)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }

 
  likePost(post)
  {
    if(post.ownlike==0)
    {
    this.PagesDisplayServiceProvider.setlike(this.user_id, post.id, 'app_post')
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
      this.PagesDisplayServiceProvider.setdislike(this.user_id, post.id, 'app_post')
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
    if(post.app_table==='SELL')
    {
      this.tablename = 'app_sell'
    }
    else if(post.app_table==='LIFESTYLE')
    {
      this.tablename = 'app_post'
    }
    else if(post.app_table==='QNA')
    {
      this.tablename = 'app_qna'
    }
    this.navCtrl.push( CommentPage, {content_id:post.id, table_name:this.tablename})
  }
}
