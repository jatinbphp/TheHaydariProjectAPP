import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, LoadingController, AnimationController, IonContent } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page'
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { ClientService } from '../providers/client.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { SearchFiltersPage } from '../search-filters/search-filters.page';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { MediaControlsService } from '../providers/media-controls.service';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Qbyte } from '../models/qbyte.interface';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Observable } from 'rxjs';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP

@Component({
  selector: 'app-sub-list-page',
  templateUrl: './sub-list-page.page.html',
  styleUrls: ['./sub-list-page.page.scss'],
})

export class SubListPagePage implements OnInit 
{
  @ViewChild('ionContent') ionContent: IonContent;
  public WelcomeText: any = null;
  public MP3Link:string='';
  public queryString: any=[];
  public queryStringData: any=[];
  public searched_filters:any=[];
  public is_searched_filters_applied:boolean=false;
  public show_in_view: any = 'list';
  public poem_subject_occassion_id:any = '';
  public poem_subject_occassion_nm:any = '';
  public poem_or_subject_occassion:any = '';
  public resultPoemsByTypeORSubject:any=[];
  public order:any='desc';
  public is_search_icon_clicked:boolean=false;
  public is_searched:boolean=false;
  public searched_text:any='';
  //ANIMATION FOR SearchFiltersPage
  /*OPTION-1* STARTS*/
  public EnterModalAnimation_1 = (baseEl: HTMLElement) => {
    const AnimationC = new AnimationController;
    const baseAnimation = AnimationC.create();
    const backdropAnimation = AnimationC.create();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = AnimationC.create();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'))
    .keyframes([
      { offset: 0, opacity: '0', transform: 'translateX(0%)' },
      { offset: 1, opacity: '0.99', transform: 'translateX(0%)' }
    ]);
    backdropAnimation.fromTo('opacity', 0.01, 0.8);
    return baseAnimation
        .addElement(baseEl)
        .easing('ease-in-out')
        .duration(500)
        .beforeAddClass('show-modal')
        .addAnimation([backdropAnimation, wrapperAnimation])
  }
  public LeaveModalAnimation_1 = (baseEl: HTMLElement) => {
    return this.EnterModalAnimation_1(baseEl).duration(600).direction('reverse');
  }
  /*OPTION-1* ENDS*/
  /*OPTION-2* STARTS*/
  public EnterModalAnimation_2 = (baseEl: HTMLElement) => {
    const AnimationC = new AnimationController;
    const baseAnimation = AnimationC.create();
    const backdropAnimation = AnimationC.create();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = AnimationC.create();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation
    .fromTo(
      'transform',
      'scaleX(0.1) scaleY(0.1)',
      'translateX(0%) scaleX(1) scaleY(1)'
    )
    .fromTo('opacity', 0, 1);
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .addAnimation(backdropAnimation)
        .addAnimation(wrapperAnimation)
    
  }
  public LeaveModalAnimation_2 = (baseEl: HTMLElement) => {
    return this.EnterModalAnimation_2(baseEl).duration(600).direction('reverse');
  }
  /*OPTION-2* ENDS*/
  /*OPTION-3* STARTS*/
  public EnterModalAnimation_3 = (baseEl: HTMLElement) => {
    const AnimationC = new AnimationController;
    const baseAnimation = AnimationC.create();
    const backdropAnimation = AnimationC.create();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    const wrapperAnimation = AnimationC.create();
    wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));
    wrapperAnimation
    .fromTo(
      'transform',
      'translateX(100%)',
      'translateX(0)'
    )
    .fromTo('opacity', 0, 1);
    backdropAnimation.fromTo('opacity', 0.01, 0.4);
    return baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(.1, .7, .1, 1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .addAnimation(backdropAnimation)
        .addAnimation(wrapperAnimation)
    
  }
  public LeaveModalAnimation_3 = (baseEl: HTMLElement) => {
    return this.EnterModalAnimation_3(baseEl).duration(600).direction('reverse');
  }
  /*OPTION-3* ENDS*/
  //ANIMATION FOR SearchFiltersPage 
  public resultPoemsDetail:any=[];//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public qbytes$: Observable<Qbyte[]>;//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public is_audio_played:boolean=false;//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  public autocomplete_options:any=[];//AUTOCOMPLETE RELETED
  constructor(public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private route: ActivatedRoute, private router: Router, private readonly mediaControllerService: MediaControlsService)
  { 
    this.client.getObservableWhenLogin().subscribe((data) => 
    {
      this.WelcomeText = this.client.WelcomeText;
    });//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN

    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.client.getObservableWhenAudioPlayed().subscribe((data) => {
      this.resultPoemsDetail = data.music_object; 
      this.qbytes$ = this.resultPoemsDetail;
      this.is_audio_played = data.is_audio_played; 
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP

    localStorage.removeItem('searched_filters');
    this.keyboard.hideFormAccessoryBar(false);
    this.client.getObservableWhenClearSearch().subscribe((dataClearSearch) => 
    {
      this.is_searched_filters_applied=false;
      localStorage.removeItem('searched_filters');
      this.shoeHomeContent();
      console.log('Search is cleared', dataClearSearch);
    });//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED
    this.client.getObservableWhenPoemTypeClickedFromMenu().subscribe(async (data) => 
    {
      console.log(data);
      this.poem_subject_occassion_id=data.poem_subject_occassion_id;
      this.poem_subject_occassion_nm=data.poem_subject_occassion_nm.replace("/ ", "/");
      this.poem_or_subject_occassion=data.poem_or_subject_occassion;
      this.resultPoemsByTypeORSubject = [];
      /*POEM TYPE*/
      //LOADER
      const loadingPoemType = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemType.present();
      //LOADER
      if(this.poem_or_subject_occassion=="by_poem_type")
      {
        let objData = 
        {
          poem_subject_occassion_id:this.poem_subject_occassion_id,
          order:this.order,
          searched_text:this.searched_text,//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedLanguage:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedPoets:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedReciters:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedPoemType:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedSubjectOccassion:''//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        }
        await this.client.getPoemsByPoemType(objData).then(result => 
        {	
          loadingPoemType.dismiss();//DISMISS LOADER
          this.resultPoemsByTypeORSubject=result;      
          console.log(this.resultPoemsByTypeORSubject);
        },
        error => 
        {
          loadingPoemType.dismiss();//DISMISS LOADER
          console.log();
        });
      }
      if(this.poem_or_subject_occassion=="by_subject_occassion")
      {
        let objData = 
        {
          poem_subject_occassion_id:this.poem_subject_occassion_id,
          order:this.order,
          searched_text:this.searched_text,//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedLanguage:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedPoets:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedReciters:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedPoemType:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
          selectedSubjectOccassion:''//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        }
        await this.client.getPoemsBySubject(objData).then(result => 
        {	
          loadingPoemType.dismiss();//DISMISS LOADER
          this.resultPoemsByTypeORSubject=result;      
          console.log(this.resultPoemsByTypeORSubject);
        },
        error => 
        {
          loadingPoemType.dismiss();//DISMISS LOADER
          console.log();
        });
      }
      /*POEM TYPE*/
    });//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU
  }

  ngOnInit()
  { 
    this.WelcomeText = (localStorage.getItem("firstname") != null && localStorage.getItem("firstname") != undefined) ? localStorage.getItem("firstname") : null;
		if(this.WelcomeText!=null)
    {
      this.WelcomeText = this.WelcomeText.substring(0,1);
    }
    this.shoeHomeContent();
  }
  
  async ionViewWillEnter()
  { 
    //AUTOCOMPLETE RELETED
    this.autocomplete_options=(localStorage.getItem('autocomplete_options')) ? localStorage.getItem('autocomplete_options') : null;
    if(this.autocomplete_options!=null)
    {
      this.autocomplete_options=JSON.parse(this.autocomplete_options);
    }
    console.log(this.autocomplete_options);
    //AUTOCOMPLETE RELETED
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.is_audio_played=(localStorage.getItem('is_audio_played')) ? Boolean(localStorage.getItem('is_audio_played')) : this.is_audio_played;
    let current_playing_audio : any = localStorage.getItem('current_playing_audio');
    this.resultPoemsDetail=JSON.parse(current_playing_audio);
    this.qbytes$=this.resultPoemsDetail;
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.MP3Link = localStorage.getItem('MP3LinkComponent');
  }

  playAudio(ev:any)
  { 
    this.client.publishSomeDataWhenAudioPlayed({
      music_object : this.resultPoemsDetail,
      is_audio_played:true
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT 
    this.mediaControllerService.playPause(this.resultPoemsDetail);
  }

  async shoeHomeContent()
  {
    this.searched_text='';
    this.is_searched=false;
    this.poem_subject_occassion_id='';
    this.poem_subject_occassion_nm='';
    this.poem_or_subject_occassion='';
    this.resultPoemsByTypeORSubject = [];
    
    this.route.queryParams.subscribe(params => 
    {
      if(params && params.special)
      {
        this.queryStringData = JSON.parse(params.special);        
      }
    });
    
    this.poem_subject_occassion_id=this.queryStringData['poem_subject_occassion_id'];
    this.poem_subject_occassion_nm=this.queryStringData['poem_subject_occassion_nm'].replace("<br>", "");
    this.poem_or_subject_occassion=this.queryStringData['poem_or_subject_occassion'];

    //IF ALREADY SEARCHED FOUNDS
    this.searched_filters=[];
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));    
    //IF ALREADY SEARCHED FOUNDS

    /*POEM TYPE*/
    //LOADER
		const loadingPoemType = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingPoemType.present();
		//LOADER
    if(this.poem_or_subject_occassion=="by_poem_type")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:this.searched_text,//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedLanguage:(this.searched_filters && this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoets:(this.searched_filters && this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedReciters:(this.searched_filters && this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoemType:(this.searched_filters && this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedSubjectOccassion:(this.searched_filters && this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        translated:(this.searched_filters && this.searched_filters['translated']) ? this.searched_filters['translated'] : ""//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        
      }
      await this.client.getPoemsByPoemType(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(this.poem_or_subject_occassion=="by_subject_occassion")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:this.searched_text,//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedLanguage:(this.searched_filters && this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoets:(this.searched_filters && this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedReciters:(this.searched_filters && this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoemType:(this.searched_filters && this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedSubjectOccassion:(this.searched_filters && this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        translated:(this.searched_filters && this.searched_filters['translated']) ? this.searched_filters['translated'] : ""//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      }
      await this.client.getPoemsBySubject(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    /*POEM TYPE*/
  }

  showGridView()
  {
    this.show_in_view='grid';
  }

  showListView()
  {
    this.show_in_view='list';
  }

  async showSubjectOccasionDetail()
  {
    const modal = await this.modalCtrl.create({
			component: SubjectOccasionDetailPage,
      cssClass: 'subject-occassion-detail',
      showBackdrop: false,
			componentProps: 
			{ 
        id: 1
			}
		});

		return await modal.present();
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

  async changeOrder(order,poem_or_subject_occassion)
  {
    //this.order = order;
    if(order=="desc")
    {
      this.order="asc";
    }
    if(order=="asc")
    {
      this.order="desc";
    }
    console.log(this.order);
    //IF ALREADY SEARCHED FOUNDS
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));
    //IF ALREADY SEARCHED FOUNDS
    if(poem_or_subject_occassion=="by_poem_type")
    {
      //LOADER
      const loadingPoemType = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemType.present();
      //LOADER

      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:this.searched_text,
        selectedLanguage:(this.searched_filters && this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoets:(this.searched_filters && this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedReciters:(this.searched_filters && this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoemType:(this.searched_filters && this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedSubjectOccassion:(this.searched_filters && this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        translated:(this.searched_filters && this.searched_filters['translated']) ? this.searched_filters['translated'] : ""//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      }
      await this.client.getPoemsByPoemType(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(poem_or_subject_occassion=="by_subject_occassion")
    {
      //LOADER
      const loadingPoemType = await this.loadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await loadingPoemType.present();
      //LOADER

      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:this.searched_text,
        selectedLanguage:(this.searched_filters && this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoets:(this.searched_filters && this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedReciters:(this.searched_filters && this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoemType:(this.searched_filters && this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedSubjectOccassion:(this.searched_filters && this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        translated:(this.searched_filters && this.searched_filters['translated']) ? this.searched_filters['translated'] : ""//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      }
      await this.client.getPoemsBySubject(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
  }
  
  showHideSearchBar()
  {
    this.is_search_icon_clicked = !this.is_search_icon_clicked;    
  }

  async searchPoem(form)
  {
    let searched_text = form.controls.search_text.value; 
    this.searched_text = (searched_text) ? searched_text : '';   
    this.is_searched = true;
    this.resultPoemsByTypeORSubject=[];
    /*POEM TYPE*/
    //LOADER
		const loadingPoemType = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingPoemType.present();
		//LOADER
    if(this.poem_or_subject_occassion=="by_poem_type")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:searched_text,
        selectedLanguage:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoets:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedReciters:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoemType:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedSubjectOccassion:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        translated:''//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      }
      await this.client.getPoemsByPoemType(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    if(this.poem_or_subject_occassion=="by_subject_occassion")
    {
      let objData = 
      {
        poem_subject_occassion_id:this.poem_subject_occassion_id,
        order:this.order,
        searched_text:searched_text,
        selectedLanguage:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoets:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedReciters:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedPoemType:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        selectedSubjectOccassion:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
        translated:''//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      }
      await this.client.getPoemsBySubject(objData).then(result => 
      {	
        loadingPoemType.dismiss();//DISMISS LOADER
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        loadingPoemType.dismiss();//DISMISS LOADER
        console.log();
      });
    }
    /*POEM TYPE*/
  }

  resetSearch()
  {
    this.searched_text='';
    this.is_searched=false;
    this.shoeHomeContent();
  }

  ionViewDidLeave()
  {
    this.searched_text='';
    this.is_searched=false;
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
  }

  async OpenAdvanceFilter()
  {
    const modal = await this.modalCtrl.create({
			component: SearchFiltersPage,
      cssClass: 'advance-search-filter',
      showBackdrop: false,
      swipeToClose:true,
      animated: true,
      enterAnimation: this.EnterModalAnimation_3,
      leaveAnimation: this.LeaveModalAnimation_3,
			componentProps: 
			{ 
        poem_or_subject_occassion:this.poem_or_subject_occassion,
        poem_subject_occassion_id:this.poem_subject_occassion_id
			}
		});

    modal.onDidDismiss().then((data) => 
		{
      let poem_or_subject_occassion = data.data.searched.poem_or_subject_occassion;
      let poem_subject_occassion_id = data.data.searched.poem_subject_occassion_id;
      let selectedLanguage = data.data.searched.selectedLanguage;
      let selectedPoets = data.data.searched.selectedPoets;
      let selectedReciters = data.data.searched.selectedReciters;
      let selectedPoemType = data.data.searched.selectedPoemType;
      let selectedSubjectOccassion = data.data.searched.selectedSubjectOccassion;
      let translated = data.data.searched.translated;
      let advanceSearchObj = {};
      if(poem_or_subject_occassion=="by_poem_type")
      {
        advanceSearchObj = 
        {
          searched_text:this.searched_text,
          order:this.order,
          poem_or_subject_occassion:poem_or_subject_occassion,
          poem_subject_occassion_id:poem_subject_occassion_id,
          selectedLanguage:selectedLanguage,
          selectedPoets:selectedPoets,
          selectedReciters:selectedReciters,
          selectedPoemType:selectedPoemType,
          selectedSubjectOccassion:selectedSubjectOccassion,
          translated:translated
        }
      }
      if(poem_or_subject_occassion=="by_subject_occassion")
      {
        advanceSearchObj = 
        {
          searched_text:this.searched_text,
          order:this.order,
          poem_or_subject_occassion:poem_or_subject_occassion,
          poem_subject_occassion_id:poem_subject_occassion_id,
          selectedLanguage:selectedLanguage,
          selectedPoets:selectedPoets,
          selectedReciters:selectedReciters,
          selectedPoemType:selectedPoemType,
          selectedSubjectOccassion:selectedSubjectOccassion,
          translated:translated
        }
      }
      if(localStorage.getItem('searched_filters'))
      {
        this.searchWithAdvanceFilters(advanceSearchObj);
      }
      //console.log(advanceSearchObj);
    });
		return await modal.present();
  }

  async searchWithAdvanceFilters(advanceSearchObj)
  {
    //IF ALREADY SEARCHED FOUNDS
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));    
    console.log(this.searched_filters);
    this.is_searched_filters_applied=false;
    if(this.searched_filters && this.searched_filters['poem_or_subject_occassion']!='')
    {
      this.is_searched_filters_applied=true;
    }
    console.log("is_searched_filters_applied",this.is_searched_filters_applied);
    //IF ALREADY SEARCHED FOUNDS
    
    this.resultPoemsByTypeORSubject=[];
    if(advanceSearchObj.poem_or_subject_occassion=="by_poem_type")
    {
      await this.client.getPoemsByPoemType(advanceSearchObj).then(result => 
      {	
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        console.log();
      });
    }
    if(advanceSearchObj.poem_or_subject_occassion=="by_subject_occassion")
    {
      await this.client.getPoemsBySubject(advanceSearchObj).then(result => 
      {	
        this.resultPoemsByTypeORSubject=result;      
        console.log(this.resultPoemsByTypeORSubject);
      },
      error => 
      {
        console.log();
      });
    }
  }

  doRefresh(ev)
  {
    setTimeout(() => 
    {
      this.shoeHomeContent();
      ev.target.complete();
    }, 2000);
  }
}
