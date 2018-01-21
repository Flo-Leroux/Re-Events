import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// --- Add Models --- //
import { User } from '../../models/User';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  biographie: string;
  biographieCount: number = 0;
  user = {} as User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.navCtrl.removeView(this.navCtrl.getPrevious());

    this.user.birthday = new Date();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');

  }

  countCharBio() {
    this.biographieCount = this.biographie.length;
  }
}
