import { Component, OnInit } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../providers/client.service';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit 
{
	public AppleSignInSignupData:any=[];
	public resultData:any={};
	public resultDataSocialLoginOrSignup:any={};
	public currentPlatform:string = '';
	public passwordType: string = 'password';
	public passwordIcon: string = 'eye-off';

	public signUpForm = this.fb.group({
		firstname: ['', Validators.required],
		lastname: ['', Validators.required],
		username: ['', Validators.required],
		password: ['', Validators.required]		
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

	constructor(private platform: Platform, private googlePlus: GooglePlus, private fbook: Facebook, public keyboard:Keyboard, public fb: FormBuilder, public client: ClientService, public loadingCtrl: LoadingController, private signInWithApple: SignInWithApple) 
	{ 
		this.keyboard.hideFormAccessoryBar(false);
	}

  	ngOnInit() 
	{ }

	ionViewWillEnter()
	{
		this.AppleSignInSignupData=[];
		this.platform.ready().then(() => 
		{
		if(this.platform.is("android"))
		{
			this.currentPlatform="android";
		}
		if(this.platform.is("ios"))
		{
			this.currentPlatform="ios";
		}
		});
	}

	async makeMeSignUp(form)
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
			firstname:form.firstname,
			lastname:form.lastname,
			username:form.username, 
			password:form.password,
		}
		await this.client.makeMeSignUp(data).then(result => 
		{	
			loading.dismiss();//DISMISS LOADER			
			this.resultData=result;
			if(this.resultData.status==true)
			{
				this.client.router.navigate(['/login']);
			}
			console.log(this.resultData);
						
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

	async GoogleLoginORSignup()
	{
		
		let params = 
		{
			webClientId: '471452795402-92fmshstflp04eheg4r4sps4kuhdfrua.apps.googleusercontent.com', //  webclientID 'string'
			offline: true
		};
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

		this.googlePlus.login(params).then(user => 
		{
			let splitName = user.displayName.split(" ");
			let firstName = splitName[0];
			let lastName = splitName[1];

			let data={
				username:user.email,
				firstname:firstName,
				lastname:lastName,
			}
			
			this.client.GoogleLoginORSignup(data).then(result => 
			{	
				loading.dismiss();//DISMISS LOADER			
				this.resultDataSocialLoginOrSignup=result;
				this.client.publishSomeDataWhenLogin({
					is_user_login: true
				});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
				if(this.resultDataSocialLoginOrSignup.status==true)
				{
					localStorage.setItem('token',this.resultDataSocialLoginOrSignup['data'].token);
					localStorage.setItem('id',this.resultDataSocialLoginOrSignup['data'].id);
					localStorage.setItem('firstname',this.resultDataSocialLoginOrSignup['data'].firstname);
					localStorage.setItem('lastname',this.resultDataSocialLoginOrSignup['data'].lastname);
					localStorage.setItem('email',this.resultDataSocialLoginOrSignup['data'].email);
					localStorage.setItem('username',this.resultDataSocialLoginOrSignup['data'].username);
					this.client.router.navigate(['/tabs/home']);
				}			
			},
			error => 
			{
				loading.dismiss();//DISMISS LOADER
				console.log();
			});
			
			//alert(JSON.stringify(user));
			//console.log(user);       
		}, 
		err => 
		{
			loading.dismiss();//DISMISS LOADER	
			//alert(JSON.stringify(err));
			console.log(err);
		});
	}

	async FaceBookLoginORSignup()
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

		this.fbook.login(['public_profile','email']).then(FacebookLoginResponse => 
		{
			let userId = FacebookLoginResponse.authResponse.userID;
			this.fbook.api("/me?fields=name,email", ['public_profile','email'])
			.then(user =>
			{
				let splitName = user.name.split(" ");
				let firstName = splitName[0];
				let lastName = splitName[1];
				
				let data={
					username:user.email,
					firstname:firstName,
					lastname:lastName,
				}
				
				this.client.FaceBookLoginORSignup(data).then(result => 
				{	
					loading.dismiss();//DISMISS LOADER			
					this.resultDataSocialLoginOrSignup=result;
					this.client.publishSomeDataWhenLogin({
						is_user_login: true
					});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
					if(this.resultDataSocialLoginOrSignup.status==true)
					{
						localStorage.setItem('token',this.resultDataSocialLoginOrSignup['data'].token);
						localStorage.setItem('id',this.resultDataSocialLoginOrSignup['data'].id);
						localStorage.setItem('firstname',this.resultDataSocialLoginOrSignup['data'].firstname);
						localStorage.setItem('lastname',this.resultDataSocialLoginOrSignup['data'].lastname);
						localStorage.setItem('email',this.resultDataSocialLoginOrSignup['data'].email);
						localStorage.setItem('username',this.resultDataSocialLoginOrSignup['data'].username);
						this.client.router.navigate(['/tabs/home']);
					}			
				},
				error => 
				{
					loading.dismiss();//DISMISS LOADER
					console.log();
				})
				//user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
				//console.log(user.name);
				//console.log(user.email);
				//console.log(user.picture);
			}, err => 
			{
				loading.dismiss();//DISMISS LOADER
				alert(JSON.stringify(err));
				console.log(err);
			})                    
		}, 
		err => 
		{
			loading.dismiss();//DISMISS LOADER
			alert(JSON.stringify(err));
			console.log(err);
		});
	}

	async AppleLoginORSignup()
	{
		await this.signInWithApple.signin({
		requestedScopes: [ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail]}).then((res: AppleSignInResponse) => 
		{
			this.AppleSignInSignupData.push(res);			
			console.log("Array",this.AppleSignInSignupData);
			//https://developer.apple.com/documentation/signinwithapplerestapi/verifying_a_user
			//alert('Send token to apple for verification: ' + res.identityToken);
			//console.log("APPLE SIGNIN RESPONSE 1",res);
			//console.log("APPLE SIGNIN RESPONSE 2",JSON.stringify(res));
		})
		.catch((error: AppleSignInErrorResponse) => 
		{
			alert(error.code + ' ' + error.localizedDescription);
			console.error("APPLE SIGNIN ERROR 1",error);
			console.error("APPLE SIGNIN ERROR 2",JSON.stringify(error));
		});
		if(this.AppleSignInSignupData.length > 0)
		{
			let data=
			{
				identityToken:this.AppleSignInSignupData[0]['identityToken']
			}

			await this.client.AppleLoginORSignup(data).then(result => 
			{	
				this.resultDataSocialLoginOrSignup=result;
				this.client.publishSomeDataWhenLogin({
					is_user_login: true
				});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
				if(this.resultDataSocialLoginOrSignup.status==true)
				{
					localStorage.setItem('token',this.resultDataSocialLoginOrSignup['data'].token);
					localStorage.setItem('id',this.resultDataSocialLoginOrSignup['data'].id);
					localStorage.setItem('firstname',this.resultDataSocialLoginOrSignup['data'].firstname);
					localStorage.setItem('lastname',this.resultDataSocialLoginOrSignup['data'].lastname);
					localStorage.setItem('email',this.resultDataSocialLoginOrSignup['data'].email);
					localStorage.setItem('username',this.resultDataSocialLoginOrSignup['data'].username);
					this.client.router.navigate(['/tabs/home']);
				}			
			},
			error => 
			{
				console.log();
			});
		}
	}
}
