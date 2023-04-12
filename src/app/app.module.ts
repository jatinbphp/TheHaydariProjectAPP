import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ExpandableComponent } from "./components/expandable/expandable.component";
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { MusicControls } from '@awesome-cordova-plugins/music-controls/ngx';

@NgModule({
  declarations: [AppComponent,ExpandableComponent],
  entryComponents: [],
  imports: 
  [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CKEditorModule, 
    IonicModule.forRoot({
      swipeBackEnabled: true // A better spot to set swipe enabled also…
    }), 
    AppRoutingModule
  ],
  providers: 
  [
    HttpClient,
    Media,
    Keyboard,
    InAppBrowser,
    GooglePlus,
    SocialSharing,
    Facebook,
    SignInWithApple,
    Network,
    SQLite,
    FirebaseX,
    File,
    FilePath,
    FileTransfer,
    AndroidPermissions,
    Deeplinks,
    MusicControls,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
