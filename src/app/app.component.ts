import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// --- Add Pages --- //
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { SplashscreenPage } from '../pages/splashscreen/splashscreen';

// --- Add Models --- //
import { User } from '../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../providers/firebase/firebase';
import { FacebookProvider } from '../providers/facebook/facebook';

@Component({
  templateUrl: 'app.html'
})
export class ReEvents {

  rootPage: any = SplashscreenPage;
  user = {} as User;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public modalCtrl: ModalController,
              public splashScreen: SplashScreen,
              private firebase: FirebaseProvider,
              private facebook: FacebookProvider) {
    platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);        
      statusBar.styleLightContent();
    });
  }
}

