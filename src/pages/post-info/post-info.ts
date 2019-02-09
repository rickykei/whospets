import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { NativeStorage } from '@ionic-native/native-storage';
import { CommentPage } from '../comment/comment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  details: Array<PetDetailsModel> = new Array<PetDetailsModel>() ;
  post: PetDetailsModel = new PetDetailsModel();
  user_id:string;
  tablename:string;
  
  likevalue : number;
  dislikevalue : number;

  showDelbtn:boolean = false;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public http: HttpClient,  
     public PagesDisplayServiceProvider: PagesDisplayServiceProvider,
     public socialSharing: SocialSharing,
     public nativeStorage: NativeStorage,
     public events:Events
    ) {
    this.post = navParams.get('post'); 
    this.tablename  =  navParams.get('tablename');
    
    this.likevalue = 0;
    this.dislikevalue = 0;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostInfoPage');
    
    this.checkDelButton();
    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log('this.user_id : ' + data.profile_user_id);
         this.getContent(data.profile_user_id);
      });

  }

  checkDelButton()
  {
    if( this.post.app_table==='SELL' || this.post.app_table==='LIFESTYLE' || this.post.app_table==='QNA' )
    {
      this.showDelbtn =true;
    }
  }

  getContent(user_id:string)
  {
    var url =''

    if( this.post.app_table==='SELL' || this.tablename ==='app_sell')
    {
      url = 'http://api.whospets.com/api/users/get_user_sells.php?user_id='+user_id+'&content_id='+this.post.id;
    }
    else if(this.post.app_table==='LIFESTYLE' || this.tablename === 'app_post') 
    {
      url ='http://api.whospets.com/api/users/get_user_lifestyles.php?user_id='+user_id+'&content_id='+this.post.id;
    }
    else if(this.post.app_table==='QNA' || this.tablename === 'app_qna')
    {
      url='http://api.whospets.com/api/users/get_user_qnas.php?user_id='+user_id+'&content_id='+this.post.id;
    }

    //http://api.whospets.com/api/users/get_user_qnas.php?user_id=501&content_id=23
    this.PagesDisplayServiceProvider.getSpecPost(url)
    .then(data => {
      if(data.success==='true')
      {
        this.details = data.data;
        this.post = this.details[0];
      }
    });
  }

  sharePost(post) {
    //this code is to use the social sharing plugin
    // message, subject, file, url
    var table_name;
    if(post.app_table==='SELL')
    {
      table_name = 'sell'
    }
    else if(post.app_table==='LIFESTYLE')
    {
      table_name = 'lifestyle'
    }
    else if(post.app_table==='QNA')
    {
      table_name = 'qna'
    }

    this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/'+table_name+'/'+post.id)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }

  deletePost(post) {
    var url;

    if( post.app_table==='SELL' || this.tablename ==='app_sell')
    {
      url = 'http://api.whospets.com/api/users/del_user_sells.php';
    }
    else if(post.app_table==='LIFESTYLE' || this.tablename === 'app_post') 
    {
      url ='http://api.whospets.com/api/users/del_user_lifestyles.php';
    }
    else if(post.app_table==='QNA' || this.tablename === 'app_qna')
    {
      url='http://api.whospets.com/api/users/del_user_qnas.php';
    }

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,content_id:this.post.id});
    this.http.post(url,data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
      this.events.publish('user:back');      
      this.navCtrl.pop();
   // alert("success "+res);
   // this.goToDisplay();
    }, (err) => {
    alert("failed");
    });
    }
 
  likePost(post)
  {
    if(post.ownlike==0)
    {
    this.PagesDisplayServiceProvider.setlike(this.user_id, post.id, this.tablename)
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
      this.PagesDisplayServiceProvider.setdislike(this.user_id, post.id, this.tablename)
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
