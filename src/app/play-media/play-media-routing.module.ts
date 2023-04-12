import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayMediaPage } from './play-media.page';

const routes: Routes = [
  {
    path: '',
    component: PlayMediaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayMediaPageRoutingModule {}
