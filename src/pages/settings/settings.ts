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


@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsForm: FormGroup;
  // make WalkthroughPage the root (or first) page
  rootPage: any = WalkthroughPage;
  loading: any;

  profile: ProfileModel = new ProfileModel();
  languages: Array<LanguageModel>;

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
    public platform: Platform
  ) {

    this.loading = this.loadingCtrl.create();

    this.languages = this.languageService.getLanguages();

    this.settingsForm = new FormGroup({
      name: new FormControl(),
      location: new FormControl(),
      description: new FormControl(),
      currency: new FormControl(),
      weather: new FormControl(),
      notifications: new FormControl(),
      language: new FormControl()
    });
  }

  ionViewDidLoad() {

    this.nativeStorage.getItem('email_user')
    .then(data => {
      // if(data.password!='')
      // {
      //   // normal
      //  url = 'http://api.whospets.com/api/users/profile.php?logintype=normal&username='+data.email+'&password='+data.password;
      // }
      // else{
      //   //fb
      //  url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email;
      // }

      var url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email;

      this.loading.present();
      this.profileService.getData(url).then(data2 => {
        this.profile.data = data2.data;
        // setValue: With setValue, you assign every form control value at once by passing in a data object whose properties exactly match the form model behind the FormGroup.
        // patchValue: With patchValue, you can assign values to specific controls in a FormGroup by supplying an object of key/value pairs for just the controls of interest.
        // More info: https://angular.io/docs/ts/latest/guide/reactive-forms.html#!#populate-the-form-model-with-_setvalue_-and-_patchvalue_
  
        let currentLang = this.translate.currentLang;
  
        this.settingsForm.patchValue({
          name: data2.data.lastname,
          location: data2.data.city,
          description: data2.data.about,
          currency: 'dollar',
          weather: 'fahrenheit',
          notifications: true,
          language: this.languages.filter(x => x.code == currentLang)
        });
  
        this.loading.dismiss();
  
        this.settingsForm.get('language').valueChanges.subscribe((lang) => {
          this.setLanguage(lang);
        });
      });

    }, error => {
      console.log('error : '+ error);
    });


   
  }

  logout() {
    // navigate to the new page if it is not the current page
    this.nav.setRoot(this.rootPage);
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
                   this.profile.data.image = image;
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
