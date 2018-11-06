import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, Events, ModalController } from 'ionic-angular';
import { MapasnativoPage } from '../mapasnativo/mapasnativo';
import { ModalPage } from '../modal/modal'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('search', { read: ElementRef }) search: ElementRef;
  @ViewChild('modal', { read: ElementRef }) modal: ElementRef;
  displayMenu: boolean = false;
  constructor(public navCtrl: NavController, public event: Events, public _zone: NgZone, public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    this.search.nativeElement.classList.add('slide-in');
    this.modal.nativeElement.classList.add('slide-in');
    this.event.subscribe('user:click', () => {
      this._zone.run(() => this.displayMenu = !this.displayMenu)
      if (this.displayMenu) {
        this.search.nativeElement.classList.add('slide-in');
        this.modal.nativeElement.classList.add('slide-in');
      } else {
        this.search.nativeElement.classList.remove('slide-in');
        this.modal.nativeElement.classList.remove('slide-in');
      }
    });
  }


}
