import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// --- Add Plugins --- //
/* Ionic's Plugins */
import { StatusBar } from '@ionic-native/status-bar';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {

  event: any;
  descriptionHTML: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public statusBar: StatusBar,
              private nativePageTransitions: NativePageTransitions
              ) {
    this.event = navParams.get('event');
    
    
    this.descriptionHTML =  JSON.stringify(this.event.description)
                            .replace(/\\n/g, "<br>")
                            .substr(1)
                            .slice(0, -1);
    
    console.log(this.descriptionHTML);
    // let status bar overlay webview
    this.statusBar.overlaysWebView(true);

    // set status bar to white
    this.statusBar.styleLightContent();
    // this.statusBar.backgroundColorByHexString('#000000DD');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionPage');
  }

}
