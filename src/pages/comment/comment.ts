import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { CommentDetailsModel } from './comment.model';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  comment: Array<CommentDetailsModel> = new Array<CommentDetailsModel>() ;
  content_id : string;
  table_name : string;
  comment_form: any;
  loading:any;
  user_id:string;
  addComment:boolean =false;
  commentcount: number;

  constructor(
    public navCtrl: NavController,
    public PagesDisplayServiceProvider:PagesDisplayServiceProvider,
    public http: HttpClient,  
    public nativeStorage:NativeStorage,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public event:Events
        ) {
     
      this.comment_form = new FormGroup({
        reply: new FormControl()   
      });

      this.content_id = this.navParams.get('content_id');
      this.table_name = this.navParams.get('table_name');

  }

  ionViewWillLeave()
  {
    if(this.addComment)
    {
      this.event.publish('user:comment', this.commentcount);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
    this.getUserComment();

    this.nativeStorage.getItem('profile_user_id')
   .then(data => {
       this.user_id = data.profile_user_id;
        console.log(data.profile_user_id);
     });
  }

  getUserComment()
  {
   
      this.PagesDisplayServiceProvider.getUserComment(this.content_id,this.table_name)
      .then(response => {
        this.comment = response.data;
      });
  }

  replyClick() {
    this.showLoader();

    let postdata = this.comment_form.value;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    //let options = new RequestOptions({ headers: headers });
    
    
    let data=JSON.stringify({user_id:this.user_id,content_id:this.content_id
      , comment:postdata.reply, table_name:this.table_name});
    this.http.post("http://api.whospets.com/api/users/set_user_comments.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
      this.getUserComment();
      this.loading.dismiss();
      this.comment_form.reset();
      this.addComment=true;
      this.commentcount++;
      
    }, (err) => {
      this.loading.dismiss();

    alert("failed");
    });
    }

    showLoader(){
      this.loading = this.loadingCtrl.create({
        content: 'Submitting...'
      });
  
      this.loading.present();
    }

}
