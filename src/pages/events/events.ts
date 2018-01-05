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

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  @ViewChild(Content)
  content: Content;

  jsonPATH: string = 'assets/json/eventsOrganised.json';
  datas: JSON;

  showDay: JSON;
  eventsDay: Array<any>;

  liked: Array<any> = [];
  bookmarked: Array<any> = [];

  itemDividerTop: Array<any> = [];

  constructor(public navCtrl: NavController,
              private http: Http,
              private statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions,
              private animation: AnimationProvider,
              private facebook: FacebookProvider) {
/*     this.loadJson()
    .then(res => {
      this.datas = res.json();
      // console.log('Events Page Datas');
      // console.log(this.datas);
      this.showDay = this.datas[0].day;
      this.eventsDay = this.datas[0].tableEvent; 
    })
    .then(() => {
      setTimeout(() => {
        console.log('ok');
        this.scrollPos();
        this.redimensionnement();
        this.headerTransform();
      }, 500);
    }); */
  }

  ionViewWillEnter() {
    console.log('Did Load')
    this.facebook.findEventsByPlaces()
    .then(events => {
      this.datas = events;
    })
    .then(() => {
      setTimeout(() => {
        console.log('ok');
        this.scrollPos();
        this.redimensionnement();
        this.headerTransform();
      }, 500);
    });
  }

  headerTransform() {
    const content = document.getElementsByClassName('scroll-content').item(0);
    const header = document.getElementById('rectBackground');
    const dividerDate = document.getElementsByTagName('ion-item-divider');   
    
    const vh15 = content.getBoundingClientRect().height*8/100;

    let item = [];

    for(let i in dividerDate) {
      let ii = dividerDate.item(parseInt(i)).firstChild.parentElement.offsetTop;
      item.push(ii);
    }

    content.addEventListener('scroll', function(e){
    
      for(let j in dividerDate) {
        let jj = parseInt(j);
        if(jj>0) {
          if((dividerDate.item(jj-1).firstChild.parentElement.offsetTop+vh15/3) > (item[jj]-vh15)) {
            dividerDate.item(jj).setAttribute('style', 'color: white !important; text-align: left !important;');
          }
          else {
            dividerDate.item(jj).removeAttribute('style');
          }
        }
        else {
          if(content.scrollTop > vh15*2) {
            dividerDate.item(0).setAttribute('style', 'color: white !important; text-align: left !important;');
          }
          else {
            dividerDate.item(0).removeAttribute('style');
          }
        }
      }


      if(content.scrollTop>20 && content.scrollTop<200) {
        let top = content.scrollTop/10;
        let skew = content.scrollTop/28;
        if(top>10 && top<20) {
          header.style.top = '-'+top+'vh';
        }

        skew = 8-skew;
        if(skew<9 && skew>=0) {
          header.style.transform = 'skewY('+skew+'deg)';
        }
      }
      else if(content.scrollTop>=200) {
        header.style.top = '-20vh';
        header.style.transform = 'skewY(0deg)';
      }
      else {
        header.style.top = '-10vh';
        header.style.transform = 'skewY(8deg)';
      }
    });
  }

  scrollPos() {
    let scroll = document.querySelectorAll('ion-scroll.scroll-x .scroll-content');
    let width = scroll.item(nb).scrollWidth;

    for(var i in scroll) {
      var nb = parseInt(i);
      scroll.item(nb).scrollLeft = width/3;

      scroll.item(nb).addEventListener('scroll', function() {
        if(this.scrollLeft<(width/20 - 2.5)) {
          this.scrollLeft = (width/20)-2; 
        }
        else if(this.scrollLeft>((width/3*2)-(width/20)+6)) {
          this.scrollLeft = (width/3*2)-(width/20)+4;
        }
      });
    }
  }

  redimensionnement(){ 
    let card = document.getElementsByClassName('card2');

    for(let k in card) {
      let height = card.item(parseInt(k)).scrollHeight;
      card.item(parseInt(k)).parentElement.getElementsByClassName('card1').item(0).setAttribute('style', 'height:'+height+'px');
      card.item(parseInt(k)).parentElement.getElementsByClassName('card2').item(0).setAttribute('style', 'height:'+height+'px');
      card.item(parseInt(k)).parentElement.getElementsByClassName('card3').item(0).setAttribute('style', 'height:'+height+'px');
    }

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

  loadJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.jsonPATH)
      .subscribe(res => {
        resolve(res);
      })
    });
  }

  collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] == b) return true;
    }
    return false;
  }
  
  findParentBySelector(elm, selector): Promise<any> {
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

  in_array(string, array){
    let result = false;
    for(let i=0; i<array.length; i++){
      if(array[i] == string){
        result = true;
      }
    }
    return result;
  }

}
