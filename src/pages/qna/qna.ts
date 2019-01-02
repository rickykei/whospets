import { Component } from '@angular/core';
<<<<<<< HEAD
import { NavController, NavParams } from 'ionic-angular';
=======
import {  NavController, NavParams } from 'ionic-angular';
>>>>>>> 91e40d37fc6f71be6007ed6d007eaac4be40bff7
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { SetQnaPage } from '../set-qna/set-qna';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PagesDisplayServiceProvider } from '../display/display.services';

/**
 * Generated class for the QnaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-qna',
  templateUrl: 'qna.html',
})
export class QnaPage {

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
   console.log('ionViewDidLoad qna');
   console.log(this.pet.name_of_pet);
  
   this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
        console.log(data.profile_user_id);
     });
     
     console.log(this.user_id);


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
      this.PagesDisplayServiceProvider.getAllQnA()
      .then(response => {
        this.petModel = response; 
        this.details = response.data;   
      });
    }
    else
    {
       this.PagesDisplayServiceProvider.getQnA(this.user_id)
       .then(response => {
         this.petModel = response; 
         this.details = response.data;                       
       });
      }
   } 

   setQna()
   {
     this.navCtrl.push(SetQnaPage, {display:this.user_id , getall:false} );
   }

}
