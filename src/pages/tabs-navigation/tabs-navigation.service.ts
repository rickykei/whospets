import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { LoginModel } from './tabs-navigation.model';

@Injectable()
export class TabsNavigationService {
  constructor(public http: Http) {}

  getData(email: string, password:string): Promise<LoginModel> {
      var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + email + '&login&password='+password ;
    console.log(url);
    
    return this.http.get(url)
     .toPromise()
     .then(response => response.json() as LoginModel)
     .catch(this.handleError);
  }

  // getData(): Promise<LoginModel> {
  //   //    var url = 'http://api.whospets.com/api/users/login.php?logintype=normal&username=' + email + '&login&password='+password ;
  //   //  console.log(url);
      
  //     return this.http.get('http://api.whospets.com/api/users/login.php?username=rickykei@yahoo.com&logintype=normal&password=1234')
  //      .toPromise()
  //      .then(response => response.json() as LoginModel)
  //      .catch(this.handleError);
  //   }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}