import { Component, Output } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ProfilePage } from '../profile/profile';
import { EventEmitter } from '@angular/core/src/event_emitter';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  user = {} as User; 
  userDefault = {} as User; 

  biographyCount: number = 0;

  pictureURL: string;
  biography: string;
  statut: string;

  constructor(public navCtrl: NavController,
              private firebase: FirebaseProvider,
              private eventsCtrl: Events,
              private nativeStorage: NativeStorage,
              private camera: Camera,
              public navParams: NavParams) {

    this.navCtrl.removeView(this.navCtrl.getPrevious());

    this.nativeStorage.getItem('USER')
    .then(res => {
      this.user = res;
      this.statut = this.user.statut;
      this.biography = this.user.biography;
      this.countCharBio();      

      if(this.user.pictureURL) {
        this.pictureURL = this.user.pictureURL;
      }
      else {
        this.pictureURL = 'assets/imgs/persona.jpg';
      }
    })
  }

  countCharBio() {
    this.biographyCount = this.user.biography.length;
  }

  updateProfileDatas() {
    console.log('UPDATE');

    if(this.pictureURL != 'assets/imgs/persona.jpg') {
      console.log('UPDATE Picture');

      if(this.statut != "") {
        console.log('UPDATE statut');
        this.firebase.updateUserInfo('statut', this.statut);
        this.user.statut = this.statut;
      }
  
      if(this.biography != "") {
        console.log('UPDATE biography');
        this.firebase.updateUserInfo('biography', this.biography);
        this.user.biography = this.biography;      
      }

      this.firebase.getStatus()
      .then(user => {
        return this.firebase.upload_Profil_Picture(user.uid, this.pictureURL);
      })
      .then(url => {
        this.user.pictureURL = url;
        return this.firebase.updateUserInfo('pictureURL', url);
      })
      .then(() => {
        return this.nativeStorage.setItem('USER', this.user)
      })
      .then(() => {
        this.eventsCtrl.publish('userNativeUpdate');
      });
    }
    else {
      if(this.statut != "") {
        console.log('UPDATE statut');
        this.firebase.updateUserInfo('statut', this.statut);
        this.user.statut = this.statut;
      }
  
      if(this.biography != "") {
        console.log('UPDATE biography');
        this.firebase.updateUserInfo('biography', this.biography);
        this.user.biography = this.biography;      
      }

      this.nativeStorage.setItem('USER', this.user)
      .then(() => {
        this.eventsCtrl.publish('userNativeUpdate');
      });
    }


  }

  selectImage(){
    let cameraOptions : CameraOptions = {
        sourceType         : this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType    : this.camera.DestinationType.DATA_URL,
        quality            : 100,
        targetWidth        : 320,
        targetHeight       : 240,
        encodingType       : this.camera.EncodingType.PNG,
        correctOrientation : true
    };

    this.camera.getPicture(cameraOptions)
    .then(data =>{
      if(data.length==0) {
        this.pictureURL = 'assets/imgs/persona.jpg';
      }
      else {
        this.pictureURL 	= "data:image/png;base64," + data;
      }
    })
    .catch(err => {
      this.pictureURL = 'assets/imgs/persona.jpg';
    })       
  }
}
