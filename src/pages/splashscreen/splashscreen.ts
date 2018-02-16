import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FacebookProvider } from '../../providers/facebook/facebook';

// --- Add Pages --- //
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-splashscreen',
  templateUrl: 'splashscreen.html',
})
export class SplashscreenPage {

  user = {} as User;

  constructor(public navCtrl: NavController,
              private nativeTransition: NativePageTransitions,
              private nativeStorage: NativeStorage,
              public viewCtrl: ViewController,
              public splashScreen: SplashScreen,   
              public navParams: NavParams,
              private firebase: FirebaseProvider,
              private facebook: FacebookProvider) {
  }

  ionViewDidEnter() {
    this.splashScreen.hide();
    console.log('Splash End');
    setTimeout(() => {
      this.nativeStorage.getItem('USERCon')
      .then(res => {
        console.log('USER');
        console.log(res);
        if(res.facebook==false) {
          this.loginEmail(res);
        }
        else {
          this.loginFacebook(res);
        }
      })
      .catch(err => {
        console.log('NOT USER');
        console.log(err);
        let options: NativeTransitionOptions = {
          duration: 500,
          slowdownfactor: -1
        }
        this.nativeTransition.fade(options);

        this.navCtrl.setRoot(LoginPage);
      });
    }, 1000);
 
  }

  loginEmail(user) {
    console.log('Login Email');
    this.firebase.emailLogin(user)
    .then(() => {
      console.log('Login Ok');
      return this.firebase.getUserInfo();
    })
    .then((userInfos) => {

      userInfos.facebook = false;
      userInfos.email = this.user.email;
      userInfos.password = this.user.password;
      
      console.log('userInfos');
      console.log(userInfos);
      this.nativeStorage.setItem('USER', userInfos);

      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativeTransition.fade(options);
      this.navCtrl.setRoot(TabsPage);
    })
    .catch(err => {
      console.log('NOT USER');
      console.log(err);
      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativeTransition.fade(options);

      this.navCtrl.setRoot(LoginPage);
    });
  }

  loginFacebook(user) {
    this.facebook.login()
    .then(res => {
      console.log('facebook Connect');
      return this.firebase.FacebookRegister(res)
    })
    .then(() => {
      return this.firebase.getUserInfo();
    })
    .then(userInfos => {
      this.user.facebook = userInfos.facebook = true;

      this.nativeStorage.setItem('USER', userInfos);

      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativeTransition.fade(options);
      this.navCtrl.setRoot(TabsPage);
    })
    .catch(err => {
      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativeTransition.fade(options);

      this.navCtrl.setRoot(LoginPage);
    });
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
