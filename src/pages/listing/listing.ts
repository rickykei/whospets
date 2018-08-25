import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ListingService } from './listing.service';
import { LostPetPage } from '../lostpet/lostpet';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
  listing: ListingModel = new ListingModel();

  constructor(
    public nav: NavController,
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
  }

  goToLostPet() {
    // console.log("Clicked goToFeed", category);
    // this.nav.push(FeedPage, { category: category });
    this.nav.push(LostPetPage);
  }

  goToFeed(category: any) {
    console.log("Clicked goToFeed", category);
     this.nav.push(FeedPage, { category: category });
  }

}
