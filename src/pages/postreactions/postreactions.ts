import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { HttpHeaders, HttpClient } from '../../../node_modules/@angular/common/http';
import { ResponseModel } from '../profile/profile.model';

/**
 * Generated class for the PostreactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-postreactions',
  templateUrl: 'postreactions.html',
})
export class PostreactionsPage {

  postResponse:ResponseModel;

  user_id:String;
  content_id:String;
  app_table:String;
  block_user_id:String;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,  
    private viewCtrl: ViewController, 
    public http: HttpClient,  
    public event: Events) {

      console.log(this.navParams.data);
      this.user_id = this.navParams.get('user_id');
      this.content_id = this.navParams.get('content_id');
      this.app_table = this.navParams.get('app_table');
      this.block_user_id = this.navParams.get('block_user_id');

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostreactionsPage');
  }

  report(){
    this.addReport();
  }

  blacklist(){
    this.addBlackList();
  }

  addReport() {

   
    var url;
    url = "http://api.whospets.com/api/users/set_filter_content.php";       

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    let data=JSON.stringify({user_id:this.user_id,content_id:this.content_id, 
      app_table: this.app_table
    });

    this.http.post(url,data, { headers: headers })
    // .map(res => res.json(data))
    //.subscribe(res => {
      .subscribe((res:ResponseModel) => { 
        this.postResponse = res; 
      
      console.log("VALUE RECEIVED: "+res);
      if(this.postResponse.success==='true')
      {
        this.event.publish('user:back');
        this.viewCtrl.dismiss();
      }
      else
      {
        alert("Fail to report : " + this.postResponse.data.message)
        this.viewCtrl.dismiss();
      }

    }, (err) => {
      this.viewCtrl.dismiss();
      alert("Fail to report, please try it later.")
    }, () =>
    {
      this.viewCtrl.dismiss();
    });
  }

  addBlackList() {

   
    var url;
    url = "http://api.whospets.com/api/users/set_filter_user.php";       

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    let data=JSON.stringify({user_id:this.user_id,block_user_id:this.block_user_id
    });

    this.http.post(url,data, { headers: headers })
    // .map(res => res.json(data))
    //.subscribe(res => {
      .subscribe((res:ResponseModel) => { 
        this.postResponse = res; 
      
      console.log("VALUE RECEIVED: "+res);
      if(this.postResponse.success==='true')
      {
        this.event.publish('user:back');
        this.viewCtrl.dismiss();
      }
      else
      {
        alert("Fail to report : " + this.postResponse.data.message)
        this.viewCtrl.dismiss();
      }

    }, (err) => {
      this.viewCtrl.dismiss();
      alert("Fail to report, please try it later.")
    }, () =>
    {
      this.viewCtrl.dismiss();
    });
  }

 
}
