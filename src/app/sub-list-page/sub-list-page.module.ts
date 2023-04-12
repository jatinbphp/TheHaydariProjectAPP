import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubListPagePageRoutingModule } from './sub-list-page-routing.module';
import { SubListPagePage } from './sub-list-page.page';
import { PlaymusicComponent } from "../components/playmusic/playmusic.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SubListPagePageRoutingModule
  ],
  declarations: [SubListPagePage,PlaymusicComponent]//,PlaymusicComponent::PUT IT HERE WHEN ENABLE PlaymusicComponent
})
export class SubListPagePageModule {}
