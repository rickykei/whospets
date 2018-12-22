import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PagesDisplayServiceProvider } from '../../providers/pages-display-service/pages-display-service';
import { SetQnaPage } from '../set-qna/set-qna';

/**
 * Generated class for the QnaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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

 constructor(
   public navCtrl: NavController, 
   public nativeStorage:NativeStorage,
   public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
   public navParams: NavParams
 ) 
 {
 
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
   // default
   //'http://graph.facebook.com/100001704123828/picture'

 //  this.nativeStorage.getItem('email_user')
//   .then(data => {
       this.PagesDisplayServiceProvider.getQnA(this.user_id)
       .then(response => {
         this.petModel = response; 
         this.details = response.data;                       
       });
  //   });
   } 

   setQna()
   {
     this.navCtrl.push(SetQnaPage, {display:this.user_id} );
   }

}
