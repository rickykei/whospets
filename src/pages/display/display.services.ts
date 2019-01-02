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

  getPost(user_id:number):Promise<PetModel>
  {
    //http://api.whospets.com/api/users/get_user_pets.php?username=stephenfung84@yahoo.com
   
      return this.http.get('http://api.whospets.com/api/users/get_user_posts.php?user_id='+user_id) //('./assets/example_data/mypet.json')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  getSell(user_id:number):Promise<PetModel>
  {
    //http://api.whospets.com/api/users/get_user_pets.php?username=stephenfung84@yahoo.com
   
      return this.http.get('http://api.whospets.com/api/users/get_user_sells.php?user_id='+user_id) //('./assets/example_data/mypet.json')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  getQnA(user_id:number):Promise<PetModel>
  {
    //http://api.whospets.com/api/users/get_user_pets.php?username=stephenfung84@yahoo.com
   
      return this.http.get('http://api.whospets.com/api/users/get_user_qnas.php?user_id='+user_id) //('./assets/example_data/mypet.json')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  getAllPost():Promise<PetModel>
  {
      return this.http.get('http://api.whospets.com/api/categories/get_all_posts.php')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  getAllSell():Promise<PetModel>
  {
      return this.http.get('http://api.whospets.com/api/categories/get_all_sells.php')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }

  getAllQnA():Promise<PetModel>
  {
      return this.http.get('http://api.whospets.com/api/categories/get_all_qnas.php')
      .toPromise()
      .then(response => response.json() as PetModel)
      .catch(this.handleError);
  
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
