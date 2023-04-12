import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubjectOccasionDetailPage } from './subject-occasion-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SubjectOccasionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectOccasionDetailPageRoutingModule {}
