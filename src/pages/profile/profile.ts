import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, Content, PopoverController, Events } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
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

  likedDATA: any;
  likedID: any;

  constructor(public navCtrl: NavController,
              private eventsCtrl: Events,
              private nativePageTransitions: NativePageTransitions,
              private firebase: FirebaseProvider,
              private nativeStorage: NativeStorage,
              public ref: ChangeDetectorRef,
              public popoverCtrl: PopoverController) {

    console.log('Profile Enter Construct');
    
    this.eventsCtrl.subscribe('userUpdate', res => {
      console.log('event received');
      
      this.nativeStorage.getItem('USER')
      .then(res => {
        this.user = res;
      });

      this.nativeStorage.getItem('userPicture')
      .then(res => {
        this.pictureURL = './assets/imgs/persona.jpg';
        console.log(res);
        this.pictureURL = res;
      })    
      .catch(err => {
        this.pictureURL = './assets/imgs/persona.jpg';
      });
    });
  }

  ionViewDidLoad() {
    this.nativeStorage.getItem('USER')
    .then(res => {
      this.user = res;
    });

    this.nativeStorage.getItem('userPicture')
    .then(res => {
      this.pictureURL = res;
    })    
    .catch(err => {
      this.pictureURL = './assets/imgs/persona.jpg';
    });
  }

  ionViewWillEnter() {
    console.log('Profile Enter');

    this.nativeStorage.getItem('likedDATA')
    .then(data => {this.likedDATA = data;})
    .catch(() => {this.likedDATA = [];})

    this.nativeStorage.getItem('likedID')
    .then(res => {this.likedID = res;})
    .catch(() => {this.likedID = [];});

    this.nativeStorage.getItem('USER')
    .then(res => {this.user = res;});

    this.nativeStorage.getItem('userPicture')
    .then(res => {
      this.pictureURL = res;
    })    
    .catch(err => {
      this.pictureURL = './assets/imgs/persona.jpg';
    });

    this.imgHeight =  document.getElementById('duotone').offsetHeight;

  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= this.imgHeight;

    this.ref.detectChanges();
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

          console.log('Get Description Profile');
          let event = this.likedDATA[res];

          event.start_time = event.start_time.toString().replace('T', ' ');
          event.start_time = event.start_time.substr(0, 18);
          event.start_time = new Date(event.start_time);

          let options: NativeTransitionOptions = {
            direction: 'left',
            duration: 500,
            slowdownfactor: 3,
          }
          this.nativePageTransitions.slide(options);

          this.navCtrl.push(DescriptionPage, {'event': event});          
        });        
      }      
    })
  }

  dislikeEvent(e) {
    this.findParentBySelector(e.target, 'ion-item')
    .then(res => {
      if(res != null) {
        let id = res.firstChild.parentNode.getAttribute('id');
        let parent = res.parentNode;
        let index = this.likedID.indexOf(id);
        if(index!=-1) {
          this.likedID.splice(index, 1);
          this.likedDATA.splice(index, 1);

          this.nativeStorage.setItem('likedID', this.likedID);          
          this.nativeStorage.setItem('likedDATA', this.likedDATA);

          let eltByID = res.firstChild.parentNode;
          parent.removeChild(eltByID);

          this.firebase.updateUserLikes(this.likedID);
          this.eventsCtrl.publish('dislikeID', id);
        }
      }
    });
  }

  // --- Others --- //
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
      for(let i in this.likedDATA) {
        let tmpId = this.likedDATA[i].id;
        if(tmpId == id) {
          resolve(i);
        }
      }
      reject();
    })
  }
}
