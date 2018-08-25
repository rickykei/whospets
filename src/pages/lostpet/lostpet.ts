import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import 'rxjs/Rx';

import { DataModel,PetLostPostModel, PetLostModel } from './lostpet.model';

import { LostPetServices } from './lostpet.service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'lostpet-page',
  templateUrl: 'lostpet.html'
})
export class LostPetPage {
  posts : PetLostModel = new PetLostModel();
  postdata : DataModel = new DataModel();
  details: Array<PetLostPostModel>;

  constructor(
    public nav: NavController,
    public petlostService: LostPetServices,
    public navParams: NavParams,
    public socialSharing: SocialSharing
  ) {
    // this.pets.category = navParams.get('category');
  }


  ionViewDidLoad(){
    this.petlostService
      .getPosts().then(posts => {


        this.posts.success =  posts.success;
        this.posts.data = posts.data;
        this.postdata = posts.data;
        this.details = posts.data.pets;

        console.log('post :' + this.posts.success);

        // this.posts.status = posts.status;
        // this.posts.message = posts.message;
        // this.posts.records = posts.records;
        // this.posts.pets = posts.pets;

      });
  }

  goToProfile(event, item) {
    this.nav.push(ProfilePage, {
      user: item
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
