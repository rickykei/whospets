import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetinfoPage } from './petinfo';

@NgModule({
  declarations: [
    PetinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PetinfoPage),
  ],
})
export class PetinfoPageModule {}
