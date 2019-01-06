import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormControl } from '../../../node_modules/@angular/forms';
import { DisplayPage } from '../display/display';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { UserModel, PetModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';

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

  profile: UserModel= new UserModel();
  pet: PetModel = new PetModel();

  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public profileService: ProfileService,
    public http: HttpClient,  
    public nativeStorage:NativeStorage,
    public navParams: NavParams) 
    {
      this.post_form = new FormGroup({
        title: new FormControl(''),
        description: new FormControl(''),      
      });

      this.profile = navParams.get('profile'); 
      this.user_id = this.profile.user_id;
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
  }

  
  choosePet(){
    let alert = this.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Pet');

    for (let pet of this.pet.data) {
      alert.addInput({
           type: 'checkbox',
           label: pet.name_of_pet,
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
    let postdata = this.post_form.value;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,username:this.email
      , title:postdata.title, description:postdata.description , name_of_pet:this.choosepet
    , pet_id:this.choosepetid});
    this.http.post("http://api.whospets.com/api/users/set_user_posts.php",data, { headers: headers })
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
      this.navCtrl.push(DisplayPage, {display:this.user_id, getall:false} );
    }

}
