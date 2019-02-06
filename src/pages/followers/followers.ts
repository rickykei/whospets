import { Component } from '@angular/core';
import { MenuController, NavParams, LoadingController } from 'ionic-angular';
import { UserModel, SearchUserModel, FollowerModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'followers-page',
  templateUrl: 'followers.html'
})
export class FollowersPage {
  list: Array<FollowerModel> = [];
  originallist: Array<FollowerModel> = [];
  searchlist: Array<FollowerModel> = [];
  
  user_id:string;
  status:string;

  loading: any;


  constructor(public menu: MenuController, 
    public profileService: ProfileService,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController,
    public navParams: NavParams)
  {
    this.originallist = navParams.get('list');
    this.checkFollowed(this.originallist);

    this.list = this.originallist;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on this page
    this.menu.enable(false);

    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
      
      });
      
      console.log("followers , user id: " + this.user_id);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  showLoader(){
	  this.loading = this.loadingCtrl.create({
		 // content: 'Loading...'
	  });

	  this.loading.present();
  }


  onSearch(event){
    this.showLoader();

    console.info(event.target.value);
    var url ='http://api.whospets.com/api/users/get_username.php?user_id='+this.user_id+'&username='+event.target.value;
    this.profileService.getSearchUserData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);
      this.status = data2.success;
      if(this.status=='true')
      {
        this.searchlist = data2.data;
        this.checkFollowed(this.searchlist);

        this.list = this.searchlist;
      }
      this.loading.dismiss();

    });

  }

  checkFollowed(list: Array<FollowerModel>)
  {
    for(var i = 0; i < list.length; i++)
    {
      if(list[i].followed=='Y')
      {
        list[i].inverse_relation=false;
      }
      else
      {
        list[i].inverse_relation=true;
      }
    }

  }
  

  onCancel(event)
  {
    console.info('onCancel: '+event.target.value);
      this.list = this.originallist;
  }

  clearSearch(event){
    console.info('onCancel: '+event.target.value);
    this.list = this.originallist;
  }
}
