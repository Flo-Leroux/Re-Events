import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, PopoverController, Events } from 'ionic-angular';
import { Http } from '@angular/http';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';

// --- Add Pages --- //
import { PopoverProfilePage } from '../../pages/popover-profile/popover-profile';
import { DescriptionPage } from '../description/description';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';

// --- Add Models --- //
import { User } from '../../models/User';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user = {} as User;

  @ViewChild(Content)
  content: Content;
  showToolbar: boolean = false;
  imgHeight: any;

  pictureURL: string;

  jsonPATH: string = 'assets/json/eventsOrganised.json';
  datas: JSON;

  constructor(public navCtrl: NavController,
              private statusBar: StatusBar,
              private navParams: NavParams,
              private eventsCtrl: Events,
              private nativePageTransitions: NativePageTransitions,
              private http: Http,
              private firebase: FirebaseProvider,
              private nativeStorage: NativeStorage,
              public ref: ChangeDetectorRef,
              public popoverCtrl: PopoverController) {

    console.log('Profile Enter Construct');

    this.eventsCtrl.subscribe('userNativeUpdate', () => {
      console.log('USER SUBSCRIBE');
      this.nativeStorage.getItem('USER')
      .then(user => {
        this.user = user;
        this.pictureURL = this.user.pictureURL;
      })
    })

  }

  ionViewWillEnter() {
    console.log('Profile Enter');
    this.nativeStorage.getItem('USER')
    .then(res => {
      this.user = res;
      if(this.user.pictureURL) {
        this.pictureURL = this.user.pictureURL;
      }
      else {
        this.pictureURL = 'assets/imgs/persona.jpg';
      }
    })
  }

  ionViewDidEnter() {
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.imgHeight = (28 * h) / 100;
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= this.imgHeight;

    console.log(this.showToolbar);

    this.ref.detectChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    this.navCtrl.viewDidEnter.toPromise()
    .then(res => {
      console.log('Profile Enter');
      
      return this.nativeStorage.getItem('USER')
    })
    .then(res => {
      this.user = res;
    })

    this.loadJson()
    .then(res => {
      let datas = res.json();
      this.datas = datas;
      console.log(this.datas);
    })
  }

  popover(e) {
    let popover = this.popoverCtrl.create(PopoverProfilePage);
    popover.present({
      ev: e
    });
  }

  getDescription(e) {
    this.findParentBySelector(e.target, 'ion-item')
    .then(res => {
      if(res != null) {
        const id = res.firstChild.parentNode.getAttribute('id');
        
        this.findEventsById(id)
        .then(res => {
          let event = this.datas[res];
          
          let options: NativeTransitionOptions = {
            direction: 'left',
            duration: 500,
            slowdownfactor: 3,
          }
          this.nativePageTransitions.slide(options);
          console.log(event);

          this.navCtrl.push(DescriptionPage, {'event': event});          
        });        
      }      
    })
  }

  dislikeEvent(e) {

  }

  onReloadUserDatas() {
    console.log('Reload Datas');
  }

  // --- Others --- //

  private loadJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.jsonPATH)
      .subscribe(res => {
        resolve(res);
      })
    });
  }

  private collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
  }
  
  private findParentBySelector(elm, selector): Promise<any> {
    return new Promise((resolve, reject) => {
      if(elm.tagName.toLowerCase()==selector) {
        resolve();
      }
      else {
        var all = document.querySelectorAll(selector);
        var cur = elm.parentNode;
        while(cur && !this.collectionHas(all, cur)) { //keep going up until you find a match
            cur = cur.parentNode; //go up
        }
        resolve(cur); //will return null if not found
      }
    });
  }

  private findEventsById(id: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      for(let i in this.datas) {
        let tmpId = this.datas[i].id;
        if(tmpId == id) {
          resolve(i);
        }
      }
      reject();
    })
  }
}
