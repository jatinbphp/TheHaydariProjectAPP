import { Component, OnInit } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-play-media',
  templateUrl: './play-media.page.html',
  styleUrls: ['./play-media.page.scss'],
})

export class PlayMediaPage implements OnInit 
{
  private mediaFile: MediaObject;
  public poem_id:any='';
  public user_id:any='';
  public resultPoemsDetailObject:any=[];
  public resultPoemsDetail:any=[];
  public MP3Link:string='';
  public poemsLine:any=[];
  public isAudioPlayed: boolean = false;
  private mediaFileCurrentPosition:any='';
  constructor(public client: ClientService, private media: Media, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, public navParams: NavParams)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.poem_id='';
    this.poem_id=this.navParams.get('poem_id');
    this.user_id=localStorage.getItem('id');
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
    let objData = {
      poem_id:this.poem_id,
      user_id:this.user_id
    }
    await this.client.getPoemsDetailById(objData).then(result => 
    {	
      loadingPoemDetail.dismiss();//DISMISS LOADER
      this.resultPoemsDetailObject=result;
      this.resultPoemsDetail=this.resultPoemsDetailObject['poemsDetail'][0];
      this.poemsLine=this.resultPoemsDetailObject['poemsLine'];

      if(this.resultPoemsDetailObject['poemsDetail'].length > 0)
      {
        this.MP3Link=(this.resultPoemsDetailObject['poemsDetail'][0]['MP3Link']) ? this.resultPoemsDetailObject['poemsDetail'][0]['MP3Link'] : "";
        this.mediaFile = this.media.create(this.MP3Link);
      }      
      //console.log("MP3Link",this.MP3Link);
      console.log("Object",this.resultPoemsDetailObject);
      console.log("Detail",this.resultPoemsDetail);
      console.log("Lines",this.poemsLine);
    },
    error => 
    {
      loadingPoemDetail.dismiss();//DISMISS LOADER
      console.log();
    });
    this.mediaFile.play();
    this.isAudioPlayed=true;
    this.mediaFile.onSuccess.subscribe(() => 
    { 
      this.pauseAudio();
      console.log("Media completed to play.");
    });
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
    this.mediaFile.getCurrentPosition().then((position) => {
      this.mediaFileCurrentPosition = position;
      console.log(this.mediaFileCurrentPosition);
    });
  }

  dismissModal(form)
	{
    this.mediaFile.release();
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }

  ionViewDidLeave()
  {
    this.mediaFile.release();
  }
}
