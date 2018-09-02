import { Component } from '@angular/core';
import { MenuController, SegmentButton, App, NavParams } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
import { SettingsPage } from '../settings/settings';
import { ProfileModel, PetModel } from './profile.model';
import { ProfileService } from './profile.service';
import { SocialSharing } from '@ionic-native/social-sharing';

import 'rxjs/Rx';

import { NativeStorage } from '@ionic-native/native-storage';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { PetinfoPage } from '../petinfo/petinfo';


@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  display: string;
  profile: ProfileModel = new ProfileModel();
  status:string;
  pet: PetModel = new PetModel();
  petstatus:string;

  constructor(
    public menu: MenuController,
    public app: App,
    public navParams: NavParams,
    public profileService: ProfileService,
    public nativeStorage:NativeStorage,
    public socialSharing: SocialSharing
  ) {
    this.display = "list";
  }


  ionViewDidLoad() {

  


    this.nativeStorage.getItem('email_user')
    .then(data => {
      console.log('..data :'+ data.email);

      var url ;
      if(data.uid=='')
      {   
        // normal
        url = 'http://api.whospets.com/api/users/profile.php?logintype=normal&username='+data.email+'&password='+data.password;  
     }
      else{
         //fb
         url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email+'&fb_uid='+data.uid;
      
          }
     
    // var url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email+'&fb_uid='+data.uid;;

    //  var url = './assets/example_data/profile.json';
      console.log('..url :'+ url);

      this.profileService.getData(url)
      .then(data2 => {
        console.log('..data2 :'+ data2.success);

        this.status = data2.success;
        if(this.status=='true')
        {
          this.profile.data.fb_uid = data2.data.fb_uid; //image
          this.profile.data.email = data2.data.email;
          this.profile.data.firstname = data2.data.firstname;
          this.profile.data.lastname = data2.data.lastname;
          this.profile.data.message = data2.data.message;
          this.profile.data.street = data2.data.street;
          this.profile.data.city = data2.data.city;
          this.profile.data.about = data2.data.about;
          this.profile.data.newsletter = data2.data.newsletter;
          this.profile.data.seller = data2.data.seller;
          this.profile.data.country_id = data2.data.country_id;
          this.profile.data.sub_country_id = data2.data.sub_country_id;


          console.log('..data2 image :'+ this.profile.data.fb_uid);
          console.log('..data2 email:'+ this.profile.data.email);

        }
        else{
          // go to create profile page
          this.app.getRootNav().push(SettingsPage);
          
        }
       
      });

    }, error => {
      console.log('error : '+ error);
    });


    this.nativeStorage.getItem('email_user')
    .then(data => {
        this.profileService.getPet(data.email)
        .then(response => {
          this.pet = response;
        });
      });
    }

/*
  ionViewDidLoad() {
    console.log("ionViewDidLoad");

    this.nativeStorage.getItem('email_user')
    .then(data => {
      if(data.password!='')
      {
        // normal
       this.url = 'http://api.whospets.com/api/users/profile.php?logintype=normal&username='+data.email+'&password='+data.password;
      }
      else{
        //fb
       this.url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email;
      }
    }, error => {
      console.log('error : '+ error);
    });
    console.log(".."+ this.url);


    this.profileService.getData()
      .then(data => {
        console.log(".."+ data.user);

        this.profile.user = data.user;
        console.log(".."+ this.profile.user.name);
        console.log(".."+ this.profile.user.email);

      }, error => {
        console.log('error : '+ error);
      });
  }
*/
  // goToFollowersList() {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   this.app.getRootNav().push(FollowersPage, {
  //     list: this.profile.followers
  //   });
  // }

  // goToFollowingList() {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   this.app.getRootNav().push(FollowersPage, {
  //     list: this.profile.following
  //   });
  // }

  goToSettings() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(SettingsPage);
  }

  backToMainPage()
  {
    this.app.getRootNav().push(TabsNavigationPage);
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // console.log('Segment selected', segmentButton.value);
  }

  sharePost(post) {
   //this code is to use the social sharing plugin
   // message, subject, file, url
   this.socialSharing.share(post.description, post.title, post.image)
   .then(() => {
     console.log('Success!');
   })
   .catch(() => {
      console.log('Error');
   });
  }

  goPetDetail(pet)
  {
    this.app.getRootNav().push(PetinfoPage, {pet:pet},{profile:this.profile.data});
  }

}
