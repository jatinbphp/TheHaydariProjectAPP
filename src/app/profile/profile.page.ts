import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit 
{
  	public id:any='';
	public resultData:any=[];
	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

  	public profileForm = this.fb.group({
		firstname: ['', Validators.required],
		lastname: ['', Validators.required],
		username: ['', Validators.required],
		password: ['']		
	});

	validation_messages = 
	{	
		'firstname': 
		[
			{ type: 'required', message: 'First name is required.' },
		],
		'lastname': 
		[
			{ type: 'required', message: 'Last name is required.' },
		],	
		'username': 
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'pattern', message: 'Please enter a valid email.' }
		],
		'password': 
		[
			{ type: 'required', message: 'Password is required.' }
		],
	};

	constructor(public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, public modalCtrl: ModalController) 
	{ }

	async ngOnInit() 
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
		this.id=localStorage.getItem('id');
		let data = {
			user_id:this.id
		}
		await this.client.getUserDetailById(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			console.log(this.resultData);
			let firstname = (this.resultData.firstname) ? this.resultData.firstname : "";
			let lastname = (this.resultData.lastname) ? this.resultData.lastname : "";
			let email = (this.resultData.email) ? this.resultData.email : "";

			this.profileForm.controls['firstname'].setValue(firstname);
			this.profileForm.controls['lastname'].setValue(lastname);
			this.profileForm.controls['username'].setValue(email);
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}

	async updateProfile(form)
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
			user_id:this.id,
			firstname:form.firstname,
			lastname:form.lastname,
			username:form.username, 
			password:form.password,
		}
		await this.client.updateProfile(data).then(result => 
		{	
			this.profileForm.controls['password'].setValue("");
			loading.dismiss();//DISMISS LOADER			
			this.ngOnInit();
						
		},
		error => 
		{
			loading.dismiss();//DISMISS LOADER
			console.log();
		});
	}

  	hideShowPassword()
	{
		this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    	this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	dismissModal()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
  	}

	Logout()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
		this.client.publishSomeDataWhenLogin({
			is_user_login: false
		});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
		//localStorage.clear();
		localStorage.removeItem('token');
		localStorage.removeItem('id');
		localStorage.removeItem('firstname');
		localStorage.removeItem('lastname');
		localStorage.removeItem('email');
		localStorage.removeItem('username');
		//this.menu.enable(false);
		this.client.router.navigate(['tabs/home']);
	}

	ShowOffline()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
		this.client.router.navigate(['tabs/offline']);
	}

	ShowBookmark()
	{
		this.modalCtrl.dismiss({
			'dismissed': true
		});
		this.client.router.navigate(['tabs/wishlist']);
	}
}
