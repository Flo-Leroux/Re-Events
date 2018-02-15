
export class AnimationProvider {

  constructor() {
  }

  fadeIn(elt): Promise<any> {
    return new Promise((resolve, reject) => {
      let pos = 0;
      let id = setInterval(frame, 5);

      function frame() {
        if (pos == 50) {
          clearInterval(id);
          resolve();
        } else {
          pos++; 
          elt.style.opacity = pos/50; 
        }
      }
    });
  }

  fadeOut(elt): Promise<any> {
    return new Promise((resolve, reject) => {
      let pos = 50;
      let id = setInterval(frame, 5);

      function frame() {
        if (pos == 0) {
          clearInterval(id);
          resolve();
        } else {
          pos--; 
          elt.style.opacity = pos/50; 
        }
      }
    });
  }
}
