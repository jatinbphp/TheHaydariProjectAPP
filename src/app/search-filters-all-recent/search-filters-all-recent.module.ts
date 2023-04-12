import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchFiltersAllRecentPageRoutingModule } from './search-filters-all-recent-routing.module';
import { SearchFiltersAllRecentPage } from './search-filters-all-recent.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchFiltersAllRecentPageRoutingModule
  ],
  declarations: [SearchFiltersAllRecentPage]
})
export class SearchFiltersAllRecentPageModule {}
