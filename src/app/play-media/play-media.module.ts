import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayMediaPageRoutingModule } from './play-media-routing.module';

import { PlayMediaPage } from './play-media.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayMediaPageRoutingModule
  ],
  declarations: [PlayMediaPage]
})
export class PlayMediaPageModule {}
