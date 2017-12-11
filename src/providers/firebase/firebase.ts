import { Injectable } from '@angular/core';

// --- Add Firebase --- //
import * as firebase from 'firebase';
// import { AngularFireAuth } from 'angularfire2/auth';

// --- Add Plugins --- //
import { ToastController } from 'ionic-angular';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Configs --- //
import { FIREBASE_CONFIG } from '../../app/app.firebase.config';

@Injectable()
export class FirebaseProvider {

  constructor(private toastCtrl: ToastController) {

    firebase.initializeApp(FIREBASE_CONFIG);
  }

  write_User_Infos(userId: string, user: User) {
    console.log("Write User Infos");
    if(user.birthday && !user.pictureURL) {
      firebase.database().ref(`users/${userId}/`).set({
        firstname   : user.prenom,
        lastname    : user.nom,
        birthday    : user.birthday
      });
    }
    else if(user.pictureURL && !user.birthday) {
      firebase.database().ref(`users/${userId}/`).set({
        firstname   : user.prenom,
        lastname    : user.nom,
        pictureURL  : user.pictureURL
      });
    }
    else if(user.birthday && user.pictureURL) {
      firebase.database().ref(`users/${userId}/`).set({
        firstname   : user.prenom,
        lastname    : user.nom,
        pictureURL  : user.pictureURL,
        birthday    : user.birthday
      });      
    }
    else {
      firebase.database().ref(`users/${userId}/`).set({
        firstname   : user.prenom,
        lastname    : user.nom
      });
    }
  }

  upload_Profil_Picture(userId: string, image: any): void {
      // Upload Image to Firebase storage
      firebase.storage().ref(`users/${userId}/profile.jpg`)
                        .putString(image, 'data_url');
  }

  lostPassword(user: User) {
    console.log(user.email);
    firebase.auth().sendPasswordResetEmail(user.email)
    .then(res => {
      let toastLostPassword = this.toastCtrl.create({
        message: 'Email de réinitialisation du mot de passe envoyé.',
        duration: 3000,
        position: 'top'
      });
      toastLostPassword.present();
    });
  }

  EmailExist(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().fetchProvidersForEmail(email)
      .then(res => {
        console.log(res);
        console.log("Email Exist | Firebase Provider");
        if(res[0]) {
          console.log(res);
          reject();
        }
        else {
          resolve();
        }
      })
      .catch(err => {
        console.log(err);
      })
    })
  }

  FacebookRegister(facebook_token: string): Promise<any> {
    return new Promise((resolve, reject) => {
  
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(facebook_token);
  
      firebase.auth().signInWithCredential(facebookCredential)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  emailLogin(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        resolve();
      })
      .catch(err => {
        console.log(err);
        reject();
      });
    });
  }
}
