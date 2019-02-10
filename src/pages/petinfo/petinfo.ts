import { Component } from '@angular/core';
import {  NavController, NavParams, Events } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';
import { NativeStorage } from '@ionic-native/native-storage';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { CommentpetPage } from '../commentpet/commentpet';
import { PetStatusModel } from '../add-page/addlayout.model';
import { PetDetailsService } from '../add-page/addlayout.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';


/**
 * Generated class for the PetinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-petinfo',
  templateUrl: 'petinfo.html',
})
export class PetinfoPage {

  pet: PetDetailsModel = new PetDetailsModel();
 uid:string;
 user_id:string;
 petStatus: PetStatusModel = new PetStatusModel();

 likevalue : number;
 dislikevalue : number;

 showDelbtn:boolean = false;


  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public http:HttpClient,
    public petdetailservice : PetDetailsService,    
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public socialSharing: SocialSharing,
    public events:Events
  ) {
    this.pet = navParams.get('pet');
    this.showDelbtn = navParams.get('fromProfile');
    this.likevalue = 0;
    this.dislikevalue = 0; 
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetinfoPage');
    console.log(this.pet.name_of_pet);
   
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

      this.petdetailservice.getStatusData()
      .then(data2 => {
        this.petStatus = data2;        
      });      
  }

  deletePost() {
    var url = 'http://api.whospets.com/api/users/del_user_pets.php';

  
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,pet_id:this.pet.product_id});
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
   this.navCtrl.push( CommentpetPage, {product_id:post.product_id})
 }
}
