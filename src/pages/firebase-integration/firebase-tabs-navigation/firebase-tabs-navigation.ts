import { Component } from '@angular/core';

import { FirebaseFeedPage } from '../firebase-feed/firebase-feed';
import { FirebaseProfilePage } from '../firebase-profile/firebase-profile';


@Component({
  selector: 'firebase-tabs-navigation',
  templateUrl: 'firebase-tabs-navigation.html'
})
export class FirebaseTabsNavigationPage {
  tab1Root: any;
  tab2Root: any;

  constructor() {
    this.tab1Root = FirebaseFeedPage;
    this.tab2Root = FirebaseProfilePage;
  }
}
