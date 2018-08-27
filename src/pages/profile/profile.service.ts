import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { ProfileModel, CountryIdModel } from './profile.model';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';


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

  getCountryCode():Promise<CountryIdModel>
  {
    return this.http.get('./assets/example_data/country.json')
    .toPromise()
    .then(response => response.json() as CountryIdModel)
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
