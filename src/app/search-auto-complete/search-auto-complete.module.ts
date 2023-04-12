import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchAutoCompletePageRoutingModule } from './search-auto-complete-routing.module';

import { SearchAutoCompletePage } from './search-auto-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchAutoCompletePageRoutingModule
  ],
  declarations: [SearchAutoCompletePage]
})
export class SearchAutoCompletePageModule {}
