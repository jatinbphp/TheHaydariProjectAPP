import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchResultPageRoutingModule } from './search-result-routing.module';
import { SearchResultPage } from './search-result.page';
import { PlaymusicComponent } from "../components/playmusic/playmusic.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchResultPageRoutingModule
  ],
  declarations: [SearchResultPage,PlaymusicComponent]//,PlaymusicComponent::PUT IT HERE WHEN ENABLE PlaymusicComponent
})
export class SearchResultPageModule {}
