import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutHaydariPage } from './about-haydari.page';

const routes: Routes = [
  {
    path: '',
    component: AboutHaydariPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutHaydariPageRoutingModule {}
