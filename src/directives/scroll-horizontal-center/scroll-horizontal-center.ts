import { Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * Generated class for the ScrollHorizontalCenterDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[scroll-horizontal-center]' // Attribute selector
})
export class ScrollHorizontalCenterDirective {

  constructor(public element: ElementRef,
              public renderer: Renderer2) {
    console.log('Hello ScrollHorizontalCenterDirective Directive');
  }

  ngOnInit() {
    let content = this.element.nativeElement.getElementsByClassName('scroll-content')[0];

      console.log(content);      
  }

}
