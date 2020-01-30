import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ContactModel } from './contact.model';

@Component({
  selector: 'contact-card-page',
  templateUrl: 'contact-card.html'
})
export class ContactCardPage {
  contact: ContactModel = new ContactModel();

  constructor(
    public navCtrl: NavController,
    private emailComposer: EmailComposer,
    public inAppBrowser: InAppBrowser
  ) {
  }

  sendMail(){
    //for more option please go here: http://ionicframework.com/docs/native/email-composer/
     let email = {
      to: 'contact@ionicthemes.com',
      subject: 'This app is the best!',
      body: "Hello, I'm trying this fantastic app that will save me hours of development"
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }

  openInAppBrowser(website: string){
    this.inAppBrowser.create(website, '_blank', "location=yes");
  }

}
