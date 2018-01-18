import { Component, Injectable, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { Http } from '@angular/http';
import { NavParams } from 'ionic-angular/navigation/nav-params';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { DatePicker } from '@ionic-native/date-picker';
import { Calendar } from '@ionic-native/calendar';

// --- Add Pages --- //
import { RegisterPage } from '../register/register';
import { DescriptionPage } from '../description/description';

// --- Add Providers --- //
import { AnimationProvider } from '../../providers/animation/animation';
import { FacebookProvider } from '../../providers/facebook/facebook';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';
import { FirebaseProvider } from '../../providers/firebase/firebase';

// --- Add Models --- //
import { User } from '../../models/User';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  user = {} as User;

  // --- Links with front-end --- //
  rangeNumber: number = 500;
  firstDatePicker: Date = new Date();
  keywordsInput: string = '';

  cityName: string;


  // --- Variables --- //
  isLoading: boolean = true;
  isError: boolean = false;
  isFinished: boolean = true;
  
  activeDate: string;
  lastActiveDate: string;
  nbActiveDate: number;

  loadingMessage: string = 'Initialisation';
  errorMessage: string = 'Rrrh ! On n\'arrive pas à te localiser. Active ton GPS et recharge la page ;)'

  @ViewChild(Content)
  content: Content;

  jsonPATH: string = 'assets/json/eventsOrganised.json';
  datas: JSON;

  activeDatas: any = [];

  liked: Array<any> = [];
  bookmarked: Array<any> = [];

  nbEventsBeforeReload: number = 5;

  constructor(public navCtrl: NavController,
              private http: Http,
              private statusBar: StatusBar,
              private navParams: NavParams,
              private nativePageTransitions: NativePageTransitions,
              private datePicker: DatePicker,
              private calendar: Calendar,
              private animation: AnimationProvider,
              private facebook: FacebookProvider,
              private geolocation: GeolocationProvider,
              private firebase: FirebaseProvider) {

    //this.user = navParams.get('userInfo');

    this.user.email = 'test@test.com';
    this.user.password = 'test1234';
    
    if(this.user.email) {
      this.firebase.emailLogin(this.user)
      .then(() => {
        this.getUserName();
      })
    }

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
  }

  // --- App Life State --- //

  ionViewDidLoad() {

  }

  ionViewWillEnter() {
    console.log('Will Enter')
    
    this.doRefreshGeolocation();
  }

  // --- Design Transformations --- //

  private scrollHorizontalCards() {
    let scroll = document.querySelectorAll('ion-scroll.scroll-x .scroll-content');
    let width = scroll[0].firstElementChild.parentElement.offsetWidth;

    for(let i=0; i<scroll.length; i++) {
      //scroll[i].scrollLeft = width;
    }
  }

  redimensionnement(){ 
    var image = document.getElementsByTagName('img');

    for(var img in image) {
      let i = parseInt(img);

      var image_width = image.item(i).getBoundingClientRect().width;
      var image_height = image.item(i).getBoundingClientRect().height; 

      var ratio = image_width/image_height;

      if(ratio >= 1.5) { // Paysage
        image.item(i).style.height = '100%'; 
      }
      else { // Portrait
        image.item(i).style.width = '100%'; 
      }
    }
  } 

  in_array(string, array){
    let result = false;
    for(let i=0; i<array.length; i++){
      if(array[i] == string){
        result = true;
      }
    }
    return result;
  }
  
  private getCityName(coords?: Array<number>) {
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords[0]+','+coords[1]+'&key=AIzaSyBHGfBQR2Pfumh6kWADjvTXIppbUqtV6gk')
    .subscribe(data => {
      let tmp = data.json();

      if(tmp.status == 'OK') {
        let nbLocality: number = -1;
  
        for(let i=0; i<tmp.results[0].address_components.length; i++) {
          let nb = tmp.results[0].address_components[i];
  
          for(let k=0; k<nb.types.length; k++) {
            if(nb.types[k] == 'locality') {
              nbLocality = i;
              break;
            }
          }
  
          if(nbLocality!=-1) {
            break;
          }
        }
  
        this.cityName = 'à '+tmp.results[0].address_components[nbLocality].long_name;
      }
    });
  }

  private getUserName() {
    this.firebase.getUserName()
    .then(res => {
      this.user.nom = res;
    })
  }

  // --- User Events --- //

  /**
   * It is a function which have a relation with the scroll Event
   * => same as 'addEventListener("scroll")'
   */
  private scrollEvent() {

    // Local Variables
    const myContent = document.getElementsByClassName('scroll-content').item(0);
    const dividerDate = document.querySelectorAll('ion-item-group');
    const header = document.getElementById('rectBackground');
    
    let arrayDate= []; // Will hold the array of Node's
    for(var i = 0, ll = dividerDate.length; i != ll; arrayDate.push(dividerDate[i++]));

    arrayDate.forEach((element, i ) => {
      let elt0;
      if(i==0) {
        elt0 = this.datas[0].day.toString().substring(0, 15);
      }
      else {
        elt0 = this.datas[i-1].day.toString().substring(0, 15);
      }  

      let elt1 = this.datas[i].day.toString().substring(0, 15);

      if(elt0==elt1) {
        element.getElementsByTagName('ion-item-divider').item(0).style.display = 'none';
      }
    });

    // Scroll Event Function
    this.content.ionScroll.subscribe(event => {     
      let scrollTop = this.content.scrollTop;

      arrayDate.forEach((element, i) => {
        let top = element.offsetTop;
        let bottom = top + element.offsetHeight;
        
        if(scrollTop>=top && scrollTop<=bottom && this.nbActiveDate!=i) {
          element.classList.add('js-Header');
        
          this.activeDate = this.datas[i].day;
          this.nbActiveDate = i;

        }
        else {
          element.classList.remove('js-Header');
        }
      });

      // Transformation effect of header (Skew & Translate)
      if(scrollTop>20 && scrollTop<200) {
        let top = scrollTop/10;
        let skew = scrollTop/28;
        let transform;

        if(top>10 && top<20) {
          transform = 'translateY(-'+top+'vh)';          
        }
        else if(top<=10) {
          transform = 'translateY(-10vh)';          
        }
        else {
          transform = 'translateY(-20vh)';                    
        }

        skew = 8-skew;
        if(skew<9 && skew>=0) {
          transform = 'skewY('+skew+'deg) ' + transform;
        }
        else if(skew>=9) {
          transform = 'skewY(8deg) ' + transform;          
        }
        else {
          transform = 'skewY(0deg) ' + transform;          
        }
        header.style.transform = transform;      
      }
      else if(scrollTop>=200) {
        header.style.transform = 'skewY(0deg) translateY(-20vh)';
      }
      else {
        header.style.transform = 'skewY(8deg) translateY(-10vh)';
      }
    })
  }

  getMoreEvents(e) {
    console.log('Getting More Events');
    let lgt = this.activeDatas.length;

    for(let i=0; i<this.nbEventsBeforeReload; i++) {
      this.activeDatas.push(this.datas[lgt+i]);
    }

    setTimeout(() => {
      this.scrollHorizontalCards();
      this.scrollEvent();
      this.redimensionnement();
      e.complete();
    }, 200);

  }

  doRefreshGeolocation(refresher?) {
    console.log('Do Refresh');

    if(refresher) {
      this.loadingMessage = 'Nouvelle recherche !'
    }

    this.isLoading = true;
    this.isError = false;
    this.isFinished = false;

    this.geolocation.getCurrentPosition()    
    .then(coords => {
      console.log('Geolocation Success');
      console.log(coords[0] + ',' + coords[1]);
      this.loadingMessage = 'Geolocalisation réussie ! Nous t\'avons trouvé ;)';
      this.getCityName(coords);
      return this.facebook.findEventsByPlaces(this.keywordsInput, coords, this.rangeNumber, this.firstDatePicker);
    })
    .catch(err => {
      console.log('Geolocation Error');
      console.log(err);
      this.isLoading = false;
      this.isError =true;

      if(refresher) {
        refresher.complete();
      }
    })
    .then(events => {
      if(!this.isError) {
        setTimeout(() => {
          if(events.length>1) {
            this.loadingMessage = 'Yeah des événements sont disponibles ! Profites-en !';
          }
          else if(events.length==1) {
            this.loadingMessage = 'Yeah un événement disponible près de toi ! N\'hésites pas à changer tes paramètres de recherche !';
          }
          else {
            this.loadingMessage = 'Oups, pas d\'événement. Essayes d\'autres paramètres de recherche.';
          }
        }, 5000);

        this.datas = events;
        this.isFinished = true;    
        
        if(refresher) {
          refresher.complete();
        }
      }
    })
    .then(() => {
      if(!this.isError) {
        if(this.datas[0]) {
          setTimeout(() => {
            console.log('Events ok');
            this.activeDate = this.datas[0].day;
            this.scrollEvent()
            this.scrollHorizontalCards();
            //this.redimensionnement();
            setTimeout(() => {
              this.isLoading = false;  
              document.getElementById('myList').setAttribute('style', '');
            }, 250);
          }, 250);
        }
      }
    })
    .then(() => {
    });
  }

  likeEvent(e) {
    console.log('Like Event');

    this.findParentBySelector(e.target, 'ion-item')
      .then(res => {
        
        if(res != null) {          
          const effect = res.getElementsByClassName('action_effect').item(0)
                          .getElementsByClassName('like').item(0);
  
          const border = res.getElementsByClassName('card2').item(0)
                          .getElementsByClassName('like').item(0)
                          .getElementsByTagName('img').item(0);
  
          const black = res.getElementsByClassName('card2').item(0)
                          .getElementsByClassName('like').item(0)
                          .getElementsByTagName('img').item(1);

          const id = res.firstChild.parentNode.getAttribute('id');
          const isExist = this.in_array(id, this.liked);
          
          if(isExist) {
            black.style.display = 'none';
            border.style.display = 'block';
            let index = this.liked.indexOf(id);

            if(index!=-1) {
              this.liked.splice(index, 1);
            }
          }
          else {
            this.liked.push(id);

            effect.style.opacity = 0;
            effect.style.display = 'block';

            this.animation.fadeIn(effect)
              .then(() => {
                effect.style.opacity = 1;      
                effect.style.display = 'block';
                border.style.display = 'none';
                black.style.display = 'block';
                setTimeout(() => {
                  return this.animation.fadeOut(effect);
                }, 250);
              })
              .then(() => {
                setTimeout(() => {
                  effect.style.display = 'none';
                }, 500);
              });
          }
        }
      });
  }
  
  bookmarkEvent(e) {
    console.log('Press Event');

    this.findParentBySelector(e.target, 'ion-item')
    .then(res => {
      
      if(res != null) {          
        const effect = res.getElementsByClassName('action_effect').item(0)
                        .getElementsByClassName('bookmark').item(0);

        const border = res.getElementsByClassName('card2').item(0)
                        .getElementsByClassName('bookmark').item(0)
                        .getElementsByTagName('img').item(0);

        const black = res.getElementsByClassName('card2').item(0)
                        .getElementsByClassName('bookmark').item(0)
                        .getElementsByTagName('img').item(1);

        const id = res.firstChild.parentNode.getAttribute('id');
        const isExist = this.in_array(id, this.bookmarked);
        
        if(isExist) {
          black.style.display = 'none';
          border.style.display = 'block';
          let index = this.bookmarked.indexOf(id);

          if(index!=-1) {
            this.bookmarked.splice(index, 1);
          }
        }
        else {
          this.bookmarked.push(id);

          effect.style.opacity = 0;
          effect.style.display = 'block';

          this.animation.fadeIn(effect)
            .then(() => {
              effect.style.opacity = 1;      
              effect.style.display = 'block';
              border.style.display = 'none';
              black.style.display = 'block';
              setTimeout(() => {
                return this.animation.fadeOut(effect);
              }, 250);
            })
            .then(() => {
              setTimeout(() => {
                effect.style.display = 'none';
              }, 500);
            });
        }
      }
    });
  }

  datePickerFunc() {
    this.datePicker.show({
      date: this.firstDatePicker,
      minDate: new Date(),
      allowOldDates: false,
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
    })
    .then(date => {
      console.log(date);
      if(date > new Date()) {
        this.firstDatePicker = date;
      }
      else {
        this.firstDatePicker = new Date();
      }
    })
  }

  addCalendar(e) {
    console.log('Calendar');

    this.findParentBySelector(e.target, 'ion-item')
    .then(res => {
      if(res != null) {

        const id = res.firstChild.parentNode.getAttribute('id');

        this.calendar.hasWritePermission()
        .then(res => {
          console.log(res);
          if(res == true) {

            this.findEventsById(id)
            .then(res => {
              let event = this.datas[res];
              let startDate = event.start_time;

              let endDate: Date;
              if(event.end_time) {
                endDate = event.end_time;
              }
              else {
                endDate = new Date();
                endDate.setHours(startDate.getHours() + 2);
              }
              
              this.calendar.createEventInteractively(event.name, event.location, event.description, startDate, endDate);
            })
          }
          else {
            this.calendar.requestWritePermission();
          }
        })
      }
    })

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
