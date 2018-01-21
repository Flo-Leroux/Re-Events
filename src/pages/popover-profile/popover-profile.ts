import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

// --- Add PAges --- //
import { LoginPage } from '../login/login';
import { EditProfilePage } from '../edit-profile/edit-profile';

// --- Add Providers --- //
import { FacebookProvider } from '../../providers/facebook/facebook';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-popover-profile',
  templateUrl: 'popover-profile.html',
})
export class PopoverProfilePage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions,
              private facebook: FacebookProvider,
              private firebase: FirebaseProvider) {
  }

  goEditProfile() {
    console.log('EditProfile');
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      slowdownfactor: -1
    }
    this.nativePageTransitions.slide(options);
    this.navCtrl.push(EditProfilePage);
  }

  goSettings() {

  }

  logout() {
    let alert = this.alertCtrl.create({
      message: 'Es-tu sûr de vouloir te déconnecter ?',
      buttons: [
        {
          text: 'Oui, sûr',
          role: 'oui',
          handler: () => {
            this.firebase.getStatus()
            .then((user) => {
              console.log(user.providerId);
              if(user.providerId == 'firebase') {
                return Promise.all([this.firebase.logout(), user.providerId]);
              }
              else {
                return Promise.all([this.facebook.logout(), user.providerId]);
              }
            })
            .then(([res, provider]) => {
              console.log(res);
              let options: NativeTransitionOptions = {
                duration: 500,
                slowdownfactor: -1
              }
              this.nativePageTransitions.fade(options);
              this.navCtrl.push(LoginPage);
            })
          }
        },
        {
          text: 'Annuler',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }
}
