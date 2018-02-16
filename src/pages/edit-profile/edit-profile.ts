import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';

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
              public loaderCtrl: LoadingController,
              public toastCtrl: ToastController,
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
        this.pictureURL = './assets/imgs/persona.jpg';
      }
    })
  }

  countCharBio(e?) {
    this.biographyCount = this.user.biography.length;
    
    if(e) {
      let minRows = e.target.getAttribute('data-min-rows')|0, rows;
      e.target.rows = minRows;
      rows = Math.ceil((e.target.scrollHeight - e.target.baseScrollHeight) / 16);
      e.target.rows = minRows + rows;
    }
  }

  updateProfileDatas() {
    console.log('UPDATE');
    let loading = this.loaderCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box">
            <img src='./assets/imgs/loader.svg'>
            <h2></h2>
          </div>
        </div>`
    });
    loading.present();

    if(this.pictureURL!=='./assets/imgs/persona.jpg' && this.pictureURL!==this.user.pictureURL) {
      console.log('UPDATE Picture');

      if(this.statut!="" && this.statut!==this.user.statut) {
        console.log('UPDATE statut');
        this.firebase.updateUserInfo('statut', this.statut);
        this.user.statut = this.statut;
      }
  
      if(this.biography!="" && this.biography!==this.user.biography) {
        console.log('UPDATE biography');
        this.firebase.updateUserInfo('biography', this.biography);
        this.user.biography = this.biography;      
      }

      this.firebase.getStatus()
      .then(user => {
        return this.firebase.upload_Profil_Picture(user.uid, this.pictureURL);
      })
      .then(url => {
        return this.firebase.updateUserInfo('pictureURL', url);
      })
      .then(() => {
        return this.firebase.getProfileURL();
      })
      .then((url) => {
        this.user.pictureURL = url;
        return this.nativeStorage.setItem('USER', this.user)
      })
      .then(() => {
        let toast = this.toastCtrl.create({
          message: 'Tes modifications ont été prise en compte !',
          duration: 3000,
          position: 'top'
        });
        this.eventsCtrl.publish('userUpdate');
        toast.present();
      });
      loading.dismiss();      
    }
    else {
      if(this.statut!="" && this.statut!=this.user.statut) {
        console.log('UPDATE statut');
        this.firebase.updateUserInfo('statut', this.statut);
        this.user.statut = this.statut;
      }
  
      if(this.biography!="" && this.biography!=this.user.biography) {
        console.log('UPDATE biography');
        this.firebase.updateUserInfo('biography', this.biography);
        this.user.biography = this.biography;      
      }
      let toast = this.toastCtrl.create({
        message: 'Tes modifications ont été prise en compte !',
        duration: 3000,
        position: 'top'
      });
      loading.dismiss();
      toast.present();

      this.nativeStorage.setItem('USER', this.user)
      .then(() => {
        this.eventsCtrl.publish('userNativeUpdate');
      });
    }
  }

  autoExpand(e) {
    console.log(e);
    let savedValue = e.target.value;
    console.log(savedValue);
    e.target.value = '';
    e.target.baseScrollHeight = e.target.scrollHeight;
    console.log(e.target.baseScrollHeight);
    e.target.value = savedValue;
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
