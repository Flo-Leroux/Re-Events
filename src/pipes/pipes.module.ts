import { NgModule } from '@angular/core';
import { MyDatePipe } from './my-date/my-date';
import { MToKmPipe } from './m-to-km/m-to-km';

@NgModule({
	declarations: [
    	MyDatePipe,
    MToKmPipe],
	imports: [],
	exports: [
    	MyDatePipe,
    MToKmPipe]
})
export class PipesModule {}
