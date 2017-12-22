import { Injectable } from '@angular/core';

export class AnimationProvider {

  constructor() {
  }

  fadeIn(elt): Promise<any> {
    return new Promise((resolve, reject) => {
      let pos = 0;
      let id = setInterval(frame, 5);

      function frame() {
        if (pos == 100) {
          clearInterval(id);
          resolve();
        } else {
          pos++; 
          elt.style.opacity = pos/100; 
        }
      }
    });
  }

  fadeOut(elt): Promise<any> {
    return new Promise((resolve, reject) => {
      let pos = 100;
      let id = setInterval(frame, 5);

      function frame() {
        if (pos == 0) {
          clearInterval(id);
          resolve();
        } else {
          pos--; 
          elt.style.opacity = pos/100; 
        }
      }
    });
  }
}
