import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';

/**
 * Generated class for the PostInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-post-info',
  templateUrl: 'post-info.html',
})
export class PostInfoPage {

  post: PetDetailsModel = new PetDetailsModel();
  uid:string;
  
  constructor(public navCtrl: NavController,
     public navParams: NavParams
    ) {
    this.post = navParams.get('post'); 

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostInfoPage');
  }

}
