import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommentDetailsModel } from './comment.model';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { StringLike } from '@firebase/util';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  comment: Array<CommentDetailsModel> = new Array<CommentDetailsModel>() ;
  content_id : string;
  table_name : string;

  constructor(
    public navCtrl: NavController,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
     public navParams: NavParams
    ) {
      this.content_id = this.navParams.get('content_id');
      this.table_name = this.navParams.get('table_name');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  getUserComment()
  {
 //   this.showLoader();
   
      this.PagesDisplayServiceProvider.getUserComment(this.content_id,this.table_name)
      .then(response => {
        this.comment = response.data;
      //  this.loading.dismiss();
      });
  }

}
