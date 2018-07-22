import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environment/environment';

//pages
import { ListingPage } from '../pages/listing/listing';
import { FeedPage } from '../pages/feed/feed';
import { FollowersPage } from '../pages/followers/followers';
import { LayoutsPage } from '../pages/layouts/layouts';
import { FormsPage } from '../pages/forms/forms';
import { LoginPage } from '../pages/login/login';
import { NotificationsPage } from '../pages/notifications/notifications';
import { ProfilePage } from '../pages/profile/profile';
import { TabsNavigationPage } from '../pages/tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { SchedulePage } from '../pages/schedule/schedule';
import { AdsPage } from '../pages/ads/ads';
import { List1Page } from '../pages/list-1/list-1';
import { List2Page } from '../pages/list-2/list-2';
import { GridPage } from '../pages/grid/grid';
import { FormLayoutPage } from '../pages/form-layout/form-layout';
import { FiltersPage } from '../pages/filters/filters';
import { TermsOfServicePage } from '../pages/terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { FormValidationsPage } from '../pages/form-validations/form-validations';
import { FunctionalitiesPage } from '../pages/functionalities/functionalities';
import { MapsPage } from '../pages/maps/maps';
import { FacebookLoginPage } from '../pages/facebook-login/facebook-login';
import { GoogleLoginPage } from '../pages/google-login/google-login';
import { TwitterLoginPage } from '../pages/twitter-login/twitter-login';
import { ContactCardPage } from '../pages/contact-card/contact-card';
import { VideoPlaylistPage } from '../pages/video-playlist/video-playlist';

//firebase integration
import { FirebaseFeedPage } from '../pages/firebase-integration/firebase-feed/firebase-feed';
import { FirebaseNewUserModalPage } from '../pages/firebase-integration/firebase-new-user-modal/firebase-new-user-modal';
import { FirebaseDetailsPage } from '../pages/firebase-integration/firebase-details/firebase-details';
import { FirebaseAvatarSelect } from '../pages/firebase-integration/firebase-avatar-select/firebase-avatar-select';
import { FirebaseProfilePage } from '../pages/firebase-integration/firebase-profile/firebase-profile';
import { FirebaseSignupPage } from '../pages/firebase-integration/firebase-signup/firebase-signup';
import { FirebaseLoginPage } from '../pages/firebase-integration/firebase-login/firebase-login';
import { FirebaseTabsNavigationPage } from '../pages/firebase-integration/firebase-tabs-navigation/firebase-tabs-navigation';
//wordpress integration
import { BlogFeedPage } from '../pages/wordpress-integration/blog-feed/blog-feed';
import { BlogPostPage } from '../pages/wordpress-integration/blog-post/blog-post';
import { BlogCustomPagesPage } from '../pages/wordpress-integration/blog-custom-pages/blog-custom-pages';
import { BlogCustomPagePage } from '../pages/wordpress-integration/blog-custom-page/blog-custom-page';
import { BlogCategoriesPage } from '../pages/wordpress-integration/blog-categories/blog-categories';
import { WordpressLoginPage } from '../pages/wordpress-integration/wordpress-login/wordpress-login';
import { WordpressMenuPage } from '../pages/wordpress-integration/wordpress-menu/wordpress-menu';

//custom components
import { PreloadImage } from '../components/preload-image/preload-image';
import { BackgroundImage } from '../components/background-image/background-image';
import { ShowHideContainer } from '../components/show-hide-password/show-hide-container';
import { ShowHideInput } from '../components/show-hide-password/show-hide-input';
import { ColorRadio } from '../components/color-radio/color-radio';
import { CounterInput } from '../components/counter-input/counter-input';
import { Rating } from '../components/rating/rating';
import { GoogleMap } from '../components/google-map/google-map';
import { VideoPlayerModule } from '../components/video-player/video-player.module';
import { ValidatorsModule } from '../components/validators/validators.module';

//services
import { FeedService } from '../pages/feed/feed.service';
import { ListingService } from '../pages/listing/listing.service';
import { ProfileService } from '../pages/profile/profile.service';
import { NotificationsService } from '../pages/notifications/notifications.service';
import { List1Service } from '../pages/list-1/list-1.service';
import { List2Service } from '../pages/list-2/list-2.service';
import { ScheduleService } from '../pages/schedule/schedule.service';
import { FacebookLoginService } from '../pages/facebook-login/facebook-login.service';
import { GoogleLoginService } from '../pages/google-login/google-login.service';
import { TwitterLoginService } from '../pages/twitter-login/twitter-login.service';
import { GoogleMapsService } from '../pages/maps/maps.service';
import { FirebaseService } from '../pages/firebase-integration/firebase-integration.service';
import { FirebaseAuthService } from '../pages/firebase-integration/firebase-auth.service';
import { WordpressService } from '../pages/wordpress-integration/wordpress-integration.service';
import { LanguageService } from '../providers/language/language.service';

// Ionic Native Plugins
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { AdMobFree } from '@ionic-native/admob-free';
import { AppRate } from '@ionic-native/app-rate';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { EmailComposer } from '@ionic-native/email-composer';

//Angular Fire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    ListingPage,
    FeedPage,
    FollowersPage,
    LayoutsPage,
    FormsPage,
    LoginPage,
    NotificationsPage,
    ProfilePage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    SignupPage,
    ForgotPasswordPage,
    SchedulePage,
    List1Page,
    List2Page,
    GridPage,
    FormLayoutPage,
    FiltersPage,
    TermsOfServicePage,
    PrivacyPolicyPage,

    //functionalities
    MapsPage,
    FunctionalitiesPage,
    FacebookLoginPage,
    GoogleLoginPage,
    ContactCardPage,
    TwitterLoginPage,
		AdsPage,
		FormValidationsPage,
		VideoPlaylistPage,

    //firebase integration
    FirebaseFeedPage,
    FirebaseNewUserModalPage,
		FirebaseDetailsPage,
		FirebaseAvatarSelect,
    FirebaseLoginPage,
    FirebaseProfilePage,
		FirebaseSignupPage,
    FirebaseTabsNavigationPage,

    //wordpress integration
    BlogFeedPage,
    BlogPostPage,
    BlogCustomPagesPage,
    BlogCustomPagePage,
		WordpressLoginPage,
    WordpressMenuPage,
    BlogCategoriesPage,

    //custom components
    PreloadImage,
    BackgroundImage,
    ShowHideContainer,
    ShowHideInput,
    ColorRadio,
    CounterInput,
    Rating,
    GoogleMap
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
			modalEnter: 'modal-slide-in',
			modalLeave: 'modal-slide-out',
			pageTransition: 'ios-transition',
			swipeBackEnabled: false
		}),
		TranslateModule.forRoot({
    loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
		VideoPlayerModule,
		ValidatorsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListingPage,
    FeedPage,
    FollowersPage,
    LayoutsPage,
    FormsPage,
    LoginPage,
    NotificationsPage,
    ProfilePage,
    TabsNavigationPage,
    WalkthroughPage,
    SettingsPage,
    ForgotPasswordPage,
    SignupPage,
    SchedulePage,
    List1Page,
    List2Page,
    GridPage,
    FormLayoutPage,
    FiltersPage,
    TermsOfServicePage,
    PrivacyPolicyPage,
    MapsPage,
    FunctionalitiesPage,
    FacebookLoginPage,
    GoogleLoginPage,
    ContactCardPage,
    TwitterLoginPage,
		AdsPage,
		FormValidationsPage,
		VideoPlaylistPage,
    //firebase integration
    FirebaseFeedPage,
    FirebaseNewUserModalPage,
		FirebaseDetailsPage,
		FirebaseAvatarSelect,
    FirebaseLoginPage,
		FirebaseSignupPage,
    FirebaseTabsNavigationPage,
    FirebaseProfilePage,
    //wordpress integration
    BlogFeedPage,
    BlogPostPage,
    BlogCustomPagesPage,
    BlogCustomPagePage,
		WordpressLoginPage,
    WordpressMenuPage,
    BlogCategoriesPage
  ],
  providers: [
    FeedService,
    ListingService,
    ProfileService,
    NotificationsService,
    List1Service,
    List2Service,
    ScheduleService,
    //functionalities
    FacebookLoginService,
    GoogleLoginService,
    TwitterLoginService,
    GoogleMapsService,
		LanguageService,
		WordpressService,
    FirebaseAuthService,
		FirebaseService,
    //ionic native plugins
	  SplashScreen,
	  StatusBar,
    SocialSharing,
    NativeStorage,
    InAppBrowser,
    Facebook,
    GooglePlus,
    Keyboard,
    Geolocation,
    TwitterConnect,
		AdMobFree,
		AppRate,
		ImagePicker,
		Crop,
		EmailComposer
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
