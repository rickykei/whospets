import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { PagesDisplayServiceProvider } from '../display/display.services';
import { CommentDetailsModel } from '../comment/comment.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the CommentpetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @Component({
  selector: 'page-commentpet',
  templateUrl: 'commentpet.html',
})
export class CommentpetPage {
  comment: Array<CommentDetailsModel> = new Array<CommentDetailsModel>() ;
  product_id:string;
  comment_form: any;
  loading:any;
  user_id:string;
  addComment:boolean =false;
  commentcount:number;

  constructor(public navCtrl: NavController,
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

      this.product_id = navParams.get('product_id');
      this.commentcount =0;
  }

  ionViewWillLeave()
  {
    if(this.addComment)
    {
      this.event.publish('user:back', this.commentcount);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentpetPage');
    this.getPetComment();

    this.nativeStorage.getItem('profile_user_id')
    .then(data => {
        this.user_id = data.profile_user_id;
         console.log(data.profile_user_id);
      });
  }


  getPetComment()
  {
      this.PagesDisplayServiceProvider.getPetComment(this.product_id)
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
    
    
    let data=JSON.stringify({user_id:this.user_id,product_id:this.product_id
      , comment:postdata.reply});
    this.http.post("http://api.whospets.com/api/users/set_pet_comments.php",data, { headers: headers })
    // .map(res => res.json(data))
    .subscribe(res => {
      this.getPetComment();
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
