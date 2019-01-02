import { Component } from '@angular/core';
<<<<<<< HEAD
import { NavController, NavParams } from 'ionic-angular';
=======
import {  NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
>>>>>>> 91e40d37fc6f71be6007ed6d007eaac4be40bff7
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PagesDisplayServiceProvider } from './display.services';

/**
 * Generated class for the DisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

<<<<<<< HEAD
=======

>>>>>>> 91e40d37fc6f71be6007ed6d007eaac4be40bff7
@Component({
  selector: 'page-display',
  templateUrl: 'display.html',
})
export class DisplayPage {

 // display: string;
  pet: PetDetailsModel = new PetDetailsModel();
  uid:string;
  petModel: PetModel = new PetModel();
  user_id:number;
  details: Array<PetDetailsModel>;
  getall:boolean;

  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public navParams: NavParams
  ) 
  {
    this.user_id = navParams.get('display'); 
    this.getall = navParams.get('getall');

    console.log("this.getall : " +this.getall);

  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PetinfoPage');
    console.log(this.pet.name_of_pet);
   
    this.nativeStorage.getItem('email_user')
    .then(data => {
      var url ;
      if(data.uid=='')
      {   
        this.uid='100001704123828';  
      }
      else{
        this.uid=data.uid;
      }
    });
    
    if(this.getall===true)
    {
      this.PagesDisplayServiceProvider.getAllPost()
      .then(response => {
        this.petModel = response; 
        this.details = response.data;   
      });
    }
    else
    {
        this.PagesDisplayServiceProvider.getPost(this.user_id)
        .then(response => {
          this.petModel = response; 
          this.details = response.data;                       
        });
      }
    } 

}
