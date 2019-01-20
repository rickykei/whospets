import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { CommentDetailsModel } from '../comment/comment.model';

/**
 * Generated class for the CommentpetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @Component({
  selector: 'page-commentpet',
  templateUrl: 'commentpet.html',
})
export class CommentpetPage {
  comment: Array<CommentDetailsModel> = new Array<CommentDetailsModel>() ;
  product_id:string;

  constructor(public navCtrl: NavController,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public navParams: NavParams) {

      this.product_id = navParams.get('product_id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentpetPage');
  }


  getPetComment()
  {
 //   this.showLoader();
   
      this.PagesDisplayServiceProvider.getPetComment(this.product_id)
      .then(response => {
        this.comment = response.data;
      //  this.loading.dismiss();
      });
  }
  
}
