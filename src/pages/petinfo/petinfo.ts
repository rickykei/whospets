import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { PetDetailsModel } from '../profile/profile.model';
import { NativeStorage } from '@ionic-native/native-storage';
import { SocialSharing } from '../../../node_modules/@ionic-native/social-sharing';


/**
 * Generated class for the PetinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-petinfo',
  templateUrl: 'petinfo.html',
})
export class PetinfoPage {

  pet: PetDetailsModel = new PetDetailsModel();
 uid:string;

  constructor(
    public navCtrl: NavController, 
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public socialSharing: SocialSharing
  ) {
    this.pet = navParams.get('pet'); 
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

  }

  sharePost(post) {
    //this code is to use the social sharing plugin
    // message, subject, file, url
    this.socialSharing.share(post.description, post.title, post.image, null)
    .then(() => {
      console.log('Success!');
    })
    .catch(() => {
       console.log('Error');
    });
  }
}
