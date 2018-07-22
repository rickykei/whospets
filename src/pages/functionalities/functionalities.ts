import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapsPage } from '../maps/maps';
import { FacebookLoginPage } from '../facebook-login/facebook-login';
import { GoogleLoginPage } from '../google-login/google-login';
import { TwitterLoginPage } from '../twitter-login/twitter-login';
import { ContactCardPage } from '../contact-card/contact-card';
import { AdsPage } from '../ads/ads';
import { VideoPlaylistPage } from '../video-playlist/video-playlist';

import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'functionalities-page',
  templateUrl: 'functionalities.html'
})
export class FunctionalitiesPage {
  items: Array<{title: string, note?: string, component: any}>;

  constructor(
    public nav: NavController,
    public translate: TranslateService
  ) {
  }

  ionViewWillEnter(){
    Observable.forkJoin(
      this.translate.get('FACEBOOK_INTEGRATION'),
      this.translate.get('GOOGLE_INTEGRATION'),
      this.translate.get('TWITTER_INTEGRATION'),
      this.translate.get('CONTACT_CARD'),
      this.translate.get('MAPS'),
      this.translate.get('VIDEO_PLAYLIST'),
      this.translate.get('ADS')
    ).subscribe(data => {
      this.items = [
        { title: data[0], component: FacebookLoginPage },
        { title: data[1], component: GoogleLoginPage },
        { title: data[2], component: TwitterLoginPage },
        { title: data[3], component: ContactCardPage },
        { title: data[4], component: MapsPage },
        { title: data[5], component: VideoPlaylistPage },
        { title: data[6], component: AdsPage }
      ];
    });
  }

  itemTapped(event, item) {
    this.nav.push(item.component);
  }

}
