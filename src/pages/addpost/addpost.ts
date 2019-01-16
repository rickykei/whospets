import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl } from '../../../node_modules/@angular/forms';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
//image
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
/**
 * Generated class for the AddpostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-addpost',
  templateUrl: 'addpost.html',
})
export class AddpostPage {
  email: string;
  user_id:number;

  post_form: any;

  pets_checkbox_open: boolean;
  pets_checkbox_result;
  choosepet :string;
  choosepetid :string;

//  profile: UserModel= new UserModel();
  pet: PetModel = new PetModel();
  isTab: boolean;
  loading :any;
  //image
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = 'assets/images/blank-avatar.jpg';

  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public profileService: ProfileService,
    public http: HttpClient,  
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private imagePicker: ImagePicker,
    private base64: Base64,
    public event: Events) 
    {
      this.post_form = new FormGroup({
        title: new FormControl(''),
        description: new FormControl('')      
      });

      this.isTab = navParams.get('onTab'); 
      console.log('this.isTab ' + this.isTab);
      // this.user_id = navParams.get('user_id'); 
      // this.profile = navParams.get('profile'); 
      // if( this.profile)
      // {       
      //   this.user_id = this.profile.user_id;
      // }     
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddpostPage');

    this.nativeStorage.getItem('email_user')
    .then(data => {
     this.email = data.email;   

     this.profileService.getPet(data.email)
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
  
  choosePet(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Pet');

    for (let pet of this.pet.data) {
      alert.addInput({
           type: 'checkbox',
           label: pet.title, // pet.name_of_pet,
           value: pet.pet_id
      });
   }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Confirm',
      handler: data => {
        console.log('Checkbox data:', data);
        this.pets_checkbox_open = false;
        this.pets_checkbox_result = data;

        this.choosepet = data.label;
        this.choosepetid = data.value;
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
    
    
    let data=JSON.stringify({user_id:this.user_id,email:this.email
      , title:postdata.title, description:postdata.description , name_of_pet:this.choosepet
    , pet_id:this.choosepetid,owner_pet_id:this.choosepetid,avatar:this.regData.avatar});
    this.http.post("http://api.whospets.com/api/users/set_user_posts.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
      this.loading.dismiss();

   // alert("success "+res);
    this.goToDisplay();
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

    goToDisplay() 
    {
      this.event.publish('user:back');
      this.navCtrl.pop();   
    }

}
