import { NgModule } from '@angular/core';
import { ParallaxHeaderDirective } from './parallax-header/parallax-header';
import { ScrollHorizontalCenterDirective } from './scroll-horizontal-center/scroll-horizontal-center';
@NgModule({
	declarations: [ParallaxHeaderDirective,
    ScrollHorizontalCenterDirective],
	imports: [],
	exports: [ParallaxHeaderDirective,
    ScrollHorizontalCenterDirective]
})
export class DirectivesModule {}
