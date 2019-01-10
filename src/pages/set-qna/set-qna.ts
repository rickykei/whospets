import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/Rx';
import { UserModel } from '../profile/profile.model';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { ImagePicker } from '../../../node_modules/@ionic-native/image-picker';
import { Base64 } from '../../../node_modules/@ionic-native/base64';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { QnaPage } from '../qna/qna';
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
  user_id:number;

  profile: UserModel= new UserModel();

  //image
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = 'assets/images/blank-avatar.jpg';
  
  constructor(public navCtrl: NavController,
    public nativeStorage:NativeStorage,
    public http: HttpClient,  
     public navParams: NavParams,
     private imagePicker: ImagePicker,
     private base64: Base64) {

      this.post_form = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),      
      });

      this.user_id = navParams.get('user_id'); 
      this.profile = navParams.get('display'); 
      if( this.profile)
      {       
        this.user_id = this.profile.user_id;
      }       
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
   });
  }

  createPost(){
    console.log(this.post_form.value);
  }

  addPost() {
    let postdata = this.post_form.value;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,username:this.email
      , title:postdata.title, description:postdata.description ,avatar:this.regData.avatar});
    this.http.post("http://api.whospets.com/api/users/set_user_qnas.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
    alert("success "+res);
    this.goToDisplay();
    }, (err) => {
    alert("failed");
    });
    }

    goToDisplay() 
    {
      this.navCtrl.push(QnaPage, {display:this.user_id, getall:false} );
    }
}
