import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PoemFeedbackPageRoutingModule } from './poem-feedback-routing.module';
import { PoemFeedbackPage } from './poem-feedback.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CKEditorModule,
    PoemFeedbackPageRoutingModule
  ],
  declarations: [PoemFeedbackPage]
})
export class PoemFeedbackPageModule {}
