import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

// --- Add Firebase --- //


// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-registerphoto',
  templateUrl: 'registerphoto.html'
})
export class RegisterphotoPage {

  user: User;
  imgPath: string = './assets/imgs/persona.jpg';
  public cameraImage : String
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public navTrans:NativePageTransitions,
              private statusBar: StatusBar,
              private firebase: FirebaseProvider,
              private nativeStorage: NativeStorage,
              private camera: Camera) {
    this.user = navParams.get('userInfo');

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
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
        this.imgPath = './assets/imgs/persona.jpg';
      }
      else {
        this.imgPath 	= "data:image/png;base64," + data;
      }
    })
    .catch(err => {
      this.imgPath = './assets/imgs/persona.jpg';
    })       
  }

  register() {
    this.firebase.emailRegister(this.user)
    .then(res => {
      if(this.imgPath != './assets/imgs/persona.jpg') {
        return this.firebase.upload_Profil_Picture(res.uid, this.imgPath);
      }
      else {
        return false;
      }
    })
    .then(() => {
      if(this.imgPath != './assets/imgs/persona.jpg') {
        return this.firebase.getProfileURL();
      }
      else {
        return false;
      }
    })
    .then(url => {
      if(url == false) {
        this.user.pictureURL = url;
      }
      else {
        this.user.pictureURL = './assets/imgs/persona.jpg';
      }
      return this.firebase.getStatus();
    })
    .then(user => {
      console.log('USER');
      console.log(user.uid);
      return this.firebase.write_User_Infos(user.uid, this.user);
    })
    .then(res => {
      //return this.firebase.sendEmailVerification();
    })
    .then(res => {
      this.user.facebook = false;      
      this.nativeStorage.setItem('USER', this.user);

      let options: NativeTransitionOptions = {
        duration: 800,
        slowdownfactor: -1
      }; 
      this.navTrans.fade(options);
      this.navCtrl.setRoot(TabsPage);
    })
  }
}
