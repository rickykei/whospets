import { Component } from '@angular/core';
import { MenuController, App, NavParams, NavController, Events } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ProfileModel, PetModel, PetDetailsModel } from './profile.model';
import { ProfileService } from './profile.service';
import { SocialSharing } from '@ionic-native/social-sharing';

import 'rxjs/Rx';

import { NativeStorage } from '@ionic-native/native-storage';
//import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { PetinfoPage } from '../petinfo/petinfo';
import { PostInfoPage } from '../post-info/post-info';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { AddpetPage } from '../addpet/addpet';
import { TabsAllsetpostPage } from '../tabs-allsetpost/tabs-allsetpost';
import { FollowersPage } from '../followers/followers';


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
  profile_user_id: string;
  petModel: PetModel = new PetModel();
  details: Array<PetDetailsModel>;

  constructor(
    public menu: MenuController,
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,   
     public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public profileService: ProfileService,
    public nativeStorage:NativeStorage,
    public socialSharing: SocialSharing,
    public events:Events) {   
    
      events.subscribe('user:back', () =>
    {    
      console.log('user:back');   
      this.loadData();
    });
    this.display = "grid";
  }

  ionViewDidEnter()
  {
    console.log('ionViewDidEnter');

  }
  ionViewWillEnter()
  {
    console.log('ionViewWillEnter');

    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.profile_user_id = data.profile_user_id;
       // this.loadData();

      });

      this.getfollowers();
      this.getfollowing();

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
     
      console.log('..url :'+ url);

      this.profileService.getData(url)
      .then(data2 => {
        console.log('..data2 :'+ data2.success);

        this.status = data2.success;
        if(this.status=='true')
        {
          console.log('..data2 :'+ data2.success);

          //this.profile = data2;
          //this.profile.followers = data2.followers;
          //this.profile.following = data2.following;
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
          this.profile.data.user_id = data2.data.user_id;
          this.profile_user_id = data2.data.user_id;

          this.setProfileUserId(data2.data.user_id +""
          , data2.data.firstname + " " + data2.data.lastname);
          
          this.loadData();

        }
        else{
          // go to create profile page
          this.app.getRootNav().push(SettingsPage);
        }

      });
    }, error => {
      console.log('error : '+ error);
    });


     
    }
    

    loadData()
    {
      //this.showLoader();
      
      this.nativeStorage.getItem('email_user')
    .then(data => {
      this.profileService.getPet(data.email, this.profile_user_id)
      .then(response => {
        this.pet = response;
      });
      });

  console.log('..data2 user_id getMixPost:'+  this.profile.data.user_id);
  this.PagesDisplayServiceProvider.getMixPost( this.profile_user_id)
      .then(response => {
      this.petModel = response; 
      this.details = response.data;    
                   
      });
    }

    setProfileUserId( _userid : string, _user_name :string )
    {
      console.log('profile_user_id :' + _userid);

      this.nativeStorage.setItem('profile_user_id',
      {
        profile_user_id : _userid,
        profile_user_name: _user_name
      })
      .then(
        () =>  console.log('profile_user_id ： Stored item!'),
        error => console.error('profile_user_id : Error storing item')
      );
  
    }

    goToSettings() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.app.getRootNav().push(SettingsPage);
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
    console.log("profile : " +this.profile.data.user_id);
    this.app.getRootNav().push(PetinfoPage, {pet:pet , profile:this.profile.data, fromProfile:true});
  }

  goPostDetail(post)
  {
    console.log("profile : " +this.profile.data.user_id);
    this.app.getRootNav().push(PostInfoPage, {post:post});  
  }

  addPet()
  {
    console.log("profile : " +this.profile.data.user_id);
    this.app.getRootNav().push(AddpetPage, {profile:this.profile.data});
  }

  addAllPost()
  {
    this.app.getRootNav().push(TabsAllsetpostPage);    
  }

  goToFollowersList() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.navCtrl.push(FollowersPage, {
      list: this.profile.followers, type:'followers'
    });
  }

  goToFollowingList() {
    // close the menu when clicking a link from the menu
    this.menu.close();
    this.navCtrl.push(FollowersPage, {
      list: this.profile.following, type:'following'
    });
  }

  getfollowers(){

    var url ='http://api.whospets.com/api/users/get_user_follower.php?user_id='+this.profile_user_id;
    this.profileService.getSearchUserData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);
      this.status = data2.success;
      if(this.status=='true')
      {
        this.profile.followers = data2.data;
      }
    });

  }

  getfollowing(){

    var url ='http://api.whospets.com/api/users/get_user_subscribe.php?user_id='+this.profile_user_id;
    this.profileService.getSearchUserData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);
      this.status = data2.success;
      if(this.status=='true')
      {
        this.profile.following = data2.data;
      }
    });

  }

}
