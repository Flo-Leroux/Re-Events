import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-splashscreen',
  templateUrl: 'splashscreen.html',
})
export class SplashscreenPage {

  constructor(public navCtrl: NavController,
              private nativeTransition: NativePageTransitions,
              private nativeStorage: NativeStorage,
              public viewCtrl: ViewController,
              public splashScreen: SplashScreen,   
              public navParams: NavParams) {
  }

  ionViewDidEnter() {
 
    this.splashScreen.hide();
    console.log('Splash End');
    setTimeout(() => {
      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativeTransition.fade(options);
      // this.navCtrl.setRoot(LoginPage);
    }, 5000);
 
  }

  /* ionViewDidLoad() {
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
      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativeTransition.fade(options);
      this.navCtrl.setRoot(LoginPage);              
    }); 
  }*/
/* 
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
  } */

}
