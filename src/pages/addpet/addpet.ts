import { Component } from '@angular/core';
import { NavController, NavParams , AlertController, LoadingController, Events} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { ProfileService } from '../profile/profile.service';
import { PetModel, CountryIdModel, UserModel, ResponseModel, ZoneModel } from '../profile/profile.model';
import { PetDetailsService } from '../add-page/addlayout.service';
import { PetBreedModel, PetColorModel, PetStatusModel, BreedModel } from '../add-page/addlayout.model';
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
  user_id:string;
  petowner:string;

  loading: any;
  postResponse:ResponseModel;

  isEnable:boolean = false;
  
  pet: PetModel = new PetModel();
  petdetail: PetBreedModel = new PetBreedModel();
  petColor: PetColorModel = new PetColorModel();
  petStatus: PetStatusModel = new PetStatusModel();
  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  zone: Array<ZoneModel> = new Array();
  petbreed: Array<BreedModel> = new Array();

  profile: UserModel= new UserModel();
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = './assets/images/blank-avatar.jpg';
  
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
    private base64: Base64,
    public event: Events) {

      this.addPetForm = new FormGroup({
        //title: new FormControl(''),
        id: new FormControl('',Validators.required),
        name_of_pet: new FormControl('',Validators.required),
        petbreed: new FormControl(''),
        description: new FormControl('', Validators.required),
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

    this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
      this.petowner = data.profile_user_name;
        console.log(data.profile_user_id);
        console.log(data.profile_user_name);
     });
     
     console.log("add sell , user id: " + this.user_id);
  }

  changePetType(event)
  {
    console.log(event);
    this.petbreed = new Array();

    for(var i = 0; i < this.petdetail.pet.length; i++)
    {
        if(this.petdetail.pet[i].parent_id === event)
        {
          this.petbreed.push(this.petdetail.pet[i]);
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

  onCountryChange(event)
  {
    console.info(this.addPetForm.value.countryId);
    this.zone = new Array();
    this.isEnable = false;

    for(var i = 0; i < this.subcountry.zone.length; i++)
    {
        if(this.subcountry.zone[i].parent_id === this.addPetForm.value.countryId)
        {
          this.zone.push(this.subcountry.zone[i]);
          this.isEnable = true;
        }
    }
  }

  getPhoto() {
    let options = {
      maximumImagesCount: 1,
      quality: 50,
      width: 512,
      height: 512,
      outputType: 1
    };
  this.imagePicker.getPictures(options).then((results) => {
    for (var i = 0; i < results.length; i++) {
      this.imgPreview = 'data:image/jpeg;base64,' + results[i];
      this.regData.avatar = this.imgPreview;
        // this.imgPreview = results[i];
        // this.base64.encodeFile(results[i]).then((base64File: string) => {
        //   this.regData.avatar = base64File;
        // }, (err) => {
        //   console.log(err);
        // });
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
          
    let data=JSON.stringify({user_id:this.user_id,email:this.email,username:this.email
      , title:postdata.name_of_pet
      , description:postdata.description , name_of_pet:postdata.name_of_pet
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

    // .subscribe(res => { 
    //   this.loading.dismiss();
    // //  alert("success "+res);
    //   this.goToDisplay();
    //   }, (err) => {
		//  this.loading.dismiss();
    // alert("failed");
    // });
    // }
    
    goToDisplay() 
    {
      this.event.publish('user:back');      
      this.navCtrl.pop();
    }
}
