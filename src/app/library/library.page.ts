import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController, AnimationController, IonContent } from '@ionic/angular';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';
import { NavigationExtras } from "@angular/router";
import { SearchFiltersAllRecentPage } from '../search-filters-all-recent/search-filters-all-recent.page';
import { MediaControlsService } from '../providers/media-controls.service';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Qbyte } from '../models/qbyte.interface';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
import { Observable } from 'rxjs';//THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit 
{
  @ViewChild('ionContent') ionContent: IonContent;
  
  public queryString: any=[];
  public showAllOrRecent:any=[];
  public resultData:any=[];
  public showingOfResult:any='';
  public numberOfRecords:number=0;
  public order_for_all:any='asc';
  public order_for_recent:any='desc';
  public order:any='';
  public keyword:any='';
  public is_searched:boolean=false;
  public show_in_view: any = 'list';
  public is_searched_filters_applied: boolean = false;
  public searched_filters_library:any=[];
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
  constructor(public client: ClientService, private router: Router, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private readonly mediaControllerService: MediaControlsService)
  { 
    localStorage.removeItem('searched_filters_all_recent');
    this.client.getObservableWhenClearSearch().subscribe((dataClearSearch) => 
    {
      this.is_searched_filters_applied=false;
      localStorage.removeItem('searched_filters_all_recent');
      this.shoeHomeContent();
      console.log('Search is cleared', dataClearSearch);
    });//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED

    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
    this.client.getObservableWhenAudioPlayed().subscribe((data) => {
      this.resultPoemsDetail = data.music_object; 
      this.qbytes$ = this.resultPoemsDetail;
      this.is_audio_played = data.is_audio_played; 
    });//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
    //THIS PORTION IS USED FOR PLAYING AUDIO THROUGH THE APP
  }

  ngOnInit()
  { 
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
  }

  async shoeHomeContent()
  {
    this.keyword='';
    this.resultData=[];
    //IF ALREADY SEARCHED FOUNDS
    this.searched_filters_library=[];
    this.searched_filters_library = JSON.parse(localStorage.getItem('searched_filters_all_recent'));   
    console.log("1",this.searched_filters_library);
    //IF ALREADY SEARCHED FOUNDS

    this.showAllOrRecent = localStorage.getItem('show_all_or_recent');
    this.showAllOrRecent = (this.showAllOrRecent) ? JSON.parse(this.showAllOrRecent) : [];
    this.showingOfResult = (this.showAllOrRecent['selected_option']=='all') ? "All Poems" : "Recently Added";
    this.order = (this.showAllOrRecent['selected_option']=='all') ? "asc" : "desc";
    //LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    let data = {
      filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
      order:this.order,
      keyword:this.keyword,
      selectedLanguage:(this.searched_filters_library && this.searched_filters_library['selectedLanguage']) ? this.searched_filters_library['selectedLanguage'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedPoets:(this.searched_filters_library && this.searched_filters_library['selectedPoets']) ? this.searched_filters_library['selectedPoets'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedReciters:(this.searched_filters_library && this.searched_filters_library['selectedReciters']) ? this.searched_filters_library['selectedReciters'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedPoemType:(this.searched_filters_library && this.searched_filters_library['selectedPoemType']) ? this.searched_filters_library['selectedPoemType'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedSubjectOccassion:(this.searched_filters_library && this.searched_filters_library['selectedSubjectOccassion']) ? this.searched_filters_library['selectedSubjectOccassion'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      translated:(this.searched_filters_library && this.searched_filters_library['translated']) ? this.searched_filters_library['translated'] : ""//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
    }
    console.log("2",data);
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];      
      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  showGridView()
  {
    this.show_in_view='grid';
  }

  showListView()
  {
    this.show_in_view='list';
  }

  async changeOrder(order)
  {
    if(order=="desc")
    {
      this.order="asc";
    }
    if(order=="asc")
    {
      this.order="desc";
    }
    console.log(this.order);
    this.resultData=[];
    //LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    let data = {
      filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
      order:this.order,
      keyword:this.keyword,
      selectedLanguage:(this.searched_filters_library && this.searched_filters_library['selectedLanguage']) ? this.searched_filters_library['selectedLanguage'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedPoets:(this.searched_filters_library && this.searched_filters_library['selectedPoets']) ? this.searched_filters_library['selectedPoets'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedReciters:(this.searched_filters_library && this.searched_filters_library['selectedReciters']) ? this.searched_filters_library['selectedReciters'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedPoemType:(this.searched_filters_library && this.searched_filters_library['selectedPoemType']) ? this.searched_filters_library['selectedPoemType'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedSubjectOccassion:(this.searched_filters_library && this.searched_filters_library['selectedSubjectOccassion']) ? this.searched_filters_library['selectedSubjectOccassion'].split(",") : "",//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      translated:(this.searched_filters_library && this.searched_filters_library['translated']) ? this.searched_filters_library['translated'] : ""//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
    }
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];      
      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
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
    this.client.router.navigate(['tabs/home/library/poem-detail'], navigationExtras);
  }

  async searchPoem(form)
  {
    this.keyword = form.controls.keyword.value;
    this.is_searched = true;
    this.resultData=[];
    //LOADER
		const loading = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    let data = {
      filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
      order:this.order,
      keyword:this.keyword,
      selectedLanguage:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedPoets:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedReciters:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedPoemType:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      selectedSubjectOccassion:'',//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
      translated:''//FORCED TO BE ADDED BECAUSE OF ADVANCE SEARCHC
    }
    
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];      
      
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  resetSearch()
  {
    this.keyword = '';
    this.is_searched = false;
    this.shoeHomeContent();
  }

  ionViewDidLeave()
  {
    this.keyword='';
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
			component: SearchFiltersAllRecentPage,
      cssClass: 'advance-search-filter',
      showBackdrop: false,
      swipeToClose:true,
      animated: true,
      enterAnimation: this.EnterModalAnimation_3,
      leaveAnimation: this.LeaveModalAnimation_3,
		});

    modal.onDidDismiss().then((data) => 
		{
      let selected_search_by = data.data.searched.selected_search_by;
      let selectedLanguage = data.data.searched.selectedLanguage;
      let selectedPoets = data.data.searched.selectedPoets;
      let selectedReciters = data.data.searched.selectedReciters;
      let selectedPoemType = data.data.searched.selectedPoemType;
      let selectedSubjectOccassion = data.data.searched.selectedSubjectOccassion;
      let translated = data.data.searched.translated;
      let advanceSearchObj = {
        selected_search_by:selected_search_by,
        filterType:this.showAllOrRecent['selected_option'].toUpperCase(),
        keyword:this.keyword,
        order:this.order,
        selectedLanguage:selectedLanguage,
        selectedPoets:selectedPoets,
        selectedReciters:selectedReciters,
        selectedPoemType:selectedPoemType,
        selectedSubjectOccassion:selectedSubjectOccassion,
        translated:translated
      };
      if(localStorage.getItem('searched_filters_all_recent'))
      {
        this.searchWithAdvanceFilters(advanceSearchObj);
      }
    });
		return await modal.present();
  }

  async searchWithAdvanceFilters(advanceSearchObj:any)
  {
    //IF ALREADY SEARCHED FOUNDS
    this.searched_filters_library = JSON.parse(localStorage.getItem('searched_filters_all_recent'));    
    this.is_searched_filters_applied=false;
    if(this.searched_filters_library)
    {
      this.is_searched_filters_applied=true;
    }
    //IF ALREADY SEARCHED FOUNDS
    
    this.resultData=[];
    await this.client.getAllOrRecentRequested(advanceSearchObj).then(result => 
    {	
      this.resultData=result['poemsData'];  
      this.numberOfRecords=result['totalPoems'];
      console.log(this.resultData);
    },
    error => 
    {
      console.log();
    });
  }

  doRefresh(ev)
  {
    setTimeout(() => 
    {
      this.shoeHomeContent();
      ev.target.complete();
    }, 2000);
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
