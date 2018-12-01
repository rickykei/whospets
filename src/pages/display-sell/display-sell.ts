import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { PagesDisplayServiceProvider } from '../../providers/pages-display-service/pages-display-service';

/**
 * Generated class for the DisplaySellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-display-sell',
  templateUrl: 'display-sell.html',
})
export class DisplaySellPage{

  display: string;
  pet: PetDetailsModel = new PetDetailsModel();
  uid:string;
  petModel: PetModel = new PetModel();


  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public navParams: NavParams
  ) 
  {
    this.display = navParams.get('display'); 
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
    // default
    //'http://graph.facebook.com/100001704123828/picture'

    this.nativeStorage.getItem('email_user')
    .then(data => {
        this.PagesDisplayServiceProvider.getPost(data.email)
        .then(response => {
          this.petModel = response; 
          this.pet = this.petModel[0].data;                  
        });
      });
    } 

}
