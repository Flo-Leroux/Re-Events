import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { NativeStorage } from '@ionic-native/native-storage';

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
              private nativeStorage: NativeStorage,           
              private firebase: FirebaseProvider,   
              private nativePageTransitions: NativePageTransitions) {
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
      
    }
    else {
      console.log('Register');
      
    }
  }

}
