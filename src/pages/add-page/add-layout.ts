import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, Platform, normalizeURL, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { PetDetailsService } from './addlayout.service';
import { PetBreedModel, PetColorModel, PetStatusModel, BreedModel } from './addlayout.model';

import { CountryIdModel, UserModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '@ionic-native/native-storage';

import {Http} from '@angular/http';
import 'rxjs/Rx';
import { ProfilePage } from '../profile/profile';
//import { Observable } from '@firebase/util';

import { Observable} from 'rxjs/Observable'
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { DisplayPage } from '../display/display';
import { DisplaySellPage } from '../display-sell/display-sell';
import { SetQnaPage } from '../set-qna/set-qna';

@Component({
  selector: 'add-layout-page',
  templateUrl: 'add-layout.html'
})
export class AddLayoutPage {
 // display:string;
  section: string;
  email: string;
  petowner:string;
  user_id:number;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  pets_checkbox_open: boolean;
  pets_checkbox_result;

  selected_image: any;

  petdetail: PetBreedModel = new PetBreedModel();
  petColor: PetColorModel = new PetColorModel();
  petStatus: PetStatusModel = new PetStatusModel();

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();

  profile: UserModel= new UserModel();

  selectedbreeds: BreedModel[];
  breeds: any;


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
    public navParams: NavParams,
    private camera: Camera,
    private transfer: FileTransfer
  ) {

    this.section = "event";

    this.post_form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),      
    });
    this.event_form = new FormGroup({
      title: new FormControl('', Validators.required),
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
    this.card_form = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),  
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

    this.initializePetType();

    console.log(this.petowner);
    console.log(this.user_id);
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

  choosePet(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Pet');

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
        this.pets_checkbox_open = false;
        this.pets_checkbox_result = data;
      }
    });
    alert.present().then(() => {
      this.pets_checkbox_open = true;
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
   // this.display ='addPet';
    console.log('-------------------add pet');

    // var url = 'http://api.whospets.com/api/users/set_user_pets.php?username=rickykei@yahoo.com.hk&category_id=&status=&tax_id=&title=&price=&size=&quantity=&view=&created&country_id=&sub_country_id=&description=&descriptionDisplay=&keywords=&language=&specifications=&style_code=&color=&condition=&feature_date=&gallery_date=&banner_a=aa&banner_b=b&banner_c=c&todays_deal=&discount=&date_lost=&date_born=&sub_category=&weight=&name_of_pet=&country=&contact=&pet_status=&count_down_end_date=&last_seen_appearance=&questions=&pet_id=&gender='

    var url = 'http://api.whospets.com/api/users/set_user_pets.php?user_id='+this.user_id
    +'&username='+this.email
    +'&title='+data.title+'&name_of_pet='+this.petowner+'&date_born='+data.born_date
    +'&category_id='+data.petbreed+'&sub_category='+data.typeofpet+'&description='+data.description
    +'&pet_id='+data.id+'&gender='+data.gender+'&color='+data.color+'&weight='+data.weight
    +'&height='+data.height+'&size='+data.size+'&country_id='+data.countryId+'&sub_country_id='+data.subCountryId
    +'&contact='+data.phone+'&pet_status='+data.petstatus+'&date_lost='+data.lost_date
    +'&count_down_end_date='+data.found_date+'&price='+data.rewards+'&last_seen_appearance='+data.lastseen
    +'&status='+data.status+'&tax_id=&price=&quantity=&condition=&feature_date=&gallery_date=&banner_a='
    +'&banner_b=&banner_c=&todays_deal=&discount=&questions=&descriptionDisplay=&keywords=&language='
    +'&specifications=&style_code=&view=&created=&country=';

     console.log(url);
    
    this.http.get(url).map(res => res.json()).subscribe(data2 => {
      console.log("success to add pet");

      this.uploadImage();
      
      this.goToDisplay();

     }, error => {
      console.log("fail to add pet");

     });
    }

    addPost()
    {
      let data = this.post_form.value;
    //  this.display ='addPost';
      console.log('-------------------add post');
  
      var url = 'http://api.whospets.com/api/users/set_user_posts.php?'+'user_id='+this.user_id+
      '&email='+this.email+'&title='+data.title+
      '&description='+data.description;
     
  
       console.log(url);
      
      this.http.get(url).map(res => res.json()).subscribe(data2 => {
        console.log("success to add post");
  
     //   this.uploadImage();

        this.goToDisplay();
      
      }, error => {
        console.log("fail to add post");
  
       });
    }

    addSell()
    {
      let data = this.card_form.value;
     // this.display ='addSell';
    
      console.log('-------------------add sell');
  
      var url = 'http://api.whospets.com/api/users/set_user_sells.php?user_id='+this.user_id
      +'&username='+this.email
      +'&title='+data.title+'&description='+data.description+'&price='+data.price
      +'&size='+data.size+'&country_id='+data.countryId+'&sub_country_id='+data.subCountryId
      +'&color='+data.color+'&weight='+data.weight;

       console.log(url);
      
      this.http.get(url).map(res => res.json()).subscribe(data2 => {
        console.log("success to add sell");
  
    //    this.uploadImage();
       
        this.nav.push(DisplaySellPage, {display:this.user_id, getall:false});

       }, error => {
        console.log("fail to add sell");
  
       });
    }

    goToDisplay() 
    {
      this.nav.push(DisplayPage, {display:this.user_id, getall:false} );
    }

   /* uploadImage()
    {
      let url = 'http://api.whospets.com/api/users/upload_image.php?image_field='+this.selected_image.newImage+'&user_id='+this.profile.user_id+'&username='+this.email+'&is_default=Y';
      let postData = new FormData();
      postData.append('file', this.selected_image);

      let data:Observable<any> =  this.http.post(url, postData);
      data.subscribe((result) => {
        console.log(result);
      });
    }
    */

    uploadImage()
  {
    
     let options = {

         quality: 100
          };


    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:

   const fileTransfer: FileTransferObject = this.transfer.create();

    let options1: FileUploadOptions = {
       fileKey: 'file',
       fileName: 'name.jpg',
       headers: {}
    
    }

    let url = 'http://api.whospets.com/api/users/upload_image.php?image_field='+options1.fileName+'&user_id='+this.profile.user_id+'&username='+this.email+'&is_default=Y';
    
fileTransfer.upload(imageData, url, options1)
 .then((data) => {
   // success
   alert("success");
   console.log("success");

 }, (err) => {
   // error
   alert("error"+JSON.stringify(err));
   console.log("error"+JSON.stringify(err));

 });


  });


}
// setDistrictValues(sState) {
//  this.selectedDistricts = this.districts.filter(district => district.state_id == sState.id)
//}
initializePetType(){
  this.breeds = [
      {id: 1, name: 'Dog', pet_id: 1},
      {id: 2, name: 'Cat', pet_id: 2}     
  ];
  }
setPetBreedValues(sBreed) {
  let data = this.event_form.value;

  this.selectedbreeds = this.petdetail.pet.filter(
    breed => breed.parent_id == sBreed 
  );

  console.log('lenght : ' + this.selectedbreeds.length);
  console.log('title :' + this.selectedbreeds[1].title);
  console.log('parent id: ' + this.selectedbreeds[1].parent_id);
}

}
