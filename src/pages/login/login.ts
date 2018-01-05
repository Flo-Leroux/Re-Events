import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// --- Add Pages --- //
import { RegisterPage } from '../register/register';
import { EventsPage } from '../events/events';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { RegexProvider } from '../../providers/regex/regex';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FacebookProvider } from '../../providers/facebook/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = {} as User;
  email: boolean = false;
  password: boolean = false;

  constructor(public navCtrl: NavController,
              private statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions,
              private reg: RegexProvider,
              private firebase: FirebaseProvider,
              private facebook: FacebookProvider) {
    this.ionView();
  }

  ionViewWillLeave() {

  }

  ionView() {
    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);
    
    // set status bar to white
    /* this.statusBar.backgroundColorByHexString('#B3000000');
    this.statusBar.styleLightContent(); */
  }

    /**
   * Test si l'email est valide :
   *    - True  =>  Affiche les champs "Mot de passe"
   * @param {User} user 
   */
  emailInput(user: User) {
    let regEmail: boolean = this.reg.email(user.email);
    
    if(regEmail) {
      this.email = true;
    }
    else {
      this.email = false;   
    }
  }
  
  /**
   * Test si le mot de passe est valide :
   *    - True  =>  Active le bouton "Se Connecter"
   * @param {User} user 
   */
  passwordInput(user: User) {
    let regPassword: boolean = this.reg.password(user.password);

    if(regPassword) {
      this.password = true;
    }
    else {
      this.password = false;
    }
  }

  login() {
    if(this.password==true && this.email==true) {
      
      this.firebase.emailLogin(this.user)
      .then(() => {
        let options: NativeTransitionOptions = {
          duration: 500,
          slowdownfactor: -1
        }
        this.nativePageTransitions.fade(options);
        this.navCtrl.setRoot(EventsPage);
      })
      .catch(() => {
        let options2: NativeTransitionOptions = {
          duration: 500,
          slowdownfactor: -1
        }
        this.nativePageTransitions.fade(options2);
        this.navCtrl.push(RegisterPage, {'userEmail': this.user.email, 'userPassword': this.user.password});
      });     
    }
  }

  facebookConnect() {
    this.facebook.login()
    .then(res => {
      let options: NativeTransitionOptions = {
        duration: 500,
        slowdownfactor: -1
      }
      this.nativePageTransitions.fade(options);
      this.navCtrl.setRoot(EventsPage);
    })
  }

  register() {
    let options: NativeTransitionOptions = {
      duration: 500,
      slowdownfactor: -1,
    }; 
    this.nativePageTransitions.fade(options);
    this.navCtrl.push(RegisterPage);
  }

}
