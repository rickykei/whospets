import { Component } from '@angular/core';
import {  NavController, NavParams, Events } from 'ionic-angular';
import { PetDetailsModel, CountryIdModel, PetModel } from '../profile/profile.model';
import { NativeStorage } from '@ionic-native/native-storage';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { CommentpetPage } from '../commentpet/commentpet';
//import { PetStatusModel } from '../add-page/addlayout.model';
import { PetDetailsService } from '../add-page/addlayout.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile/profile.service';
import { AddpetPage } from '../addpet/addpet';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { PetBreedModel, PetColorModel } from '../add-page/addlayout.model';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


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
  petmodel: PetModel = new PetModel();
  petbreedmodel: PetBreedModel = new PetBreedModel();
  color: PetColorModel = new PetColorModel();

 uid:string;
 user_id:string;
 age:any;
 email:string;
 //petStatus: PetStatusModel = new PetStatusModel();

 country: CountryIdModel = new CountryIdModel();
 subcountry: CountryIdModel = new CountryIdModel();

 likevalue : number;
 dislikevalue : number;

 showDelbtn:boolean = false;
  commentcnt:number;
  _temp:number;

  isPetLost:boolean = false;
  language :string;
  isChi : boolean = false;
  title:string;

  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public http:HttpClient,
    public petdetailservice : PetDetailsService,    
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public socialSharing: SocialSharing,
    public profileService: ProfileService,
    public events:Events,
    public translate: TranslateService
  ) {
    
    this.pet = navParams.get('pet');
    this.likevalue = 0;
    this.dislikevalue = 0; 
    this.translate.get("petinfo").subscribe((result: string) => {
      this.title = result;
    });
 
    events.subscribe('user:back', (commentcount) =>
    {    
      this._temp = commentcount;
      this.commentcnt = this.pet.commentcnt*1 + this._temp*1;
      this.pet.commentcnt = this.commentcnt;
    });

    events.subscribe('user:back' ,() =>
    {    
     // this.profileService.getSpecPet(this.email, this.user_id, this.pet.product_id)
     this.profileService.getSpecPost(this.pet.product_id,'shop_products')
           .then(response => {
             this.petmodel = response;
             if(this.petmodel.success==='true')
              this.pet = this.petmodel.data[0];
             this.checkPetStatus();

             this.petdetailservice.getData()
             .then(data2 => {
               this.petbreedmodel = data2;
               this.getPetType();
             });

             this.profileService.getColorCode()
             .then(colorCode => {
               this.color = colorCode;
               this.getPetColor();
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

            this.getPetSizeAndSex();
          
          });
    });
  }

  ionViewWillEnter()
  {
    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
        this.language = data.profile_language;
        console.log('data.profile_language : ' + data.profile_language);
        if(data.profile_language==="zh")
        {
          this.isChi = true;
        }
        else
        {
          this.isChi = false;
        }
      });
  }

  getPetSizeAndSex()
  {
    if(this.isChi)
    {
      if(this.pet.size=='S'|| this.pet.size=='s')
      {
        this.pet.size='細';
      }
      else if(this.pet.size=='M' || this.pet.size=='m')
      {
        this.pet.size='中';
      }
      else if(this.pet.size=='L'|| this.pet.size=='l')
      {
        this.pet.size='大';
      }

      if(this.pet.gender=='f' || this.pet.gender=='F')
      {
        this.pet.gender='女';
      }
      else if(this.pet.gender=='m'|| this.pet.gender=='M')
      {
        this.pet.gender='男';
      }
    }

  }

  getPetType()
  {
    for(var i = 0; i < this.petbreedmodel.pet.length; i++)
    {
        if(this.petbreedmodel.pet[i].category_id === this.pet.category_id)
        {
          this.pet.petbreed = this.petbreedmodel.pet[i].title;
          this.pet.petbreed_zh = this.petbreedmodel.pet[i].title_zh;
          this.pet.pet_type = this.petbreedmodel.pet[i].parent_id;  
        }
    }
  }

  getPetColor()
  {
    for(var i = 0; i < this.color.pet_color.length; i++)
    {
        if(this.color.pet_color[i].color === this.pet.color)
        {
          this.pet.color = this.color.pet_color[i].color;
          this.pet.color_zh = this.color.pet_color[i].color_zh;
        }

        //isChi wording
        if(this.color.pet_color[i].color_zh === this.pet.color)
        {    
          this.pet.color = this.color.pet_color[i].color;
          this.pet.color_zh = this.color.pet_color[i].color_zh;
        }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetinfoPage');
    console.log(this.pet.name_of_pet);
   
    this.nativeStorage.getItem('email_user')
    .then(data => {
      if(data.uid=='')
      {   
        this.uid='100001704123828'; 
        this.email = data.email; 
      }
      else{
        this.uid=data.uid;
        this.email = data.email; 
      }

      

      this.nativeStorage.getItem('profile_user_id')
      .then(data2 => {
          this.user_id = data2.profile_user_id;
           console.log(data2.profile_user_id);
           this.checkDelButton(data2.profile_user_id);


          // this.profileService.getSpecPet(this.email, this.user_id, this.pet.product_id)
          this.profileService.getSpecPost(this.pet.product_id,'shop_products')
           .then(response => {
             this.petmodel = response;
             if(this.petmodel.success==='true')
              this.pet = this.petmodel.data[0];
             this.checkPetStatus();


             this.petdetailservice.getData()
              .then(data2 => {
                this.petbreedmodel = data2;
                this.getPetType();
              });

              this.profileService.getColorCode()
              .then(colorCode => {
                this.color = colorCode;
                this.getPetColor();
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

            this.getPetSizeAndSex();

           });
        });
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
      if(this.isChi)
        this.pet.pet_Status_string = '走失了';
      else
        this.pet.pet_Status_string = 'Pet Lost';

      this.isPetLost = true;
    }
    else if(this.pet.pet_status==0)
    {
      if(this.isChi)
        this.pet.pet_Status_string = '在家中';
      else
        this.pet.pet_Status_string = 'At Home';
    }
    else if(this.pet.pet_status==2)
    {
      if(this.isChi)
        this.pet.pet_Status_string = '已回家';
      else
        this.pet.pet_Status_string = 'Pet found';
    }
    else if(this.pet.pet_status==3)
    {
      if(this.isChi)
        this.pet.pet_Status_string = '求領養';
      else
        this.pet.pet_Status_string = 'Pet adoption';
    }
    else if(this.pet.pet_status==4)
    {
      if(this.isChi)
        this.pet.pet_Status_string = '等暫託';
      else
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
