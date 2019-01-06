import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '../../../node_modules/@angular/forms';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { DisplaySellPage } from '../display-sell/display-sell';
import { PetModel, UserModel, CountryIdModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetColorModel } from '../add-page/addlayout.model';
import { PetDetailsService } from '../add-page/addlayout.service';

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
  petowner:string;
  user_id:number;
  
  pet: PetModel = new PetModel();
  profile: UserModel= new UserModel();

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  petColor: PetColorModel = new PetColorModel();

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public profileService: ProfileService,
    public petdetailservice : PetDetailsService,    
    public http: HttpClient,  
    public nativeStorage:NativeStorage, 
    public navParams: NavParams) {
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
      this.profile = navParams.get('profile'); 
      this.petowner = this.profile.firstname + '' + this.profile.lastname;
      this.user_id = this.profile.user_id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddsellPage');
    
    this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   

     this.profileService.getPet(data.email)
     .then(response => {
       this.pet = response;
     });
   });

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

  addSell() {
    let postdata = this.sell_form.value;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,username:this.email
      , title:postdata.title, description:postdata.description , price:postdata.price
      , size:postdata.size, country_id:postdata.country_id, sub_country_id:postdata.sub_country_id
      , color:postdata.color, weight:postdata.weight});
    this.http.post("http://api.whospets.com/api/users/set_user_sells.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
    alert("success "+res);
    this.navCtrl.push(DisplaySellPage, {display:this.user_id, getall:false});

    }, (err) => {
    alert("failed");
    });
    }

}
