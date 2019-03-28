import { Component } from '@angular/core';
import {  NavController, NavParams, Events } from 'ionic-angular';
import { PetDetailsModel, CountryIdModel } from '../profile/profile.model';
import { NativeStorage } from '@ionic-native/native-storage';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { CommentpetPage } from '../commentpet/commentpet';
//import { PetStatusModel } from '../add-page/addlayout.model';
import { PetDetailsService } from '../add-page/addlayout.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile/profile.service';
import { AddpetPage } from '../addpet/addpet';


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
 age:any;
 //petStatus: PetStatusModel = new PetStatusModel();

 country: CountryIdModel = new CountryIdModel();
 subcountry: CountryIdModel = new CountryIdModel();

 likevalue : number;
 dislikevalue : number;

 showDelbtn:boolean = false;
  commentcnt:number;
  _temp:number;

  isPetLost:boolean = false;
  
  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public http:HttpClient,
    public petdetailservice : PetDetailsService,    
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public socialSharing: SocialSharing,
    public profileService: ProfileService,
    public events:Events
  ) {
    
    this.pet = navParams.get('pet');
    this.likevalue = 0;
    this.dislikevalue = 0; 

 
    events.subscribe('user:back', (commentcount) =>
    {    
      this._temp = commentcount;
      this.commentcnt = this.pet.commentcnt*1 + this._temp*1;
      this.pet.commentcnt = this.commentcnt;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetinfoPage');
    console.log(this.pet.name_of_pet);
   
    this.nativeStorage.getItem('email_user')
    .then(data => {
      if(data.uid=='')
      {   
        this.uid='100001704123828';  
      }
      else{
        this.uid=data.uid;
      }
    });

    this.checkPetStatus();
  
    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log(data.profile_user_id);
         this.checkDelButton(data.profile_user_id);
      });

   this.profileService.getCountryCode()
   .then(zone => {
     this.country = zone;

     this.checkCountryZone();

   });

   this.profileService.getSubCountryCode()
   .then(zone => {
     this.subcountry = zone;

     this.checkSubCountryZone();
  
   });
  }

  checkDelButton(user_id:string)
  {
    if(this.pet.user_id===user_id)
    {
      this.showDelbtn =true;
    }
  }

  checkPetStatus()
  {
    if(this.pet.pet_status==1)
    {
      this.pet.pet_Status_string = 'Pet Lost';
      this.isPetLost = true;
    }
    else if(this.pet.pet_status==2)
    {
      this.pet.pet_Status_string = 'At Home';
    }
    else if(this.pet.pet_status==3)
    {
      this.pet.pet_Status_string = 'Pet found';
    }
    else if(this.pet.pet_status==4)
    {
      this.pet.pet_Status_string = 'Pet adoption';
    }
    else if(this.pet.pet_status==5)
    {
      this.pet.pet_Status_string = 'Pet boarding required';
    }

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

 editPost(post)
 {
  this.navCtrl.push( AddpetPage, {post:post})
 }

 checkCountryZone()
  {
    console.info("this.pet.country_id : " + this.pet.country_id);
    for(var i = 0; i < this.country.zone.length; i++)
    {
        if(this.country.zone[i].country_id === this.pet.country_id)
        {
          this.pet.country_title = this.country.zone[i].title;
          this.pet.country_title_zh = this.country.zone[i].title_zh;
        }
    }
  }
  checkSubCountryZone()
  {
    console.info("this.pet.sub_country_id : " + this.pet.sub_country_id);

    for(var i = 0; i < this.subcountry.zone.length; i++)
    {
        if(this.subcountry.zone[i].country_id === this.pet.sub_country_id)
        {
          this.pet.subcountry_title = this.subcountry.zone[i].title;
          this.pet.subcountry_title_zh = this.subcountry.zone[i].title_zh;
        }
    }
  }

  getAge()
  {
    var borndate:any;
    borndate = this.pet.date_born;

    

      var timeDiff = Math.abs(Date.now() - borndate);
      this.age = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
  }
}
