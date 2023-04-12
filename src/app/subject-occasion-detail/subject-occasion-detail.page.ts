import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-subject-occasion-detail',
  templateUrl: './subject-occasion-detail.page.html',
  styleUrls: ['./subject-occasion-detail.page.scss'],
})

export class SubjectOccasionDetailPage implements OnInit 
{

  constructor(public modalCtrl: ModalController)
  { }

  ngOnInit()
  { }

  dismissModal(form)
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  }
}
