import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchFiltersBookmarksPageRoutingModule } from './search-filters-bookmarks-routing.module';
import { SearchFiltersBookmarksPage } from './search-filters-bookmarks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchFiltersBookmarksPageRoutingModule
  ],
  declarations: [SearchFiltersBookmarksPage]
})
export class SearchFiltersBookmarksPageModule {}
