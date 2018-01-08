import { NgModule } from '@angular/core';
import { MyDatePipe } from './my-date/my-date';

@NgModule({
	declarations: [
    	MyDatePipe],
	imports: [],
	exports: [
    	MyDatePipe]
})
export class PipesModule {}
