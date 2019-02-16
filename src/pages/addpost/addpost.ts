import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetModel, ResponseModel } from '../profile/profile.model';
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
  user_id:string;

  post_form: any;

  pets_checkbox_open: boolean;
  pets_checkbox_result;
  choosepet :string;
  choosepetid :number;
  postResponse:ResponseModel;

//  profile: UserModel= new UserModel();
  pet: PetModel = new PetModel();
  isTab: boolean;
  loading :any;
  //image
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = './assets/images/blank-avatar.jpg';

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
        title: new FormControl('',Validators.required),
        description: new FormControl('',Validators.required)      
      });

      this.isTab = navParams.get('onTab'); 
      console.log('this.isTab ' + this.isTab);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddpostPage');

    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log(data.profile_user_id);

         this.nativeStorage.getItem('email_user')
         .then(data2 => {
          this.email = data2.email;   

          this.profileService.getPet(data2.email, data.profile_user_id)
          .then(response => {
            this.pet = response;
          });
         });
      });
   
     console.log(this.user_id);
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
        this.imgPreview = 'data:image/jpeg;base64,' + results[i];
        this.regData.avatar = this.imgPreview;
          // this.imgPreview = results[i];
          // this.base64.encodeFile(results[i]).then((base64File: string) => {
          //   this.regData.avatar = base64File;
          // }, (err) => {
          //   console.log(err);
          // });
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

    if(this.checkField())
    {
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
        .subscribe((res:ResponseModel) => { 
          this.postResponse = res; 
        
        console.log("VALUE RECEIVED: "+res);
        this.loading.dismiss();

        if(this.postResponse.success==='true')
        {
          this.event.publish('user:back');
          this.navCtrl.pop();
        }
        else
        {
          alert("Fail to add, missing contents.")
        }

      }, (err) => {
        this.loading.dismiss();
        alert("Fail to add, please try it later.")
      }, () =>
      {
        this.loading.dismiss();
      });
    } 
  }
    // .map(res => res.json(data))
  //   .subscribe(res => {
  //     this.loading.dismiss();
  //     this.event.publish('user:back');
  //     this.navCtrl.pop();
  //  // alert("success "+res);
  //  // this.goToDisplay();
  //   }, (err) => {
  //     this.loading.dismiss();

  //   alert("failed");
  //   });
  //   }

    showLoader(){
      this.loading = this.loadingCtrl.create({
        content: 'Submitting...'
      });
  
      this.loading.present();
    }

    goToDisplay() 
    {
      this.navCtrl.pop().then(
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
    }

    checkField()
  {
    if(!this.choosepetid || !this.regData.avatar)
    {
      alert('Missing petId or image.');
      return false;
    }
   
    return true;
  }

}
