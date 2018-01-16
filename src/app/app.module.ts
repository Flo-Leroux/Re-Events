import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

// --- Add Plugins -- //
/* Ionic's Plugins */
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Keyboard } from '@ionic-native/keyboard';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { Geolocation } from '@ionic-native/geolocation';
import { DatePicker } from '@ionic-native/date-picker';
import { Calendar } from '@ionic-native/calendar';
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
import { AnimationProvider } from '../providers/animation/animation';
import { GeolocationProvider } from '../providers/geolocation/geolocation';

// --- Add Pipes --- //
import { PipesModule } from '../pipes/pipes.module';

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
    HttpModule,
    PipesModule,

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
    Geolocation,
    DatePicker,
    Calendar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RegexProvider,
    PermissionsProvider,
    FirebaseProvider,
    FacebookProvider,
    AnimationProvider,
    GeolocationProvider
  ]
})
export class AppModule {}
