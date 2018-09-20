import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { PetBreedModel, PetColorModel } from './addlayout.model';



@Injectable()
export class PetDetailsService {
  constructor(
    public http: Http,
    public nativeStorage: NativeStorage
  ) {}

  getData(): Promise<PetBreedModel> {
    return this.http.get('./assets/example_data/petbreed.json')
     .toPromise()
     .then(response => response.json() as PetBreedModel)
     .catch(this.handleError);
  }

  getColorData(): Promise<PetColorModel> {
    return this.http.get('./assets/example_data/petcolor.json')
     .toPromise()
     .then(response => response.json() as PetColorModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
