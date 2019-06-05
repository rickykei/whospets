import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { AddsellPage } from '../addsell/addsell';
import { PostInfoPage } from '../post-info/post-info';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { CommentPage } from '../comment/comment';
import { PetinfoPage } from '../petinfo/petinfo';

/**
 * Generated class for the DisplayfollowerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-displayfollower',
  templateUrl: 'displayfollower.html',
})
export class DisplayfollowerPage {

  post: PetDetailsModel = new PetDetailsModel();
  uid:string;
  petModel: PetModel = new PetModel();
  user_id:string;
  details: Array<PetDetailsModel> = new Array<PetDetailsModel>() ;
  getall: boolean;
  loading: any;
  likevalue : number;
  dislikevalue : number;

  table_type:string;
  table_name:String;

  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public navParams: NavParams,
    public socialSharing: SocialSharing,
    public loadingCtrl: LoadingController,
    public events:Events) {   
     
      events.subscribe('user:back', () =>
    {    
      console.log('user:back');   
      this.getContent();
    });
    this.user_id = navParams.get('display'); 
    this.getall = navParams.get('getall'); 
    console.log( 'getall : ' + this.getall);
    console.log( 'user_id : ' + this.user_id);

    this.likevalue = 0;
    this.dislikevalue = 0;
  }

  ionViewWillEnter()
  {
    console.log('ionViewWillEnter Displayfollowerpage');
   
    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log(data.profile_user_id);   
         this.getContent();
      });
    }
  
  ionViewDidLoad() {
   // console.log('ionViewDidLoad Displayfollowerpage');
   
    
    }

    getContent()
  {
   
    this.showLoader();

      this.PagesDisplayServiceProvider.getFollower(this.user_id,100,0)
      .then(response => {
        this.details = response.data;
        this.dismissLoading();
      });
      
    
    }

    getAppTable(post:PetDetailsModel)
    {
      if( post.app_table==='SELL')
      {
        this.table_type ='sell';
        this.table_name ='app_sell';
      }
      else if(post.app_table==='LIFESTYLE') 
      {
        this.table_type ='lifestyle';
        this.table_name = 'app_post';
      }
      else if(post.app_table==='QNA')
      {
        this.table_type ='qna';
        this.table_name = 'app_qna';
      }
      else if(post.app_table=='shop_product')
      {
        this.table_type ='product';
        this.table_name = 'shop_products';
      }
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
  
      this.PagesDisplayServiceProvider.getFollower(this.user_id,100,this.details.length)
      .then(response => {
        this.petModel = response; 
        if(response.success==='true'){
          for(let i=0; i<response.data.length; i++) {
            console.log('postdata looop'+i); 
            this.details.push(response.data[i]);
              }                 
            }
          });
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
    }

  detailPost(post)
  {        
    this.getAppTable(post);

    if(this.table_name === 'shop_products')
    {
      console.log('pet:' + post.product_id);
      post.product_id = post.id;
      this.navCtrl.push(PetinfoPage, {pet:post, tablename:this.table_name});  
    }
    else
    {
      post.content_id = post.id;
      this.navCtrl.push(PostInfoPage, {post:post, tablename:this.table_name});  
    }
  }

  likePost(post)
  {
    this.getAppTable(post);
    console.info('ost.ownlike: ' + post.ownlike);

    if(post.ownlike==0)
    {
    this.PagesDisplayServiceProvider.setlike(this.user_id, post.id, this.table_name)
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
      this.PagesDisplayServiceProvider.setdislike(this.user_id, post.id, this.table_name)
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
    this.getAppTable(post);
    //this code is to use the social sharing plugin
    // message, subject, file, url
    this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/'+ this.table_type+'/'+post.id)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }

  commentPost(post)
  {
    this.getAppTable(post);
    this.navCtrl.push( CommentPage, {content_id:post.id, table_name:this.table_name})
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

}
