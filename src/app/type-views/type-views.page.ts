import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ProfilePage } from '../profile/profile.page';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-type-views',
  templateUrl: './type-views.page.html',
  styleUrls: ['./type-views.page.scss'],
})

export class TypeViewsPage implements OnInit 
{

  constructor(public client: ClientService, private router: Router, public fb: FormBuilder, public loadingCtrl: LoadingController, public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

  home() 
  {
  	this.router.navigateByUrl('/tabs/home');
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
}
