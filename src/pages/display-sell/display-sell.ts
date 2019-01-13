import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel, PetModel } from '../profile/profile.model';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { AddsellPage } from '../addsell/addsell';

/**
 * Generated class for the DisplaySellPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-display-sell',
  templateUrl: 'display-sell.html',
})
export class DisplaySellPage{

 // display: string;
  pet: PetDetailsModel = new PetDetailsModel();
  uid:string;
  petModel: PetModel = new PetModel();
  user_id:number;
  details: Array<PetDetailsModel>;
  getall: boolean;

  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public navParams: NavParams
  ) 
  {
    this.user_id = navParams.get('display'); 
    this.getall = navParams.get('getall'); 
    console.log( 'getall : ' + this.getall);
  }

  
  ionViewDidEnter()
  {
    this.getContent();
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
    
   //this.getContent();
    } 

    setSell()
    {
      this.navCtrl.push(AddsellPage, {profile:this.user_id} );
    }

    getContent()
    {
      if(this.getall===true)
      {
        this.PagesDisplayServiceProvider.getAllSell(10,0)
        .then(response => {
          this.petModel = response; 
          this.details = response.data;                  
        });
      }
      else
      {
          this.PagesDisplayServiceProvider.getSell(this.user_id,10,0)
          .then(response => {
            this.petModel = response; 
            this.details = response.data;                  
          });
        }

    }

    doRefresh(refresher) {
      console.log('Begin async operation', refresher);
      this.getContent();
    
      setTimeout(() => {
        console.log('Async operation has ended');
        refresher.complete();
      }, 2000);
    }
	
	
	doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
     if(this.getall===true)
      {
        this.PagesDisplayServiceProvider.getAllSell(10,this.details.length)
        .then(response => {
          //this.petModel = response; 
          for(let i=0; i<response.data.length; i++) {
			console.log('postdata looop'+i); 
			this.details.push(response.data[i]);
		  }
        });
      }
      else
      {
          this.PagesDisplayServiceProvider.getSell(this.user_id,10,this.details.length)
          .then(response => {
            this.petModel = response; 
            for(let i=0; i<response.data.length; i++) {
			console.log('postdata looop'+i); 
			this.details.push(response.data[i]);
		    }                 
          });
        }

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
    }
}
