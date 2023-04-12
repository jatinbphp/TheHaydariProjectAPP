import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AboutHaydariPageRoutingModule } from './about-haydari-routing.module';
import { AboutHaydariPage } from './about-haydari.page';
import { PlaymusicComponent } from "../components/playmusic/playmusic.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutHaydariPageRoutingModule
  ],
  declarations: [AboutHaydariPage,PlaymusicComponent]//,PlaymusicComponent::PUT IT HERE WHEN ENABLE PlaymusicComponent
})
export class AboutHaydariPageModule {}
