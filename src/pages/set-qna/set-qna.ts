import { Component } from '@angular/core';
import { NavController, NavParams, Events, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/Rx';
import { UserModel, PetModel } from '../profile/profile.model';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Base64 } from '../../../node_modules/@ionic-native/base64';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { QnaPage } from '../qna/qna';
import { ProfileService } from '../profile/profile.service';
/**
 * Generated class for the SetQnaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-set-qna',
  templateUrl: 'set-qna.html',
})
export class SetQnaPage {
  post_form: any;
  email: string;
  user_id:string;
  loading:any;
  pet: PetModel = new PetModel();
   pets_checkbox_open: boolean;
 pets_checkbox_result;
 choosepet :string;
 choosepetid :number;
  //image
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = './assets/images/blank-avatar.jpg';
  
  constructor(public navCtrl: NavController,
    public nativeStorage:NativeStorage,
    public http: HttpClient,  
     public navParams: NavParams,
     private imagePicker: ImagePicker,
     private base64: Base64,
     public alertCtrl: AlertController,
     public profileService: ProfileService,
     public loadingCtrl: LoadingController,
     public event: Events) {
      this.post_form = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),      
      });

      // this.user_id = navParams.get('user_id'); 
      // this.profile = navParams.get('display'); 
      // if( this.profile)
      // {       
      //   this.user_id = this.profile.user_id;
      // }       
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetQnaPage');

    this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;     

     this.profileService.getPet(data.email, this.user_id)
     .then(response => {
       this.pet = response;
     });
   });

   this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
        console.log(data.profile_user_id);
     });
     
     console.log(this.user_id);
  }

  createPost(){
    console.log(this.post_form.value);
  }

  choosePet(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Pet');

    for (let pet of this.pet.data) {
         alert.addInput({
           type: 'radio',
           label: pet.title, // pet.name_of_pet,
           value: pet.product_id
      });
   }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.pets_checkbox_open = false;
        this.pets_checkbox_result = data;

        this.choosepetid = data;

      }
    });
    alert.present().then(() => {
      this.pets_checkbox_open = true;
    });
  }
  addPost() {
    this.showLoader();
    
    let postdata = this.post_form.value;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    console.info('this.choosepetid : ' + this.choosepetid);
    
    let data=JSON.stringify({user_id:this.user_id,email:this.email
      , title:postdata.title, description:postdata.description
      , owner_pet_id:this.choosepetid ,avatar:this.regData.avatar});
    this.http.post("http://api.whospets.com/api/users/set_user_qnas.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
      this.loading.dismiss();
    //alert("success "+res);
    this.goToDisplay();
    }, (err) => {
      this.loading.dismiss();

    alert("failed");
    });
    }

    goToDisplay() 
    {
     // this.navCtrl.push(QnaPage, {display:this.user_id, getall:false} );
      this.navCtrl.pop();  
      this.event.publish('user:back');   
    }

    showLoader(){
      this.loading = this.loadingCtrl.create({
        content: 'Submitting...'
      });
  
      this.loading.present();
    }
}
