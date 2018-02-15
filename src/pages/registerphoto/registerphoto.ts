import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';

// --- Add Pages --- //
import { CguPage } from '../cgu/cgu';
import { TabsPage } from '../tabs/tabs';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { FirebaseProvider } from '../../providers/firebase/firebase';

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
    let options: NativeTransitionOptions = {
      duration: 800,
      slowdownfactor: -1,
      iosdelay: 50,
      androiddelay: 100,
    }; 
    this.navTrans.fade(options);
    this.navCtrl.setRoot(CguPage, {'origin': 'email', 'user': this.user, 'img': this.imgPath});
  }
}
