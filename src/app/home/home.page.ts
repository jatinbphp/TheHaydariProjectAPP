import { Component } from '@angular/core';
import { MenuController, LoadingController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { MediaControlsService } from '../providers/media-controls.service';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Qbyte } from '../models/qbyte.interface';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Observable } from 'rxjs';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { SearchAutoCompletePage } from '../search-auto-complete/search-auto-complete.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage 
{
  public WelcomeText: any = null;
  public queryString: any=[];
  public resultAllAndResent:any=[];
  public resultPoemTypes:any=[];
  public resultSubjectOccasion:any=[];
  public resultReciters:any=[];
  public resultAllPoems:any=[];
  public resultPoets:any=[];
  public resultLanguages:any=[];
  public searched_text:string='';
  public showAllSubjects:boolean=false;
  public is_network_connected:boolean=false;
  public MP3Link:string='';

  public isAudioPlayedComponent: boolean = false;
  public mediaFileComponent: MediaObject;

  public resultPoemsDetail:any=[];//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public qbytes$: Observable<Qbyte[]>;//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public is_audio_played:boolean=false;//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public autocomplete_options:any=[];//AUTOCOMPLETE RELETED
  public resultSearchResult:any=[];//AUTOCOMPLETE RELETED
  public is_searched:boolean=false;//AUTOCOMPLETE RELETED
  constructor(public keyboard:Keyboard, public fb: FormBuilder, public offline: OfflineService, public client: ClientService, public menu: MenuController, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private readonly mediaControllerService: MediaControlsService) 
  { 
    this.keyboard.hideFormAccessoryBar(false);
    this.client.getObservableWhenOnLine().subscribe((data) => {
      this.is_network_connected = data.is_network_connected; 
      this.ngOnInit();     
      console.log('Data received', data);
    });//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN

    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.client.getObservableWhenAudioPlayed().subscribe((data) => {
      this.resultPoemsDetail = data.music_object; 
      this.qbytes$ = this.resultPoemsDetail;
      this.is_audio_played = data.is_audio_played; 
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    
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
    
    this.searched_text = '';
    this.menu.enable(true);
    //AUTOCOMPLETE RELETED
    let objAutoComplete=
    {
      keyword:'',
      recent_or_all:'0',
      recent_or_all_request:'',
      poemtype_or_subjectoccassion:'0',
      poemtype_or_subjectoccassion_request:'',
      poemtype_or_subjectoccassion_id:'0'
    }
    localStorage.setItem('autocomplete_options',JSON.stringify(objAutoComplete));
    //AUTOCOMPLETE RELETED    
    //DELETING RECORDS STARTS
    this.offline.DBInformation().subscribe(async (res) => 
    {
      if(res)
      {
        let queryToDelete_1 = 'DELETE FROM allpoems';
        //let queryToDelete_1 = 'DROP TABLE IF EXISTS allpoems';
        await this.offline.dropTableByQuery(queryToDelete_1).then(result => 
        {},
        error => 
        {console.log("error DROP TABLE allpoems = ",error);});//DELETING RECORDS FROM TABLE
        /*
        let queryToCreate_1 = 'CREATE TABLE allpoems(Email varchar(255),Fullname varchar(255),LanguageID int(11),LanguageName varchar(255),MP3Link text CHARACTER,PoemName varchar(255),PoemTypeID int(11),PoemTypeName varchar(255),PoetID int(11),PoetName varchar(255),ReciterID int(11),ReciterName varchar(255),SubjectID int(11),SubjectName varchar(255),TranslatedText text CHARACTER,UserID int(11),YouTubeURL varchar(255),addedBy int(11),bookmarkStatus int(11),colorCode varchar(255),createdAt timestamp,id int(11),isVerified tinyint(1),poemsLine json,FromTableNM varchar(255))';
        await this.offline.createTableByQuery(queryToCreate_1).then(result => 
        {},
        error => 
        {console.log("error CREATE TABLE allpoems = ",error);});
        */
        let queryToDelete_2 = 'DELETE FROM poemtypes';
        //let queryToDelete_2 = 'DROP TABLE IF EXISTS poemtypes';
        await this.offline.dropTableByQuery(queryToDelete_2).then(async (result) => 
        {},
        error => 
        {console.log("error DROP TABLE poemtypes = ",error);});//DELETING RECORDS FROM TABLE
        /*
        let queryToCreate_2 = 'CREATE TABLE poemtypes(id int(11),PoemTypeName varchar(255),Image text,colorCode varchar(255),isActive int(11))';
        await this.offline.createTableByQuery(queryToCreate_2).then(result => 
        {},
        error => 
        {console.log("error CREATE TABLE poemtypes = ",error);});
        */
        let queryToDelete_3 = 'DELETE FROM subjectoccassion';
        //let queryToDelete_3 = 'DROP TABLE IF EXISTS subjectoccassion';
        await this.offline.dropTableByQuery(queryToDelete_3).then(async (result) => 
        {},
        error => 
        {console.log("error DROP TABLE subjectoccassion = ",error);});//DELETING RECORDS FROM TABLE
        /*
        let queryToCreate_3 = 'CREATE TABLE subjectoccassion(id int(11),subjectName varchar(255))';
        await this.offline.createTableByQuery(queryToCreate_3).then(result => 
        {},
        error => 
        {console.log("error CREATE TABLE subjectoccassion = ",error);});
        */
        let queryToDelete_4 = 'DELETE FROM languages';
        //let queryToDelete_4 = 'DROP TABLE IF EXISTS languages';
        await this.offline.dropTableByQuery(queryToDelete_4).then(async (result) => 
        {},
        error => 
        {console.log("error DROP TABLE languages = ",error);});//DELETING RECORDS FROM TABLE
        /*
        let queryToCreate_4 = 'CREATE TABLE languages(id int(11),LanguageName varchar(255))';
        await this.offline.createTableByQuery(queryToCreate_4).then(result => 
        {},
        error => 
        {console.log("error CREATE TABLE languages = ",error);});
        */
        let queryToDelete_5 = 'DELETE FROM poets';
        //let queryToDelete_5 = 'DROP TABLE IF EXISTS poets';
        await this.offline.dropTableByQuery(queryToDelete_5).then(async (result) => 
        {},
        error => 
        {console.log("error DROP TABLE poets = ",error);});//DELETING RECORDS FROM TABLE
        /*
        let queryToCreate_5 = 'CREATE TABLE poets(id int(11),PoetName varchar(255))';
        await this.offline.createTableByQuery(queryToCreate_5).then(result => 
        {},
        error => 
        {console.log("error CREATE TABLE poets = ",error);});
        */
        let queryToDelete_6 = 'DELETE FROM reciters';
        //let queryToDelete_6 = 'DROP TABLE IF EXISTS reciters';
        await this.offline.dropTableByQuery(queryToDelete_6).then(async (result) => 
        {},
        error => 
        {console.log("error DROP TABLE reciters = ",error);});//DELETING RECORDS FROM TABLE
        /*
        let queryToCreate_6 = 'CREATE TABLE reciters(id int(11),ReciterName varchar(255))';
        await this.offline.createTableByQuery(queryToCreate_6).then(result => 
        {},
        error => 
        {console.log("error CREATE TABLE reciters = ",error);});
        */
      }
    });
    //DELETING RECORDS ENDS
    /*ALL/RECENT*/    
    await this.client.getAllAndRecent().then(result => 
    {	
      this.resultAllAndResent=result;
      //console.log(this.resultAllAndResent);
    },
    error => 
    {
      console.log();
    });
    /*ALL/RECENT*/
    /*POEM TYPE*/    
    await this.client.getPoemTypes().then(async (result) => 
    {	
      this.resultPoemTypes=result;
      if(this.resultPoemTypes.length > 0)
      {
        for(let p = 0; p < this.resultPoemTypes.length; p ++)
        {
          let PoemTypeName = this.resultPoemTypes[p].PoemTypeName.replace("/ ", "/<br>");
          let checkSlashInString = this.resultPoemTypes[p]['PoemTypeName'].replace("/ ", "/");
          this.resultPoemTypes[p]['PoemTypeName']=PoemTypeName;
          //console.log(PoemTypeName);
          //INSERT INTO TABLE          
          /*
          let arrayToInsert_1 = [this.resultPoemTypes[p]['id'],checkSlashInString,this.resultPoemTypes[p]['Image'],this.resultPoemTypes[p]['colorCode'],this.resultPoemTypes[p]['isActive']];
          let queryToInsert_1 = 'INSERT INTO poemtypes (id,PoemTypeName,Image,colorCode,isActive) VALUES (?,?,?,?,?)';
          await this.offline.insertData(queryToInsert_1, arrayToInsert_1).then(result => 
          {	},
          error => 
          {console.log(error);});          
          */
          //INSERT INTO TABLE
        }
      }      
      console.log(this.resultPoemTypes);
    },
    error => 
    {
      console.log();
    });
    /*POEM TYPE*/
    /*SUBJECT/OCCASION*/    
    await this.client.getSubject().then(async (result) => 
    {	
      this.resultSubjectOccasion=result;
      //INSERT INTO TABLE      
      /*
      if(this.resultSubjectOccasion.length > 0)
      {
        for(let s = 0 ; s < this.resultSubjectOccasion.length; s ++)
        {
          let arrayToInsert_2 = [this.resultSubjectOccasion[s]['id'],this.resultSubjectOccasion[s]['subjectName']];
          let queryToInsert_2 = 'INSERT INTO subjectoccassion (id,subjectName) VALUES (?,?)';
          await this.offline.insertData(queryToInsert_2, arrayToInsert_2).then(result => 
          {	},
          error => 
          {console.log(error);});          
        }
      } 
      */     
      //INSERT INTO TABLE   
      //console.log(this.resultSubjectOccasion);
    },
    error => 
    {
      console.log();
    });
    /*SUBJECT/OCCASION*/
    /*ALL POEMS*/
    let data = {
      filterType:"All Poems",
      order:"",
      keyword:"",
      selectedLanguage:"",
      selectedPoets:"",
      selectedReciters:"",
      selectedPoemType:"",
      selectedSubjectOccassion:"",
      translated:""
    }
    /*
    //LOADER
		const loadingAllPoems = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingAllPoems.present();
		//LOADER
    */
    await this.client.getAllOrRecentRequested(data).then(async (result:any) => 
    {	
      //loadingAllPoems.dismiss();//DISMISS LOADER
      this.resultAllPoems=result['poemsData'];
      //INSERT INTO TABLE
      /*
      if(this.resultAllPoems.length > 0)
      {
        let Counter = 0;
        for(let p = 0; p < this.resultAllPoems.length; p ++)
        { 
          this.resultAllPoems[p]['poemsLine']=JSON.stringify([]);
          let arrayToInsert_allpoem = [this.resultAllPoems[p]['Email'], this.resultAllPoems[p]['Fullname'],this.resultAllPoems[p]['LanguageID'],this.resultAllPoems[p]['LanguageName'],this.resultAllPoems[p]['MP3Link'],this.resultAllPoems[p]['PoemName'],this.resultAllPoems[p]['PoemTypeID'],this.resultAllPoems[p]['PoemTypeName'],this.resultAllPoems[p]['PoetID'],this.resultAllPoems[p]['PoetName'],this.resultAllPoems[p]['ReciterID'],this.resultAllPoems[p]['ReciterName'],this.resultAllPoems[p]['SubjectID'],this.resultAllPoems[p]['SubjectName'],this.resultAllPoems[p]['TranslatedText'],this.resultAllPoems[p]['UserID'],this.resultAllPoems[p]['YouTubeURL'],this.resultAllPoems[p]['addedBy'],this.resultAllPoems[p]['bookmarkStatus'],this.resultAllPoems[p]['colorCode'],this.resultAllPoems[p]['createdAt'],this.resultAllPoems[p]['id'],this.resultAllPoems[p]['isVerified'], this.resultAllPoems[p]['poemsLine'],this.resultAllPoems[p]['FromTableNM']];
          let queryToInsert_allpoem = 'INSERT INTO allpoems (Email,Fullname,LanguageID,LanguageName,MP3Link,PoemName,PoemTypeID,PoemTypeName,PoetID,PoetName,ReciterID,ReciterName,SubjectID,SubjectName,TranslatedText,UserID,YouTubeURL,addedBy,bookmarkStatus,colorCode,createdAt,id,isVerified,poemsLine,FromTableNM) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
          await this.offline.insertData(queryToInsert_allpoem, arrayToInsert_allpoem).then(result => 
          {
            Counter++;
          },
          error => 
          {
            loadingAllPoems.dismiss();//DISMISS LOADER
            console.log(error);
          });
        }
        if(Counter == this.resultAllPoems.length)
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
        }        
      }
      */
      //INSERT INTO TABLE
      //console.log(this.resultAllPoems);
    },
    error => 
    {
      //loadingAllPoems.dismiss();//DISMISS LOADER
      console.log(error);
    });
    /*ALL POEMS*/
    /*RECIETERS*/
    await this.client.getReciters().then(async(result) => 
    {	
      this.resultReciters=result;
      //INSERT INTO TABLE
      /*      
      if(this.resultReciters.length > 0)
      {
        for(let r = 0 ; r < this.resultReciters.length; r ++)
        {
          let arrayToInsert_3 = [this.resultReciters[r]['id'],this.resultReciters[r]['ReciterName']];
          let queryToInsert_3 = 'INSERT INTO reciters (id,ReciterName) VALUES (?,?)';
          await this.offline.insertData(queryToInsert_3, arrayToInsert_3).then(result => 
          {	},
          error => 
          {console.log(error);});          
        }
      }
      */      
      //INSERT INTO TABLE   
      //console.log(this.resultReciters);
    },
    error => 
    {
      console.log(error);
    });
    /*RECIETERS*/
    /*POETS*/
    await this.client.getPoets().then(async (result) => 
    {	
      this.resultPoets=result;
      //INSERT INTO TABLE      
      /*
      if(this.resultPoets.length > 0)
      {
        for(let p = 0 ; p < this.resultPoets.length; p ++)
        {
          let arrayToInsert_3 = [this.resultPoets[p]['id'],this.resultPoets[p]['PoetName']];
          let queryToInsert_3 = 'INSERT INTO poets (id,PoetName) VALUES (?,?)';
          await this.offline.insertData(queryToInsert_3, arrayToInsert_3).then(result => 
          {	},
          error => 
          {console.log(error);});          
        }
      } 
      */     
      //INSERT INTO TABLE
    },
    error => 
    {
      console.log(error);
    });
    /*POETS*/
    /*LANGUAGES*/    
    await this.client.getLanguages().then(async(result) => 
    {	
      this.resultLanguages=result;      
      //INSERT INTO TABLE      
      /*
      if(this.resultLanguages.length > 0)
      {
        for(let l = 0 ; l < this.resultLanguages.length; l ++)
        {
          let arrayToInsert_3 = [this.resultLanguages[l]['id'],this.resultLanguages[l]['LanguageName']];
          let queryToInsert_3 = 'INSERT INTO languages (id,LanguageName) VALUES (?,?)';
          await this.offline.insertData(queryToInsert_3, arrayToInsert_3).then(result => 
          {	},
          error => 
          {console.log(error);});          
        }
      }
      */     
      //INSERT INTO TABLE
      //console.log(this.resultLanguages);
    },
    error => 
    {
      console.log(error);
    });
    /*LANGUAGES*/
    await this.InsertOfflineRecords();
  }

  async InsertOfflineRecords()
  {
    //LOADER
    const loadingAllPoems = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingAllPoems.present();
    //LOADER
    if(this.resultPoemTypes.length > 0)
    {
      for(let p = 0; p < this.resultPoemTypes.length; p ++)
      {
        let PoemTypeName = this.resultPoemTypes[p].PoemTypeName.replace("/ ", "/<br>");
        let checkSlashInString = this.resultPoemTypes[p]['PoemTypeName'].replace("/ ", "/");
        this.resultPoemTypes[p]['PoemTypeName']=PoemTypeName;
        let arrayToInsert_1 = [this.resultPoemTypes[p]['id'],checkSlashInString,this.resultPoemTypes[p]['Image'],this.resultPoemTypes[p]['colorCode'],this.resultPoemTypes[p]['isActive']];
        let queryToInsert_1 = 'INSERT INTO poemtypes (id,PoemTypeName,Image,colorCode,isActive) VALUES (?,?,?,?,?)';
        await this.offline.insertData(queryToInsert_1, arrayToInsert_1).then(result => 
        {	},
        error => 
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
          console.log(error);
        });          
      }
    }
    if(this.resultSubjectOccasion.length > 0)
    {
      for(let s = 0 ; s < this.resultSubjectOccasion.length; s ++)
      {
        let arrayToInsert_2 = [this.resultSubjectOccasion[s]['id'],this.resultSubjectOccasion[s]['subjectName']];
        let queryToInsert_2 = 'INSERT INTO subjectoccassion (id,subjectName) VALUES (?,?)';
        await this.offline.insertData(queryToInsert_2, arrayToInsert_2).then(result => 
        {	},
        error => 
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
          console.log(error);
        });          
      }
    }
    if(this.resultReciters.length > 0)
    {
      for(let r = 0 ; r < this.resultReciters.length; r ++)
      {
        let arrayToInsert_3 = [this.resultReciters[r]['id'],this.resultReciters[r]['ReciterName']];
        let queryToInsert_3 = 'INSERT INTO reciters (id,ReciterName) VALUES (?,?)';
        await this.offline.insertData(queryToInsert_3, arrayToInsert_3).then(result => 
        {	},
        error => 
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
          console.log(error);
        });          
      }
    }
    if(this.resultPoets.length > 0)
    {
      for(let p = 0 ; p < this.resultPoets.length; p ++)
      {
        let arrayToInsert_3 = [this.resultPoets[p]['id'],this.resultPoets[p]['PoetName']];
        let queryToInsert_3 = 'INSERT INTO poets (id,PoetName) VALUES (?,?)';
        await this.offline.insertData(queryToInsert_3, arrayToInsert_3).then(result => 
        {	},
        error => 
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
          console.log(error);
        });          
      }
    }
    if(this.resultLanguages.length > 0)
    {
      for(let l = 0 ; l < this.resultLanguages.length; l ++)
      {
        let arrayToInsert_3 = [this.resultLanguages[l]['id'],this.resultLanguages[l]['LanguageName']];
        let queryToInsert_3 = 'INSERT INTO languages (id,LanguageName) VALUES (?,?)';
        await this.offline.insertData(queryToInsert_3, arrayToInsert_3).then(result => 
        {	},
        error => 
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
          console.log(error);
        });          
      }
    }
    if(this.resultAllPoems.length > 0)
    {
      
      let Counter = 0;
      for(let p = 0; p < this.resultAllPoems.length; p ++)
      {
        this.resultAllPoems[p]['poemsLine']=JSON.stringify([]);
        let arrayToInsert_allpoem = [this.resultAllPoems[p]['Email'], this.resultAllPoems[p]['Fullname'],this.resultAllPoems[p]['LanguageID'],this.resultAllPoems[p]['LanguageName'],this.resultAllPoems[p]['MP3Link'],this.resultAllPoems[p]['PoemName'],this.resultAllPoems[p]['PoemTypeID'],this.resultAllPoems[p]['PoemTypeName'],this.resultAllPoems[p]['PoetID'],this.resultAllPoems[p]['PoetName'],this.resultAllPoems[p]['ReciterID'],this.resultAllPoems[p]['ReciterName'],this.resultAllPoems[p]['SubjectID'],this.resultAllPoems[p]['SubjectName'],this.resultAllPoems[p]['TranslatedText'],this.resultAllPoems[p]['UserID'],this.resultAllPoems[p]['YouTubeURL'],this.resultAllPoems[p]['addedBy'],this.resultAllPoems[p]['bookmarkStatus'],this.resultAllPoems[p]['colorCode'],this.resultAllPoems[p]['createdAt'],this.resultAllPoems[p]['id'],this.resultAllPoems[p]['isVerified'], this.resultAllPoems[p]['poemsLine'],this.resultAllPoems[p]['FromTableNM']];
        let queryToInsert_allpoem = 'INSERT INTO allpoems (Email,Fullname,LanguageID,LanguageName,MP3Link,PoemName,PoemTypeID,PoemTypeName,PoetID,PoetName,ReciterID,ReciterName,SubjectID,SubjectName,TranslatedText,UserID,YouTubeURL,addedBy,bookmarkStatus,colorCode,createdAt,id,isVerified,poemsLine,FromTableNM) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        await this.offline.insertData(queryToInsert_allpoem, arrayToInsert_allpoem).then(result => 
        {
          Counter++;
        },
        error => 
        {
          loadingAllPoems.dismiss();//DISMISS LOADER
          console.log(error);
        });
      }      
    }
    loadingAllPoems.dismiss();//DISMISS LOADER      
  }

  async ionViewWillEnter()
  {
    //AUTOCOMPLETE RELETED
    this.autocomplete_options=(localStorage.getItem('autocomplete_options')) ? localStorage.getItem('autocomplete_options') : null;
    if(this.autocomplete_options!=null)
    {
      this.autocomplete_options=JSON.parse(this.autocomplete_options);
    }
    //AUTOCOMPLETE RELETED
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.is_audio_played=(localStorage.getItem('is_audio_played')) ? Boolean(localStorage.getItem('is_audio_played')) : this.is_audio_played;
    let current_playing_audio : any = localStorage.getItem('current_playing_audio');
    this.resultPoemsDetail=JSON.parse(current_playing_audio);
    this.qbytes$=this.resultPoemsDetail;
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.MP3Link = localStorage.getItem('MP3LinkComponent');
    await this.offline.getData('SELECT FromTableNM FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("JUST TO INITILIZE TABLE");
    },async (error) => 
    {
      console.log("ERROR-JUST TO INITILIZE TABLE",error);
    });//JUST TO INITILIZE TABLE ONLY
  }

  playAudio(ev:any)
  { 
    this.client.publishSomeDataWhenAudioPlayed({
      music_object : this.resultPoemsDetail,
      is_audio_played:true
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT 
    this.mediaControllerService.playPause(this.resultPoemsDetail);
  }//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP

  library()
  {
    //BEFORE::this.client.router.navigateByUrl('/tabs/search');
    this.client.router.navigateByUrl('/tabs/home/search');
  }
  
  showPoemByPoemTypeORSubjectOccassion(id,poem_subject_occassion,type)
  {
    this.queryString = 
    {
      poem_subject_occassion_id:id,
      poem_subject_occassion_nm:poem_subject_occassion,
      poem_or_subject_occassion:type
    };
    //AUTOCOMPLETE RELETED
    Object.entries(this.autocomplete_options).forEach(async (entry) => 
    {
      const [key, value] = entry;
      if('poemtype_or_subjectoccassion'==key)
      {
        this.autocomplete_options[key]='1';
      }
      else if('poemtype_or_subjectoccassion_request'==key)
      {
        this.autocomplete_options[key]=poem_subject_occassion;
      }
      else if('poemtype_or_subjectoccassion_id'==key)
      {
        this.autocomplete_options[key]=id;
      }
      else
      {
        this.autocomplete_options[key]=value;
      }
      //console.log(key, value);
    });
    localStorage.setItem('autocomplete_options',JSON.stringify(this.autocomplete_options));
    //AUTOCOMPLETE RELETED
    localStorage.setItem('choosen_option',JSON.stringify(this.queryString));

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    //BEFORE::this.client.router.navigate(['tabs/sub-list-page'], navigationExtras);
    this.client.router.navigate(['tabs/home/sub-list-page'], navigationExtras);
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

  async searchPoem(form)
  {
    this.searched_text = form.controls.search_text.value;    
    this.queryString = 
    {
      searched_text:this.searched_text
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.searched_text = '';
    //BEFORE::this.client.router.navigate(['tabs/search-result'], navigationExtras);
    this.client.router.navigate(['tabs/home/search-result'], navigationExtras);
  }
  
  showHide()
  {
    this.showAllSubjects = !this.showAllSubjects;
    //console.log(this.showAllSubjects);
  }

  showAllOrRecent(asked)
  {
    let objShowAllOrRecent = 
    {
      selected_option : asked
    }
    localStorage.setItem('show_all_or_recent',JSON.stringify(objShowAllOrRecent));
    //AUTOCOMPLETE RELETED
    Object.entries(this.autocomplete_options).forEach(async (entry) => 
    {
      const [key, value] = entry;
      if('recent_or_all'==key)
      {
        this.autocomplete_options[key]='1';
      }
      else if('recent_or_all_request'==key)
      {
        this.autocomplete_options[key]=asked;
      }
      else
      {
        this.autocomplete_options[key]=value;
      }
      //console.log(key, value);
    });
    localStorage.setItem('autocomplete_options',JSON.stringify(this.autocomplete_options));
    //AUTOCOMPLETE RELETED
    this.client.router.navigate(['tabs/home/library']);
  }

  async ionViewDidEnter()
  {
    //ALTER TABLE
    await this.offline.getData('SELECT FromTableNM FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 1");
      
      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['Poems'];
      let queryToExecute_1 = "UPDATE Poems SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      {
        console.log("Field updated - 1"); 
        //console.log(res);
      }).catch((err) => 
      { 
        console.log(err);
      });
      
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `Poems` ADD `FromTableNM` VARCHAR(255) NOT NULL DEFAULT `Poems`').then(resultAlter => 
      {
        console.log("Field altered - 1");
      },error => 
      {
        //COLUMN CREATING ERROR
        console.log("column created 1 error",error);
      });
      
      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['Poems'];
      let queryToExecute_1 = "UPDATE Poems SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      { 
        console.log("Field altered updated - 1");
      }).catch((err) => 
      { 
        console.log(err);
      });

    });//TO CHECK COLUMN FromTableNM EXISTS IN Poems table if not then add
    
    //ALTER TABLE FOR MP3 STARTS
    await this.offline.getData('SELECT MP3Link FROM Poems LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 1");
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `Poems` ADD `MP3Link` text CHARACTER').then(resultAlter => 
      {
        console.log("Field altered - 1");
      },error => 
      {
        //COLUMN CREATING ERROR
        console.log("column created 1 error",error);
      });
    });//TO CHECK COLUMN MP3Link EXISTS IN Poems table if not then add
    //ALTER TABLE FOR MP3 ENDS

    await this.offline.getData('SELECT FromTableNM FROM bookmarks LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 2");
      
      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['bookmarks'];
      let queryToExecute_1 = "UPDATE bookmarks SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      { 
        console.log("Field updated - 2");
        //console.log(res);
      }).catch((err) => 
      { 
        console.log(err);
      });
    },async (error) => 
    {
      console.log("ERROR-2",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `bookmarks` ADD `FromTableNM` VARCHAR(255) NOT NULL DEFAULT `bookmarks`').then(resultAlter => 
      {
        console.log("Field altered - 2");
      },error => 
      {
        //COLUMN CREATING ERROR
        //console.log("column created 2 error",error);
      });

      //UPDATE ALL COLUMN VALUE WITH DEFAULT
      let idToExecute_1=['bookmarks'];
      let queryToExecute_1 = "UPDATE bookmarks SET FromTableNM = ?";
      await this.offline.updateData(queryToExecute_1,idToExecute_1).then((res) => 
      { 
        console.log("Field altered updated - 2");
      }).catch((err) => 
      { 
        console.log(err);
      });
    });//TO CHECK COLUMN FromTableNM EXISTS IN bookmarks table if not then add    
    
    //ALTER TABLE FOR MP3 STARTS
    await this.offline.getData('SELECT MP3Link FROM bookmarks LIMIT 1',[]).then(async (resultToAlter:any) => 
    {
      console.log("Field exists - 1");
    },async (error) => 
    {
      console.log("ERROR-1",error);
      //NO COLUMN FOUND ADD TO THE TABLE
      await this.offline.alterTable('ALTER TABLE `bookmarks` ADD `MP3Link` VARCHAR(255) NULL').then(resultAlter => 
      {
        console.log("Field altered - 1");
      },error => 
      {
        //COLUMN CREATING ERROR
        console.log("column created 1 error",error);
      });
    });//TO CHECK COLUMN MP3Link EXISTS IN bookmarks table if not then add
    //ALTER TABLE FOR MP3 ENDS
    //ALTER TABLE
  }

  async onSearchChange(event: any) 
  {
    const substring = event.target.value;
    if(substring!="" && substring!=null && substring!=undefined)
    {
      this.is_searched=true;
      this.resultSearchResult=[];
      //LOADER
      const loadingSearch = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingSearch.present();
      //LOADER
      let dataToPost = {
        keyword:substring
      }
      await this.client.searchPoems(dataToPost).then(searchResult => 
      {	
        loadingSearch.dismiss();//DISMISS LOADER
        this.resultSearchResult=searchResult;
        console.log("SEARCH RESULT",this.resultSearchResult);
      },
      error => 
      {
        loadingSearch.dismiss();//DISMISS LOADER
        console.log();
      });
    }
  }//AUTOCOMPLETE RELETED

  cancelSearch()
  {
    this.is_searched=false;
    this.resultSearchResult = [];
  }//AUTOCOMPLETE RELETED

  getPoemsDetail(id)
  {
    this.queryString = 
    {
      poem_id:id
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    //BEFORE::this.client.router.navigate(['tabs/poem-detail'], navigationExtras);
    this.client.router.navigate(['tabs/home/sub-list-page/poem-detail'], navigationExtras);
  }

  async OpenAutoComplete()
  {
    const modal = await this.modalCtrl.create({
			component: SearchAutoCompletePage,
      cssClass: 'advance-search-filter',
      showBackdrop: false,
      swipeToClose:true,
      animated: true
		});
		return await modal.present();
  }
}
