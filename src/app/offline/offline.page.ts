import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ClientService } from '../providers/client.service';
import { OfflineService } from '../providers/offline.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.page.html',
  styleUrls: ['./offline.page.scss'],
})

export class OfflinePage implements OnInit 
{
  public resultPoemOffline:any = [];
  public limitedResultPoemOffline:any = [];
  public resultPoemBookMarked:any = [];
  public limitedResultBookMarked:any = [];
  public is_network_connected:boolean=false;
  public ResultUnique:any = [];
  public LimitedResultUnique:any = [];

  constructor(public client: ClientService, public offline: OfflineService, public loadingCtrl: LoadingController, public alertController: AlertController)
  { 
    this.client.getObservableWhenOnLine().subscribe((data) => {
      this.is_network_connected = data.is_network_connected; 
    });//THIS OBSERVABLE IS USED TO KNOW IF NETWORK CONNECTED THEN RELOAD THE HOME SCREEN
  }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.is_network_connected=this.client.is_network_connected;
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

    await this.offline.getPoems().then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.resultPoemOffline=result; 
      //console.log("OFFLINE POEMS",this.resultPoemOffline);
      this.limitedResultPoemOffline=[];
      if(this.resultPoemOffline.length > 0)
      {
        for(let p = 0 ; p < this.resultPoemOffline.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultPoemOffline[p]['id'],
            PoemName:this.resultPoemOffline[p]['PoemName'],
            colorCode:this.resultPoemOffline[p]['colorCode'],
            LanguageName:this.resultPoemOffline[p]['LanguageName'],
            ReciterName:this.resultPoemOffline[p]['ReciterName'],
            PoetName:this.resultPoemOffline[p]['PoetName'],
            FromTableNM:this.resultPoemOffline[p]['FromTableNM'],
          }
          this.limitedResultPoemOffline.push(objPoemLimited);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });

    await this.offline.getBookmarks().then(result => 
    {
      loading.dismiss();//DISMISS LOADER
      this.resultPoemBookMarked=result; 
      //console.log("OFFLINE POEMS",this.resultPoemBookMarked);
      this.limitedResultBookMarked=[];
      if(this.resultPoemBookMarked.length > 0)
      {
        for(let p = 0 ; p < this.resultPoemBookMarked.length; p ++)
        {
          let objPoemLimited = {
            arrayIndex:p,
            id:this.resultPoemBookMarked[p]['id'],
            PoemName:this.resultPoemBookMarked[p]['PoemName'],
            colorCode:this.resultPoemBookMarked[p]['colorCode'],
            LanguageName:this.resultPoemBookMarked[p]['LanguageName'],
            ReciterName:this.resultPoemBookMarked[p]['ReciterName'],
            PoetName:this.resultPoemBookMarked[p]['PoetName'],
            FromTableNM:this.resultPoemBookMarked[p]['FromTableNM'],
          }
          this.limitedResultBookMarked.push(objPoemLimited);
        }
      }
    },
    error => 
    {
      loading.dismiss();//DISMISS LOADER
      console.log();
    });

    //await this.CheckAndRemoveDuplicates();  
    console.log("Offline",this.limitedResultPoemOffline);
    console.log("Bookmark",this.limitedResultBookMarked);  
    await this.RemoveDuplicates(this.limitedResultPoemOffline,this.limitedResultBookMarked);
  }

  async RemoveDuplicates(a,b)
  {
    for (var i = 0, len = a.length; i < len; i++)
    { 
      for (var j = 0, len2 = b.length; j < len2; j++)
      { 
        if (a[i].id === b[j].id) 
        {
          b.splice(j, 1);
          len2=b.length;              
        }
      }
    }
    Array.prototype.push.apply(a,b);
    console.log("1",a);
    if(a.length > 0)
    {
      this.limitedResultPoemOffline = [];
      for(let p = 0 ; p < a.length; p ++)
      {
        let objPoemLimited = {
          arrayIndex:a[p]['arrayIndex'],
          id:a[p]['id'],
          PoemName:a[p]['PoemName'],
          colorCode:a[p]['colorCode'],
          LanguageName:a[p]['LanguageName'],
          ReciterName:a[p]['ReciterName'],
          PoetName:a[p]['PoetName'],
          FromTableNM:a[p]['FromTableNM'],
        }
        this.limitedResultPoemOffline.push(objPoemLimited);
      }
    }
    console.log("2",this.limitedResultPoemOffline);
  }

  async CheckAndRemoveDuplicates()
  {
    for (var i = 0, len = this.resultPoemOffline.length; i < len; i++) 
    { 
      for (var j = 0, len2 = this.resultPoemBookMarked.length; j < len2; j++) 
      { 
        if (this.resultPoemOffline[i].id === this.resultPoemBookMarked[j].id)
        {
          this.resultPoemBookMarked.splice(j, 1);
          len2=this.resultPoemBookMarked.length;
        } 
      }
    }
    Array.prototype.push.apply(this.resultPoemOffline,this.resultPoemBookMarked);
    this.limitedResultPoemOffline=[];
    if(this.resultPoemOffline.length > 0)
    {
      for(let p = 0 ; p < this.resultPoemOffline.length; p ++)
      {
        let objPoemLimited = {
          arrayIndex:p,
          id:this.resultPoemOffline[p]['id'],
          PoemName:this.resultPoemOffline[p]['PoemName'],
          colorCode:this.resultPoemOffline[p]['colorCode'],
          LanguageName:this.resultPoemOffline[p]['LanguageName'],
          ReciterName:this.resultPoemOffline[p]['ReciterName'],
          PoetName:this.resultPoemOffline[p]['PoetName'],
          FromTableNM:this.resultPoemOffline[p]['FromTableNM'],
        }
        this.limitedResultPoemOffline.push(objPoemLimited);
      }
    }
    console.log("1",this.limitedResultPoemOffline);
    /*
    var a = [{'name':'bob', 'age':22}, {'name':'alice', 'age':12}, {'name':'mike', 'age':13}];
    var b = [{'name':'bob', 'age':62}, {'name':'kevin', 'age':32}, {'name':'alice', 'age':32}];

    function remove_duplicates(a, b) {
        let c = [];
        for (var i = 0, len = a.length; i < len; i++) { 
            for (var j = 0, len2 = b.length; j < len2; j++) { 
                if (a[i].name === b[j].name) {
                    b.splice(j, 1);
                    len2=b.length;
                      
                }
                
            }
        }
        Array.prototype.push.apply(a,b);
        console.log(a);

    }
    remove_duplicates(a,b);
    */
  }

  getPoemsDetail(arrayIndex,FromTableNM)
  {
    let offLinePoem = [];
    let RequestFrom = (FromTableNM == "Poems") ? "Poems" : "bookmarks";
    if(RequestFrom=="Poems")
    {
      offLinePoem = this.resultPoemOffline[arrayIndex];
    }
    if(RequestFrom=="bookmarks")
    {
      offLinePoem = this.resultPoemBookMarked[arrayIndex];
    }
    
    localStorage.setItem('read_offline_poem',JSON.stringify(offLinePoem));
    this.client.router.navigate(['/tabs/offline/offline-poem-detail']);
  }

  async ConfirmRemovingFromOFFLINE(poem_id,FromTableNM)
  {
    let messageToRemove = (FromTableNM == "Poems") ? "Are you sure you want to remove this from Offline Poems?" : "Are you sure you want to remove this from Bookmarked Poems?";
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Please confirm:',
      message: messageToRemove,
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => 
          {
            console.log('Confirm Cancel: blah');
          }
        }, 
        {
          text: 'YES',
          handler: () => 
          {
            this.RemoveFromOFFLINE(poem_id,FromTableNM);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }

  async RemoveFromOFFLINE(poem_id,FromTableNM)
  {
    if(FromTableNM == "Poems")
    {
      await this.offline.deleteData(poem_id).then(result => 
      {
        //this.client.showMessage("Poem is removed from offline!");
        this.ionViewWillEnter();      
      });
    }
    if(FromTableNM == "bookmarks")
    {
      await this.offline.deleteBookmarkData(poem_id).then(result => 
      {
        //this.client.showMessage("Poem is removed from bookmark!");
        this.ionViewWillEnter();      
      });
    }
    
  }
}
