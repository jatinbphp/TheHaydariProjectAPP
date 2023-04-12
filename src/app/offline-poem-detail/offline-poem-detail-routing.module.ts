import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflinePoemDetailPage } from './offline-poem-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OfflinePoemDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflinePoemDetailPageRoutingModule {}
