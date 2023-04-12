import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OfflinePoemDetailPageRoutingModule } from './offline-poem-detail-routing.module';
import { OfflinePoemDetailPage } from './offline-poem-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflinePoemDetailPageRoutingModule
  ],
  declarations: [OfflinePoemDetailPage]
})
export class OfflinePoemDetailPageModule {}
