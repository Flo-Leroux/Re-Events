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
  transform(value: string, ...args: any[]) {
    if(value != undefined || value != null) {
      
      let dateArray = value.toString().split(args[1]);

      // Day
      switch(dateArray[0].toUpperCase()) {
        case 'MON':
          dateArray[0] = 'Lundi';
          break;
        case 'TUE':
          dateArray[0] = 'Mardi';
          break;
        case 'WED':
          dateArray[0] = 'Mercredi';
          break;
        case 'THU':
          dateArray[0] = 'Jeudi';
          break;
        case 'FRI':
          dateArray[0] = 'Vendredi';
          break;
        case 'SAT':
          dateArray[0] = 'Samedi';
          break;
        case 'SUN':
          dateArray[0] = 'Dimanche';
        default:
          break;
      }

      // Month
      switch(dateArray[1].toUpperCase()) {
        case 'JAN':
          dateArray[1] = 'Janvier';
          break;
        case 'FEB':
          dateArray[1] = 'Février';
          break;
        case 'MAR':
          dateArray[1] = 'Mars';
          break;
        case 'APR':
          dateArray[1] = 'Avril';
          break;
        case 'MAY':
          dateArray[1] = 'Mai';
          break;
        case 'JUN':
          dateArray[1] = 'Juin';
          break;        
        case 'JUL':
          dateArray[1] = 'Juillet';
          break;
        case 'AUG':
          dateArray[1] = 'Août';
          break;
        case 'SEP':
          dateArray[1] = 'Septembre';
          break;
        case 'OCT':
          dateArray[1] = 'Octobre';
          break;
        case 'NOV':
          dateArray[1] = 'Novembre';
          break;
        case 'DEC':
          dateArray[1] = 'Décembre';
          break;
        default:
          break;
      }

      if(args[0] == 'fr') {
        value = dateArray[0]+args[2]+
                dateArray[2]+args[2]+
                dateArray[1]+args[2]+
                dateArray[3];
      }
      else {

      }

      //Format
      switch(args[0]) {
        case 'ddMMMMyy':
          value = dateArray[2]+args[2]+
                  dateArray[1]+args[2]+
                  dateArray[3];
          break;
        case 'ddMMMM':
          value = dateArray[2]+args[2]+
                  dateArray[1]+args[2];
          break;
        case 'ddMMMMyy hhmm': 
          value = dateArray[0]+args[2]+
                  dateArray[2]+args[2]+
                  dateArray[1]+args[2]+
                  dateArray[3]+' '+
                  dateArray[4].replace(':', 'H').substring(0,5); 
          break;
        case 'ddddMMMMyy':
          value = dateArray[0]+args[2]+
                  dateArray[2]+args[2]+
                  dateArray[1]+args[2]+
                  dateArray[3];
          break;
        default:
          value = dateArray[0]+args[2]+
                  dateArray[1]+args[2]+
                  dateArray[2]+args[2]+
                  dateArray[3];
          break;
      }
      return value;
    }
    else {
      return value;
    }
  }
}
