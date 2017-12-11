import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// --- Add Pages --- //
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  constructor(public navCtrl: NavController,
              private statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions) {
                console.log("Events Page");
  }

  ionViewWillLeave() {

  }
}
