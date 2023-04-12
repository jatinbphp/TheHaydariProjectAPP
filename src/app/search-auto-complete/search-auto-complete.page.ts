import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-search-auto-complete',
  templateUrl: './search-auto-complete.page.html',
  styleUrls: ['./search-auto-complete.page.scss'],
})

export class SearchAutoCompletePage implements OnInit 
{  
  
  public resultData:any=[];
  public resultDataOFFLine:any=[];
  public resultDataOnSearch=[];
  public numberOfRecords:number=0;
  public queryString: any=[];
  public is_searched:boolean = false;
  constructor(public client: ClientService, public offline: OfflineService, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  { }

  async ngOnInit()
  {
    this.resultDataOFFLine=[];
    this.resultData=[];
    this.resultDataOnSearch=[];
    await this.offline.getData('SELECT * FROM allpoems',[]).then(result => 
    {
      this.resultDataOFFLine=result;
      if(this.resultDataOFFLine.rows.length > 0)
      {
        for(let p = 0; p < this.resultDataOFFLine.rows.length; p ++)
        {
          let objectOFFLineRecord_1 = 
          {
            id:this.resultDataOFFLine.rows.item(p).id,
            PoemName:this.resultDataOFFLine.rows.item(p).PoemName,
            PoetName:this.resultDataOFFLine.rows.item(p).PoetName,
            ReciterName:this.resultDataOFFLine.rows.item(p).ReciterName,
            SubjectName:this.resultDataOFFLine.rows.item(p).SubjectName,
            PoemTypeName:this.resultDataOFFLine.rows.item(p).PoemTypeName,
            TranslatedText:this.resultDataOFFLine.rows.item(p).TranslatedText,
            LanguageName:this.resultDataOFFLine.rows.item(p).LanguageName,
            colorCode:this.resultDataOFFLine.rows.item(p).colorCode,
            TranslatedStatus:this.resultDataOFFLine.rows.item(p).TranslatedStatus,
          }
          this.resultData.push(objectOFFLineRecord_1);
        }
        this.resultDataOnSearch=this.resultData;
        console.log(this.resultData);
      }
    },error => 
    {
      console.log(error);
    });    
    /*
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
    await this.client.getAllOrRecentRequested(data).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result['poemsData'];
      this.resultDataOnSearch=this.resultData;
      this.numberOfRecords=result['totalPoems'];
      console.log(this.resultData);
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log(error);
    });
    */
  }

  SearchPoem(ev)
  {
    this.resultData = this.resultDataOnSearch;
    let searchedValue = (ev.detail.value) ? ev.detail.value : "";
    console.log(searchedValue);
    if(searchedValue.length > 0 && searchedValue != "" && searchedValue != null && searchedValue != undefined)
    {
      this.is_searched=true;
      this.resultData = this.resultData.filter(currentItem => 
      {
        let PoemName = (currentItem.PoemName) ? currentItem.PoemName : "novalue"; 
        let PoetName = (currentItem.PoetName) ? currentItem.PoetName : "novalue"; 
        let ReciterName = (currentItem.ReciterName) ? currentItem.ReciterName : "novalue"; 
        let SubjectName = (currentItem.SubjectName) ? currentItem.SubjectName : "novalue"; 
        let PoemTypeName = (currentItem.PoemTypeName) ? currentItem.PoemTypeName : "novalue";
        let TranslatedText = (currentItem.TranslatedText) ? currentItem.TranslatedText : "novalue"; 
        let LanguageName = (currentItem.LanguageName) ? currentItem.LanguageName : "novalue"; 
        return (PoemName.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1 || PoetName.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1 || ReciterName.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1 || SubjectName.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1 || PoemTypeName.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1 || TranslatedText.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1 || LanguageName.toLowerCase().indexOf(searchedValue.toLowerCase()) > -1);
      });
    }
    else 
    {
      this.is_searched=false;
      this.resultData = this.resultDataOnSearch;
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
    this.modalCtrl.dismiss();
    this.client.router.navigate(['tabs/home/sub-list-page/poem-detail'], navigationExtras);
  }

  dismissModel()
  {
    this.modalCtrl.dismiss();
  }
  
}
