import { Component } from '@angular/core';
import { NavController, NavParams , AlertController, LoadingController, Events} from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { ProfileService } from '../profile/profile.service';
import { PetModel, CountryIdModel, UserModel, ResponseModel, ZoneModel, PetDetailsModel } from '../profile/profile.model';
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

  isEdit : boolean = false;

  loading: any;
  postResponse:ResponseModel;

  isEnable:boolean = false;
  isEnableBreed: boolean = false;
  isLostPet: boolean = false;
  
  post: PetDetailsModel = new PetDetailsModel();

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
  updateimg:number = 0;

  addpettitle:string;
  
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
        id: new FormControl(''),
        name_of_pet: new FormControl('',Validators.required),
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

      this.post = this.navParams.get('post');
      this.addpettitle = 'ADD_A_PET'
      if(this.post)
      {
        this.isEdit = true;
        this.updateimg = 0;
        this.addpettitle = 'EDIT_A_PET'
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

    if(this.isEdit)
    {
    this.addPetForm.patchValue({

      id : this.post.pet_id,
      name_of_pet: this.post.name_of_pet,
      petbreed: this.post.category_id,
      description: this.post.description,
      phone: this.post.contact,
      gender: this.post.gender,
      weight: this.post.weight,
      height: this.post.height,
      rewards: this.post.price,
      size: this.post.size,
      born_date: this.post.date_born,
      lost_date: this.post.date_lost ,
      found_date: this.post.count_down_end_date,
      typeofpet: this.post.sub_category,
      countryId: this.post.country_id,
      color: this.post.color,
      petstatus: this.post.pet_status,
      lastseen :this.post.last_seen_appearance,
      status: this.post.status,
      subCountryId: this.post.sub_country_id,
      imgPreview:this.post.image
    });

  }

	this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   
 
   });

   this.petdetailservice.getData()
    .then(data2 => {
      this.petdetail = data2;
      
      if(this.isEdit)
    {
      this.isEnableBreed = true;
      this.changePetType(this.addPetForm.value.typeofpet);
    }
    });

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
      this.onCountryChange(this.addPetForm.value.countryId);
    }
    });

    this.petdetailservice.getColorData()
    .then(data2 => {
      this.petColor = data2;
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

  changePetStatus(event)
  {
    console.log(event);
    if(event==1)
    {
      this.isLostPet = true;
    }
    else
    {
      this.isLostPet = false;
    }
  }

  changePetType(event)
  {
    console.log(event);
    this.petbreed = new Array();
    console.log('this.petdetail.pet.length: ' + this.petdetail.pet.length);

    for(var i = 0; i < this.petdetail.pet.length; i++)
    {
        if(this.petdetail.pet[i].parent_id === event)
        {
          this.petbreed.push(this.petdetail.pet[i]);
        }
    }

    this.checkBreedEnable();
  }

  checkBreedEnable()
  {
    console.info('this.petbreed.length: ' + this.petbreed.length);
      if(this.petbreed.length>0)
      {
        this.isEnableBreed = true;
      }
      else
      {
        this.isEnableBreed = false;
      }
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

      for(var i = 0; i < this.subcountry.zone.length; i++)
      {
          if(this.subcountry.zone[i].parent_id === this.addPetForm.value.countryId)
          {
            this.zone.push(this.subcountry.zone[i]);
          }
      }

      this.checkEnable();
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
      this.updateimg = 1;
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

    if(this.checkField() || this.isEdit)
    {
      var url;

      if(this.isEdit)
      {
        url = "http://api.whospets.com/api/users/update_user_pets.php";
      }else
      {
        url = "http://api.whospets.com/api/users/set_user_pets.php";
      }

      console.log('url : ' + url);
    
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
        , todays_deal:'', discount:'', questions:'', descriptionDisplay:'', updateimg :this.updateimg
        , language:'', specifications:'', style_code:'', created:'', country:'',avatar:this.regData.avatar});
        this.http.post(url,data, { headers: headers })
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

    checkField()
  {
    if(!this.regData.avatar && !this.isEdit)
    {
      alert('Missing petId or image.');
      return false;
    }
   
    return true;
  }
}
