import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.page.html',
  styleUrls: ['./search-filters.page.scss'],
})

export class SearchFiltersPage implements OnInit 
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

  public poem_or_subject_occassion:any='';
  public poem_subject_occassion_id:any='';
  public is_anything_have_been_searched: boolean = false;

  public loginForm = this.fb.group({
		subject_occassion: [''],
		poem_type: [''],
    languages: [''],
    reciters: [''],
    poets: [''],
    translated: [''],
	});

  constructor(public fb: FormBuilder, public offline: OfflineService, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
  { }

  async ngOnInit()
  { 
    //INITILIZE SEARCH FIELDS
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));
    if(this.searched_filters)
    {
      this.is_anything_have_been_searched=true;
      let translated = (this.searched_filters['translated']) ? this.searched_filters['translated'] : "";
      this.loginForm.controls['translated'].setValue(translated);
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
    /*
    WORKING CODE BY CALLING API STARTS
    await this.client.getPoemTypes().then(result => 
    {	
      //loadingPoemType.dismiss();//DISMISS LOADER
      this.resultPoemTypes=result;
      console.log(this.resultPoemTypes);
      if(this.searched_filters)
      {
        let selectedPoemType = (this.searched_filters['selectedPoemType']) ? this.searched_filters['selectedPoemType'].split(",") : "";
        this.loginForm.controls['poem_type'].setValue(selectedPoemType);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    WORKING CODE BY CALLING API ENDS
    */
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
    /*
    WORKING CODE BY CALLING API STARTS
    await this.client.getSubject().then(result => 
    {	
      this.resultSubjectOccasion=result;      
      console.log(this.resultSubjectOccasion);
      if(this.searched_filters)
      {
        let selectedSubjectOccassion = (this.searched_filters['selectedSubjectOccassion']) ? this.searched_filters['selectedSubjectOccassion'].split(",") : "";
        this.loginForm.controls['subject_occassion'].setValue(selectedSubjectOccassion);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    WORKING CODE BY CALLING API ENDS
    */
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
    /*
    WORKING CODE BY CALLING API STARTS
    await this.client.getReciters().then(result => 
    {	
      this.resultReciters=result;
      console.log(this.resultReciters);
      if(this.searched_filters)
      {
        let selectedReciters = (this.searched_filters['selectedReciters']) ? this.searched_filters['selectedReciters'].split(",") : "";
        this.loginForm.controls['reciters'].setValue(selectedReciters);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    WORKING CODE BY CALLING API ENDS
    */
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
    /*
    WORKING CODE BY CALLING API STARTS
    await this.client.getPoets().then(result => 
    {	
      this.resultPoets=result;      
      console.log(this.resultPoets);
      if(this.searched_filters)
      {
        let selectedPoets = (this.searched_filters['selectedPoets']) ? this.searched_filters['selectedPoets'].split(",") : "";
        this.loginForm.controls['poets'].setValue(selectedPoets);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    WORKING CODE BY CALLING API ENDS
    */
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
    /*
    WORKING CODE BY CALLING API STARTS
    await this.client.getLanguages().then(result => 
    {	
      loadingPoemType.dismiss();//DISMISS LOADER
      this.resultLanguages=result;      
      console.log(this.resultLanguages);
      if(this.searched_filters)
      {
        let selectedLanguage = (this.searched_filters['selectedLanguage']) ? this.searched_filters['selectedLanguage'].split(",") : "";
        this.loginForm.controls['languages'].setValue(selectedLanguage);
      }//INITILIZE SEARCH FIELDS
    },
    error => 
    {
      loadingPoemType.dismiss();//DISMISS LOADER
      console.log();
    });
    WORKING CODE BY CALLING API ENDS
    */
    /*LANGUAGES*/
  }

  ionViewWillEnter()
  {
    this.poem_or_subject_occassion=this.navParams.get('poem_or_subject_occassion');
    this.poem_subject_occassion_id=this.navParams.get('poem_subject_occassion_id');
  }

  SelectedSubjectOccassion(ev)
  {
    let anything = ev.detail.value;
    if(anything.length > 0)
    {
      this.is_anything_have_been_searched=true;
    }
  }//THIS IS JUST TO ENABLE/DISABLE SUBMIT BUTTON ONLY

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
		let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
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
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
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
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    this.searched_filters = JSON.parse(localStorage.getItem('searched_filters'));
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
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
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
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
      selectedPoemType:(form.poem_type) ? form.poem_type.join(",") : "",
      selectedSubjectOccassion:(form.subject_occassion) ? form.subject_occassion.join(",") : "",
      selectedLanguage:(form.languages) ? form.languages.join(",") : "",
      selectedReciters:(form.reciters) ? form.reciters.join(",") : "",
      selectedPoets:(form.poets) ? form.poets.join(",") : "",
      translated:(form.translated) ? form.translated : ""
    }
    localStorage.setItem('searched_filters',JSON.stringify(dataToSearch));
    this.modalCtrl.dismiss({
			'dismissed': true,
      'searched': dataToSearch
		});
  }

  clearAppliedFilters()
  {
    this.client.publishSomeDataWhenClearSearch({
      is_search_clear: true
    });//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED
    this.is_anything_have_been_searched=false;

    this.loginForm.reset();
    localStorage.removeItem('searched_filters');
    let SearchType = JSON.parse(localStorage.getItem('choosen_option'));
    let poem_or_subject_occassion = SearchType['poem_or_subject_occassion'];
    let poem_subject_occassion_id = SearchType['poem_subject_occassion_id'];
    
    let dataToSearch = {
      poem_or_subject_occassion:poem_or_subject_occassion,
      poem_subject_occassion_id:poem_subject_occassion_id,
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
}
