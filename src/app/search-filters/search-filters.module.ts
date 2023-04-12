import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchFiltersPageRoutingModule } from './search-filters-routing.module';
import { SearchFiltersPage } from './search-filters.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SearchFiltersPageRoutingModule
  ],
  declarations: [SearchFiltersPage]
})
export class SearchFiltersPageModule {}
