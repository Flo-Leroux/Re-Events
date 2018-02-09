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

  user = {} as User;

  constructor(private toastCtrl: ToastController) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  write_User_Infos(userId: string, user: User) {
    console.log("Write User Infos");
    console.log(user);
    firebase.database().ref(`users/${userId}`).on('value', res => {
      console.log(res.val());
      if(!res.val()) {
        if(user.birthday && !user.pictureURL) {
          firebase.database().ref(`users/${userId}/`).set({
            firstname   : user.firstname,
            lastname    : user.lastname,
            birthday    : user.birthday,
            pictureURL  : './assets/imgs/persona.jpg'
          });
        }
        else if(user.pictureURL && !user.birthday) {
          firebase.database().ref(`users/${userId}/`).set({
            firstname   : user.firstname,
            lastname    : user.lastname,
            pictureURL  : user.pictureURL
          });
        }
        else if(user.birthday && user.pictureURL) {
          firebase.database().ref(`users/${userId}/`).set({
            firstname   : user.firstname,
            lastname    : user.lastname,
            pictureURL  : user.pictureURL,
            birthday    : user.birthday
          });      
        }
        else {
          firebase.database().ref(`users/${userId}/`).set({
            firstname   : user.firstname,
            lastname    : user.lastname,
            pictureURL  : './assets/imgs/persona.jpg'
          });
        }
      }
    })
  }

  upload_Profil_Picture(userId: string, image: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if(image == 'assets/imgs/persona.jpg') {
        resolve();
      } 
      else {
        firebase.storage().ref(`users/${userId}/profile.jpg`).putString(image, 'data_url')
        .then(res => {
          resolve(res.downloadURL);
        })
        .catch(err => {
          reject(err);
        })
      }
    });
  }

  getProfileURL(): Promise<any> {
    return new Promise((resolve, reject) => {
      let userId = firebase.auth().currentUser.uid;
      setTimeout(() => {
        firebase.database().ref(`users/${userId}/pictureURL`).on('value', (snap) => {
          let url = snap.val();
          console.log('URL IMAGE');
          console.log(userId);
          console.log(url);
          resolve(url);
        });
      }, 2000);
    });
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
        console.log('Email Exist');
        console.log(res);
        if(res[0]) {
          reject();
        }
        else {
          resolve();
        }
      })
      .catch(err => {
      })
    })
  }

  FacebookRegister(facebook_token: string): Promise<any> {
    return new Promise((resolve, reject) => {
  
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(facebook_token);
      firebase.auth().signInWithCredential(facebookCredential)
      .then(res => {
        console.log('Facebook Login Firebase');
        console.log(res);
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
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  getUserName(): Promise<any> {
    return new Promise((resolve, reject) => {
      let uid = firebase.auth().currentUser.uid;
      let name;
      firebase.database().ref(`users/${uid}/firstname`).on('value', (snap) => {
        name = snap.val();
        resolve(name);
      })
    });
  }

  emailRegister(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
    });
  }

  getStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      let user = firebase.auth().currentUser;
      if(user != null) {
        resolve(user);
      }
      else {
        reject();
      }
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getStatus()
      .then(user => {
        firebase.auth().signOut()
        .then(() => {
          resolve();
        })
      })
    });
  }

  setUserInfo(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;

      if(currentUser != null) {
        currentUser.updateProfile({
          displayName: user.prenom+' '+user.nom,
          photoURL: user.pictureURL
        })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
      }
      else {
        reject();
      }
    });
  }

  getUserInfo(): Promise<any> {
    return new Promise((resolve, reject) => {

      const uid= firebase.auth().currentUser.uid;

      firebase.database().ref(`users/${uid}`).once('value', snap => {
        resolve(snap.val());
      })
    });
  }

  sendEmailVerification(): Promise<any> {
    return new Promise((resolve, reject) => {
      const currentUser = firebase.auth().currentUser;

      currentUser.sendEmailVerification()
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      })
    });
  }

  updateUserInfo(userKey: string, userValue: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const uid = firebase.auth().currentUser.uid;
      let update = {};
      update[`users/${uid}/${userKey}`] = userValue;
      firebase.database().ref().update(update);
      resolve();
    })
  }

  updateUserLikes(like: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('Events Firebase');
      const uid = firebase.auth().currentUser.uid;
      firebase.database().ref(`users/${uid}/likedEvents`).set(like);
    });
  }

  getUserLikes(): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      const uid = firebase.auth().currentUser.uid;
      firebase.database().ref(`users/${uid}/likedEvents`).once('value')
      .then(likeID => {
        resolve(likeID.val());
      })
    });
  }
}
