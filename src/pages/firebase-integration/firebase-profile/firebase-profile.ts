import { Component } from '@angular/core';
import { NavController, App, Platform, ToastController, normalizeURL } from 'ionic-angular';
import { FirebaseService } from '../firebase-integration.service';
import { FirebaseAuthService } from '../firebase-auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';

@Component({
  selector: 'firebase-profile-page',
  templateUrl: 'firebase-profile.html'
})
export class FirebaseProfilePage {

  profile_form: FormGroup;
  user: any = {
    id: "",
    name: "",
    image: ""
  };
  validation_messages = {
   'name': [
     { type: 'required', message: 'Name is required.' },
   ],
    'description': [
      { type: 'required', message: 'Description is required.' },
    ]
 };

  constructor(
    public nav: NavController,
    public firebaseService: FirebaseService,
    public fAuthService: FirebaseAuthService,
    public app: App,
    public imagePicker: ImagePicker,
    public cropService: Crop,
    public platform: Platform,
    public toastCtrl: ToastController
  ) {
    this.profile_form = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl({
        value: 'This is an example of Social Authentication using Firebase in an Ionic 3 mobile app.',
        disabled: true
      })
    });
  }

  ionViewWillLoad(){
   this.fAuthService.getCurrentUser()
   .then( user => {
     this.user = user;
     this.updateFormValues(this.user.name);
   }, err => console.log(err))
  }

  updateFormValues(name) {
    this.profile_form.patchValue({
      name: name
    });
  }

  saveFormValues(value){
    this.fAuthService.updateFormValues(value)
    .then(res => {
      console.log(res);
      let toast = this.toastCtrl.create({
        message: 'Your name was updated successfully',
        duration: 3000
      });
      toast.present();
    }, err => console.log(err))
  }

  logout(){
    this.fAuthService.doLogout()
    .then((res) => {
      this.app.getRootNav().pop();
    }, (error) => {
      console.log("Logout error", error);
    });
  }

  openImagePicker(){
    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.cropService.crop(results[i], {quality: 75}).then(
                  newImage => {
                    this.uploadImageToFirebase(newImage);
                  },
                  error => console.error("Error cropping image", error)
                );
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  uploadImageToFirebase(image){
    image = normalizeURL(image);

    //uploads img to firebase storage
    this.firebaseService.uploadImage(this.user.id, image)
    .then(photoURL => {
      //updates firebase current user photo
      this.fAuthService.updatePhotoUrl(photoURL);
      this.user.image = photoURL;
      let toast = this.toastCtrl.create({
        message: 'Image was updated successfully',
        duration: 3000
      });
      toast.present();
      })
  }

}
