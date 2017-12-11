import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// --- Add Plugins -- //
/* Ionic's Plugins */
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase';

/* Npm's Plugins */
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// --- Add Pages --- //
import { ReEvents } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { RegisterphotoPage } from '../pages/registerphoto/registerphoto';
import { EventsPage } from '../pages/events/events';

// --- Add Providers --- //
import { RegexProvider } from '../providers/regex/regex';
import { PermissionsProvider } from '../providers/permissions/permissions';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { FacebookProvider } from '../providers/facebook/facebook';

// --- Add Configs --- //
import { FIREBASE_CONFIG } from './app.firebase.config';

@NgModule({
  declarations: [
    ReEvents,
    LoginPage,
    RegisterPage,
    RegisterphotoPage,
    EventsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ReEvents, {
      scrollAssist: true,
      autoFocusAssist: true 
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ReEvents,
    LoginPage,
    RegisterPage,
    RegisterphotoPage,
    EventsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    NativePageTransitions,
    Camera,
    Facebook,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RegexProvider,
    PermissionsProvider,
    FirebaseProvider,
    FacebookProvider
  ]
})
export class AppModule {}
