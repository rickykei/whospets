import { Component } from '@angular/core';
import { ModalController, NavController, LoadingController, Range } from 'ionic-angular';
import { FirebaseNewUserModalPage } from '../firebase-new-user-modal/firebase-new-user-modal';
import { FirebaseDetailsPage } from '../firebase-details/firebase-details';
import { FormGroup, FormControl } from '@angular/forms';
import { FirebaseService } from '../firebase-integration.service';

@Component({
  selector: 'firebase-feed-page',
  templateUrl: 'firebase-feed.html'
})
export class FirebaseFeedPage {

  items: Array<any>;
  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;
  searchValue: string;
  rangeForm: any;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public firebaseService: FirebaseService
  ){
    this.rangeForm = new FormGroup({
      dual: new FormControl({lower: 1, upper: 99})
    });
  }

  ionViewWillEnter(){
    this.searchValue = "";
    this.getData();
  }

  getData(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.firebaseService.getPeople()
    .then(users => {
      //we use 3 lists for the filters. Check the template docs to learn more.
      this.items = users;
      this.age_filtered_items = users;
      this.name_filtered_items = users;
      loading.dismiss();
    })
  }

  viewDetails(item){
    this.navCtrl.push(FirebaseDetailsPage, {
      data: item
    })
  }

  openNewUserModal(){
    let modal = this.modalCtrl.create(FirebaseNewUserModalPage);
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }

  rangeChange(range: Range) {
    this.firebaseService.searchPeopleByAge(
      this.rangeForm.controls.dual.value.lower,
      this.rangeForm.controls.dual.value.upper
    )
    .then(res => {
      this.age_filtered_items = res;
      this.items = this.combineLists(res, this.name_filtered_items);
    })
  }

  onInputChange(event){
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchPeople(value)
    .then(res => {
      this.name_filtered_items = res;
      this.items = this.combineLists(res, this.age_filtered_items);
    })
  }

  combineLists(a, b){
    let result = [];

    a.filter(x => {
      return b.filter(x2 =>{
        if(x2.payload.doc.id == x.payload.doc.id){
          result.push(x2);
        }
      });
    });
    return result;
  }

}
