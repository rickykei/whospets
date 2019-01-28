import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { ProfileModel, CountryIdModel, PetModel, LoginModel } from './profile.model';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { ListingItemModel } from "../listing/listing.model";
import { FeedModel } from "../feed/feed.model";


@Injectable()
export class ProfileService {
  constructor(
    public http: Http,
    public facebookLoginService: FacebookLoginService,
    public nativeStorage: NativeStorage
  ) {}

  getData(url:string): Promise<ProfileModel> {
    return this.http.get(url)//('./assets/example_data/profile.json')
     .toPromise()
     .then(response => response.json() as ProfileModel)
     .catch(this.handleError);
  }

  getLoginData(url:string):Promise<LoginModel> {
    return this.http.get(url)
     .toPromise()
     .then(response => response.json() as LoginModel)
     .catch(this.handleError);
  }

  getSubCountryCode():Promise<CountryIdModel>
  {
    return this.http.get('./assets/example_data/subcountry.json')
    .toPromise()
    .then(response => response.json() as CountryIdModel)
    .catch(this.handleError);
  }

  getCountryCode():Promise<CountryIdModel>
  {
    return this.http.get('./assets/example_data/country.json')
    .toPromise()
    .then(response => response.json() as CountryIdModel)
    .catch(this.handleError);
  }

  getPet(_email:string, user_id:string):Promise<PetModel>
  {
      return this.http.get('http://api.whospets.com/api/users/get_user_pets.php?username='+_email+'&user_id='+user_id) //('./assets/example_data/mypet.json')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  }


  getPopularData(group_ids:string[],limit,offset): Promise<FeedModel> {

    console.info(group_ids.length);
    var _tmpQ ='';
    for(let i = 0; i < group_ids.length; i++)
    {
      if(i=0)
        _tmpQ = '?sub_country_id_array[]=' + group_ids[i];
      else
        _tmpQ = _tmpQ + '&sub_country_id_array[]=' + group_ids[i];
    }

    return this.http.get('http://api.whospets.com/api/categories/get_pets.php'+_tmpQ+'&limit='+limit+'&offset='+offset)
    .toPromise()
     .then(response => response.json() as FeedModel)
     .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  getUserImage(){
    return this.nativeStorage.getItem('profileImage');
  }

  setUserImage(newImage){
    this.nativeStorage.setItem('profileImage', newImage);
  }

}
