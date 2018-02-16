import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

// --- Add Plugins --- //
/* Ionic's Plugins */

@Injectable()
export class GeolocationProvider {

  constructor(private geolocation: Geolocation) {
    console.log('Hello GeolocationProvider Provider');
  }

  public getCurrentPosition(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 15000})
      .then(res => {
        resolve([res.coords.latitude, res.coords.longitude]);
      })
      .catch(err => {
        reject(err);
      })
    });
  }
}
