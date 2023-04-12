import { Component } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { SubjectOccasionDetailPage } from '../subject-occasion-detail/subject-occasion-detail.page';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})

export class SearchPage 
{
  public show_in_view: any = 'list';
  public resultData:any=[];
  public resultDataNewRelease:any=[];
  public resultDataTrendingNow:any=[];
  public resultDataRecentlyViewed:any=[];
  public user_id:any='';
  public queryString: any=[];  
  public searched_text:string='';
  constructor(public client: ClientService, public modalCtrl: ModalController, public fb: FormBuilder, public loadingCtrl: LoadingController, private route: ActivatedRoute, private router: Router) 
  {}
  
  ngOnInit()
  {}

  async ionViewWillEnter() 
	{
    this.searched_text='';
    this.user_id = (localStorage.getItem('id')) ? localStorage.getItem('id') : 0;
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
    let dataToPost = {
      user_id:this.user_id
    }
    await this.client.getNewReleasePoems(dataToPost).then(result => 
    {	
      loading.dismiss();//DISMISS LOADER
      this.resultData=result;   
      this.resultDataNewRelease=this.resultData['new_release_poems'];
      this.resultDataTrendingNow=this.resultData['trend_poems'];
      this.resultDataRecentlyViewed=this.resultData['recent_view_poems'];
      console.log(this.resultDataNewRelease);
      console.log(this.resultDataTrendingNow);
      console.log(this.resultDataRecentlyViewed);
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
      poem_id:id,
      from_page:'search'
    };

    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.client.router.navigate(['tabs/home/search/poem-detail'], navigationExtras);
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
    this.client.router.navigate(['tabs/search-result'], navigationExtras);
  }
}
