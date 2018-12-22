import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QnaPage } from './qna';

@NgModule({
  declarations: [
    QnaPage,
  ],
  imports: [
    IonicPageModule.forChild(QnaPage),
  ],
})
export class QnaPageModule {}
