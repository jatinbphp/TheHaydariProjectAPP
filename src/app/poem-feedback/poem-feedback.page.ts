import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-poem-feedback',
  templateUrl: './poem-feedback.page.html',
  styleUrls: ['./poem-feedback.page.scss'],
})

export class PoemFeedbackPage implements OnInit 
{
  public Editor = ClassicEditor;
  public user_id:any='';
  public poem_id:any='';
  public resultPoemsSuggestion:any=[];
  public resultPoemsDetailObject:any=[];
  public resultPoemsDetail:any=[];
  public poemsLine:any=[];
  public ngFormSuggestion:any=[];
  constructor(public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public navParams: NavParams)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.user_id=(localStorage.getItem('id')) ? localStorage.getItem('id') : null;
    this.poem_id='';
    this.resultPoemsDetailObject=[];
    this.resultPoemsDetail=[];
    this.poemsLine=[];
    this.ngFormSuggestion=[];
    this.poem_id=this.navParams.get('poem_id');
    
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
      //console.log("MP3Link",this.MP3Link);
      //console.log("Object",this.resultPoemsDetailObject);
      //console.log("Detail",this.resultPoemsDetail);
      console.log("Lines",this.poemsLine);
    },
    error => 
    {
      loadingPoemDetail.dismiss();//DISMISS LOADER
      console.log();
    });

    if(this.poemsLine.length > 0)
    {
      for(let i = 0; i < this.poemsLine.length; i ++)
      {
        let translated_text = this.poemsLine[i]['TranslatedText'].replace( /(<([^>]+)>)/ig, '');
        let ObjSuggestion = 
        {
          array_index: i,
          row_id : this.poemsLine[i]['id'],
          poem_id : this.poemsLine[i]['PoemID'],
          suggested_text: translated_text,
          is_suggested_text_updated: false,
        }
        this.ngFormSuggestion.push(ObjSuggestion);
      }
    }
  }

  async SaveSuggestion(form: NgForm)
  {
    let array_index = form.controls.array_index.value;
    let row_id = form.controls.row_id.value;
    let poem_id = form.controls.poem_id.value;
    let suggested_text = form.controls.suggested_text.value;
    let remove_tags_from_suggested_text = suggested_text.replace( /(<([^>]+)>)/ig, '')
    let user_id = this.user_id;
    this.ngFormSuggestion[array_index]['is_suggested_text_updated']=true;
    //console.log("B=",suggested_text);
    //console.log("A=",remove_tags_from_suggested_text);
    //return false;
    //LOADER
    const loadingSuggestion = await this.loadingCtrl.create({
      spinner: null,
      //duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loadingSuggestion.present();
    //LOADER
    let objData = {
      row_id:row_id,
      poem_id:poem_id,
      //suggested_text:remove_tags_from_suggested_text,
      suggested_text:suggested_text,
      user_id:user_id
    }
    await this.client.SaveSuggestion(objData).then(resultSuggestion => 
    {	
      loadingSuggestion.dismiss();//DISMISS LOADER
      this.resultPoemsSuggestion=resultSuggestion;
      this.client.showMessage(this.resultPoemsSuggestion['message']);
      //console.log(this.resultPoemsSuggestion);
    },
    error => 
    {
      loadingSuggestion.dismiss();//DISMISS LOADER
      console.log();
    });
    /*
    console.log(array_index);
    console.log(row_id);
    console.log(poem_id);
    console.log(suggested_text);
    */
  }

  dismissFilterModal()
  {
    this.modalCtrl.dismiss({
			'dismissed': true
		});
  }
}
