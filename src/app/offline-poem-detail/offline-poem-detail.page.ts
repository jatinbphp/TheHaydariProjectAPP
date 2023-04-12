import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { OfflineService } from '../providers/offline.service';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';

@Component({
  selector: 'app-offline-poem-detail',
  templateUrl: './offline-poem-detail.page.html',
  styleUrls: ['./offline-poem-detail.page.scss'],
})

export class OfflinePoemDetailPage implements OnInit 
{
  public resultPoemsDetail:any=[];
  public resultPoemsDetailLines:any=[];
  public has_mp3:boolean=false;
  public MP3Link:string='';
  private mediaFile: MediaObject;
  private mediaFileCurrentPosition:any='';
  public isAudioPlayed: boolean = false;
  public togglePlayerInFullHeight:boolean = false;
  constructor(public offline: OfflineService, public loadingCtrl: LoadingController, private media: Media)
  {}

  ngOnInit()
  {}

  async ionViewWillEnter()
  {
    this.has_mp3=false;
    //LOADER
    const loadingPoemDetail = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingPoemDetail.present();
    //LOADER
    this.resultPoemsDetail=(localStorage.getItem('read_offline_poem')) ? JSON.parse(localStorage.getItem('read_offline_poem')) : [];
    this.resultPoemsDetailLines=JSON.parse(this.resultPoemsDetail['poemsLine']);
    this.MP3Link=(this.resultPoemsDetail['MP3Link']) ? this.resultPoemsDetail['MP3Link'] : null;
    if(this.MP3Link!=null)
    {
      this.mediaFile = this.media.create(this.MP3Link);
    }
    this.has_mp3=(this.MP3Link!=null) ? true : false;
    loadingPoemDetail.dismiss();//DISMISS LOADER
  }

  playAudio()
  {
    if(this.mediaFileCurrentPosition > 0)
    {
      //console.log("SEEK");
      this.mediaFile.seekTo(this.mediaFileCurrentPosition);
      this.mediaFile.play();
      this.isAudioPlayed=true;
    }
    else 
    {
      //console.log("PLAY");
      this.mediaFile.play();
      this.isAudioPlayed=true;
    }
  }

  pauseAudio()
  {
    //console.log("PAUSE");
    this.mediaFile.pause();    
    this.isAudioPlayed=false;
    this.togglePlayerInFullHeight=false;
    this.mediaFile.getCurrentPosition().then((position) => {
      this.mediaFileCurrentPosition = position;
      console.log(this.mediaFileCurrentPosition);
    });
  }

  ionViewDidLeave()
  {
    if(this.MP3Link!=null)
    {
      this.mediaFile.release();
    }
  }
}
