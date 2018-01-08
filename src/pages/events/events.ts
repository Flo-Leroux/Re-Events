import { Component, Injectable, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { Http } from '@angular/http';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// --- Add Pages --- //
import { RegisterPage } from '../register/register';

// --- Add Providers --- //
import { AnimationProvider } from '../../providers/animation/animation';
import { FacebookProvider } from '../../providers/facebook/facebook';
import { GeolocationProvider } from '../../providers/geolocation/geolocation';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  // --- Variables --- //
  isLoading: boolean = true;
  isError: boolean = false;
  isFinished: boolean = true;
  
  activeDate: string;

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
              private nativePageTransitions: NativePageTransitions,
              private animation: AnimationProvider,
              private facebook: FacebookProvider,
              private geolocation: GeolocationProvider) {

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

    console.log(scroll.length);

    for(let i=0; i<scroll.length; i++) {
      scroll[i].scrollTo(width, 0);
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
  
  // --- User Events --- //

  /**
   * It is a function which have a relation with the scroll Event
   * => same as 'addEventListener("scroll")'
   */
  private scrollEvent() {

    // Local Variables
    const myContent = document.getElementsByClassName('scroll-content').item(0);
    const dividerDate = document.getElementsByTagName('ion-item-divider');   
    const header = document.getElementById('rectBackground');
    let item = [];

    // Add Values in Item's Array
    for(let i in dividerDate) {
      let ii = dividerDate.item(parseInt(i)).firstChild.parentElement.offsetTop;
      item.push(ii);
    }

    // Scroll Event Function
    this.content.ionScroll.subscribe(event => {      
      let scrollTop = myContent.scrollTop;
      
      // Date in header modification
      let elt;
      if(item[1]>scrollTop) {
        elt = dividerDate.item(0).getElementsByTagName('ion-label').item(0).innerHTML;
      }
      else { 
        for(let i=1; i<item.length; i++) {
          if(item[i+1]>scrollTop && scrollTop>=item[i]) {
            elt = dividerDate.item(i).getElementsByTagName('ion-label').item(0).innerHTML;
          }
        }
      }
      this.activeDate = elt;

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
    console.log(lgt);

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
      return this.facebook.findEventsByPlaces('',coords)
    })
    .catch(err => {
      console.log('Geolocation Error');
      console.log(err);
      this.isLoading = false;
      this.isError =true;
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
        
        for(let i=0; i<this.nbEventsBeforeReload; i++) {
          this.activeDatas.push(this.datas[i]);
        }
        
        if(refresher) {
          refresher.complete();
        }
      }
    })
    .then(() => {
      if(!this.isError) {
        this.isLoading = false;
        setTimeout(() => {
          console.log('Events ok');
          this.scrollEvent();
          this.scrollHorizontalCards();
          this.redimensionnement();
          document.getElementsByTagName('ion-item-divider').item(0).setAttribute('hidden','');
          this.activeDate = document.getElementsByTagName('ion-item-divider').item(0).getElementsByTagName('ion-label').item(0).innerHTML;
        }, 2500);
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
}
