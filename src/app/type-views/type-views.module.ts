import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TypeViewsPageRoutingModule } from './type-views-routing.module';
import { TypeViewsPage } from './type-views.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TypeViewsPageRoutingModule
  ],
  declarations: [TypeViewsPage]
})
export class TypeViewsPageModule {}
