import { Component } from '@angular/core';
import { NavController, NavParams , AlertController, LoadingController} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { ProfileService } from '../profile/profile.service';
import { PetModel, CountryIdModel, UserModel } from '../profile/profile.model';
import { PetDetailsService } from '../add-page/addlayout.service';
import { PetBreedModel, PetColorModel, PetStatusModel } from '../add-page/addlayout.model';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { ApiProvider } from '../../providers/api/api';

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

  loading: any;
  
  pet: PetModel = new PetModel();
  petdetail: PetBreedModel = new PetBreedModel();
  petColor: PetColorModel = new PetColorModel();
  petStatus: PetStatusModel = new PetStatusModel();
  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  profile: UserModel= new UserModel();
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = 'assets/images/blank-avatar.jpg';

  
  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public profileService: ProfileService,
    public petdetailservice : PetDetailsService,    
    public http: HttpClient,  
    public navParams: NavParams,
	public loadingCtrl: LoadingController,
	public alertCtrl: AlertController,
  public api: ApiProvider,
  private imagePicker: ImagePicker,
    private base64: Base64) {

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

      this.user_id = navParams.get('user_id'); 
      this.petowner = navParams.get('user_name'); 

      this.profile = navParams.get('profile'); 
      if( this.profile)
      {
        this.petowner = this.profile.firstname + '' + this.profile.lastname;
        this.user_id = this.profile.user_id;
      }     
  }

  
  register() {
  this.showLoader();
  this.api.register(this.regData).subscribe((result) => {
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Registration Successful',
      subTitle: 'Great! Your registration is success',
      buttons: ['OK']
    });
    alert.present();
  }, (err) => {
    console.log(err);
    this.loading.dismiss();
    let alert = this.alertCtrl.create({
      title: 'Registration Failed',
      subTitle: 'Oh no! Your registration is failed',
      buttons: ['OK']
    });
    alert.present();
  });
  }
  
  showLoader(){
	  this.loading = this.loadingCtrl.create({
		  content: 'Submitting...'
	  });

	  this.loading.present();
  }


  ionViewDidLoad() {
	  
	this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   
    
    //  this.profileService.getPet(data.email)
     //then(response => {
      // this.pet = response;
     ///});
 
   });
     
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

  addPet() {
	  this.showLoader();
	
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
    , language:'', specifications:'', style_code:'', created:'', country:'',avatar:this.regData.avatar});
    this.http.post("http://api.whospets.com/api/users/set_user_pets.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
		 this.loading.dismiss();
    alert("success "+res);
    this.goToDisplay();
    }, (err) => {
		 this.loading.dismiss();
    alert("failed");
    });
    }


    
    goToDisplay() 
    {
      this.navCtrl.pop();
    }
}
