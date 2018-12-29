import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostInfoPage } from './post-info';

@NgModule({
  declarations: [
    PostInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(PostInfoPage),
  ],
})
export class PostInfoPageModule {}
