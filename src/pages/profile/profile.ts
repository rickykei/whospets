import { Component } from '@angular/core';
import { MenuController, SegmentButton, App, NavParams } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
import { SettingsPage } from '../settings/settings';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';
import { SocialSharing } from '@ionic-native/social-sharing';

import 'rxjs/Rx';

import { NativeStorage } from '@ionic-native/native-storage';


@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  display: string;
  profile: ProfileModel = new ProfileModel();
  status:string;

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

      
      // if(data.password='')
      // {
      //   // normal
      //  url = 'http://api.whospets.com/api/users/profile.php?logintype=normal&username='+data.email+'&password='+data.password;
      // }
      // else{
      //   //fb
      //  url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email;
      // }
     
     var url = 'http://api.whospets.com/api/users/profile.php?logintype=fb&username='+data.email;

    //  var url = './assets/example_data/profile.json';
      console.log('..url :'+ url);

      this.profileService.getData(url)
      .then(data2 => {
        console.log('..data2 :'+ data2.success);

        this.status = data2.success;
        this.profile.data.image = data2.data.image;

        this.profile.data.email = data2.data.email;

        console.log('..data2 image :'+ this.profile.data.image);
        console.log('..data2 email:'+ this.profile.data.email);

        // this.profile.following = data.following;
        // this.profile.followers = data.followers;
        // this.profile.posts = data.posts;
      });

    }, error => {
      console.log('error : '+ error);
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

}
