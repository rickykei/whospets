import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, App, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Observable } from 'rxjs/Observable';

import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
//import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { FcmProvider } from '../providers/fcm/fcm';
import { tap } from 'rxjs/operators';

//import { LoginPage } from '../pages/login/login';


@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  // make WalkthroughPage the root (or first) page
 rootPage: any = TabsNavigationPage;
 
 textDir: string = "ltr";

  pages: Array<{title: any, icon: string, component: any}>;
  pushPages: Array<{title: any, icon: string, component: any}>;

  constructor(
    platform: Platform,
    public menu: MenuController,
    public app: App,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    fcm: FcmProvider
  ) {
    translate.setDefaultLang('en');
    translate.use('en');

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleDefault();

      //fcm:
      // Get a FCM token
      fcm.getToken()

      // Listen to incoming messages
      fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          const toast = toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      )
      .subscribe()
    

    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
      {
        if(event.lang == 'ar')
        {
          platform.setDir('rtl', true);
        }
        else
        {
          platform.setDir('ltr', true);
        }
        Observable.forkJoin(
          this.translate.get('HOME'),
          // this.translate.get('FORMS'),
          // this.translate.get('FUNCTIONALITIES'),
          // this.translate.get('LAYOUTS'),
          this.translate.get('SETTINGS'),
          // this.translate.get('WORDPRESS_INTEGRATION'),
          // this.translate.get('FIREBASE_INTEGRATION')
        ).subscribe(data => {
          this.pages = [
            { title: data[0], icon: 'home', component: TabsNavigationPage }
            // { title: data[1], icon: 'create', component: FormsPage },
            // { title: data[2], icon: 'code', component: FunctionalitiesPage }
          ];

          this.pushPages = [
            // { title: data[3], icon: 'grid', component: LayoutsPage },
            { title: data[1], icon: 'settings', component: SettingsPage }
            // { title: data[5], icon: 'logo-wordpress', component: WordpressMenuPage },
            // { title: data[6], icon: 'flame', component: FirebaseLoginPage }
          ];
        });
      });

  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  pushPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // rootNav is now deprecated (since beta 11) (https://forum.ionicframework.com/t/cant-access-rootnav-after-upgrade-to-beta-11/59889)
    this.app.getRootNav().push(page.component);
  }
}
