import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchFiltersAllRecentPage } from './search-filters-all-recent.page';

const routes: Routes = [
  {
    path: '',
    component: SearchFiltersAllRecentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchFiltersAllRecentPageRoutingModule {}
