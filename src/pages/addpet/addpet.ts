import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { ProfileService } from '../profile/profile.service';
import { PetModel, CountryIdModel, UserModel } from '../profile/profile.model';
import { PetDetailsService } from '../add-page/addlayout.service';
import { PetBreedModel, PetColorModel, PetStatusModel } from '../add-page/addlayout.model';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { DisplayPage } from '../display/display';

/**
 * Generated class for the AddpetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addpet',
  templateUrl: 'addpet.html',
})
export class AddpetPage {

  addPetForm: FormGroup;

  email: string; 
  user_id:number;
  petowner:string;

  pet: PetModel = new PetModel();
  petdetail: PetBreedModel = new PetBreedModel();
  petColor: PetColorModel = new PetColorModel();
  petStatus: PetStatusModel = new PetStatusModel();
  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  profile: UserModel= new UserModel();


  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public profileService: ProfileService,
    public petdetailservice : PetDetailsService,    
    public http: HttpClient,  
    public navParams: NavParams) {

      this.addPetForm = new FormGroup({
        title: new FormControl(''),
        id: new FormControl(''),
        name_of_pet: new FormControl(''),
        petbreed: new FormControl(''),
        description: new FormControl(''),
        phone: new FormControl(''),
        gender: new FormControl(''),
        weight: new FormControl(0),
        height: new FormControl(0),
        rewards: new FormControl(0),
        size: new FormControl(''),
        born_date: new FormControl(''),
        lost_date: new FormControl(''),
        found_date: new FormControl(''),
        typeofpet: new FormControl(''),
        countryId: new FormControl(''),
        color:new FormControl(''),
        petstatus:new FormControl(''),
        lastseen :new FormControl(''),
        status:new FormControl(''),
        subCountryId: new FormControl('')
      });

      this.profile = navParams.get('profile'); 
      this.petowner = this.profile.firstname + '' + this.profile.lastname;
      this.user_id = this.profile.user_id;
  }

  ionViewDidLoad() {

    
  
   
   
   this.petdetailservice.getData()
    .then(data2 => {
      this.petdetail = data2;
    });

    this.petdetailservice.getColorData()
    .then(data2 => {
      this.petColor = data2;
    });

    this.profileService.getCountryCode()
    .then(zone => {
      this.country = zone;
    });

    this.profileService.getSubCountryCode()
    .then(zone => {
      this.subcountry = zone;
    });

    this.petdetailservice.getStatusData()
    .then(data2 => {
      this.petStatus = data2;
    });
  }

  

  addPet() {
	  
	  this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   

     /*this.profileService.getPet(data.email)
     .then(response => {
       this.pet = response;
     });
	 */
	 
	 
   });
    let postdata = this.addPetForm.value;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
          
    let data=JSON.stringify({user_id:this.user_id,username:this.email
      , title:postdata.title, description:postdata.description , name_of_pet:this.petowner
    , pet_id:postdata.id, category_id:postdata.petbreed, sub_category:postdata.typeofpet
    , gender:postdata.gender, date_born:postdata.born_date, color:postdata.color
    , weight:postdata.weight, height:postdata.height
    , size:postdata.size, country_id:postdata.countryId, sub_country_id:postdata.subCountryId
    , contact:postdata.phone , pet_status:postdata.petstatus, date_lost:postdata.lost_date
    , count_down_end_date:postdata.found_date
    , price:postdata.rewards, last_seen_appearance:postdata.lastseen, status:postdata.status
    , tax_id:'', quantity:'', condition:'', feature_date:'', gallery_date:'', banner_a:''
    , banner_b:'', banner_c:''
    , todays_deal:'', discount:'', questions:'', descriptionDisplay:''
    , language:'', specifications:'', style_code:'', created:'', country:''});
    this.http.post("http://api.whospets.com/api/users/set_user_pets.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
    alert("success "+res);
    this.goToDisplay();
    }, (err) => {
    alert("failed");
    });
    }


    
    goToDisplay() 
    {
      this.navCtrl.push(DisplayPage, {display:this.user_id, getall:false} );
    }
}
