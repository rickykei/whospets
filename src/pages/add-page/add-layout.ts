import { Component } from '@angular/core';
import { NavController, SegmentButton, AlertController, Platform, normalizeURL } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { counterRangeValidator } from '../../components/counter-input/counter-input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { PetDetailsService } from './addlayout.service';
import { PetBreedModel, PetColorModel } from './addlayout.model';

import { CountryIdModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'add-layout-page',
  templateUrl: 'add-layout.html'
})
export class AddLayoutPage {
  section: string;

  post_form: any;
  event_form: FormGroup;
  card_form: FormGroup;

  categories_checkbox_open: boolean;
  categories_checkbox_result;

  selected_image: any;

  petdetail: PetBreedModel = new PetBreedModel();
  petColor: PetColorModel = new PetColorModel();

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();


  constructor(
    public nav: NavController,
    public petdetailservice : PetDetailsService,
    public profileService: ProfileService,
    public alertCtrl: AlertController,
    public cropService: Crop,
    public imagePicker: ImagePicker,
    public platform: Platform
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
      petbreed: new FormControl(),
      description: new FormControl(),
      phone: new FormControl(),
      gender: new FormControl(),
      weight: new FormControl(30),
      height: new FormControl(15),
      rewards: new FormControl(0),
      size: new FormControl(),
      to_date: new FormControl(),
      lost_date: new FormControl(),
      found_date: new FormControl(),
      typeofpet: new FormControl(),
      countryId: new FormControl(),
      subCountryId: new FormControl()
    });
    this.card_form = new FormGroup({
      card_number: new FormControl('', Validators.required),
      card_holder: new FormControl('', Validators.required),
      cvc: new FormControl('', Validators.required),
      exp_date: new FormControl('', Validators.required),
      save_card: new FormControl(true, Validators.required)
    });
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

}
