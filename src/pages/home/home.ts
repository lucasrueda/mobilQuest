import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, Events, ModalController } from 'ionic-angular';
import { MapasnativoPage } from '../mapasnativo/mapasnativo';
import { Profile } from './modal'
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('search', { read: ElementRef }) search: ElementRef;
  displayMenu: boolean = false;
  constructor(public navCtrl: NavController, public event: Events, public _zone: NgZone, public modalCtrl: ModalController) { }

  ionViewDidLoad() {
    this.event.subscribe('user:click', () => {
      this._zone.run(() => this.displayMenu = !this.displayMenu)
      if (this.displayMenu) {
        this.search.nativeElement.classList.add('displayMenu');
      } else {
        this.search.nativeElement.classList.remove('displayMenu');
      }
    });
  }

  presentModal() {
    const modal = this.modalCtrl.create(Profile);
    modal.present();
  }

}
