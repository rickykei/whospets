import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { PetDetailsModel, CountryIdModel } from '../profile/profile.model';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { NativeStorage } from '@ionic-native/native-storage';
import { CommentPage } from '../comment/comment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ProfileService } from '../profile/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { AddsellPage } from '../addsell/addsell';
import { AddpostPage } from '../addpost/addpost';
import { SetQnaPage } from '../set-qna/set-qna';
import { PetColorModel } from '../add-page/addlayout.model';

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
  table_type:string;
  title:string;
  
  likevalue : number;
  dislikevalue : number;

  showDelbtn:boolean = false;

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  color: PetColorModel = new PetColorModel();

  commentcnt: number;
  _temp:number;

  language :string;
  isChi : boolean = false;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public http: HttpClient,  
     public PagesDisplayServiceProvider: PagesDisplayServiceProvider,
     public socialSharing: SocialSharing,
     public nativeStorage: NativeStorage,
     public profileService: ProfileService,
     public translate: TranslateService,
     public events:Events
    ) {

    this.post = navParams.get('post'); 
    this.tablename  =  navParams.get('tablename');

    this.likevalue = 0;
    this.dislikevalue = 0;
    this.commentcnt = 0;

    this.table_type='';

    events.subscribe('user:back', (commentcount) =>
    {    
      this._temp = commentcount;
      this.commentcnt = this.post.commentcnt *1 + this._temp*1;
      this.post.commentcnt = this.commentcnt;
    });
    
    events.subscribe('user:back' ,() =>
    {  
      this.getContent(this.user_id);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostInfoPage');
    
    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log('this.user_id : ' + data.profile_user_id);
         console.log('data.profile_language : ' + data.profile_language);
         if(data.profile_language==="zh")
         {
           this.isChi = true;
         }
         else
         {
           this.isChi = false;
         }

         this.getContent(data.profile_user_id);
         this.checkDelButton(data.profile_user_id);

         this.profileService.getCountryCode()
         .then(zone => {
           this.country = zone;
         });
      
         this.profileService.getSubCountryCode()
         .then(zone => {
           this.subcountry = zone;
         });

         this.profileService.getColorCode()
         .then(colorCode => {
           this.color = colorCode;
           this.getPetColor();
         });

         this.getPostSize();

      });
  }

  checkCountryZone()
  {
    console.info()
    for(var i = 0; i < this.country.zone.length; i++)
    {
        if(this.country.zone[i].country_id === this.post.country_id)
        {
          this.post.country_title = this.country.zone[i].title;
          this.post.country_title_zh = this.country.zone[i].title_zh;
        }
    }

    if(this.isChi)
    {
      this.post.country_title = this.post.country_title_zh;
    }
  }
  checkSubCountryZone()
  {
    for(var i = 0; i < this.subcountry.zone.length; i++)
    {
        if(this.subcountry.zone[i].country_id === this.post.sub_country_id)
        {
          this.post.subcountry_title = this.subcountry.zone[i].title;
          this.post.subcountry_title_zh = this.subcountry.zone[i].title_zh;
        }
    }

    if(this.isChi)
    {
      this.post.subcountry_title = this.post.subcountry_title_zh;
    }
  }

  getPostSize()
  {
    if(this.isChi)
    {
      if(this.post.size=='S'|| this.post.size=='s')
      {
        this.post.size_zh='細';
      }
      else if(this.post.size=='M' || this.post.size=='m')
      {
        this.post.size_zh='中';
      }
      else if(this.post.size=='L'|| this.post.size=='l')
      {
        this.post.size_zh='大';
      }
    }
  }

  getPetColor()
  {
    //init color_zh
    this.post.color_zh = this.post.color;     

    for(var i = 0; i < this.color.pet_color.length; i++)
    {
   //   console.log("this.pet.color : " + this.pet.color);
   //   console.log("this.color.pet_color[i].color : " + this.color.pet_color[i].color);

        if(this.color.pet_color[i].color === this.post.color)
        {
          this.post.color = this.color.pet_color[i].color;
          this.post.color_zh = this.color.pet_color[i].color_zh;
        }

        if(this.color.pet_color[i].color_zh === this.post.color)
        {    
          this.post.color = this.color.pet_color[i].color;
          this.post.color_zh = this.color.pet_color[i].color_zh;
        }       
    }   

    if(this.isChi)
    {
      this.post.color =  this.post.color_zh;
    }
  }

  checkDelButton(user_id:string)
  {
    //this.post.app_table==='SELL' || this.post.app_table==='LIFESTYLE' || this.post.app_table==='QNA' || 
    if(this.post.user_id===user_id)
    {
      this.showDelbtn =true;
    }
  }

  getContent(user_id:string)
  {
    var url =''
   

    if( this.post.app_table==='SELL' || this.tablename ==='app_sell')
    {
      //url = 'http://api.whospets.com/api/users/get_user_sells.php?user_id='+user_id+'&content_id='+this.post.id;
      this.table_type ='sells';
      this.tablename ='app_sell';
      this.translate.get("SELL_DETAIL").subscribe((result: string) => {
        this.title = result;
      });
    }
    else if(this.post.app_table==='LIFESTYLE' || this.tablename === 'app_post') 
    {
     // url ='http://api.whospets.com/api/users/get_user_lifestyles.php?user_id='+user_id+'&content_id='+this.post.id;
      this.table_type ='lifestyles';
      this.tablename = 'app_post';
      this.translate.get("LIFESTYLE_DETAIL").subscribe((result: string) => {
        this.title = result;
      });
    }
    else if(this.post.app_table==='QNA' || this.tablename === 'app_qna')
    {
     // url='http://api.whospets.com/api/users/get_user_qnas.php?user_id='+user_id+'&content_id='+this.post.id;
      this.table_type ='qnas';
      this.tablename = 'app_qna';
      this.translate.get("QNA_DETAIL").subscribe((result: string) => {
        this.title = result;
      });
    }
    // update to use this get content
    //url = 'http://api.whospets.com/api/users/get_mix_detail.php?content_id='+this.post.id+'&app_table='+this.tablename
    console.log('post id:'+this.post.id);
    console.log('tablename:'+this.tablename);

    this.profileService.getSpecPost(this.post.id,this.tablename)//getSpecPost(url)
    .then(data => {
      if(data.success==='true')
      {
        this.details = data.data;
        this.post = this.details[0];

        this.checkCountryZone();
        this.checkSubCountryZone();

        this.getPetColor();
        this.getPostSize();
      }
    });
  }

  sharePost(post) {
   
    this.socialSharing.share(post.description, post.title, '', 'https://whospets.com/zh/shop/'+this.table_type+'/'+post.id)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }

  deletePost() {
    var url;
    if(this.table_type!='')
      url = 'http://api.whospets.com/api/users/del_user_'+this.table_type+'.php';
    else
      console.log('error with table_type');

    console.log('url : '+ url);

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
    this.navCtrl.push( CommentPage, {content_id:post.id, table_name:this.tablename})
  }

  editPost(post)
  {
    console.log(this.tablename);
    if( this.tablename ==='app_sell')
    {
      this.navCtrl.push( AddsellPage, {post:post})
    }
    else if( this.tablename === 'app_post') 
    {
      this.navCtrl.push( AddpostPage, {post:post})
    }
    else if(this.tablename === 'app_qna')
    {
      this.navCtrl.push( SetQnaPage, {post:post})
    }
   
  }
}
