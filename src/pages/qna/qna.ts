import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { SetQnaPage } from '../set-qna/set-qna';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { PostInfoPage } from '../post-info/post-info';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { CommentPage } from '../comment/comment';

/**
 * Generated class for the QnaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-qna',
  templateUrl: 'qna.html',
})
export class QnaPage {

 // display: string;
 pet: PetDetailsModel = new PetDetailsModel();
 uid:string;
 petModel: PetModel = new PetModel();
 user_id:string;
 details: Array<PetDetailsModel>  = new Array<PetDetailsModel>() ;
  getall:boolean;
  loading: any;
  countlike: number;

  likevalue : number;
  dislikevalue : number;

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

    this.likevalue = 0;
    this.dislikevalue = 0;

 }


 ionViewDidLoad() {
   console.log('ionViewDidLoad qna');
   console.log(this.pet.name_of_pet);
  
   this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
        console.log(data.profile_user_id);
     });
     
     console.log(this.user_id);


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

   this.getContent();
   } 

   setQna()
   {
     this.navCtrl.push(SetQnaPage);
   //  this.details = new Array<PetDetailsModel>();
   }

   
  getContent()
  {
    this.showLoader();
    if(this.getall===true)
    {
      this.PagesDisplayServiceProvider.getAllQnA(100,0)
      .then(response => {
        this.details = response.data;
      //   for(let i=0; i<response.data.length; i++) {
			// console.log('postdata looop'+i); 
			// this.details.push(response.data[i]);
      // };   
      this.loading.dismiss();//显示多久消失
    });
    }
    else
    {
      this.PagesDisplayServiceProvider.getQnA(this.user_id,100,0)
      .then(response => {
      //   for(let i=0; i<response.data.length; i++) {
			// console.log('postdata looop'+i); 
      // this.details.push(response.data[i]);     
      // };   
      this.details = response.data;
      this.loading.dismiss();//显示多久消失
    });
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
     if(this.getall===true)
    {
      this.PagesDisplayServiceProvider.getAllQnA(100,this.details.length)
      .then(response => {
        if(response.success==='true')
        {
        for(let i=0; i<response.data.length; i++) {
			console.log('postdata looop'+i); 
			this.details.push(response.data[i]);
      };
    }   
      });
    }
    else
    {
       this.PagesDisplayServiceProvider.getQnA(this.user_id,100,this.details.length)
       .then(response => {
        if(response.success==='true')
        {
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
    this.navCtrl.push(PostInfoPage, {post:post, tablename:'app_qna'});  
  }

 
  likePost(post)
  {
    if(post.ownlike==0)
    {
    this.PagesDisplayServiceProvider.setlike(this.user_id, post.id, 'app_qna')
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
      this.PagesDisplayServiceProvider.setdislike(this.user_id, post.id, 'app_qna')
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
    this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/qnas/'+post.id)
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

  dismissLoading()
  {
    setTimeout(() => {
      this.loading.dismiss();//显示多久消失
  }, 2000);
  }


  commentPost(post)
  {
    this.navCtrl.push( CommentPage, {content_id:post.id, table_name:'app_qna'})
  }

  // ionViewWillLeave()
  // {
  //   this.loading.dismiss();
  // }
  
}