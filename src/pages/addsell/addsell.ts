import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { PetModel, CountryIdModel, ResponseModel, ZoneModel, PetDetailsModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetColorModel } from '../add-page/addlayout.model';
import { PetDetailsService } from '../add-page/addlayout.service';
//image
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';

/**
 * Generated class for the AddsellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addsell',
  templateUrl: 'addsell.html',
})
export class AddsellPage {
  sell_form: FormGroup;

  email: string;  
  pet: PetModel = new PetModel();
//  profile: UserModel= new UserModel();
  user_id:string;

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  zone: Array<ZoneModel> = new Array();

  petColor: PetColorModel = new PetColorModel();
  isEnable:boolean = false;

  loading: any;
  postResponse:ResponseModel;
  //image
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = './assets/images/blank-avatar.jpg';

  post: PetDetailsModel = new PetDetailsModel();
  addposttitle:string;  
  isEdit : boolean = false;
  product_id :string;

  isChi : boolean = false;
  language :string;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public profileService: ProfileService,
    public petdetailservice : PetDetailsService,    
    public http: HttpClient,  
    public nativeStorage:NativeStorage, 
    public navParams: NavParams,
    private imagePicker: ImagePicker,
    public loadingCtrl: LoadingController,
    private base64: Base64,
    public event: Events) {
      this.sell_form = new FormGroup({
        title: new FormControl('',Validators.required),
        description: new FormControl('',Validators.required),  
        price:new FormControl('',Validators.required),
        countryId: new FormControl('',Validators.required),
        subCountryId: new FormControl(''),
        color:new FormControl('',Validators.required),
        weight: new FormControl(0,Validators.required),
        size: new FormControl(0,Validators.required)
      });


      this.post = this.navParams.get('post');
      this.addposttitle = 'ADD_A_SELL'

      if(this.post)
      {
        this.isEdit = true;
        this.addposttitle = 'EDIT_A_SELL'
      }
  
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad AddsellPage');

    if(this.isEdit)
    {
      this.product_id = this.post.id;
      
      this.sell_form.patchValue({
        title: this.post.title,
        description: this.post.description,
        price: this.post.price,
        countryId: this.post.country_id,
        subCountryId: this.post.sub_country_id,
        color:this.post.color,
        weight: this.post.weight,
        size: this.post.size
      });
    }
    
    this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   

     this.profileService.getPet(data.email, this.user_id, 100,0)
     .then(response => {
       this.pet = response;
     });
   });

   this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
        console.log(data.profile_user_id);

        if(data.profile_language==="zh")
        {
          this.isChi = true;
        }
        else
        {
          this.isChi = false;
        }
        
     });
     
     console.log("add sell , user id: " + this.user_id);

   this.profileService.getCountryCode()
   .then(zone => {
     this.country = zone;
   });

   this.profileService.getSubCountryCode()
   .then(zone => {
     this.subcountry = zone;

     if(this.isEdit)
     {
       this.isEnable = true;
       this.onCountryChange(this.sell_form.value.countryId);
     }
   });

   this.petdetailservice.getColorData()
    .then(data2 => {
      this.petColor = data2;
    });

   
  }

  getPhoto() {
    let options = {
      maximumImagesCount: 1,
      quality: 80,
      width: 800,
      height: 800,
      outputType: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imgPreview = 'data:image/jpeg;base64,' + results[i];
        this.regData.avatar = this.imgPreview;

        // console.log('Image : ' + this.imgPreview);
        // console.log('this.regData.avatar : ' + this.regData.avatar);

          // this.imgPreview = results[i];
          // this.base64.encodeFile(results[i]).then((base64File: string) => {
          //   this.regData.avatar = base64File;
          // }, (err) => {
          //   console.log(err);
          // });
      }
    }, (err) => { });
    }

  addSell() {

    if(this.checkField())
    {
        var url;
  
        if(this.isEdit)
        {
          url = "https://api.whospets.com/api/users/update_user_sells.php";
        }else
        {
          url = "https://api.whospets.com/api/users/set_user_sells.php";
        }
  
        console.log('url : ' + url);

      
        this.showLoader();

        let postdata = this.sell_form.value;

        let headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin' , '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        //let options = new RequestOptions({ headers: headers });
        
        
        let data=JSON.stringify({user_id:this.user_id,email:this.email, id: this.product_id
          , title:postdata.title, description:postdata.description , price:postdata.price
          , size:postdata.size, country_id:postdata.countryId, sub_country_id:postdata.subCountryId
          , color:postdata.color, weight:postdata.weight,avatar:this.regData.avatar});
        this.http.post(url,data, { headers: headers })
        // .map(res => res.json(data))
        //.subscribe(res => {
          .subscribe((res:ResponseModel) => { 
            this.postResponse = res; 
          
          console.log("VALUE RECEIVED: "+res);
          this.loading.dismiss();

          if(this.postResponse.success==='true')
          {
            this.event.publish('user:back');
            this.navCtrl.pop();
          }
          else
          {
            alert("Fail to add, missing contents.")
          }

        }, (err) => {
          this.loading.dismiss();
          alert("Fail to add, please try it later.")
        }, () =>
        {
          this.loading.dismiss();
        });
      }
    }

    onCountryChange(event)
    {
      console.info(this.sell_form.value.countryId);
      this.zone = new Array();

      for(var i = 0; i < this.subcountry.zone.length; i++)
      {
          if(this.subcountry.zone[i].parent_id === this.sell_form.value.countryId)
          {
            this.zone.push(this.subcountry.zone[i]);
          }
      }

      this.checkEnable();
    }

    checkEnable()
    {
      console.info('this.zone.length: ' + this.zone.length);
      if(this.zone.length>0)
      {
        this.isEnable = true;
      }
      else
      {
        this.isEnable = false;
      }
    }

    showLoader(){
      this.loading = this.loadingCtrl.create({
        content: 'Submitting...'
      });
  
      this.loading.present();
    }

    goToDisplay() 
    {
      this.navCtrl.pop().then(
        response => {
          console.log('Response ' + response);
        },
        error => {
          console.log('Error: ' + error);
          this.event.publish('user:back');      
        }
      ).catch(exception => {
        console.log('Exception ' + exception);
        this.event.publish('user:back');      
      });;   
    }

    checkField()
    {

      if(!this.regData.avatar && !this.isEdit)
      {
        alert('Missing image.');
        return false;
      }
      else{
        console.log('have image');        
      }
     
      return true;
    }

}
