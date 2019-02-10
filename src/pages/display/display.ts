import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PagesDisplayServiceProvider } from './display.services';
import { AddpostPage } from '../addpost/addpost';
import { PostInfoPage } from '../post-info/post-info';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { CommentPage } from '../comment/comment';

/**
 * Generated class for the DisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-display',
  templateUrl: 'display.html',
})
export class DisplayPage {

 // display: string;
  pet: PetDetailsModel = new PetDetailsModel();
  uid:string;
  petModel: PetModel = new PetModel();
  user_id:string;
  details: Array<PetDetailsModel> = new Array<PetDetailsModel>() ;
  getall:boolean;
  loading: any;
  likevalue : number;
  dislikevalue : number;
  //totalpost:number;

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

    console.log("this.getall : " +this.getall);
    console.log( 'user_id : ' + this.user_id);

    this.likevalue = 0;
    this.dislikevalue = 0;
    //this.totalpost =0;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PetinfoPage');
    console.log(this.pet.name_of_pet);
   
    this.getContent();

    this.nativeStorage.getItem('email_user')
    .then(data => {
      var url ;
      if(data.uid=='')
      {   
        this.uid='100001704123828';  
      }
      else{
        this.uid=data.uid;
      }
    });  

    this.nativeStorage.getItem('profile_user_id')
  .then(data => {
      this.user_id = data.profile_user_id;
       console.log(data.profile_user_id);   
    });
  } 

  getContent()
  {
   
    this.showLoader();

    if(this.getall===true)
    {
      this.PagesDisplayServiceProvider.getAllPost(10,0)
      .then(response => {
        //this.petModel = response; 
        this.details = response.data;  
        this.dismissLoading();
      });
      
    }
    else
    {
        this.PagesDisplayServiceProvider.getPost(this.user_id,10,0)
        .then(response => {
          //this.petModel = response; 
          this.details = response.data;  
          this.dismissLoading();
        });
         
      }

    
  }
    
    setPost()
    {
      this.navCtrl.push(AddpostPage, {profile:this.user_id} );
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

   // this.totalpost = this.totalpost + 10;

    setTimeout(() => {
       if(this.getall===true)
    {
      this.PagesDisplayServiceProvider.getAllPost(10,this.details.length)//this.totalpost)
      .then(response => {
        //this.petModel = response; 
        if(response.success==='true')
        {
          for(let i=0; i<response.data.length; i++) {
            console.log('postdata looop'+i); 
            this.details.push(response.data[i]);   
           }
        }
      });
    }
    else
    {
        this.PagesDisplayServiceProvider.getPost(this.user_id,10,this.details.length) //this.totalpost)
        .then(response => {
          if(response.success==='true')
          {
          //this.petModel = response; 
          for(let i=0; i<response.data.length; i++) {
            console.log('postdata looop'+i); 
            this.details.push(response.data[i]);   
            }                   
          } 
        });
      }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  detailPost(post)
  {        
    this.navCtrl.push(PostInfoPage, {post:post, tablename:'app_post'});  
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
  
  sharePost(post) {
    //this code is to use the social sharing plugin
    // message, subject, file, url
    this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/lifestyle/'+post.id)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }
  
  showLoader(){
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.dismissLoading();
  }

  commentPost(post)
 {
   this.navCtrl.push( CommentPage, {content_id:post.id, table_name:'app_post'})
 }

//  ionViewWillLeave()
//   {
//     this.dismissLoading();
//   }

  dismissLoading()
  {
    setTimeout(() => {
      this.loading.dismiss();//显示多久消失
  }, 2000);
  }

  

}
