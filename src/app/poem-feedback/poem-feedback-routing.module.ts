import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoemFeedbackPage } from './poem-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: PoemFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoemFeedbackPageRoutingModule {}
