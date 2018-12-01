import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayPage } from './display';

@NgModule({
  declarations: [
    DisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayPage),
  ],
})
export class DisplayPageModule {}
