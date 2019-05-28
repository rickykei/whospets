import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { NativeStorage } from '@ionic-native/native-storage';



/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    public nativeStorage:NativeStorage,
  ) {}

  // Get permission from the user
  async getToken() {

    let token;
  
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    } 
  
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 

    console.info('device token:' + token);
    this.nativeStorage.setItem('firebase_token',
    {       
      token: token,
    })
    .then(
      () =>  console.log('firebase_token , Stored firebase_token!'),
      error => console.error('Error storing firebase_token')
    ); 
    
    return this.saveTokenToFirestore(token)
  }
  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;
  
    const devicesRef = this.afs.collection('devices');
  
    const docData = { 
      token,
      userId: 'whospetsuser',
    }
    return devicesRef.doc(token).set(docData);
  }
  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}
