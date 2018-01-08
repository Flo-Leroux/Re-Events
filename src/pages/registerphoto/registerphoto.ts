import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

// --- Add Firebase --- //


// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

/* Npm's Plugins */
import { AngularFireAuth } from 'angularfire2/auth';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Pages --- //

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { EventsPage } from '../events/events';

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
              private aFauth : AngularFireAuth,
              private firebaseProvid: FirebaseProvider,
              private camera: Camera) {
    this.user = navParams.get('userInfo');

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
  }

  ionViewDidEnter() {    
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

  async register() {
    this.aFauth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password)
    .then(res => {      
      this.firebaseProvid.upload_Profil_Picture(res.uid, this.imgPath);
      this.firebaseProvid.write_User_Infos(res.uid, this.user);
    })
    .then(res => {
      let options: NativeTransitionOptions = {
        duration: 800,
        slowdownfactor: -1
      }; 
      this.navTrans.fade(options);
      this.navCtrl.setRoot(EventsPage);
    })
  }
}
