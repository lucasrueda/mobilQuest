import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-error404',
  templateUrl: 'error404.html',
})
export class Error404Page {

  botonReintentar: boolean;
  mensaje: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.botonReintentar = this.navParams.get('botonReintentar');
    this.mensaje = this.navParams.get('mensaje');
  }


}
