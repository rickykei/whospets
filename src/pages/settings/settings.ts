import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform, normalizeURL } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { WalkthroughPage } from '../walkthrough/walkthrough';

import 'rxjs/Rx';

import { ProfileModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';

import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from "../../providers/language/language.service";
import { LanguageModel } from "../../providers/language/language.model";
import { AppRate } from '@ionic-native/app-rate';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';
import { FacebookUserModel } from '../facebook-login/facebook-user.model';
import { FacebookLoginService } from '../facebook-login//facebook-login.service';


import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;
  status : string;

  profile: ProfileModel = new ProfileModel();
  languages: Array<LanguageModel>;

  user: FacebookUserModel = new FacebookUserModel();


  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public languageService: LanguageService,
    public profileService: ProfileService,
    public appRate: AppRate,
    public imagePicker: ImagePicker,
    public cropService: Crop,
    public nativeStorage:NativeStorage,
    public facebookLoginService: FacebookLoginService,
    private http: Http,
    public platform: Platform
  ) {

    this.loading = this.loadingCtrl.create();

    this.languages = this.languageService.getLanguages();

    this.settingsForm = new FormGroup({
      username: new FormControl(),
      firstname: new FormControl(),
      lastname: new FormControl(),
      email: new FormControl(),
      city: new FormControl(),
      street: new FormControl(),
      notifications: new FormControl(),
      about: new FormControl(),
      language: new FormControl(),
      newsletter: new FormControl(),
      seller: new FormControl(),
      gender: new FormControl(),
      bio: new FormControl(),
      birthday: new FormControl(),
      countryId: new FormControl(),
      subCountryId: new FormControl()

    });
  }

  ionViewDidLoad() {

    this.nativeStorage.getItem('email_user')
    .then(data => {
      var url ;
      if(data.uid=='')
      {   
        // normal
        url = 'http://api.whospets.com/api/users/profile.php?logintype=normal&username='+data.email+'&password='+data.password;  
     }
      else{
         //fb
         url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email+'&fb_uid='+data.uid;
      
          }
     
    // var url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email+'&fb_uid='+data.uid;;

    //  var url = './assets/example_data/profile.json';
      console.log('..url :'+ url);

      this.profileService.getData(url)
      .then(data2 => {
        console.log('..data2 :'+ data2.success);

        this.status = data2.success;
        if(this.status=='true')
        {
          this.profile.data.fb_uid = data2.data.fb_uid; //image
          this.profile.data.email = data2.data.email;
          this.profile.data.firstname = data2.data.firstname;
          this.profile.data.lastname = data2.data.lastname;
          this.profile.data.message = data2.data.message;
          this.profile.data.street = data2.data.street;
          this.profile.data.city = data2.data.city;
          this.profile.data.about = data2.data.about;
          this.profile.data.newsletter = data2.data.newsletter;
          this.profile.data.seller = data2.data.seller;
          this.profile.data.notification = data2.data.notification;
          this.profile.data.gender = data2.data.gender;
          this.profile.data.bio = data2.data.bio;
          this.profile.data.birthday = data2.data.birthday;
          this.profile.data.country_id = data2.data.country_id;
          this.profile.data.sub_country_id = data2.data.sub_country_id;
        // setValue: With setValue, you assign every form control value at once by passing in a data object whose properties exactly match the form model behind the FormGroup.
        // patchValue: With patchValue, you can assign values to specific controls in a FormGroup by supplying an object of key/value pairs for just the controls of interest.
        // More info: https://angular.io/docs/ts/latest/guide/reactive-forms.html#!#populate-the-form-model-with-_setvalue_-and-_patchvalue_
  
        let currentLang = this.translate.currentLang;
  
        this.settingsForm.patchValue({

          username: this.profile.data.email,
          firstname: this.profile.data.firstname,
          lastname: this.profile.data.lastname,
          email: this.profile.data.email,
          city: this.profile.data.city,
          street: this.profile.data.street,
          about: this.profile.data.about,
          notifications: this.profile.data.notification,
          newsletter: this.profile.data.newsletter,
          seller: this.profile.data.seller,
          gender: this.profile.data.gender,
          language: this.languages.filter(x => x.code == currentLang),
          bio : this.profile.data.bio,
          birthday : this.profile.data.birthday ,
          countryId : this.profile.data.country_id ,
          subCountryId : this.profile.data.sub_country_id ,
        });
  
        
  
        this.settingsForm.get('language').valueChanges.subscribe((lang) => {
          this.setLanguage(lang);
        });
      }
    });
    }, error => {
      console.log('error : '+ error);
    });

    this.loading.dismiss();

  }

  saveProfile()
  {
    let data = this.settingsForm.value;
 
    console.log('-------------------update profile');
    //http://api.whospets.com/api/users/createprofile.php?username=rickykei@yahoo.com.hk&street=street
     var url = 'http://api.whospets.com/api/users/createprofile.php?username=' + data.email + '&email='+data.email + '&firstname='+data.firstname + '&lastname='+data.lastname+ '&city='+data.city + '&street='+data.street + '&about='+data.about + '&notification='+data.notifications     + '&newsletter='+data.newsletter + '&seller='+data.seller + '&gender='+data.gender   + '&birthday='+data.birthday+ '&bio='+data.bio  + '&country_id='+data.countryId + '&sub_country_id='+data.subCountryId   ;
     console.log(url);
    
    this.http.get(url).map(res => res.json()).subscribe(data2 => {
      console.log("success to update profile");

     }, error => {
      console.log("fail to update profile");

     });
  }

  logout() {
    // navigate to the new page if it is not the current page
    this.facebookLoginService.doFacebookLogout()
    .then((res) => {
      this.user = new FacebookUserModel();
    }, (error) => {
      console.log("Facebook logout error", error);
    });
    this.nav.setRoot(LoginPage);
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }

  setLanguage(lang: LanguageModel){
    let language_to_set = this.translate.getDefaultLang();

    if(lang){
      language_to_set = lang.code;
    }
    this.translate.setDefaultLang(language_to_set);
    this.translate.use(language_to_set);
  }

  rateApp(){
    if(this.platform.is('cordova')){
      this.appRate.preferences.storeAppURL = {
        ios: '<my_app_id>',
        android: 'market://details?id=<package_name>',
        windows: 'ms-windows-store://review/?ProductId=<Store_ID>'
      };

      this.appRate.promptForRating(true);
    }
    else{
      console.log("You are not in a cordova environment. You should test this feature in a real device or an emulator");
    }
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

                   this.profileService.setUserImage(image);
                   this.profile.data.fb_uid = image;
                 },
                 error => console.error("Error cropping image", error)
               );
             }
           }, (err) => console.log(err)
         );
       }
     }, (err) => {
       console.log(err);
     });
  }
}
