import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MediaControlsService } from '../providers/media-controls.service';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Qbyte } from '../models/qbyte.interface';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Observable } from 'rxjs';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP

@Component({
  selector: 'app-about-haydari',
  templateUrl: './about-haydari.page.html',
  styleUrls: ['./about-haydari.page.scss'],
})

export class AboutHaydariPage implements OnInit 
{
  public resultContributionLinks:any=[];
  public resultPoemsDetail:any=[];//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public qbytes$: Observable<Qbyte[]>;//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public is_audio_played:boolean=false;//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  constructor(public client: ClientService, public modalCtrl: ModalController, public inAppBrowser: InAppBrowser, private readonly mediaControllerService: MediaControlsService)
  { 
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.client.getObservableWhenAudioPlayed().subscribe((data) => {
      this.resultPoemsDetail = data.music_object; 
      this.qbytes$ = this.resultPoemsDetail;
      this.is_audio_played = data.is_audio_played; 
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  }

  async ngOnInit()
  { 
    await this.client.getContributionLinks().then(result => 
    {	
      this.resultContributionLinks = result;
      console.log(this.resultContributionLinks);
    },
    error => 
    {
      console.log();
    });
  }

  async ionViewWillEnter()
  {
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.is_audio_played=(localStorage.getItem('is_audio_played')) ? Boolean(localStorage.getItem('is_audio_played')) : this.is_audio_played;
    let current_playing_audio : any = localStorage.getItem('current_playing_audio');
    this.resultPoemsDetail=JSON.parse(current_playing_audio);
    this.qbytes$=this.resultPoemsDetail;
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP    
  }

  async showMyProfile()
  {
    let id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    if(id!='' && id!='null' && id!=null && id!=undefined && id!='undefined')
    {
      const modal = await this.modalCtrl.create({
        component: ProfilePage,
      });

      return await modal.present();
    }
    else 
    {
      this.client.router.navigate(['login']);  
    }
  }

  OpenContributionURL(contributionURL)
  {
    let targetUrl=contributionURL;
    const options : InAppBrowserOptions = 
    {
        location : 'no',//Or 'no' 
        hidden : 'no', //Or  'yes'
        clearcache : 'yes',
        clearsessioncache : 'yes',
        zoom : 'no',//Android only ,shows browser zoom controls 
        hardwareback : 'no',
        mediaPlaybackRequiresUserAction : 'no',
        shouldPauseOnSuspend : 'no', //Android only 
        closebuttoncaption : 'Close', //iOS only
        disallowoverscroll : 'no', //iOS only 
        toolbar : 'yes', //iOS only 
        enableViewportScale : 'no', //iOS only 
        allowInlineMediaPlayback : 'no',//iOS only 
        presentationstyle : 'pagesheet',//iOS only 
        fullscreen : 'yes',//Windows only    
    };
    let target = "_system";
    const browser = this.inAppBrowser.create(targetUrl,target,options);
  }

  playAudio(ev:any)
  { 
    this.client.publishSomeDataWhenAudioPlayed({
      music_object : this.resultPoemsDetail,
      is_audio_played:true
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT 
    this.mediaControllerService.playPause(this.resultPoemsDetail);
  }//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
}
