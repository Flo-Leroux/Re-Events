import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NativeStorage } from '@ionic-native/native-storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

// --- Add Pages --- //
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';
import { CguPage } from '../cgu/cgu';

// --- Add Models --- //
import { User } from '../../models/User';

// --- Add Providers --- //
import { RegexProvider } from '../../providers/regex/regex';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { FacebookProvider } from '../../providers/facebook/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user = {} as User;
  email: boolean = false;
  password: boolean = false;
  // splash = true;
  // secondPage = SecondPagePage;
  private fileTransfer: FileTransferObject;

  constructor(public navCtrl: NavController,
              private transfer: FileTransfer,
              private file: File,
              private statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions,
              private nativeStorage: NativeStorage,
              private reg: RegexProvider,
              private firebase: FirebaseProvider,
              private facebook: FacebookProvider) {
    
    console.log('KEYS');
    this.nativeStorage.keys()
    .then(res => console.log(res))
    .catch(err => console.log(err));

    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
    this.fileTransfer = this.transfer.create();    
  }

  /**
   * Test si l'email est valide :
   *    - True  =>  Affiche les champs "Mot de passe"
   * @param {User} user 
   */
  emailInput(user: User) {
    let regEmail: boolean = this.reg.email(user.email);
    
    if(regEmail) {
      this.email = true;
    }
    else {
      this.email = false;   
    }
  }
  
  /**
   * Test si le mot de passe est valide :
   *    - True  =>  Active le bouton "Se Connecter"
   * @param {User} user 
   */
  passwordInput(user: User) {
    let regPassword: boolean = this.reg.password(user.password);

    if(regPassword) {
      this.password = true;
    }
    else {
      this.password = false;
    }
  }

  login() {

    if(this.password==true && this.email==true) {
      
      this.firebase.emailLogin(this.user)
      .then(() => {
        return this.firebase.getUserInfo();
      })
      .then((userInfos) => {

        userInfos.facebook = false;
        userInfos.email = this.user.email;
        userInfos.password = this.user.password;
        
        console.log('userInfos');
        console.log(userInfos);
        this.nativeStorage.setItem('USER', userInfos);

        let con = {
          facebook : false,
          email : this.user.email,
          password : this.user.password
        };

        this.nativeStorage.setItem('USERCon', con);

        this.firebase.getProfileURL()
        .then(url => {
          console.log(url);
          this.user.pictureURL = url;
          return this.fileTransfer.download(url, this.file.dataDirectory + 'profile.png');
        })
        .catch(err => {
          console.log(err);
          this.user.pictureURL = './assets/imgs/persona.jpg';
        })
        .then(res => {
          this.nativeStorage.setItem('userPicture', this.file.dataDirectory + 'profile.png');      
          console.log(this.user.pictureURL);
          let options: NativeTransitionOptions = {
            duration: 500,
            slowdownfactor: -1
          }
          this.nativePageTransitions.fade(options);
          this.navCtrl.setRoot(TabsPage);
        })
      })
      .catch(() => {
        let options2: NativeTransitionOptions = {
          duration: 500,
          slowdownfactor: -1
        }
        this.nativePageTransitions.fade(options2);
        this.navCtrl.push(RegisterPage, {'userEmail': this.user.email, 'userPassword': this.user.password});
      });     
    }
  }

  facebookConnect() {
    this.facebook.login()
    .then(res => {
      console.log('facebook Connect');
      this.firebase.FacebookRegister(res)
      .then(() => {
        return this.firebase.getUserInfo();
      })
      .then(userInfos => {
        this.user.facebook = userInfos.facebook = true;
  
        this.nativeStorage.setItem('USER', userInfos);

        let con = {
          facebook : true,
          email : '',
          password : ''
        };

        this.nativeStorage.setItem('USERCon', con);

        console.log('FACEBOOK');
        console.log(userInfos);

        this.fileTransfer.download(userInfos.pictureURL, this.file.dataDirectory + 'profile.png')
        .then(res => {
          this.nativeStorage.setItem('userPicture', this.file.dataDirectory + 'profile.png');      
        })
        .then(res => {
          let options: NativeTransitionOptions = {
            duration: 500,
            slowdownfactor: -1
          }
          this.nativePageTransitions.fade(options);
          this.navCtrl.setRoot(TabsPage);
        });
      });
    })
    .catch((res) => {
      this.user = res[1];
      this.firebase.FacebookRegister(res[0])
      .then(() => {
        return this.firebase.getStatus();
      })
      .then(user => {
        return this.firebase.write_User_Infos(user.uid, this.user);
      })
      .then(() => {
        return this.firebase.getUserInfo()
      })
      .then(userInfos => {
        this.user.facebook = userInfos.facebook = true;
  
        this.nativeStorage.setItem('USER', userInfos);
  
        let con = {
          facebook : true,
          email : '',
          password : ''
        };

        this.nativeStorage.setItem('USERCon', con);

        this.fileTransfer.download(userInfos.pictureURL, this.file.dataDirectory + 'profile.png')
        .then(res => {
          this.nativeStorage.setItem('userPicture', this.file.dataDirectory + 'profile.png');      
        })
        .then(res => {
          let options: NativeTransitionOptions = {
            duration: 500,
            slowdownfactor: -1
          }
          this.nativePageTransitions.fade(options);
          this.navCtrl.setRoot(TabsPage);
        });
      });
    });
  }

  register() {
    let options: NativeTransitionOptions = {
      duration: 500,
      slowdownfactor: -1,
    }; 
    this.nativePageTransitions.fade(options);
    this.navCtrl.push(RegisterPage);
  }

  getCGU() {
    let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      slowdownfactor: -1
    }
    this.nativePageTransitions.slide(options);
    this.navCtrl.push(CguPage);
  }
}
