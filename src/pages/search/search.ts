import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FeedService } from '../feed/feed.service';
import { FeedPostModel } from '../feed/feed.model';
import { PetinfoPage } from '../petinfo/petinfo';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  details: Array<FeedPostModel> = new Array<FeedPostModel>() ;
  loading: any;
  constructor(public navCtrl: NavController, 
    public loadingCtrl: LoadingController,
    public feedService: FeedService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  onSearch(event){
    console.info(event.target.value);
    var url ='http://api.whospets.com/api/categories/get_pets.php?keyword='+event.target.value;
    this.getContent(url);
  }

  getContent(url:string)
 {  
    this.showLoader();
    this.feedService
    .getSearchFeeds(url)
    .then(response => {
      this.details = response.data.pets;
      this.dismissLoading();
    });  
 }

  detailPost(pet)
  {
    this.navCtrl.push(PetinfoPage, {pet:pet} );
  }
  
  onCancel(event)
  {
    console.info('onCancel: '+event.target.value);
      this.refreshFeed();
  }

  clearSearch(event){
    console.info('onCancel: '+event.target.value);
    this.refreshFeed();
  }

  refreshFeed()
  {  
    this.details = new Array<FeedPostModel>() ;
  }

  showLoader(){
	  this.loading = this.loadingCtrl.create({
		 // content: 'Loading...'
	  });

	  this.loading.present();
  }

  dismissLoading()
  {
    setTimeout(() => {
      this.loading.dismiss();//显示多久消失
  }, 2000);
  }

}
