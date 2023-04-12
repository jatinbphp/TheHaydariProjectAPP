import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoemDetailPage } from './poem-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PoemDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoemDetailPageRoutingModule {}
