import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { LoginModel } from './tabs-navigation.model';

@Injectable()
export class TabsNavigationService {
  constructor(public http: Http) {}

  getData(email: string, password:string, token:string): Promise<LoginModel> {
      var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + email + '&password='+password  + '&device_id='+token;
    console.log(url);
    
    return this.http.get(url)
     .toPromise()
     .then(response => response.json() as LoginModel)
     .catch(this.handleError);
  }


  getFBData(email: string, uid:string, token: string): Promise<LoginModel> {
    var url = 'http://api.whospets.com/api/users/login.php?logintype=fb&username=' + email  +'&fb_uid=' + uid+ '&device_id='+token;
  console.log(url);
  return this.http.get(url)
   .toPromise()
   .then(response => response.json() as LoginModel)
   .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}