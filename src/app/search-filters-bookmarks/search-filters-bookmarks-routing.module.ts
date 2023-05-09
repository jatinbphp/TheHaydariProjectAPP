import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchFiltersBookmarksPage } from './search-filters-bookmarks.page';

const routes: Routes = [
  {
    path: '',
    component: SearchFiltersBookmarksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchFiltersBookmarksPageRoutingModule {}
