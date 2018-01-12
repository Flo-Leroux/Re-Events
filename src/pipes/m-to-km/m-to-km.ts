import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mToKm',
})
export class MToKmPipe implements PipeTransform {
  transform(value: number, ...args) {
    return value/1000;
  }
}
