import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { PagesDisplayServiceProvider } from '../../providers/pages-display-service/pages-display-service';

/**
 * Generated class for the DisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
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
