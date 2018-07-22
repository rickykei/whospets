import { Component } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';
import { FirebaseService } from '../firebase-integration.service';

@Component({
  selector: 'firebase-avatar-select-page',
  templateUrl: 'firebase-avatar-select.html'
})
export class FirebaseAvatarSelect {

  avatars: Array<any>;

  constructor(
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    public firebaseService: FirebaseService
  ){}

  ionViewWillLoad(){
    this.getData();
  }

  getData(){
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.firebaseService.getAvatars()
    .then(data => {
      this.avatars = data;
      loading.dismiss();
    })
  }

  close(avatar) {
    this.viewCtrl.dismiss(avatar.link);
  }

}
