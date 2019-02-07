import { Component } from '@angular/core';
import { MenuController, NavParams, LoadingController } from 'ionic-angular';
import { UserModel, SearchUserModel, FollowerModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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

  type:string;

  constructor(public menu: MenuController, 
    public profileService: ProfileService,
    public nativeStorage: NativeStorage,
    public loadingCtrl: LoadingController,
    public http: HttpClient,  
    public navParams: NavParams)
  {
    this.originallist = navParams.get('list');
    this.checkFollowed(this.originallist);

    this.list = this.originallist;

    this.type = navParams.get('type');
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
        list[i].isfollowed=true;
      }
      else
      {
        list[i].isfollowed=false;
      }
    }

  }
  
  onCancel(event)
  {
    console.info('onCancel: '+event.target.value);
   //   this.list = this.originallist;
      this.refreshFollow();
  }

  clearSearch(event){
    console.info('onCancel: '+event.target.value);
    //this.list = this.originallist;
    this.refreshFollow();
  }

  refreshFollow()
  {
    if(this.type=='followers')
    {
      this.getfollowers();
    }else if(this.type=='following')
    {
      this.getfollowing();
    }
  }

  getfollowers(){

    var url ='http://api.whospets.com/api/users/get_user_follower.php?user_id='+this.user_id;
    this.profileService.getSearchUserData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);
      this.status = data2.success;
      if(this.status=='true')
      {
        this.searchlist = data2.data;
        this.checkFollowed(this.searchlist);

        this.list = this.searchlist;      }
    });

  }

  getfollowing(){

    var url ='http://api.whospets.com/api/users/get_user_subscribe.php?user_id='+this.user_id;
    this.profileService.getSearchUserData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);
      this.status = data2.success;
      if(this.status=='true')
      {
        this.searchlist = data2.data;
        this.checkFollowed(this.searchlist);

        this.list = this.searchlist;      }
    });

  }

  itemFollower(item:FollowerModel){
    console.info('user id: ' + item.user_id);
    console.info('follower user id : ' + item.follower_user_id);

    if(item.isfollowed===true)
    {
      this.removeFollower(item);
    }else{
      this.addFollower(item);
    }

  }

  addFollower(item:FollowerModel) {
    //this.showLoader();

   // let postdata = this.sell_form.value;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,subscribe_user_id:item.id});
    this.http.post("http://api.whospets.com/api/users/set_user_subscribe.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
     // this.loading.dismiss();
     item.isfollowed=true;

    }, (err) => {
     // this.loading.dismiss();

    alert("failed");
    });
    }

    removeFollower(item:FollowerModel) {
      //this.showLoader();
  
     // let postdata = this.sell_form.value;
  
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin' , '*');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
      //let options = new RequestOptions({ headers: headers });
      
      
      let data=JSON.stringify({user_id:this.user_id,subscribe_user_id:item.id});
      this.http.post("http://api.whospets.com/api/users/unset_user_subscribe.php",data, { headers: headers })
      // .map(res => res.json(data))
      .subscribe(res => {
       // this.loading.dismiss();
       item.isfollowed=false;
  
      }, (err) => {
       // this.loading.dismiss();
  
      alert("failed");
      });
      }



}
