import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  @Input() filtrosAlertas;
  switched:boolean = false;

  constructor(
    public viewCtrl: ViewController,
    public event: Events,
    public navCtrl: NavController,
    public HomeP: HomePage
  ) {

  }

  ngOnChanges() {
    console.log(this.filtrosAlertas)
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

  filtroReposoMovimiento(arrayAutos){
    this.HomeP.filtroReposoMovimiento(arrayAutos);
  }

  switchValue(){
    this.switched = !this.switched;
  }
}
