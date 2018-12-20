import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

import { ListingModel, ListingItemModel } from './listing.model';
import { ListingService } from './listing.service';
import { LostPetPage } from '../lostpet/lostpet';
import { DisplaySellPage } from '../display-sell/display-sell';
import { DisplayPage } from '../display/display';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
  listing: ListingModel = new ListingModel();
  categories: ListingItemModel;
  user_id : string;

  constructor(
    public nav: NavController,
    public nativeStorage:NativeStorage,
    public listingService: ListingService
  ) {}
 
  ionViewDidLoad() {
    this.listingService
      .getData()
      .then(data => {
        this.listing.banner_image = data.banner_image;
        this.listing.banner_title = data.banner_title;
        this.listing.populars = data.populars;
        this.listing.categories = data.categories;
      });

      this.nativeStorage.getItem('profile_user_id')
      .then(data => {
          this.user_id = data.profile_user_id;
        });
  }

  goToLostPet() {
    // console.log("Clicked goToFeed", category);
    // this.nav.push(FeedPage, { category: category });
    this.nav.push(LostPetPage);
  }

  goToFeed(category: any) {
    console.log("Clicked goToFeed", category);
    this.categories  = category;
    if(this.categories.catid == '4')
    {
      this.nav.push(DisplaySellPage, {display:this.user_id});
    }
    else     if(this.categories.catid == '5')
    {

    }else     if(this.categories.catid == '6')
    {
      this.nav.push(DisplayPage, {display:this.user_id});
    }else{
     this.nav.push(FeedPage, { category: category });
    }
  }

}
