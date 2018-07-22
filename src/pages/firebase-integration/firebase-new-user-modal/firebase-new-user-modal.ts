import { Component } from '@angular/core';
import { ViewController, PopoverController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FirebaseAvatarSelect } from '../firebase-avatar-select/firebase-avatar-select';
import { FirebaseService } from '../firebase-integration.service';

@Component({
  selector: 'page-firebase-new-user-modal',
  templateUrl: 'firebase-new-user-modal.html'
})
export class FirebaseNewUserModalPage {

  validations_form: FormGroup;
  avatar: any;

  constructor(
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public popoverCtrl: PopoverController,
    public firebaseService: FirebaseService
  ) {}

  ionViewWillLoad(){
    this.resetFields()
  }

  resetFields(){
    this.avatar = "https://s3.amazonaws.com/uifaces/faces/twitter/jsa/128.jpg";
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required)
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

  onSubmit(value){
    this.firebaseService.createPerson(value, this.avatar)
    .then(
      res => {
        this.resetFields();
        this.viewCtrl.dismiss();
      }
    )
  }

  openImagePicker(){
    let popover = this.popoverCtrl.create(FirebaseAvatarSelect);
    popover.onDidDismiss(data => {
      if(data != null){
        this.avatar = data;
      }
    });
    popover.present();
  }
}
