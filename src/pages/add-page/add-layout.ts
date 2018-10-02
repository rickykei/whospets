import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, Platform, normalizeURL, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { PetDetailsService } from './addlayout.service';
import { PetBreedModel, PetColorModel, PetStatusModel } from './addlayout.model';

import { CountryIdModel, UserModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '@ionic-native/native-storage';

import {Http} from '@angular/http';
import 'rxjs/Rx';

@Component({
  selector: 'add-layout-page',
  templateUrl: 'add-layout.html'
})
export class AddLayoutPage {
  section: string;
  email: string;
  petowner:string;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  selected_image: any;

  petdetail: PetBreedModel = new PetBreedModel();
  petColor: PetColorModel = new PetColorModel();
  petStatus: PetStatusModel = new PetStatusModel();

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();

  profile: UserModel= new UserModel();

  constructor(
    public nav: NavController,
    public petdetailservice : PetDetailsService,
    public profileService: ProfileService,
    public alertCtrl: AlertController,
    public cropService: Crop,
    public imagePicker: ImagePicker,    
    private http: Http,    
    public nativeStorage:NativeStorage,
    public platform: Platform,
    public navParams: NavParams
  ) {

    this.section = "event";

    this.post_form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      servings: new FormControl(2, counterRangeValidator(10, 1)),
      time: new FormControl('01:30', Validators.required),
      temperature: new FormControl(180)
    });
    this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
      id: new FormControl('', Validators.required),
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
    this.card_form = new FormGroup({
      card_number: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      exp_date: new FormControl('', Validators.required),
      save_card: new FormControl(true, Validators.required)
    });

    this.profile = navParams.get('profile'); 
    this.petowner = this.profile.firstname + '' + this.profile.lastname;

    console.log(this.petowner);
  }

  ionViewDidLoad() {

    this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;
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
  
  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  createPost(){
    console.log(this.post_form.value);
  }

  createEvent(){
    console.log(this.event_form.value);
  }

  createCard(){
    console.log(this.card_form.value);
  }

  chooseCategory(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Category');

    alert.addInput({
      type: 'checkbox',
      label: 'Alderaan',
      value: 'value1',
      checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Bespin',
      value: 'value2'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.categories_checkbox_open = false;
        this.categories_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.categories_checkbox_open = true;
    });
  }

  openImagePicker(){
   this.imagePicker.hasReadPermission().then(
     (result) => {
       if(result == false){
         // no callbacks required as this opens a popup which returns async
         this.imagePicker.requestReadPermission();
       }
       else if(result == true){
         this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
           (results) => {
             for (var i = 0; i < results.length; i++) {
               this.cropService.crop(results[i], {quality: 75}).then(
                 newImage => {
                   let image  = normalizeURL(newImage);
                   this.selected_image = image;
                 },
                 error => console.error("Error cropping image", error)
               );
             }
           }, (err) => console.log(err)
         );
       }
     }
   )
  }

  addPet()
  {
    let data = this.event_form.value;
    
    console.log('-------------------add pet');

    // var url = 'http://api.whospets.com/api/users/set_user_pets.php?username=rickykei@yahoo.com.hk&category_id=&status=&tax_id=&title=&price=&size=&quantity=&view=&created&country_id=&sub_country_id=&description=&descriptionDisplay=&keywords=&language=&specifications=&style_code=&color=&condition=&feature_date=&gallery_date=&banner_a=aa&banner_b=b&banner_c=c&todays_deal=&discount=&date_lost=&date_born=&sub_category=&weight=&name_of_pet=&country=&contact=&pet_status=&count_down_end_date=&last_seen_appearance=&questions=&pet_id=&gender='

    var url = 'http://api.whospets.com/api/users/set_user_pets.php?username='+this.email+'&title='+data.title+'&name_of_pet='+data.name_of_pet+'&date_born='+data.born_date+'&category_id='+data.petbreed+'&sub_category='+data.typeofpet+'&description='+data.description+'&pet_id='+data.id+'&gender='+data.gender+'&color='+data.color+'&weight='+data.weight+'&height='+data.height+'&size='+data.size+'&country_id='+data.countryId+'&sub_country_id='+data.subCountryId+'&contact='+data.phone+'&pet_status='+data.petstatus+'&date_lost='+data.lost_date+'&count_down_end_date='+data.found_date+'&price='+data.rewards+'&last_seen_appearance='+data.lastseen+'&status='+data.status+'&tax_id=&price=&quantity=&condition=&feature_date=&gallery_date=&banner_a=&banner_b=&banner_c=&todays_deal=&discount=&questions=&descriptionDisplay=&keywords=&language=&specifications=&style_code=&view=&created=&country=';

     console.log(url);
    
    this.http.get(url).map(res => res.json()).subscribe(data2 => {
      console.log("success to update profile");

     }, error => {
      console.log("fail to update profile");

     });
    }

}
