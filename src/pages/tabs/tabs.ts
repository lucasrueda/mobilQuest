import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { Events } from 'ionic-angular';


@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  @ViewChild('myTabs', { read: ElementRef }) myTabs: ElementRef;
  displayMenu: boolean = false;

  constructor(public event: Events, public _zone: NgZone) {
  }

  ionViewDidLoad() {
    this.event.subscribe('user:click', () => {
      this._zone.run( () => this.displayMenu = !this.displayMenu) 
      if(this.displayMenu){
        this.myTabs.nativeElement.classList.add('displayMenu');
      }else{
        this.myTabs.nativeElement.classList.remove('displayMenu');
      }
    });
  }
}
