import { Component, ViewChild } from '@angular/core';
import { NavController, Tabs, Events } from 'ionic-angular';
import { AddsellPage } from '../addsell/addsell';
import { AddpostPage } from '../addpost/addpost';
import { SetQnaPage } from '../set-qna/set-qna';

/**
 * Generated class for the TabsAllsetpostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'tabs-allsetpost',
  templateUrl: 'tabs-allsetpost.html',
})
export class TabsAllsetpostPage {
  tab1Root = AddsellPage;
  tab2Root = AddpostPage;
  tab3Root = SetQnaPage;
  
  isTab : {
    onTab : true;
  }

  @ViewChild('myTab') tabRef: Tabs;

  constructor(public navCtrl: NavController,
    public events:Events) {   
     
      events.subscribe('user:back', () =>
    {    
      console.log('user:back');   
      this.navCtrl.popToRoot();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsAllsetpostPage');
    this.tabRef.select(1);
  }

}
