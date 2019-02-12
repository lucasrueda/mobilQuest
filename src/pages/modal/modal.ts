import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  @Input() autosOnOff;

  constructor(
    public viewCtrl: ViewController,
    public event: Events,
    public navCtrl: NavController,
    public HomeP: HomePage
  ) {
    this.event.subscribe('user:click', () => {
      console.log('dissmiseando')
    })
  }

  ngOnChanges() {
  }

  actualizar() {
    this.HomeP.consultarTodo(true);
  }

  verTodaLaFlota() {
    this.HomeP.consultarTodo();
  }

  filtroApagadoEncendido(estado) {
    this.HomeP.filtroRapidoApagadoEncendido(estado);
  }
}
