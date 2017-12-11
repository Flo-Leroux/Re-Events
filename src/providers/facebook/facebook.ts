
import { Injectable, Inject } from '@angular/core';

import { Platform } from 'ionic-angular';

// --- Plugins --- //
/* Ionic's Plugins */
import { Facebook } from '@ionic-native/facebook';

// --- Provider --- //
import  { FirebaseProvider } from '../firebase/firebase';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Configs --- //
import { FACEBOOK_CONFIG } from '../../app/app.facebook.config';

@Injectable()
export class FacebookProvider {

  user = {} as User;
  facebook_token: string;

  constructor(private fb: Facebook,
              private firebase: FirebaseProvider,
              private platform: Platform) {
  }

  login(): Promise<any>{
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
          console.log(res);
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
          console.log("logged");
          resolve();
        });
      }
    });
  }

  api(request: string): Promise<any> {
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

}
