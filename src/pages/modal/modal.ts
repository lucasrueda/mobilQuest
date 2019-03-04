import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  @Input() autosOnOff;
  switched:boolean = false;

  constructor(
    public viewCtrl: ViewController,
    public event: Events,
    public navCtrl: NavController,
    public HomeP: HomePage
  ) {
    this.event.subscribe('user:click', () => {
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

  switchValue(){
    console.log(this.switched)
    this.switched = !this.switched;
  }
}
