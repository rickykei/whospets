import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Platform, normalizeURL } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { WalkthroughPage } from '../walkthrough/walkthrough';

import 'rxjs/Rx';

import { ProfileModel, CountryIdModel, ZoneModel } from '../profile/profile.model';
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


import 'rxjs/add/operator/map';
import { Base64 } from '../../../node_modules/@ionic-native/base64';
import { HttpHeaders, HttpClient} from '@angular/common/http';



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

  country: CountryIdModel = new CountryIdModel();
  subcountry: CountryIdModel = new CountryIdModel();
  zone: Array<ZoneModel> = new Array();
  
  user: FacebookUserModel = new FacebookUserModel();
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = './assets/images/blank-avatar.jpg';

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
    private http: HttpClient,
    public platform: Platform,
      private base64: Base64
  ) {

    this.loading = this.loadingCtrl.create();

    this.languages = this.languageService.getLanguages();

    this.settingsForm = new FormGroup({
      username: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
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

    this.profileService.getCountryCode()
    .then(zone => {
      this.country = zone;
    });

    this.profileService.getSubCountryCode()
    .then(zone => {
      this.subcountry = zone;
      this.zone = this.subcountry.zone;
    });

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

          username: data.email,
          firstname: this.profile.data.firstname,
          lastname: this.profile.data.lastname,
          email: data.email,
          city: this.profile.data.city,
          street: this.profile.data.street,
          about: this.profile.data.about,
          notifications: (data2.data.notification=='1'? true:false),
          newsletter: (data2.data.newsletter=='1'? true:false),
          seller: (data2.data.seller=='1'? true:false),
          gender: this.profile.data.gender,
          language: this.languages.filter(x => x.code == currentLang),
          bio : (data2.data.bio=='1'? true:false),
          birthday : this.profile.data.birthday ,
          countryId : this.profile.data.country_id ,
          subCountryId : this.profile.data.sub_country_id ,
        });
  
        
  
        this.settingsForm.get('language').valueChanges.subscribe((lang) => {
          this.setLanguage(lang);
        });
      }
      else{
        this.settingsForm.patchValue({

          username: data.email,
          email: data.email,
        });

      }
    });
    }, error => {
      console.log('error : '+ error);
    });

    this.loading.dismiss();

  }

  biotoggle()
  {

  }

  onCountryChange(event)
  {
    console.info(this.settingsForm.value.countryId);
    this.zone = new Array();
    
    for(var i = 0; i < this.subcountry.zone.length; i++)
    {
        if(this.subcountry.zone[i].parent_id === this.settingsForm.value.countryId)
        {
          this.zone.push(this.subcountry.zone[i]);
        }
    }
  }

  saveProfile()
  {

     this.showLoader();

    let postdata = this.settingsForm.value;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    let data=JSON.stringify({email:postdata.email,username:postdata.email
      , firstname:postdata.firstname, lastname:postdata.lastname , city:postdata.city
    , street:postdata.street,about:postdata.about, notification:(postdata.notifications?'1':'0' )
    ,newsletter:(postdata.newsletter?'1':'0'), seller:(postdata.seller?'1':'0' ),
    gender:postdata.gender, birthday:postdata.birthday, bio:(postdata.bio?'1':'0') ,
    country_id:postdata.countryId, sub_country_id:postdata.subCountryId,avatar:this.regData.avatar});
    this.http.post("http://api.whospets.com/api/users/createprofile.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe((res) => { 
      this.nav.pop();
      this.loading.dismiss();
    }, (err) => {
      this.loading.dismiss();

    alert("failed");
    });
    }

    showLoader(){
      this.loading = this.loadingCtrl.create({
        content: 'Submitting...'
      });
  
      this.loading.present();
    }

  logout() {
    // navigate to the new page if it is not the current page
    this.facebookLoginService.doFacebookLogout()
    .then((res) => {
      this.user = new FacebookUserModel();
    }, (error) => {
      console.log("Facebook logout error", error);
    });
    this.nativeStorage.remove('email_user');
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
    
        this.imgPreview = results[i];
        this.base64.encodeFile(results[i]).then((base64File: string) => {
          this.regData.avatar = base64File;
        }, (err) => {
          console.log(err);
        }).catch(exception => {
          console.log(' base64 Exception ' + exception);
        });

        // this.imgPreview = 'data:image/jpeg;base64,' + results[i];
        // this.regData.avatar = this.imgPreview;

        let image  = results[i];
        this.profileService.setUserImage(image);
        this.profile.data.fb_uid = image;
    }
  }, (err) => { })
  .catch(exception => {
    console.log('Exception ' + exception);
  }); 

  }

  /*
  .then(
        response => {
          console.log('Response ' + response);
        },
        error => {
          console.log('Error: ' + error);
          this.event.publish('user:back');      
        }
      ).catch(exception => {
        console.log('Exception ' + exception);
        this.event.publish('user:back');      
      });;   

      */

  
  ionViewWillLeave()
  {
    this.loading.dismiss();
  }
}
