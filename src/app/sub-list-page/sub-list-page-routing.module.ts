import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubListPagePage } from './sub-list-page.page';

const routes: Routes = [
  {
    path: '',
    component: SubListPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubListPagePageRoutingModule {}
