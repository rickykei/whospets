import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let apiUrl = 'https://api.whospets.com/api/users/set_user_pets.php';
let apiUrlgetimg = 'https://api.whospets.com/api/users/get_image_by_id.php';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) {
    console.log('Hello upload image ApiProvider Provider');
  }
	
	private extractData(res: Response) {
  let body = res;
  return body || { };
	}
	
	register(data): Observable<any> {
  return this.http.post(apiUrl, JSON.stringify(data), httpOptions);
}


getUser(id): Observable<any> {
  return this.http.get(apiUrlgetimg+'?imageid='+id, httpOptions).pipe(
    map(this.extractData));
}


}
