import { Component } from '@angular/core';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { Platform, LoadingController, ModalController, ActionSheetController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { PoemFeedbackPage } from '../poem-feedback/poem-feedback.page';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { PlayMediaPage } from '../play-media/play-media.page';
import { FileTransfer, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { MediaControlsService } from '../providers/media-controls.service';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
@Component({
  selector: 'app-poem-detail',
  templateUrl: './poem-detail.page.html',
  styleUrls: ['./poem-detail.page.scss'],
})

export class PoemDetailPage 
{
  public WelcomeText: any = null;
  public user_id:any='';
  public poem_id:any='';
  public from_page:any='';
  public queryStringData: any=[];
  private mediaFile: MediaObject;
  private mediaFileCurrentPosition:any='';
  public isAudioPlayed: boolean = false;
  public togglePlayerInFullHeight:boolean = false;
  public has_mp3:boolean=false;
  public resultPoemBookMark: any=[];
  public resultPoemOffline: any=[];
  public resultPoemsDetailObject:any=[];
  public resultPoemsDetail:any=[];
  public poemsLine:any=[];
  public resultPoemsForBookmark:any=[];
  public resultPoem
  public MP3Link:string='';
  public queryString: any=[];
  public does_poem_already_made_offline: boolean = false;
  public does_poem_already_made_bookmark: boolean = false;
  private fileTransfer: FileTransferObject;
  public currentPlatform:any='';
  public PDFFileToBeShared:any=''; 
  public downloadPDFPath:any='';
  public MP3FileToBeSave:any=''; 
  public downloadMP3Path:any=''; 
  public show_hide_translation:boolean=true;
  public does_poem_has_translated_text:boolean=false;
  constructor(private platform: Platform, private filePath: FilePath, private file: File, private transfer: FileTransfer, private inAppBrowser: InAppBrowser, public offline: OfflineService, public client: ClientService, private media: Media, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, public actionSheetCtrl: ActionSheetController, private androidPermissions: AndroidPermissions, private readonly mediaControllerService: MediaControlsService)
  {
    this.client.getObservableWhenLogin().subscribe((data) => 
    {
      this.WelcomeText = this.client.WelcomeText;
    });//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
  }

  async ngOnInit()
  {
    this.WelcomeText = (localStorage.getItem("firstname") != null && localStorage.getItem("firstname") != undefined) ? localStorage.getItem("firstname") : null;
		if(this.WelcomeText!=null)
    {
      this.WelcomeText = this.WelcomeText.substring(0,1);
    }
  }

  async ionViewWillEnter()
  {
    this.user_id=localStorage.getItem('id');
    this.poem_id='';
    this.from_page='';
    this.resultPoemsDetailObject=[];
    this.resultPoemsDetail=[];
    this.poemsLine=[];
    this.has_mp3=false;
    this.does_poem_already_made_offline=false;
    this.does_poem_already_made_bookmark=false;
    
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    
    this.poem_id=this.queryStringData['poem_id'];
    this.from_page=this.queryStringData['from_page'];
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
        this.mediaFile = this.media.create(this.MP3Link);//WORKING CODE :: PLAY/PAUSE AUDIO FROM POEM DETAIL
      } 
      if(this.poemsLine.length > 0)
      {
        for(let i = 0; i < this.poemsLine.length; i ++)
        {
          if(this.poemsLine[i]['TranslatedText']!="")
          {
            this.does_poem_has_translated_text = true;
          }
        }
      }     
      //console.log("MP3Link",this.MP3Link);
      //console.log("Object",this.resultPoemsDetailObject);
      console.log("Detail",this.resultPoemsDetail);
      //console.log("Lines",this.poemsLine);
      this.has_mp3=(this.MP3Link!="") ? true : false;
    },
    error => 
    {
      loadingPoemDetail.dismiss();//DISMISS LOADER
      console.log();
    });
    //CHECK IF POEM ALREADY MADE OFF-LINE
    let idToExecute=[this.poem_id];
    let queryToExecute = "SELECT * FROM poems WHERE id=?";
    await this.offline.getData(queryToExecute,idToExecute).then((result:any) => 
    {
      if(result.rows.length > 0)
      {
        this.does_poem_already_made_offline = true;
      }
      else
      {
        this.does_poem_already_made_offline = false;
      } 
    },
    error => 
    {
      console.log(error);
    });
    //CHECK IF POEM ALREADY MADE OFF-LINE
    //CHECK IF POEM ALREADY MADE BOOKMARK
    let idToExecute_1=[this.poem_id];
    let queryToExecute_1 = "SELECT * FROM bookmarks WHERE id=?";
    await this.offline.getData(queryToExecute_1,idToExecute_1).then((result:any) => 
    {
      if(result.rows.length > 0)
      {
        this.does_poem_already_made_bookmark = true;
      }
      else
      {
        this.does_poem_already_made_bookmark = false;
      } 
    },
    error => 
    {
      console.log(error);
    });
    //CHECK IF POEM ALREADY MADE BOOKMARK
  }
  
  playAudio(ev:any)
  { 
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.client.publishSomeDataWhenAudioPlayed({
      music_object : this.resultPoemsDetail
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT 
    localStorage.setItem('current_playing_audio',JSON.stringify(this.resultPoemsDetail));
    this.mediaControllerService.playPause(this.resultPoemsDetail);
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  }
  
  playAudioOriginal()
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
      console.log("PLAY");
      this.mediaFile.play();
      this.isAudioPlayed=true;
    }
  }//WORKING CODE :: PLAY/PAUSE AUDIO FROM POEM DETAIL
  
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
  }//WORKING CODE :: PLAY/PAUSE AUDIO FROM POEM DETAIL
  

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
  
  async makeBookMarkAtRow(poem_id,poem_line_id,user_id,is_to_insert)
  {
    let id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    if(id!='' && id!='null' && id!=null && id!=undefined && id!='undefined')
    {
      //LOADER
      const loadingPoemBookmark = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemBookmark.present();
      //LOADER

      let objData = {
        poem_id:poem_id,
        poem_line_id:poem_line_id,
        user_id:user_id,
        is_to_insert:is_to_insert
      }
      
      await this.client.poemLineWishlist(objData).then(result => 
      {
        loadingPoemBookmark.dismiss();//DISMISS LOADER
        this.resultPoemsForBookmark=result;	
        if(this.resultPoemsForBookmark.status==true)
        {
          //this.client.showMessage(this.resultPoemsForBookmark.message);
          if(is_to_insert == 1)
          {
            this.client.showMessage("Poem is bookmarked.<br />\nYou can access your bookmarked poems under My Bookmarks.");
          }
          if(is_to_insert == 0)
          {
            this.client.showMessage("Bookmark has been removed from Poem.");
          }
        }
        this.ionViewWillEnter();
        console.log(result);
      },
      error => 
      {
        loadingPoemBookmark.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    else 
    {
      this.client.router.navigate(['login']);  
    }
  }

  openYouTubeURL(targetURL)
  {
    const options : InAppBrowserOptions = {
      location : 'yes',//Or 'no' 
      hidden : 'no', //Or  'yes'
      clearcache : 'yes',
      clearsessioncache : 'yes',
      zoom : 'yes',//Android only ,shows browser zoom controls 
      hardwareback : 'yes',
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
    this.inAppBrowser.create(targetURL,target,options);
  }

  ionViewDidLeave()
  {
    //this.mediaFile.release();
  }//WORKING CODE :: PLAY/PAUSE AUDIO FROM POEM DETAIL
  
  async playMediaInPOPUP(poem_id)
  {
    const modal = await this.modalCtrl.create({
			component: PlayMediaPage,
      cssClass: 'subject-occassion-detail',
      showBackdrop: false,
			componentProps: 
			{ 
        poem_id: poem_id
			}
		});

		return await modal.present();
  }

  BackAsQueryString()
  {
    let choosen_option = JSON.parse(localStorage.getItem('choosen_option'));
    this.queryString = 
    {
      poem_subject_occassion_id:choosen_option.poem_subject_occassion_id,
      poem_subject_occassion_nm:choosen_option.poem_subject_occassion_nm,
      poem_or_subject_occassion:choosen_option.poem_or_subject_occassion
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/sub-list-page'], navigationExtras);
  }

  togglePlayerHeight()
  {
    this.togglePlayerInFullHeight = this.togglePlayerInFullHeight = !this.togglePlayerInFullHeight;
    console.log(this.togglePlayerInFullHeight);
  }

  async ShareURLOnSocialNetwork(poem_id,poem_slug,poem_nm)
  {
    let url_of_open = '';
    if(poem_slug!=null)
    {
      //BEFORE::url_of_open = "https://app.thehaydariproject.com/poem-detail/"+poem_slug;
      url_of_open = this.client.site_url+"poem-detail/"+poem_slug;
    }
    else
    {
      //BEFORE::url_of_open = "https://app.thehaydariproject.com/poem/"+poem_id;
      url_of_open = this.client.site_url+"poem/"+poem_id;
    }
    let message = '';    
    //message += "Have you read this poem ?";
    this.client.ShareOnSocialNetwork("none","Share","none",message,null,null,url_of_open);
  }

  async SharePDFOnSocialNetwork(poem_id,poem_url)
  {
    //LOADER
    const loadingDownloadingPDF = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingDownloadingPDF.present();
    //LOADER
    this.PDFFileToBeShared='';
    this.downloadPDFPath = "";
    await this.platform.ready().then(async () => 
    {
      this.currentPlatform = (this.platform.is("android") == true) ? "android" : "ios";
    });
    this.fileTransfer = this.transfer.create();
    let fileName = this.client.generateRandomString(5);
    if(this.currentPlatform == "android")
    {
      this.downloadPDFPath = this.file.externalRootDirectory+"/Download/"+fileName+".pdf";      
    }
    else
    {
      this.downloadPDFPath = this.file.documentsDirectory+fileName+".pdf";
      this.PDFFileToBeShared = this.downloadPDFPath;
    }
    await this.fileTransfer.download(encodeURI(poem_url),this.downloadPDFPath,true).then(result => 
    {
      loadingDownloadingPDF.dismiss();//DISMISS LOADER
      this.PDFFileToBeShared = result.toURL();
      console.log('download completed: ' + result.toURL());
    },(error) => 
    {  
      loadingDownloadingPDF.dismiss();//DISMISS LOADER
      //here logging our error its easier to find out what type of error occured.  
      console.log('download failed: ' + JSON.stringify(error));  
    });    
    //COULD HELP::https://stackoverflow.com/questions/65768839/get-selected-file-size-from-chooser-plugin-cordova-ionic

    await this.platform.ready().then(async () => 
    {
      if(this.platform.is("android") == true)
      {
        await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => 
        {
          if(result.hasPermission) 
          {
            this.ShareMediaOnSocialNetwork();
          } 
          else 
          {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(() => 
            {
              this.ShareMediaOnSocialNetwork();
            },
            error => 
            {
              alert("2="+error)
            });
          }
        },error => 
        {
          alert("1="+error);
        });
      }
      else 
      {
        this.ShareMediaOnSocialNetwork();
      }
    });
  }

  async ShareMediaOnSocialNetwork()
  {
    let message = '';
    let url_of_open = this.PDFFileToBeShared;
    console.log("Download Path Device",url_of_open);
    //message += "Have you read this poem ?";
    this.client.ShareOnSocialNetwork("none","Share","none",message,null,url_of_open,null);
  }

  async makeItOffLine(poemObject)
  {
    console.log(poemObject);
    if(this.does_poem_already_made_offline == false)
    {
      //LOADER
      const loadingPoemOffline = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemOffline.present();
      //LOADER
      if(this.poemsLine.length > 0)
      {
        poemObject['poemsLine']=JSON.stringify(this.poemsLine);
      }
      else 
      {
        poemObject['poemsLine']=JSON.stringify([]);
      }
      await this.offline.addPoem(poemObject).then(result => 
      {
        loadingPoemOffline.dismiss();//DISMISS LOADER
        this.resultPoemOffline=result;
        this.client.showMessage("Poem is made Offline!");
        this.does_poem_already_made_offline = true;
        console.log(this.resultPoemOffline);
      },
      error => 
      {
        loadingPoemOffline.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    else 
    {
      this.client.showMessage("You already have the poem Offline!");
    }
  }

  async ToggleOffLine(poemObject,what_to_do,has_mp3)
  {
    let actionToTake = (what_to_do == 1) ? "insert" : "delete";
    if(actionToTake == "insert")
    {
      //DOWNLOADING MP3 TO THE DEVICE STARTS
      this.MP3FileToBeSave='';
      this.downloadMP3Path = "";
      
      //LOADER
      const loadingDownloadingMP3 = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingDownloadingMP3.present();
      //LOADER      
      await this.platform.ready().then(async () => 
      {
        this.currentPlatform = (this.platform.is("android") == true) ? "android" : "ios";
      });
      this.fileTransfer = this.transfer.create();
      let fileName = this.client.generateRandomString(5);
      if(this.currentPlatform == "android")
      {
        this.downloadMP3Path = this.file.externalRootDirectory+"/Download/"+fileName+".mp3";      
      }
      else
      {
        this.downloadMP3Path = this.file.documentsDirectory+fileName+".mp3";
        this.MP3FileToBeSave = this.downloadMP3Path;
      }
      await this.fileTransfer.download(encodeURI(poemObject['MP3Link']),this.downloadMP3Path,true).then(result => 
      {
        loadingDownloadingMP3.dismiss();//DISMISS LOADER
        this.MP3FileToBeSave = result.toURL();
        console.log('download completed: ' + result.toURL());
      },(error) => 
      {  
        loadingDownloadingMP3.dismiss();//DISMISS LOADER
        //here logging our error its easier to find out what type of error occured.  
        console.log('download failed: ' + JSON.stringify(error));  
      });
      //DOWNLOADING MP3 TO THE DEVICE ENDS
      //LOADER
      const loadingPoemOffline = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemOffline.present();
      //LOADER
      if(this.poemsLine.length > 0)
      {
        poemObject['poemsLine']=JSON.stringify(this.poemsLine);
      }
      else 
      {
        poemObject['poemsLine']=JSON.stringify([]);
      }
      poemObject['FromTableNM']="Poems";      
      poemObject['MP3Link']=(this.MP3FileToBeSave!='') ? this.MP3FileToBeSave : null;
      await this.offline.addPoem(poemObject).then(result => 
      {
        loadingPoemOffline.dismiss();//DISMISS LOADER
        this.resultPoemOffline=result;
        this.client.showMessage("Poem is added to offline!");
        this.does_poem_already_made_offline = true;
        this.ionViewWillEnter();
      },
      error => 
      {
        loadingPoemOffline.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(actionToTake == "delete")
    {
      await this.offline.deleteData(poemObject.id).then(result => 
      {
        this.client.showMessage("Poem is removed from offline!");
        this.does_poem_already_made_offline = false;
        this.ionViewWillEnter();      
      });
    }
  }

  async BookmarkThisPoem(poemObject,what_to_do,has_mp3)
  {
    let actionToTake = (what_to_do == 1) ? "insert" : "delete";
    if(actionToTake == "insert")
    { 
      let idToExecute_1=[poemObject.id];
      let queryToExecute_1 = "SELECT * FROM bookmarks WHERE id=?";
      await this.offline.getData(queryToExecute_1,idToExecute_1).then(async (result:any) => 
      {
        if(result.rows.length > 0)
        {
          this.client.showMessage("You already have bookmarked this poem!");
        }
        else
        {
          //DOWNLOADING MP3 TO THE DEVICE STARTS
          this.MP3FileToBeSave='';
          this.downloadMP3Path = "";
          
          //LOADER
          const loadingDownloadingMP3 = await this.loadingCtrl.create({
            spinner: null,
            //duration: 5000,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
          });
          await loadingDownloadingMP3.present();
          //LOADER
          
          await this.platform.ready().then(async () => 
          {
            this.currentPlatform = (this.platform.is("android") == true) ? "android" : "ios";
          });
          this.fileTransfer = this.transfer.create();
          let fileName = this.client.generateRandomString(5);
          if(this.currentPlatform == "android")
          {
            this.downloadMP3Path = this.file.externalRootDirectory+"/Download/"+fileName+".mp3";      
          }
          else
          {
            this.downloadMP3Path = this.file.documentsDirectory+fileName+".mp3";
            this.MP3FileToBeSave = this.downloadMP3Path;
          }
          await this.fileTransfer.download(encodeURI(poemObject['MP3Link']),this.downloadMP3Path,true).then(result => 
          {
            loadingDownloadingMP3.dismiss();//DISMISS LOADER
            this.MP3FileToBeSave = result.toURL();
            console.log('download completed: ' + result.toURL());
          },(error) => 
          {  
            loadingDownloadingMP3.dismiss();//DISMISS LOADER
            //here logging our error its easier to find out what type of error occured.  
            console.log('download failed: ' + JSON.stringify(error));  
          });
          //DOWNLOADING MP3 TO THE DEVICE ENDS

          //LOADER
          const loadingPoemBookmark = await this.loadingCtrl.create({
            spinner: null,
            //duration: 5000,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
          });
          await loadingPoemBookmark.present();
          //LOADER
          if(this.poemsLine.length > 0)
          {
            poemObject['poemsLine']=JSON.stringify(this.poemsLine);
          }
          else 
          {
            poemObject['poemsLine']=JSON.stringify([]);
          }
          poemObject['FromTableNM']="bookmarks";
          poemObject['MP3Link']=(this.MP3FileToBeSave) ? this.MP3FileToBeSave : null;
          await this.offline.addBookmark(poemObject).then(result => 
          {
            loadingPoemBookmark.dismiss();//DISMISS LOADER
            this.client.showMessage("Poem is added to bookmark!");
            this.does_poem_already_made_bookmark = true;
            this.ionViewWillEnter();
          },
          error => 
          {
            loadingPoemBookmark.dismiss();//DISMISS LOADER
            console.log();
          });
        } 
      },
      error => 
      {
        console.log(error);
      });
      
    }
    if(actionToTake == "delete")
    {
      await this.offline.deleteBookmarkData(poemObject.id).then(result => 
      {
        this.client.showMessage("Poem is removed from bookmark!");
        this.does_poem_already_made_bookmark = false;
        this.ionViewWillEnter();      
      });
    }
  }

  async PoemFeedBack(poem_id)
  {
    const modal = await this.modalCtrl.create({
			component: PoemFeedbackPage,
      cssClass: 'advance-search-filter',
      showBackdrop: false,
      swipeToClose:true,
      animated: true,
			componentProps: 
			{ 
        poem_id:poem_id
			}
		});
    return await modal.present();
  }

  async ionViewDidEnter()
  {
    //ALTER TABLE
    await this.offline.getData('SELECT FromTableNM FROM Poems LIMIT 1',[]).then((resultToAlter:any) => 
    {
      //COLUMN EXISTS :: NOT NEED TO DO ANYTHING
    },async (error) => 
    {
      //console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `Poems` ADD `FromTableNM` VARCHAR(255) NOT NULL DEFAULT `Poems` AFTER `poemsLine`').then(resultAlter => 
      {
        //COLUMN ADDED :: NOT NEED TO DO ANYTHING
        //console.log("column created 1",resultAlter);
      },error => 
      {
        //COLUMN CREATING ERROR
        //console.log("column created 1 error",error);
      });
      
    });//TO CHECK COLUMN FromTableNM EXISTS IN Poems table if not then add
    
    //ALTER TABLE FOR MP3 STARTS
    await this.offline.getData('SELECT MP3Link FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      //COLUMN EXISTS :: NOT NEED TO DO ANYTHING
    },async (error) => 
    {
      //console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `Poems` ADD `MP3Link` text CHARACTER').then(resultAlter => 
      {
        //console.log("Field altered - 1");
        //COLUMN ADDED :: NOT NEED TO DO ANYTHING
      },error => 
      {
        //COLUMN CREATING ERROR
        //console.log("column created 1 error",error);
      });
    });//TO CHECK COLUMN MP3Link EXISTS IN Poems table if not then add
    //ALTER TABLE FOR MP3 ENDS

    await this.offline.getData('SELECT FromTableNM FROM bookmarks LIMIT 1',[]).then((resultToAlter:any) => 
    {
      //COLUMN EXISTS :: NOT NEED TO DO ANYTHING
    },async (error) => 
    {
      //console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `bookmarks` ADD `FromTableNM` VARCHAR(255) NOT NULL DEFAULT `bookmarks`').then(resultAlter => 
      {
        //COLUMN ADDED :: NOT NEED TO DO ANYTHING
        //console.log("column created 2",resultAlter);
      },error => 
      {
        //COLUMN CREATING ERROR
        //console.log("column created 2 error",error);
      });
    });//TO CHECK COLUMN FromTableNM EXISTS IN bookmarks table if not then add 
    
    //ALTER TABLE FOR MP3 STARTS
    await this.offline.getData('SELECT MP3Link FROM bookmarks LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      //COLUMN EXISTS :: NOT NEED TO DO ANYTHING
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `bookmarks` ADD `MP3Link` VARCHAR(255) NULL').then(resultAlter => 
      {
        //console.log("Field altered - 1");
        //COLUMN ADDED :: NOT NEED TO DO ANYTHING
      },error => 
      {
        //COLUMN CREATING ERROR
        //console.log("column created 1 error",error);
      });
    });//TO CHECK COLUMN MP3Link EXISTS IN bookmarks table if not then add
    //ALTER TABLE FOR MP3 ENDS
    //ALTER TABLE
  }

  ToogleTranslation()
  {
    this.show_hide_translation = this.show_hide_translation ? false : true;
  }
}
