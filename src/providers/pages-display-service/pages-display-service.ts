import { Injectable } from '@angular/core';
import { PetModel } from '../../pages/profile/profile.model';

import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';


/*
  Generated class for the PagesDisplayServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PagesDisplayServiceProvider {

  constructor(public http: Http,
    public nativeStorage: NativeStorage) {
    console.log('Hello PagesDisplayServiceProvider Provider');
  }

  getPost(_email:string):Promise<PetModel>
  {
    //http://api.whospets.com/api/users/get_user_pets.php?username=stephenfung84@yahoo.com
   
      return this.http.get('http://api.whospets.com/api/users/get_posts.php?username='+_email) //('./assets/example_data/mypet.json')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  getSell(_email:string):Promise<PetModel>
  {
    //http://api.whospets.com/api/users/get_user_pets.php?username=stephenfung84@yahoo.com
   
      return this.http.get('http://api.whospets.com/api/users/get_sells.php?username='+_email) //('./assets/example_data/mypet.json')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
