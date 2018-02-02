import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the MyDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'myDate',
})
export class MyDatePipe implements PipeTransform {
  /**
   * Takes a date Thu Oct 19 2017 and formate this
   * 
   */
  transform(value: any, ...args: any[]) {

    switch(args[0]) {
      case 'T':
        const optionsT = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
        return value.toLocaleTimeString('fr-FR', optionsT);         
      
      default:
        const options = {weekday: "long", month: "long", day: "numeric"};
        return value.toLocaleDateString('fr-FR', options); 
    }
  }
}
