import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '../../../node_modules/@angular/forms';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { PetModel, CountryIdModel } from '../profile/profile.model';
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
  petColor: PetColorModel = new PetColorModel();

  loading: any;
  //image
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = './assets/images/blank-avatar.jpg';

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
        title: new FormControl(''),
        description: new FormControl(''),  
        price:new FormControl(''),
        countryId: new FormControl(''),
        subCountryId: new FormControl(''),
        color:new FormControl(''),
        weight: new FormControl(0),
        size: new FormControl(0)
      });
    
      // this.user_id = navParams.get('user_id'); 
      // this.profile = navParams.get('profile'); 
      // if( this.profile)
      // {       
      //   this.user_id = this.profile.user_id;
      // }    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddsellPage');
    
    this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   

     this.profileService.getPet(data.email, this.user_id)
     .then(response => {
       this.pet = response;
     });
   });

   this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
        console.log(data.profile_user_id);
     });
     
     console.log("add sell , user id: " + this.user_id);

   this.profileService.getCountryCode()
   .then(zone => {
     this.country = zone;
   });

   this.profileService.getSubCountryCode()
   .then(zone => {
     this.subcountry = zone;
   });

   this.petdetailservice.getColorData()
    .then(data2 => {
      this.petColor = data2;
    });

   
  }

  getPhoto() {
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.imgPreview = results[i];
          this.base64.encodeFile(results[i]).then((base64File: string) => {
            this.regData.avatar = base64File;
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => { });
    }

  addSell() {
    this.showLoader();

    let postdata = this.sell_form.value;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,email:this.email
      , title:postdata.title, description:postdata.description , price:postdata.price
      , size:postdata.size, country_id:postdata.countryId, sub_country_id:postdata.subCountryId
      , color:postdata.color, weight:postdata.weight,avatar:this.regData.avatar});
    this.http.post("http://api.whospets.com/api/users/set_user_sells.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
      this.loading.dismiss();

   // alert("success "+res);
    
    //this.navCtrl.push(DisplaySellPage, {display:this.user_id, getall:false});
    this.event.publish('user:back');
    this.navCtrl.pop();  

    }, (err) => {
      this.loading.dismiss();

    alert("failed");
    });
    }

    showLoader(){
      this.loading = this.loadingCtrl.create({
        content: 'Submitting...'
      });
  
      this.loading.present();
    }

}
