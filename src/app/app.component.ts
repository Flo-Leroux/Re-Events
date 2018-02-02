import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeStorage } from '@ionic-native/native-storage';

// --- Add Pages --- //
import { LoginPage } from '../pages/login/login';
import { EventsPage } from '../pages/events/events';
import { ProfilePage } from '../pages/profile/profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { TabsPage } from '../pages/tabs/tabs';

// --- Add Models --- //
import { User } from '../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../providers/firebase/firebase';
import { FacebookProvider } from '../providers/facebook/facebook';

@Component({
  templateUrl: 'app.html'
})
export class ReEvents {

  rootPage: any;
  user = {} as User;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private nativeStorage: NativeStorage,
              private firebase: FirebaseProvider,
              private facebook: FacebookProvider) {

    this.nativeStorage.getItem('USER')
    .then(res => {
      console.log('NATIVE STORAGE');
      console.log(res);

      if(res.facebook == false) {
        console.log('Email');
        this.login(res);
      }
      else {
        console.log('Facebook');
        this.facebookConnect();
      }
    })
    .catch(err => {
      console.log('Empty Data');
      this.rootPage = LoginPage;              
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  login(user) {
    if(user != null) {
      this.firebase.emailLogin(user)
      .then(() => {
        this.rootPage = TabsPage;        
      })
      .catch(() => {
        this.rootPage = LoginPage;                
      });     
    }
  }

  facebookConnect() {
    this.facebook.login()
    .then(res => {
      this.rootPage = TabsPage;
    })
    .catch(err => {
      this.rootPage = LoginPage;
    })
  }
}

