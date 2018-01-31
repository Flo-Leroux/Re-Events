
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, Events } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Calendar } from '@ionic-native/calendar';
import { NativeStorage } from '@ionic-native/native-storage';

// --- Add Providers --- //
import { RegexProvider } from '../../providers/regex/regex';

@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {

  @ViewChild(Content)
  content: Content;
  event: any;
  descriptionHTML: any;
  showToolbar: boolean = false;

  imgHeight: any;

  likedID: Array<any>;
  likedDATA: Array<any>;

  display1: object;
  display2: object;

  constructor(public navCtrl: NavController, 
              private eventsCtrl: Events,
              public navParams: NavParams,
              public statusBar: StatusBar,
              private calendar: Calendar,
              private nativeStorage: NativeStorage,
              private nativePageTransitions: NativePageTransitions,
              public ref: ChangeDetectorRef,
              private regex: RegexProvider
              ) {
    this.event = navParams.get('event');

    let descriptionHTML =  JSON.stringify(this.event.description)
                            .replace(/\\n/g, "<br>")
                            .substr(1)
                            .slice(0, -1);
    
    this.descriptionHTML = this.regex.urlify(descriptionHTML);
    
    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
  }

  ionViewWillEnter() {
    console.log('Description ENTER');

    this.imgHeight =  document.getElementById('duotone').offsetTop + 
                      document.getElementById('duotone').offsetHeight -
                      document.getElementsByTagName('ion-navbar').item(0).firstElementChild.parentElement.offsetHeight/2;

    this.nativeStorage.getItem('likedID')
    .then(data => {
      this.likedID = data;

      const id = this.event.id;
      const isExist = this.in_array(id, this.likedID);

      if(isExist) {
        this.display1 = {'display': 'none'};
        this.display2 = {'display': 'block'};
      }
    })
    .catch(() => {
      this.likedID = [];
      this.display1 = {'display': 'block'};
      this.display2 = {'display': 'none'};
    });

    this.nativeStorage.getItem('likedDATA')
    .then(data => {
      this.likedDATA = data;
    })
    .catch(() => {
      this.likedDATA = [];
    });
  }

  onScroll(event: any){
    let scrollTop = event.scrollTop;
    this.showToolbar = scrollTop >= this.imgHeight;

    // console.log(this.showToolbar);

    this.ref.detectChanges();
  }

  likeEvent(e) {
    console.log('Like Event');

    this.findParentBySelector(e.target, 'ion-grid')
      .then(res => {
        
        if(res != null) {          
          const effect = res.getElementsByClassName('like').item(0);

          const id = this.event.id;
          const isExist = this.in_array(id, this.likedID);
          
          if(isExist) {
            this.display1 = {'display': 'block'};
            this.display2 = {'display': 'none'};
            let index = this.likedID.indexOf(id);

            if(index!=-1) {
              this.likedID.splice(index, 1);
              this.likedDATA.splice(index, 1);

              this.eventsCtrl.publish('dislikeID', id);
            }
          }
          else {
            this.display1 = {'display': 'none'};
            this.display2 = {'display': 'block'};

            this.likedID.push(id);
            this.likedDATA.push(this.event);
          }
          this.nativeStorage.setItem('likedID', this.likedID);
          this.nativeStorage.setItem('likedDATA', this.likedDATA);
        }
      });
  }

  addCalendar(e) {
    console.log('Calendar');

    const id = this.event.id;

    this.calendar.hasWritePermission()
    .then(res => {
      console.log(res);
      if(res == true) {
        let startDate = this.event.start_time;

        let endDate: Date;
        if(this.event.end_time) {
          endDate = this.event.end_time;
        }
        else {
          endDate = new Date();
          endDate.setHours(startDate.getHours() + 2);
        }
        
        this.calendar.createEventInteractively(this.event.name, this.event.location, this.event.description, startDate, endDate);
      }
      else {
        this.calendar.requestWritePermission();
      }
    })
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

  private in_array(string: string, array: Array<any>){
    let result = false;
    for(let i=0; i<array.length; i++){
      if(array[i] == string){
        result = true;
      }
    }
    return result;
  }
}
