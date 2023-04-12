import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WishlistPage } from './wishlist.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { WishlistPageRoutingModule } from './wishlist-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: WishlistPage }]),
    WishlistPageRoutingModule,
  ],
  declarations: [WishlistPage]
})
export class WishlistPageModule {}
