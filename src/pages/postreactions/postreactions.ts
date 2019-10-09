import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';

/**
 * Generated class for the PostreactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-postreactions',
  templateUrl: 'postreactions.html',
})
export class PostreactionsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,  private viewCtrl: ViewController, public event: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostreactionsPage');
  }

  report(){
    this.event.publish('user:back');
    this.viewCtrl.dismiss();
  }

}
