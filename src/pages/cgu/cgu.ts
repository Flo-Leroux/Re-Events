import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { NativeStorage } from '@ionic-native/native-storage';
import { StatusBar } from '@ionic-native/status-bar';


// --- Add Pages --- //
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-cgu',
  templateUrl: 'cgu.html',
})
export class CguPage {

  origin: string;
  user = {} as User;
  facebook_token_user: string;
  imgPath: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private statusBar: StatusBar,
              private nativeStorage: NativeStorage,              
              private nativePageTransitions: NativePageTransitions,
              public firebase: FirebaseProvider) {
  }

  ionViewDidLoad() {
    this.origin = this.navParams.get('origin');

    if(this.origin==='profile') {
      this.navCtrl.removeView(this.navCtrl.getPrevious());    
    }

    if(this.navParams.get('token')) {
      this.facebook_token_user = this.navParams.get('token');
    }

    if(this.navParams.get('user')) {
      this.user = this.navParams.get('user');
    }

    if(this.navParams.get('img')) {
      this.imgPath = this.navParams.get('img');
    }
  }

  refused() {
    if(this.origin==='facebook') {
      console.log(this.origin);
      let options: NativeTransitionOptions = {
        duration: 1500,
        slowdownfactor: -1
      }
      this.nativePageTransitions.fade(options);
      this.navCtrl.setRoot(this.navCtrl.getPrevious());
    }
    else {
      let options: NativeTransitionOptions = {
        duration: 1500,
        slowdownfactor: -1
      }
      this.nativePageTransitions.fade(options);
      this.navCtrl.setRoot(LoginPage);
    }
  }

  accepted() {
    if(this.origin==='facebook') {
      this.firebase.FacebookRegister(this.facebook_token_user)
      .then(() => {
        return this.firebase.getStatus();
      })
      .then(user => {
        console.log('USER');
        console.log(this.user);
        return this.firebase.write_User_Infos(user.uid, this.user);
      })
      .then(() => {
        return this.firebase.getUserInfo()
      })
      .then(userInfos => {
        this.user.facebook = userInfos.facebook = true;
  
        this.nativeStorage.setItem('USER', userInfos);
  
        let options: NativeTransitionOptions = {
          duration: 500,
          slowdownfactor: -1
        }
        this.nativePageTransitions.fade(options);
        this.navCtrl.setRoot(TabsPage);
      });
    }
    else {
      console.log('Register');
      this.firebase.emailRegister(this.user)
      .then(res => {
        if(this.imgPath != './assets/imgs/persona.jpg') {
          return this.firebase.upload_Profil_Picture(res.uid, this.imgPath);
        }
        else {
          return false;
        }
      })
      .then(() => {
        if(this.imgPath != './assets/imgs/persona.jpg') {
          return this.firebase.getProfileURL();
        }
        else {
          return false;
        }
      })
      .then(url => {
        if(url == false) {
          this.user.pictureURL = url;
        }
        else {
          this.user.pictureURL = './assets/imgs/persona.jpg';
        }
        return this.firebase.getStatus();
      })
      .then(user => {
        console.log('USER');
        console.log(user.uid);
        return this.firebase.write_User_Infos(user.uid, this.user);
      })
      .then(res => {
        //return this.firebase.sendEmailVerification();
      })
      .then(res => {
        this.user.facebook = false;      
        this.nativeStorage.setItem('USER', this.user);
  
        let options: NativeTransitionOptions = {
          duration: 800,
          slowdownfactor: -1
        }; 
        this.nativePageTransitions.fade(options);
        this.navCtrl.setRoot(TabsPage);
      });
    }
  }

}
