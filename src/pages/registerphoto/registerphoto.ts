import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

// --- Add Pages --- //
import { CguPage } from '../cgu/cgu';

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
  private fileTransfer: FileTransferObject

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public firebase: FirebaseProvider,
              public navTrans:NativePageTransitions,
              private transfer: FileTransfer,
              private file: File,
              private nativeStorage: NativeStorage, 
              private statusBar: StatusBar,
              private camera: Camera) {
    this.user = navParams.get('userInfo');

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
    this.fileTransfer = this.transfer.create();
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
        this.imgPath 	= "data:image/png;base64," + data;
    })
    .catch(err => {
      this.imgPath = './assets/imgs/persona.jpg';
    })       
  }

  register() {
    console.log('REGISTER');
    this.firebase.emailRegister(this.user)
    .then(res => {
      console.log(res);
      console.log('IMAGE PATH');
      return this.firebase.upload_Profil_Picture(res.uid, this.imgPath);
    })
    .then(url => {
      this.user.pictureURL = url;
      return this.firebase.getStatus();
    })
    .then(user => {
      console.log('USER');
      console.log(user.uid);
      return this.firebase.write_User_Infos(user.uid, this.user);
    })
    .then(() => {
      return this.firebase.getProfileURL();
    })
    .then(url => {
      this.user.pictureURL = url;
      return this.fileTransfer.download(url, this.file.dataDirectory + 'profile.png');
    })
    .then(() => {
      //return this.firebase.sendEmailVerification();
      this.user.facebook = false;      
      this.nativeStorage.setItem('USER', this.user);
      this.nativeStorage.setItem('userPicture', this.file.dataDirectory + 'profile.png');
      
      let con = {
        facebook : false,
        email : this.user.email,
        password : this.user.password
      };

      this.nativeStorage.setItem('USERCon', con);

      let options: NativeTransitionOptions = {
        duration: 800,
        slowdownfactor: -1
      }; 
      this.navTrans.fade(options);
      this.navCtrl.setRoot(TabsPage);
    });
  }
}
