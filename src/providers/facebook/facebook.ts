
import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';

// --- Plugins --- //
/* Ionic's Plugins */
import { Facebook } from '@ionic-native/facebook';

// --- Provider --- //
import  { FirebaseProvider } from '../firebase/firebase';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Configs --- //
import { FACEBOOK_CONFIG, FACEBOOK_TOKEN } from '../../app/app.facebook.config';

@Injectable()
export class FacebookProvider {

  user = {} as User;
  facebook_token: string = '';

  constructor(private fb: Facebook,
              private firebase: FirebaseProvider,
              private platform: Platform,
              private http: Http) {
  }

  /**
   * Log the user to Firebase database with Facebook Informations
   */
  public login(): Promise<any>{
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')){
        this.fb.login(FACEBOOK_CONFIG)
        .then(res => {        
          if(res.status=="connected") {
            let userFacebookId: string = res.authResponse.userID;
            this.facebook_token = res.authResponse.accessToken;
            return this.api(userFacebookId + '?fields=id,email,first_name,last_name,birthday,picture{url}');
          }
        })
        .then(res => {
          this.user.email = res.email;
          this.user.nom = res.last_name;
          this.user.prenom = res.first_name;
          this.user.birthday = res.birthday;
          this.user.pictureURL = res.picture.data.url;
  
          return this.firebase.EmailExist(this.user.email);
        })
        .then(() => {
          return this.firebase.FacebookRegister(this.facebook_token);
        })
        .catch(() => {
          console.log("OK Logged");
          resolve();
        })
        .then(res => {
          if(res) {
            this.firebase.write_User_Infos(res.uid, this.user);
          }
        })
        .then(() => {
          console.log("Logged");
          resolve();
        });
      }
    });
  }

  /**
   * It is the method to access to Facebook Graph API
   * @param {string} request 
   */
  public api(request: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fb.api(request, FACEBOOK_CONFIG)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  /**
   * It the method to find all Facebook Events around a GPS Center 
   */
  public findEventsByPlaces(query?: string, center?: Array<number>, distance?: number, since?: Date): Promise<any> {
    return new Promise((resolve) => {

      let current_DateTime = new Date();

      if(query==null || query=='') {
        query = "*";
      }
      if(center == null) {
        // reject();
        center = [48.692054, 6.184416999999939];
      }
      if(distance == null || distance == undefined) {
        distance = 500;
      }
      if(since == null || since < current_DateTime) {
        since = current_DateTime;
      }

      // Add Comments here to...
      this.prepareRequestPlaces(query, center, distance)
      .then(stmt => {
        console.log('Prepare quest ok');
        return this.api(stmt);
      })
      .then(datas => {
        return this.allResultsPlaces(datas);
      })
      .then(all => {
        return this.allResultsEvents(all, since);
      })
      .then(events => {
        return this.deletePlacesWithoutEvents(events);      
      })
      // ... Here for testing with local datas

      // Remove Comments to...
/*       this.loadJson('assets/json/eventsBrut.json')
      .then(res => {
        let datas = res.json();
        return this.deletePlacesWithoutEvents(datas);
      }) */
      // ... Here for testing with local datas

      .then(res => {
        return this.mergeEvents(res);
      })
      .then(res => {
        return this.organizeEvents(res);
      })
/*       .then(res => {
        return this.groupEvents(res);
      }) */
      .then(res => {
        console.log(res[0]);
        resolve(res);
      })
    })
  }

  // --- Privates Methods --- //

  /**
   * Prepare the request to Facebook Graph API
   * @param {string} query KeyWords
   * @param {Array<number>} center An Array of 2 float numbers. There are GPS Coordonnates, Latitude and Longitude.
   * @param {number} distance The radius around the center in meters
   * @param {string} category 
   */
  private prepareRequestPlaces(query?: string, center?: Array<number>, distance?: number, category?: string): Promise<string> {
    return new Promise ((resolve, reject) => {
      let stm: string ;
      if(category=="ALL" || category==null){
        stm = 'search?q='+query+'&type=place&center='+center[0]+','+center[1]+'&distance='+distance+'&fields=id,name';
      }
      else {
        stm = 'search?q='+query+'&type=place&center='+center[0]+','+center[1]+'&distance='+distance+'&fields=id,name&categories=["'+category+'"]';    
      }

      this.getAccessTokenFacebook()
      .then(res => {
        resolve(stm+'&access_token='+this.facebook_token);
      })
      .catch(err => {
        reject();
      })
    })
  }

  /**
   * Prepare the request to find events by places
   * @param {Array<any>} places Facebook ID of places
   * @param {number} count 
   */
  private prepareRequestEventsByPlaces(places: Array<any>, count: number, since: Date): string {
    let composer: string = ""; // Composer is the somme of ID Places
    for (let i=count; i<(count+50); i++) {
      if (places[i]) {
        composer += places[i].id+',';
      }
      else {
        break;
      }
    }
    
    // let datetime_UNIX = this.formatDate.transformeDateToUNIX(this.newDate);
    let datetime_UNIX = this.getUnixTime(since);
    console.log('Date ' + datetime_UNIX);

    if (composer != "") {
      composer = composer.substring(0, composer.length-1);
      let stm = 'events?fields=id,name,description,start_time,cover,place&since='+datetime_UNIX+'&ids='+composer+'&access_token='+FACEBOOK_TOKEN;
      return stm;
    }
  }

  /**
   * A classic method to get data without use the Graph API. 
   * @param {string} query The request string
   */
  private requestToHTTP(query: string): Promise<JSON> {
    return new Promise ((resolve) => {
      this.http.get(query).subscribe(data => {
        resolve(data.json());
      });
    })
  }
  
  /**
   * To get all results Places
   * @param {any} datas Last datas results
   */
  private async allResultsPlaces(datas: any): Promise<any> {
    let places = [];
    
    for(let h=0; h<datas.data.length; h++){
      places.push(datas.data[h]);
    }

    while(typeof datas.paging != "undefined") {
      datas = await this.requestToHTTP(datas.paging.next+'&access_token='+this.facebook_token);
      for(let i=0; i<datas.data.length; i++){
        places.push(datas.data[i]);
      }
    }
    return places;
  }

  /**
   * To get all events associated to Facebook places
   * @param {Array<any>} places All places find by allResultsPlaces Method
   */
  private async allResultsEvents(places: Array<any>, since: Date): Promise<any> {
    let events = [];
    let count = 0;

    while(count < places.length) {
      let stm = this.prepareRequestEventsByPlaces(places, count, since);
      let datas = await this.fb.api(stm, []);
      for(let i=count; i<count+50; i++){
        if(places[i]){
          events.push(datas[places[i].id]);
        }
        else {
          break;
        }
      }
      count += 50;
    }   
    return events;
  }

  /**
   * Delete places without events
   * @param {Array<any>} events 
   */
  private deletePlacesWithoutEvents(events: Array<any>): Promise<Array<any>> {
    return new Promise ((resolve) => {
      let new_events: Array<any> = [];

      for (let i=0; i<events.length; i++) {
        if (events[i]==null || !events[i].data || events[i].data.length == 0) {
          delete events[i];        
        }
        else {
          new_events.push(events[i]);
        }
      }
      resolve(new_events);
    })
  }

  /**
   * Merge events & organize the informations
   * @param {Array<any>} events 
   */
  private mergeEvents(events: Array<any>): Promise<Array<object>> {
    return new Promise ((resolve) => {
      let events_final: Array<object> = [];

      for (let j=0; j < events.length; j++){
        for(let i=0; i<events[j].data.length; i++){
          let array = events[j].data;
          let event_info = {
            day: null,
            time: null,
            id: null,
            name: null,
            description: null,
            location: null,
            img: null,
            start_time: null,
            etat: 'segmentIMG'
          }

          event_info.day = event_info.time = new Date(array[i].start_time.replace('T', ' '));
          event_info.id = array[i].id;
          event_info.name = array[i].name;
          event_info.start_time = new Date(array[i].start_time.replace('T', ' '));

          if(array[i].description){
            event_info.description = array[i].description;
          }

          if(array[i].place && array[i].place.location) {
            let street, city, country: string = "";
            if (array[i].place.location.street) {
              street = array[i].place.location.street;
            }
            if(array[i].place.location.city){
              city = array[i].place.location.city;
            }
            if(array[i].place.location.country){
              country = array[i].place.location.country;
            }

            event_info.location = street +', '+ city + ', '+ country;
          }

          if(array[i].cover) {
            event_info.img = array[i].cover.source;
          }
          else {
            event_info.img = null;
          }

          events_final.push(event_info);
        }
      }
      resolve(events_final);
    })
  }

  /**
   * Sort the table by datetime of each event
   * @param {Array<object>} events 
   */
  private async organizeEvents(events: Array<object>): Promise<any> {
    return new Promise ((resolve) => {
      events = events.sort((item1, item2): number => this.sortByDate(item1, item2));
      resolve(events);
    })
  }

  /**
   * Groupe events by date
   * @param {Array<any>} events 
   */
  private groupEvents(events: Array<any>): Promise<any> {
    return new Promise ((resolve) => {
      let eventDay: String = "";
      let groupTmp = {
          day: null,
          tableEvent: []
      };
      let eventsGrouped: Array<any> = [];

      for (let i=0; i<events.length; i++) {
        if (i == 0) {
          eventDay = events[i].day.toDateString();
          groupTmp.day = eventDay;
          groupTmp.tableEvent.push(events[i]);
        }
        else if (events[i].day.toDateString() == eventDay) {
          groupTmp.tableEvent.push(events[i]);
        }
        else {
          eventsGrouped.push(groupTmp);
          groupTmp = {
            day: null,
            tableEvent: []
          };
          eventDay = events[i].day.toDateString();
          groupTmp.day = eventDay;
          groupTmp.tableEvent.push(events[i]);
        }
      }
      resolve(eventsGrouped);
    })
  }

  /**
   * Get an access token to use Facebook Services.
   * Resolve => Get a private token
   * Reject => Get a public token
   */
  private getAccessTokenFacebook(): Promise<String> {
    return new Promise ((resolve, reject) => {
      if(this.facebook_token!='') {
        resolve();
      }
      else {
        this.fb.getAccessToken()
        .then(res => {
          this.facebook_token = res;
          resolve();
        })
        .catch(err => {
          this.facebook_token = FACEBOOK_TOKEN;
          resolve();
        })
      }      
    });
  }

  /**
   * Local function to sort item by date
   * @param {any} item1 
   * @param {any} item2 
   */
  private sortByDate(item1: any, item2: any): any {
    return (item1.start_time < item2.start_time) ? -1 : (item1.start_time === item2.start_time ? 0 : 1);
  }

  /**
   * This method is to load a JSON file for testing with local data
   * @param {string} jsonPATH The path to the JSON file 
   */
  private loadJson(jsonPATH: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(jsonPATH)
      .subscribe(res => {
        resolve(res);
      })
    });
  }

  /**
   * Get Unix Time from Date
   * @param {Date} date 
   */
  private getUnixTime(date: Date) {
    return date.getTime()/1000|0;
  }
}