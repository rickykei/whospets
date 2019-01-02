import { Component } from '@angular/core';
<<<<<<< HEAD
import { NavController, NavParams } from 'ionic-angular';
=======
import {  NavController, NavParams } from 'ionic-angular';
>>>>>>> 91e40d37fc6f71be6007ed6d007eaac4be40bff7
import { Validators, FormGroup, FormControl } from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/Rx';
import { UserModel } from '../profile/profile.model';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
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

  constructor(public navCtrl: NavController,
    public nativeStorage:NativeStorage,
    private http: Http,    
     public navParams: NavParams) {

      this.post_form = new FormGroup({
        title: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),      
      });

      this.profile = navParams.get('display'); 
      this.user_id = this.profile.user_id;
  
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

  addPost()
  {
    let data = this.post_form.value;
  //  this.display ='addPost';
    console.log('-------------------add qnas');

    var url = 'http://api.whospets.com/api/users/set_user_qnas.php?'+'user_id='+this.user_id+
    '&email='+this.email+'&title='+data.title+
    '&description='+data.description;
   

     console.log(url);
    
    this.http.get(url).map(res => res.json()).subscribe(data2 => {
      console.log("success to add post");

   //   this.uploadImage();

     // this.goToDisplay();
    
    }, error => {
      console.log("fail to add post");

     });
  }  
}
