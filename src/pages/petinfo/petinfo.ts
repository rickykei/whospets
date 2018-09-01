import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';

/**
 * Generated class for the PetinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-petinfo',
  templateUrl: 'petinfo.html',
})
export class PetinfoPage {

  pet: PetDetailsModel = new PetDetailsModel();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pet = navParams.get('pet'); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PetinfoPage');
    console.log(this.pet.name_of_pet);

  }

}
