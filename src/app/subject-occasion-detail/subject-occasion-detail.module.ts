import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubjectOccasionDetailPageRoutingModule } from './subject-occasion-detail-routing.module';

import { SubjectOccasionDetailPage } from './subject-occasion-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubjectOccasionDetailPageRoutingModule
  ],
  declarations: [SubjectOccasionDetailPage]
})
export class SubjectOccasionDetailPageModule {}
