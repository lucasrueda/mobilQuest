import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  constructor(public viewCtrl: ViewController, public event: Events) {
    this.event.subscribe('user:click', () => {
      console.log('dissmiseando')
      this.dismiss();
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
