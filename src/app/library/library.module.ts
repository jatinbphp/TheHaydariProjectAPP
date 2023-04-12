import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LibraryPageRoutingModule } from './library-routing.module';
import { LibraryPage } from './library.page';
import { PlaymusicComponent } from "../components/playmusic/playmusic.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibraryPageRoutingModule
  ],
  declarations: [LibraryPage,PlaymusicComponent]//,PlaymusicComponent::PUT IT HERE WHEN ENABLE PlaymusicComponent
})
export class LibraryPageModule {}
