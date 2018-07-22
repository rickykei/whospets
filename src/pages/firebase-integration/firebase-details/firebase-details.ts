import { Component } from '@angular/core';
import { NavParams, AlertController, NavController, PopoverController, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseAvatarSelect } from '../firebase-avatar-select/firebase-avatar-select';
import { FirebaseService } from '../firebase-integration.service';

@Component({
  selector: 'firebase-details-page',
  templateUrl: 'firebase-details.html'
})
export class FirebaseDetailsPage {

  item: any;
  avatar: any;
  details_form: FormGroup;
  changeAvatar: boolean;

  constructor(
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public popoverCtrl: PopoverController,
    public firebaseService: FirebaseService,
    public platform: Platform
  ){}

  ionViewWillLoad(){
    this.getData();
  }

  getData(){
    this.changeAvatar = false;
    this.item = this.navParams.get('data');
    this.avatar = this.item.payload.doc.data().avatar;
    this.details_form = this.formBuilder.group({
      name: new FormControl(this.item.payload.doc.data().name, Validators.required),
      surname: new FormControl(this.item.payload.doc.data().surname, Validators.required),
      age: new FormControl(this.item.payload.doc.data().age, Validators.required)
    });
  }

  openImagePicker(){
    let popover = this.popoverCtrl.create(FirebaseAvatarSelect);
    popover.onDidDismiss(data => {
      if(data != null){
        this.changeAvatar = true;
        this.avatar = data;
      }
    });
    popover.present();
  }

  delete() {
    let confirm = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you want to delete ' + this.item.payload.doc.data().name + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.firebaseService.deletePerson(this.item.payload.doc.id)
            .then(
              () => this.navCtrl.pop(),
              err => console.log(err)
            )
          }
        }
      ]
    });
    confirm.present();
  }


  onSubmit(value){
    value.avatar = this.avatar;
    value.age = Number(value.age);
    this.firebaseService.updatePerson(this.item.payload.doc.id, value)
    .then(
      res => this.navCtrl.pop(),
      err => console.log(err)
    )
  }

}
