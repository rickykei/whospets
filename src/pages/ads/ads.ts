import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free';

@Component({
  selector: 'ads-page',
  templateUrl: 'ads.html'
})
export class AdsPage {

  bannerConfig: AdMobFreeBannerConfig = {
    // add your banner config here
    // for the sake of this example we will just use the test config
    isTesting: true,
    autoShow: true,
    // id: 'ca-app-pub-xxx/xxx',
    // bannerAtTop : true
  };

  interstitialConfig: AdMobFreeInterstitialConfig = {
    // add your config here
    // for the sake of this example we will just use the test config
    isTesting: true,
    autoShow: true,
    // id: 'ca-app-pub-xxx/xxx'
  };

  constructor(
    public nav: NavController,
    private admob: AdMobFree,
    public toastCtrl: ToastController
  ) {}

  ionViewWillLoad(){
    this.admob.banner.config(this.bannerConfig);
    this.admob.interstitial.config(this.interstitialConfig);
  }

  showBanner() {
    let toast = this.toastCtrl.create({
      message: 'Your ad is being created...',
      duration: 3000,
      position: 'top'
    });
    toast.present();

    this.admob.banner.prepare()
    .then(() => {
      // banner Ad is ready
      // if we set autoShow to false, then we will need to call the show method here
    })
    .catch(e => console.log(e));
  }

  removeBanner() {
    this.admob.banner.remove()
    .then(() => {
      console.log("removeBanner");
    })
    .catch(e => console.log(e));
  }

  showInterstitial() {
    this.admob.interstitial.prepare()
    .then(() => {
      // interstitial Ad is ready
      // if we set autoShow to false, then we will need to call the show method here
    })
    .catch(e => console.log(e));
  }

}
