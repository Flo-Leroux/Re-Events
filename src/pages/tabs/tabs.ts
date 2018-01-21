import { Component } from '@angular/core';

// --- Add Pages --- //
import { EventsPage } from '../events/events';
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tabEvents = EventsPage;
  tabProfile = ProfilePage;

  constructor() {
  }
}
