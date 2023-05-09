import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-filters-bookmarks',
  templateUrl: './search-filters-bookmarks.page.html',
  styleUrls: ['./search-filters-bookmarks.page.scss'],
})
export class SearchFiltersBookmarksPage implements OnInit 
{

  public resultSubjectOccasion:any=[];
  public resultSubjectOccasionOFFLine:any=[];

  public resultReciters:any=[];
  public resultRecitersOFFLine:any=[];

  public resultPoets:any=[];
  public resultPoetsOFFLine:any=[];

  public resultLanguages:any=[];
  public resultLanguagesOFFLine:any=[];

  public resultPoemTypes:any=[];
  public resultPoemTypesOFFLine:any=[];

  public selectedPoemType:any=[];
  public selectedSubjectOccassion:any=[];
  public selectedLanguage:any=[];
  public selectedReciters:any=[];
  public selectedPoets:any=[];

  public searched_filters:any=[];
  public selected_search_by:any='';
  public search_with_subject_occassion: boolean = false;
  public search_with_poem_type: boolean = false;
  public is_anything_have_been_searched: boolean = false;

  public loginForm = this.fb.group({
		selected_search_by:[''],
    subject_occassion: [''],
		poem_type: [''],
    languages: [''],
    reciters: [''],
    poets: [''],
    translated: [''],
	});
  validation_messages = 
  {    
    'subject_occassion': 
    [
      { type: 'required', message: 'Selecting subject/occassion is required.' }
    ],
    'poem_type': 
    [
      { type: 'required', message: 'Selecting poem type is required.' }
    ]
  };
  constructor(public fb: FormBuilder, public offline: OfflineService, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
  { }

  async ngOnInit()
  { 
    //INITILIZE SEARCH FIELDS
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters_bookmarks'));
    if(this.searched_filters)
    {
      this.is_anything_have_been_searched=true;
      let translated = (this.searched_filters['translated']) ? this.searched_filters['translated'] : "";
      this.loginForm.controls['translated'].setValue(translated);

      let selected_search_by = (this.searched_filters['selected_search_by']) ? this.searched_filters['selected_search_by'] : "";
      if(selected_search_by=="by_poem_type")
      {
        this.loginForm.controls['selected_search_by'].setValue("by_poem_type");
        this.selected_search_by="by_poem_type";
        this.search_with_poem_type=true;
        this.search_with_subject_occassion=false;
      }
      if(selected_search_by=="by_subject_occassion")
      {
        this.loginForm.controls['selected_search_by'].setValue("by_subject_occassion");
        this.selected_search_by="by_subject_occassion";
        this.search_with_poem_type=false;
        this.search_with_subject_occassion=true;
      }
    }
    console.log("SEARCHED FILTERS",this.searched_filters);
    //INITILIZE SEARCH FIELDS

    /*POEM TYPE*/
    //LOADER
    /*
		const loadingPoemType = await this.loadingCtrl.create({
			spinner: null,
			//duration: 5000,
			message: 'Please wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loadingPoemType.present();
		*/
    //LOADER
    this.resultPoemTypesOFFLine=[];
    await this.offline.getData('SELECT * FROM poemtypes',[]).then(result => 
    {
      this.resultPoemTypesOFFLine=result;
      this.resultPoemTypes=[];
      if(this.resultPoemTypesOFFLine.rows.length > 0)
      {
        for(let p = 0; p < this.resultPoemTypesOFFLine.rows.length; p ++)
        {
          let objectOFFLineRecord_1 = 
          {
            id:this.resultPoemTypesOFFLine.rows.item(p).id,
            PoemTypeName:this.resultPoemTypesOFFLine.rows.item(p).PoemTypeName,
            Image:this.resultPoemTypesOFFLine.rows.item(p).Image,
            colorCode:this.resultPoemTypesOFFLine.rows.item(p).colorCode,
            isActive:this.resultPoemTypesOFFLine.rows.item(p).isActive,
          }
          this.resultPoemTypes.push(objectOFFLineRecord_1);
        }
      }
      if(this.searched_filters)
      {
        let selectedPoemType = (this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "";
        this.loginForm.controls['poem_type'].setValue(selectedPoemType);
      }//INITILIZE SEARCH FIELDS
    },error => 
    {
      //loadingPoemType.dismiss();//DISMISS LOADER
      console.log(error);
    });    
    /*POEM TYPE*/
    /*SUBJECT/OCCASION*/    
    this.resultSubjectOccasionOFFLine=[];
    await this.offline.getData('SELECT * FROM subjectoccassion',[]).then(result => 
    {
      this.resultSubjectOccasionOFFLine=result;
      this.resultSubjectOccasion=[];      
      if(this.resultSubjectOccasionOFFLine.rows.length > 0)
      {
        for(let s = 0; s < this.resultSubjectOccasionOFFLine.rows.length; s ++)
        {
          let objectOFFLineRecord_2 = 
          {
            id:this.resultSubjectOccasionOFFLine.rows.item(s).id,
            subjectName:this.resultSubjectOccasionOFFLine.rows.item(s).subjectName            
          }
          this.resultSubjectOccasion.push(objectOFFLineRecord_2);
        }
      }
      if(this.searched_filters)
      {
        let selectedSubjectOccassion = (this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "";
        this.loginForm.controls['subject_occassion'].setValue(selectedSubjectOccassion);
      }//INITILIZE SEARCH FIELDS
    },error => 
    {
      //loadingPoemType.dismiss();//DISMISS LOADER
      console.log(error);
    });    
    /*SUBJECT/OCCASION*/
    /*RECIETERS*/
    this.resultRecitersOFFLine=[];
    await this.offline.getData('SELECT * FROM reciters',[]).then(result => 
    {
      this.resultRecitersOFFLine=result;
      this.resultReciters=[];
      if(this.resultRecitersOFFLine.rows.length > 0)
      {
        for(let r = 0; r < this.resultRecitersOFFLine.rows.length; r ++)
        {
          let objectOFFLineRecord_3 = 
          {
            id:this.resultRecitersOFFLine.rows.item(r).id,
            ReciterName:this.resultRecitersOFFLine.rows.item(r).ReciterName            
          }
          this.resultReciters.push(objectOFFLineRecord_3);
        }
      }
      if(this.searched_filters)
      {
        let selectedReciters = (this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "";
        this.loginForm.controls['reciters'].setValue(selectedReciters);
      }//INITILIZE SEARCH FIELDS
    },error => 
    {
      //loadingPoemType.dismiss();//DISMISS LOADER
      console.log(error);
    });    
    /*RECIETERS*/
    /*POETS*/
    this.resultPoetsOFFLine=[];
    await this.offline.getData('SELECT * FROM poets',[]).then(result => 
    {
      this.resultPoetsOFFLine=result;  
      this.resultPoets=[];    
      if(this.resultPoetsOFFLine.rows.length > 0)
      {
        for(let p = 0; p < this.resultPoetsOFFLine.rows.length; p ++)
        {
          let objectOFFLineRecord_4 = 
          {
            id:this.resultPoetsOFFLine.rows.item(p).id,
            PoetName:this.resultPoetsOFFLine.rows.item(p).PoetName            
          }
          this.resultPoets.push(objectOFFLineRecord_4);
        }
      }
      if(this.searched_filters)
      {
        let selectedPoets = (this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "";
        this.loginForm.controls['poets'].setValue(selectedPoets);
      }//INITILIZE SEARCH FIELDS
    },error => 
    {
      //loadingPoemType.dismiss();//DISMISS LOADER
      console.log(error);
    });    
    /*POETS*/
    /*LANGUAGES*/
    this.resultLanguagesOFFLine=[];
    await this.offline.getData('SELECT * FROM languages',[]).then(result => 
    {
      //loadingPoemType.dismiss();//DISMISS LOADER
      this.resultLanguagesOFFLine=result;
      this.resultLanguages=[];
      if(this.resultLanguagesOFFLine.rows.length > 0)
      {
        for(let l = 0; l < this.resultLanguagesOFFLine.rows.length; l ++)
        {
          let objectOFFLineRecord_5 = 
          {
            id:this.resultLanguagesOFFLine.rows.item(l).id,
            LanguageName:this.resultLanguagesOFFLine.rows.item(l).LanguageName            
          }
          this.resultLanguages.push(objectOFFLineRecord_5);
        }
      }
      if(this.searched_filters)
      {
        let selectedLanguage = (this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "";
        this.loginForm.controls['languages'].setValue(selectedLanguage);
      }//INITILIZE SEARCH FIELDS
    },error => 
    {
      //loadingPoemType.dismiss();//DISMISS LOADER
      console.log(error);
    });    
    /*LANGUAGES*/
  }

  ionViewWillEnter()
  { 
    this.loginForm.controls['subject_occassion'].setValue("");
    this.loginForm.controls['poem_type'].setValue("");
    this.loginForm.get('subject_occassion').clearValidators();     
    this.loginForm.get('subject_occassion').updateValueAndValidity();
    this.loginForm.get('poem_type').clearValidators();     
    this.loginForm.get('poem_type').updateValueAndValidity();
  }

  SelectedPoemType(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedPoemType.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedPoemType=this.removeA(this.selectedPoemType,ev.detail.value);
    }
    console.log(this.selectedPoemType);
  }

  SelectedSubOccassion(ev)
  {
    console.log(ev);
    if(ev.detail.checked == true)
    {
      this.selectedSubjectOccassion.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedSubjectOccassion=this.removeA(this.selectedSubjectOccassion,ev.detail.value);
    }
    console.log(this.selectedSubjectOccassion);
  }

  SelectedLanguage(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedLanguage.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedLanguage=this.removeA(this.selectedLanguage,ev.detail.value);
    }
    console.log(this.selectedLanguage);
  }

  SelectedReciters(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedReciters.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedReciters=this.removeA(this.selectedReciters,ev.detail.value);
    }
    console.log(this.selectedReciters);
  }

  SelectedPoets(ev)
  {
    if(ev.detail.checked == true)
    {
      this.selectedPoets.push(ev.detail.value);      
    }
    if(ev.detail.checked == false)
    {
      this.selectedPoets=this.removeA(this.selectedPoets,ev.detail.value);
    }
    console.log(this.selectedPoets);
  }

  removeA(arr,ax) 
  {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) 
    {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) 
        {
            arr.splice(ax, 1);
        }
    }
    return arr;
  }

  dismissModal()
	{
    let dataToSearch = {
      selected_search_by:this.selected_search_by,
      selectedPoemType:this.selectedPoemType.join(","),
      selectedSubjectOccassion:this.selectedSubjectOccassion.join(","),
      selectedLanguage:this.selectedLanguage.join(","),
      selectedReciters:this.selectedReciters.join(","),
      selectedPoets:this.selectedPoets.join(","),
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  searchPoem()
  {
    let dataToSearch = {      
      selected_search_by:this.selected_search_by,
      selectedPoemType:this.selectedPoemType.join(","),
      selectedSubjectOccassion:this.selectedSubjectOccassion.join(","),
      selectedLanguage:this.selectedLanguage.join(","),
      selectedReciters:this.selectedReciters.join(","),
      selectedPoets:this.selectedPoets.join(","),
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
    /*
    console.log(SearchType);
    console.log(this.selectedSubjectOccassion);
    console.log(this.selectedLanguage);
    console.log(this.selectedReciters);
    console.log(this.selectedPoets);
    */
  }

  dismissFilterModal()
  {
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters_bookmarks'));
    let selectedSubjectOccassion='';
    let selectedPoemType = '';
    let selectedLanguage = '';
    let selectedReciters = '';
    let selectedPoets = '';
    let translated = '';
    if(this.searched_filters)
    {
      selectedSubjectOccassion = (this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "";
      selectedPoemType = (this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "";
      selectedLanguage = (this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "";
      selectedReciters = (this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "";
      selectedPoets = (this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "";
      translated = (this.searched_filters['translated']) ? this.searched_filters['translated'] : "";
    }
    
    let dataToSearch = {
      selected_search_by:this.selected_search_by,
      selectedPoemType:selectedPoemType,
      selectedSubjectOccassion:selectedSubjectOccassion,
      selectedLanguage:selectedLanguage,
      selectedReciters:selectedReciters,
      selectedPoets:selectedPoets,
      translated:translated
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  applyFilters(form)
  {
    let dataToSearch = {
      selected_search_by:this.selected_search_by,
      selectedPoemType:(form.poem_type) ? form.poem_type.join(",") : "",
      selectedSubjectOccassion:(form.subject_occassion) ? form.subject_occassion.join(",") : "",
      selectedLanguage:(form.languages) ? form.languages.join(",") : "",
      selectedReciters:(form.reciters) ? form.reciters.join(",") : "",
      selectedPoets:(form.poets) ? form.poets.join(",") : "",
      translated:(form.translated) ? form.translated : ""
    }
    localStorage.setItem('searched_filters_bookmarks',JSON.stringify(dataToSearch));
    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  clearAppliedFilters()
  {
    this.client.publishSomeDataWhenClearSearchBookmark({
      is_search_clear: true
    });//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED ON BOOKMARK

    this.is_anything_have_been_searched=false;
    this.loginForm.reset();
    localStorage.removeItem('searched_filters_bookmarks');
    let dataToSearch = {
      selected_search_by:"",
      selectedPoemType:"",
      selectedSubjectOccassion:"",
      selectedLanguage:"",
      selectedReciters:"",
      selectedPoets:"",
      translated:""
    }

    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  LanguageHaveBeenSelected(ev)
  {
    let anything = ev.detail.value;
    if(anything.length > 0)
    {
      this.is_anything_have_been_searched=true;
    }
  }//THIS IS JUST TO ENABLE/DISABLE SUBMIT BUTTON ONLY

  ReciterHaveBeenSelected(ev)
  {
    let anything = ev.detail.value;
    if(anything.length > 0)
    {
      this.is_anything_have_been_searched=true;
    }
  }//THIS IS JUST TO ENABLE/DISABLE SUBMIT BUTTON ONLY

  PoetHaveBeenSelected(ev)
  {
    let anything = ev.detail.value;
    if(anything.length > 0)
    {
      this.is_anything_have_been_searched=true;
    }
  }//THIS IS JUST TO ENABLE/DISABLE SUBMIT BUTTON ONLY

  TranslatedHaveBeenSelected(ev)
  { 
    let anything = ev.detail.value;
    if(anything!=undefined)
    {
      this.is_anything_have_been_searched=true;
    }
  }//THIS IS JUST TO ENABLE/DISABLE SUBMIT BUTTON ONLY

  SelectedOption(ev)
  {
    this.is_anything_have_been_searched=true;
    this.selected_search_by = ev.detail.value;
    if(this.selected_search_by == 'by_poem_type')
    {
      this.search_with_poem_type=true;
      this.search_with_subject_occassion=false;
      this.loginForm.controls['selected_search_by'].setValue("by_poem_type");
      this.loginForm.get('poem_type').setValidators([Validators.required]);     
      this.loginForm.get('poem_type').updateValueAndValidity();
      this.loginForm.controls['subject_occassion'].setValue("");
    }
    if(this.selected_search_by == 'by_subject_occassion')
    {
      this.search_with_subject_occassion=true;
      this.search_with_poem_type=false;
      this.loginForm.controls['selected_search_by'].setValue("by_subject_occassion");
      this.loginForm.get('subject_occassion').setValidators([Validators.required]);     
      this.loginForm.get('subject_occassion').updateValueAndValidity();
      this.loginForm.controls['poem_type'].setValue("");
    }
  }

}
