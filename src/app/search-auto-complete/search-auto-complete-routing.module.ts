import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchAutoCompletePage } from './search-auto-complete.page';

const routes: Routes = [
  {
    path: '',
    component: SearchAutoCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchAutoCompletePageRoutingModule {}
