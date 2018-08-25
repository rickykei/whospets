import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { FeedModel } from './feed.model';

@Injectable()
export class FeedService {
  constructor(public http: Http) {}

  getPosts(catid): Promise<FeedModel> {
    //return this.http.get('./assets/example_data/feed.json')
	console.log('http://api.whospets.com/api/categories/get_pets.php?pet_status='+catid);
	  return this.http.get('http://api.whospets.com/api/categories/get_pets.php?pet_status='+catid)
               .toPromise()
               .then(response =>
			   response.json() as FeedModel)
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
