import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// --- Add Pages --- //
import { SplashscreenPage } from '../pages/splashscreen/splashscreen';

@Component({
  templateUrl: 'app.html'
})
export class ReEvents {

  rootPage: any = SplashscreenPage;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public modalCtrl: ModalController,
              public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);        
      statusBar.styleLightContent();
    });
  }
}

