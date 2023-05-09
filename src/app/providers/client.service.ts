import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; 
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Injectable({
  providedIn: 'root'
})

export class ClientService 
{
	//LIVE API URL::https://app.thehaydariproject.com/api/
	//LIVE SITE URL:: https://app.thehaydariproject.com/
	//DEV API URL:: https://haydari.ecnet.dev/api/
	//DEV SITE URL:: https://haydari.ecnet.dev/	
	//public site_url: string ="https://haydari.ecnet.dev/";//DEV
	//public api_url: string = "https://haydari.ecnet.dev/api/";//DEV
	public site_url: string ="https://app.thehaydariproject.com/";//LIVE
	public api_url: string = "https://app.thehaydariproject.com/api/";//LIVE
	public token: string;
	public serverResponse: any=[];
	private fooSubjectWhenlOGIN = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
	private fooSubjectWhenPoemTypeClickedFromMenu = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU
	private fooSubjectWhenClearSearch = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED
	private fooSubjectWhenClearBookmarkSearch = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED ON BOOKMARK
	private fooSubjectWhenOnLine = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN
	private fooSubjectWhenAudioPlayed = new Subject<any>();//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT
	public is_network_connected:boolean=true;
	public WelcomeText:any=null;
	constructor(public http: HttpClient, private alertCtrl: AlertController, public router: Router, private socialSharing: SocialSharing) 
	{ 
		this.getObservableWhenLogin().subscribe((data) => 
		{
			if(data.is_user_login == true)
			{
				this.WelcomeText = (localStorage.getItem("firstname") != null && localStorage.getItem("firstname") != undefined) ? localStorage.getItem("firstname") : null;
				this.WelcomeText = this.WelcomeText.substring(0,1);
			}	
			else 
			{
				this.WelcomeText = null;
			}		
		});//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN
	}

	publishSomeDataWhenLogin(data: any) {
        this.fooSubjectWhenlOGIN.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN

    getObservableWhenLogin(): Subject<any> {
        return this.fooSubjectWhenlOGIN;
	}//THIS OBSERVABLE IS USED TO KNOW IS USER LOGGEDIN

	publishSomeDataWhenPoemTypeClickedFromMenu(data: any) 
	{
		this.fooSubjectWhenPoemTypeClickedFromMenu.next(data);
	}//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU

	getObservableWhenPoemTypeClickedFromMenu(): Subject<any> 
	{
		return this.fooSubjectWhenPoemTypeClickedFromMenu;
	}//THIS OBSERVABLE IS USED TO KNOW IF POEM TYPE CLICKED FROM MENU

	publishSomeDataWhenClearSearch(data: any) {
        this.fooSubjectWhenClearSearch.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED

    getObservableWhenClearSearch(): Subject<any> {
        return this.fooSubjectWhenClearSearch;
	}//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED

	publishSomeDataWhenClearSearchBookmark(data: any) {
        this.fooSubjectWhenClearBookmarkSearch.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED ON BOOKMARK

    getObservableWhenClearSearchBookmark(): Subject<any> {
        return this.fooSubjectWhenClearBookmarkSearch;
	}//THIS OBSERVABLE IS USED TO KNOW IS CLEAR SEARCH BUTTON CLICKED ON BOOKMARK

	publishSomeDataWhenOnLine(data: any) {
        this.fooSubjectWhenOnLine.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN

    getObservableWhenOnLine(): Subject<any> {
        return this.fooSubjectWhenOnLine;
	}//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN

	publishSomeDataWhenAudioPlayed(data: any) {
        this.fooSubjectWhenAudioPlayed.next(data);
    }//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT

    getObservableWhenAudioPlayed(): Subject<any> {
        return this.fooSubjectWhenAudioPlayed;
	}//THIS OBSERVABLE IS USED TO KNOW IF AUDIO PLAYED FROM PLAY MUSIC COMPONENT

  	getHeaderOptions(): any 
	{	
		this.token=localStorage.getItem('token');
		var headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Accept','application/json');
		return { headers }	    
	}

	makeMeLoggedin(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("username",data.username).set("password", data.password);
			this.http.post(this.api_url + "login",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					this.serverResponse=res;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	makeMeSignUp(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("FirstName",data.firstname).set("LastName", data.lastname).set("Email",data.username).set("Password", data.password);
			this.http.post(this.api_url + "register",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					resolve(res);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateMyPassword(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("email",data.username);
			this.http.post(this.api_url + "resetPassword",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage(res.message);
					this.serverResponse=res;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getUserDetailById(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id);
			this.http.post(this.api_url + "getUserDetailById",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.serverResponse=res.data;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updateProfile(data)
	{	
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id).set("firstname",data.firstname).set("lastname",data.lastname).set("password",data.password);
			this.http.post(this.api_url + "updateProfile",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					this.showMessage("Profile updated!!");
					this.serverResponse=res.data;
					resolve(this.serverResponse);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getAllAndRecent()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getSettings",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}
	
	getContributionLinks()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getContributionLink",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}
	
	getPoemTypes()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getPoemTypes",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsByPoemType(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poemTypeID",data.poem_subject_occassion_id).set("orderType",data.order).set("keyword",(data.searched_text) ? data.searched_text : '').set("subjectId",data.selectedSubjectOccassion).set("languageId",data.selectedLanguage).set("receiterId",data.selectedReciters).set("poetId",data.selectedPoets).set("translatedStatus",data.translated);
			this.http.post(this.api_url + "getPoemsByPoemType",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsDetailById(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poemID",data.poem_id).set("user_id",data.user_id);
			this.http.post(this.api_url + "getPoemsDetailById",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsDetailBySlug(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poemSlug",data.poem_slug);
			this.http.post(this.api_url + "getPoemsDetailBySlug",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	poemLineWishlist(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poem_id",data.poem_id).set("poem_line_id",data.poem_line_id).set("user_id",data.user_id).set("is_to_insert",data.is_to_insert);
			this.http.post(this.api_url + "poemLineWishlist",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getBookmarkPoems(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id).set("orderType",data.order);
			this.http.post(this.api_url + "getBookmarkPoems",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getSubject()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getSubject",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoemsBySubject(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("subjectID",data.poem_subject_occassion_id).set("orderType",data.order).set("keyword",(data.searched_text) ? data.searched_text : '').set("poemTypeId",data.selectedPoemType).set("languageId",data.selectedLanguage).set("receiterId",data.selectedReciters).set("poetId",data.selectedPoets).set("translatedStatus",data.translated);
			this.http.post(this.api_url + "getPoemsBySubject",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getReciters()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getReciters",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getPoets()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getPoets",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getLanguages()
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.api_url + "getLanguages",headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getNewReleasePoems(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("user_id",data.user_id);
			this.http.post(this.api_url + "getNewReleasePoems",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	searchPoems(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("keyword",data.keyword);
			this.http.post(this.api_url + "searchPoems",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	GoogleLoginORSignup(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("FirstName",data.firstname).set("LastName",data.lastname).set("Email",data.username);
			this.http.post(this.api_url + "socialLogin",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	FaceBookLoginORSignup(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("FirstName",data.firstname).set("LastName",data.lastname).set("Email",data.username);
			this.http.post(this.api_url + "socialLogin",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	AppleLoginORSignup(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("identityToken",data.identityToken);
			this.http.post(this.api_url + "socialLoginApple",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	ShareOnSocialNetwork(packageName: string, appName: string, social: string, message: string, subject: string, image: string, url:string) 
	{		
		return new Promise((reject) => {
		if(social === "facebook")
		{
			this.socialSharing.canShareVia(packageName,message,subject,image,url).then(() => {
				this.socialSharing.shareViaFacebook(message, image, url).catch(err => {
					
					let messageDisplay=this.showMessage("There was a problem please try later");
					reject(messageDisplay);					
				});
			})
			.catch(err => {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(appName+" "+errorMessage);
				reject(errorMessage);				
			});
		} 
		else if(social === "whatsapp")
		{
			this.socialSharing.canShareVia(packageName,message,subject,image,url).then(() => {
				this.socialSharing.shareViaWhatsApp(message, image, url).catch(err => {
					let messageDisplay=this.showMessage("There was a problem please try later");
					reject(messageDisplay);
				});
			})
			.catch(err => {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(appName+" "+errorMessage);
				reject(errorMessage);
			});
		}
		else if (social === "instagram") 
		{
			this.socialSharing.canShareVia(packageName,message,subject,image,url).then(() => {
				this.socialSharing.shareViaInstagram(message, image).catch(err => {
					let messageDisplay=this.showMessage("There was a problem please try later");
					reject(messageDisplay);
				});
			})
			.catch(err => {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(appName+" "+errorMessage);
				reject(errorMessage);
			});
		} 
		else if (social === "twitter")
		{
			this.socialSharing.canShareVia(packageName,message,subject,image,url).then(() => {
				this.socialSharing.shareViaTwitter(message, image, url).catch(err => {
					let messageDisplay=this.showMessage("There was a problem please try later");
					reject(messageDisplay);
				});
			})
			.catch(err => {
				let errorMessage=this.getErrorMessage(err);
				this.showMessage(appName+" "+errorMessage);
				reject(errorMessage);
			});
		} 
		else
		{
			this.socialSharing.share(message, subject, image, url).catch(err => {
				let messageDisplay=this.showMessage("There was a problem please try later");
				reject(messageDisplay);
			});
		}
		});
	}

	getAllOrRecentRequested(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			//let dataToPost = new HttpParams().set("filterType",data.filterType).set("keyword",data.keyword).set("orderType",data.order);
			let dataToPost = new HttpParams().set("filterType",data.filterType).set("subjectId",data.selectedSubjectOccassion).set("orderType",data.order).set("keyword",(data.keyword) ? data.keyword : '').set("poemTypeId",data.selectedPoemType).set("languageId",data.selectedLanguage).set("receiterId",data.selectedReciters).set("poetId",data.selectedPoets).set("translatedStatus",data.translated);
			this.http.post(this.api_url + "getAllPoems",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	generateRandomString(length)
	{
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) 
		{
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	setPushNotificationToken(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("device_id",data.device_id).set("device_type",data.device_type).set("device_token",data.device_token);
			this.http.post(this.api_url + "deviceDetailInsert",  dataToPost , headers).subscribe((res: any) =>       
			{
				if(res.status == true)
				{
					resolve(res.data);					
				}
				else
				{
					let messageDisplay=this.showMessage(res.message);
					reject(messageDisplay);
				}
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	updatePushInformation(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("device_id",data.device_id).set("device_type",data.device_type).set("device_token",data.device_token).set("user_id",data.user_id);
			this.http.post(this.api_url + "userDeviceDetailUpdate",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	SaveSuggestion(data)
	{
		let headers = this.getHeaderOptions();
		return new Promise((resolve, reject) => 
		{
			let dataToPost = new HttpParams().set("poem_id",data.poem_id).set("poem_line_id",data.row_id).set("user_id",data.user_id).set("suggestion_text",data.suggested_text);
			this.http.post(this.api_url + "addPoemFeedback",  dataToPost , headers).subscribe((res: any) =>       
			{
				resolve(res);
			},
			err => 
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				//this.showMessage(errorMessage);
				reject(errorMessage);
			});
		});
	}

	getErrorMessage(err)
	{	
		if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		} 
		else 
		{
			return err.error.status;
		}
	}
	
	async showMessage(message)
	{
		if(message == 'Token not valid') 
		{
			localStorage.clear();
		    this.router.navigate(['/login']);
		}
		else
		{
			const alert = await this.alertCtrl.create(
			{
				header: 'The Haydari Project',
				message: message,
				buttons: 
				[
					{
						text: 'Okay',
						handler: () => 
						{
							//console.log('Confirm Cancel: blah');
						}
					}
				]
			});
			await alert.present();		
		}
	}
}
