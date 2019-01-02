import { Component } from '@angular/core';
<<<<<<< HEAD
import { NavController, NavParams } from 'ionic-angular';
=======
import {  NavController, NavParams } from 'ionic-angular';
>>>>>>> 91e40d37fc6f71be6007ed6d007eaac4be40bff7
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
