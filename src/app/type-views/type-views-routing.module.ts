import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeViewsPage } from './type-views.page';

const routes: Routes = [
  {
    path: '',
    component: TypeViewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeViewsPageRoutingModule {}
