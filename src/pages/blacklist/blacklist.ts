import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BlacklistModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { NativeStorage } from '../../../node_modules/@ionic-native/native-storage';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';

/**
 * Generated class for the BlacklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-blacklist',
  templateUrl: 'blacklist.html',
})
export class BlacklistPage {

  list: Array<BlacklistModel> = [];
  user_id:string;
  status:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public profileService: ProfileService,
    public nativeStorage: NativeStorage,
    public http: HttpClient  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlacklistPage');
    
    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
        this.getBlackList();
      });
      
      console.log("followers , user id: " + this.user_id);
  }


  getBlackList(){

    var url ='http://api.whospets.com/api/users/get_filter_user.php?user_id='+this.user_id;
    this.profileService.getBlacklistPostUserData(url)
    .then(data2 => {
      console.log('..data2 :'+ data2.success);
      this.status = data2.success;
      if(this.status=='true')
      {
        this.list =  data2.data;      
      }
    });

  }

  removeBlacklist(item:BlacklistModel) {
    //this.showLoader();

   // let postdata = this.sell_form.value;

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,block_user_id:item.block_user_id});
    this.http.post("http://api.whospets.com/api/users/unset_filter_user.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
     // this.loading.dismiss();
    // item.isfollowed=false;
      this.getBlackList();

    }, (err) => {
     // this.loading.dismiss();

    alert("failed");
    });
    }

}
