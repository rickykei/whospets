import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { PetLostModel } from './lostpet.model';

@Injectable()
export class LostPetServices {
  constructor(public http: Http) {}

  getPosts(): Promise<PetLostModel> {
 //   return this.http.get('./assets/example_data/petlost.json')
   return this.http.get('http://api.whospets.com/api/categories/get_pets.php?pet_status=3')
               .toPromise()
               .then(response => 
                response.json() as PetLostModel)
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
