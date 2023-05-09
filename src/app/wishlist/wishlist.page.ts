import { Component, ViewChild } from '@angular/core';
import { LoadingController, ModalController, AlertController, AnimationController, IonContent } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { ProfilePage } from '../profile/profile.page';
import { SearchFiltersBookmarksPage } from '../search-filters-bookmarks/search-filters-bookmarks.page';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-wishlist',
  templateUrl: 'wishlist.page.html',
  styleUrls: ['wishlist.page.scss']
})

export class WishlistPage 
{
  @ViewChild('ionContent') ionContent: IonContent;
  public numberOfRecords:number=0;
  public searched_filters_library:any=[];
  public showAllOrRecent:any=[];
  public resultData:any=[];
  public is_searched_filters_applied: boolean = false;
  public keyword:any='';
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
  public id: any = '';
  public show_in_view: any = 'list';
  public resultDataBookMark: any=[];
  public limitedResultDataBookMark:any = [];
  public queryString: any=[];
  public order:any='desc';
  public is_network_connected:boolean=false;
  constructor(public client: ClientService, public offline: OfflineService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public alertController: AlertController)
  {
    this.client.getObservableWhenOnLine().subscribe((data) => {
      this.is_network_connected = data.is_network_connected; 
    });//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN

    this.client.getObservableWhenClearSearchBookmark().subscribe((dataClearSearch) => 
    {
      this.is_searched_filters_applied=false;
      localStorage.removeItem('searched_filters_bookmarks');
      this.ionViewWillEnter();
      console.log('Search is cleared', dataClearSearch);
    });//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED ON BOOKMARK
  }

  async ionViewWillEnter()
  {
    this.is_network_connected=this.client.is_network_connected;
    this.id = (localStorage.getItem('id')) ? localStorage.getItem('id') : undefined;
    /*
    BELOW PORTION WILL FETCH DATA FROM WEB SERVER AS BECAUSE WE WERE STORING IT ON WEB SERVER BEFORE
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
      user_id:this.id,
      order:this.order,
    }
    await this.client.getBookmarkPoems(objData).then(result => 
    {	
      loadingPoemType.dismiss();//DISMISS LOADER
      this.resultDataBookMark=result;      
      console.log(this.resultDataBookMark);
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    }); 
    BELOW PORTION WILL FETCH DATA FROM WEB SERVER AS BECAUSE WE WERE STORING IT ON WEB SERVER BEFORE
    */
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

    await this.offline.getBookmarks().then(result => 
    {
      console.log("1",result);
      loading.dismiss();//DISMISS LOADER
      this.resultDataBookMark=result; 
      this.limitedResultDataBookMark=[];
      if(this.resultDataBookMark.length > 0)
      {
        for(let p = 0 ; p < this.resultDataBookMark.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultDataBookMark[p]['id'],
            PoemName:this.resultDataBookMark[p]['PoemName'],
            colorCode:this.resultDataBookMark[p]['colorCode'],
            LanguageName:this.resultDataBookMark[p]['LanguageName'],
            ReciterName:this.resultDataBookMark[p]['ReciterName'],
            PoetName:this.resultDataBookMark[p]['PoetName'],
            FromTableNM:this.resultDataBookMark[p]['FromTableNM'],
            MP3Link:this.resultDataBookMark[p]['MP3Link'],
          }
          this.limitedResultDataBookMark.push(objPoemLimited);
        }
        console.log("2",this.limitedResultDataBookMark);
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });
  }

  async changeOrder(order)
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
    this.ionViewWillEnter();
    
  }
  
  async searchWithAdvanceFilters(advanceSearchObj:any)
  {
    //IF ALREADY SEARCHED FOUNDS
    this.searched_filters_library = JSON.parse(localStorage.getItem('searched_filters_bookmarks'));    
    this.is_searched_filters_applied=false;
    if(this.searched_filters_library)
    {
      this.is_searched_filters_applied=true;
    }
    //IF ALREADY SEARCHED FOUNDS
    let queryToExecute = "SELECT * FROM bookmarks WHERE 1 = 1 ";
    if(advanceSearchObj.selectedPoemType!="")
    {
      //queryToExecute += " AND PoemTypeID = "+advanceSearchObj.selectedPoemType+" ";
      queryToExecute += " AND PoemTypeID IN ("+advanceSearchObj.selectedPoemType+") ";
    }
    if(advanceSearchObj.selectedSubjectOccassion!="")
    {
      //queryToExecute += " AND SubjectID = "+advanceSearchObj.selectedSubjectOccassion+" ";
      queryToExecute += " AND SubjectID IN ("+advanceSearchObj.selectedSubjectOccassion+") ";
    }
    if(advanceSearchObj.selectedLanguage!="")
    {
      //queryToExecute += " AND LanguageID = "+advanceSearchObj.selectedLanguage+" ";
      queryToExecute += " AND LanguageID IN ("+advanceSearchObj.selectedLanguage+") ";
    }
    if(advanceSearchObj.selectedReciters!="")
    {
      //queryToExecute += " AND ReciterID = "+advanceSearchObj.selectedReciters+" ";
      queryToExecute += " AND ReciterID IN ("+advanceSearchObj.selectedReciters+") ";
    }
    if(advanceSearchObj.selectedPoets!="")
    {
      queryToExecute += " AND PoetID IN ("+advanceSearchObj.selectedPoets+") ";
    }
    if(advanceSearchObj.translated!="")
    {
      queryToExecute += " AND TranslatedText = "+advanceSearchObj.translated+" ";
    }
    
    this.resultDataBookMark=[];
    await this.offline.getBookmarksWithSearch(queryToExecute,[]).then(result => 
    {
      this.resultDataBookMark=result; 
      this.limitedResultDataBookMark=[];
      if(this.resultDataBookMark.length > 0)
      {
        for(let p = 0 ; p < this.resultDataBookMark.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultDataBookMark[p]['id'],
            PoemName:this.resultDataBookMark[p]['PoemName'],
            colorCode:this.resultDataBookMark[p]['colorCode'],
            LanguageName:this.resultDataBookMark[p]['LanguageName'],
            ReciterName:this.resultDataBookMark[p]['ReciterName'],
            PoetName:this.resultDataBookMark[p]['PoetName'],
            FromTableNM:this.resultDataBookMark[p]['FromTableNM'],
            MP3Link:this.resultDataBookMark[p]['MP3Link'],
          }
          this.limitedResultDataBookMark.push(objPoemLimited);
        }
        console.log("2",this.limitedResultDataBookMark);
      }
    },
    error => 
    {
      console.log(error);
    });
  }

  async OpenAdvanceFilter()
  {
    const modal = await this.modalCtrl.create({
			component: SearchFiltersBookmarksPage,
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
        keyword:this.keyword,
        order:this.order,
        selectedLanguage:selectedLanguage,
        selectedPoets:selectedPoets,
        selectedReciters:selectedReciters,
        selectedPoemType:selectedPoemType,
        selectedSubjectOccassion:selectedSubjectOccassion,
        translated:translated
      };
      if(localStorage.getItem('searched_filters_bookmarks'))
      {
        this.searchWithAdvanceFilters(advanceSearchObj);
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
  
  getPoemsDetailBefore(id)
  {
    this.queryString = 
    {
      poem_id:id,
      from_page:'wishlist'
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/wishlist/poem-detail'], navigationExtras);
  }

  getPoemsDetail(arrayIndex)
  {
    let offLinePoem = [];
    offLinePoem = this.resultDataBookMark[arrayIndex];
    localStorage.setItem('read_offline_poem',JSON.stringify(offLinePoem));
    this.client.router.navigate(['/tabs/wishlist/offline-poem-detail']);
  }

  async ConfirmRemovingFromBookMark(poem_id,FromTableNM)
  {
    let messageToRemove = (FromTableNM == "Poems") ? "Are you sure you want to remove this from Offline Poems?" : "Are you sure you want to remove this from Bookmarked Poems?";
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please confirm:',
      message: messageToRemove,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => 
          {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'YES',
          handler: () => 
          {
            this.RemoveBookmark(poem_id,FromTableNM);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async RemoveBookmark(poem_id,FromTableNM)
  {
    if(FromTableNM == "Poems")
    {
      await this.offline.deleteData(poem_id).then(result => 
      {
        //this.client.showMessage("Poem is removed from offline!");
        this.ionViewWillEnter();      
      });
    }
    if(FromTableNM == "bookmarks")
    {
      await this.offline.deleteBookmarkData(poem_id).then(result => 
      {
        //this.client.showMessage("Poem is removed from bookmark!");
        this.ionViewWillEnter();      
      });
    }
    
  }
}
