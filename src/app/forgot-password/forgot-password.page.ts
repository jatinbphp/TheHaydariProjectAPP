import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit 
{
  public resultData:any={};
  public forgotPasswordForm = this.fb.group({
		username: ['', Validators.required],
	});

	validation_messages = 
	{		
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		]
	};

	constructor(public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController) 
	{ 
		this.keyboard.hideFormAccessoryBar(false);
	}

	ngOnInit()
	{}

	async updateMyPassword(form)
	{
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

			let data=
			{
				username:form.username
			}
			await this.client.updateMyPassword(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultData=result;
				this.client.router.navigate(['/login']);
				console.log(this.resultData);
							
			},
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
	}
}
