import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AngularFireAuth } from 'angularfire2/auth';
import { NativeStorage } from '@ionic-native/native-storage';
import * as firebase from 'firebase';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Pages --- //
import { RegisterphotoPage } from '../registerphoto/registerphoto';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

// --- Add Providers --- //
import { RegexProvider } from '../../providers/regex/regex';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FacebookProvider } from '../../providers/facebook/facebook';

// --- Add Configs --- //

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  user = {} as User;

  email: boolean = false;
  step1: boolean = true;
  step2: boolean = false;

  confirmation: string = "";

  errors = {
    email: false
  }

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions,
              private nativeStorage: NativeStorage,
              private reg: RegexProvider,
              private firebase: FirebaseProvider,
              private facebook: FacebookProvider,
              private aFauth : AngularFireAuth,
              private navParams: NavParams) {
    if(navParams.get('userEmail')) {
      this.user.email = navParams.get('userEmail');
      this.user.password = navParams.get('userPassword');
      this.email = true;
    }
  
    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
  }

  /**
   * Test si l'email est valide :
   *    - True  =>  Affiche les champs "Mot de passe" & "Confirmation"
   *    - False =>  Affiche un message d'erreur
   * @param {User} user 
   */
  emailInput(user: User) {
    let regEmail: boolean = this.reg.email(user.email);

    if(regEmail) {
      this.firebase.EmailExist(user.email)
      .then((res) => {
        this.email = true;
      })
      .catch(err => {
        this.email = false;
        this.errors.email = true;
        let toastEmail = this.toastCtrl.create({
          message: 'Cette adresse email est déjà utilisé.',
          duration: 3000,
          position: 'top'
        });
        toastEmail.present();
      });
    }
    else {
      this.email = false;   
    }
  }

  errorsEmail() {
    console.log('Errors');
    this.firebase.lostPassword(this.user);
  }

  /**
   * Test si le mot de passe et la confirmation sont égaux et valides :
   *    - True  =>  Affiche les champs "Nom", "Prénom" & "Date de naissance"
   *    - False =>  Affiche un message d'erreur
   * @param {User} user 
   */
  passwordConfirm(user: User) {
    let regPassword: boolean = this.reg.password(user.password);
    let regConfirm: boolean = this.reg.password(this.confirmation);
    
    if(!regPassword) {
      let toastPasswordRegex = this.toastCtrl.create({
        message: 'Le mot de passe doit comporté au moins 8 caractères, 1 lettre et 1 chiffre.',
        duration: 3000,
        position: 'top'
      });
      toastPasswordRegex.present();   
    }
    
    if(regPassword && regConfirm && user.password.length>=8 && this.confirmation.length>=8) {
      if(user.password === this.confirmation) {
        this.step1 = false;
      }
      else {
        this.step1 = true;
        let toastPasswordConfirm = this.toastCtrl.create({
          message: 'Les mots de passe ne correspondent pas.',
          duration: 3000,
          position: 'top'
        });
        toastPasswordConfirm.present();
      }
    }
    else {
      this.step1 = true;   
    }
  }

  /**
   * Test si les champs "Nom" & "Prénom" sont complétés :
   *    - True  =>  Active le bouton "S'inscrire"
   *    - False =>  Affiche un message d'erreur
   * @param {User} user 
   */
  step2Inputs(user: User) {
    if(user.lastname && user.firstname) {
      this.step2 = true;
    }
    else {
      this.step2 = false;
    }
  }

  register() {
    if(!this.step1 && this.step2 ) {
      let options2: NativeTransitionOptions = {
        duration: 800,
        slowdownfactor: -1,
        iosdelay: 50,
        androiddelay: 100,
      }; 
      this.nativePageTransitions.fade(options2);
      this.navCtrl.setRoot(RegisterphotoPage, {'userInfo' : this.user});
    } 
  }

  facebookRegister() {
    this.facebook.login()
    .then(res => {

      this.user.facebook = true;

      this.nativeStorage.setItem('USER', this.user);

      let options: NativeTransitionOptions = {
        duration: 800,
        slowdownfactor: -10
      }; 
      this.nativePageTransitions.fade(options);
      this.navCtrl.setRoot(TabsPage);
    });
  }

  login() {
    let options: NativeTransitionOptions = {
      duration: 800,
      slowdownfactor: -10
    }; 
    this.nativePageTransitions.fade(options);
    this.navCtrl.setRoot(LoginPage);
  }

}
