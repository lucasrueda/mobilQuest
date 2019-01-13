import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, Events, ModalController, NavParams } from 'ionic-angular';
import { MapasnativoPage } from '../mapasnativo/mapasnativo';
import { Mapajshtml } from '../mapajshtml/mapajshtml';
import { ModalPage } from '../modal/modal'
import { MapaProvider } from '../../providers/mapa/mapa';
import { Storage } from '@ionic/storage';
import { obtenerDireccion } from '../../helpers/helpers';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('search', { read: ElementRef }) search: ElementRef;
  @ViewChild('modal', { read: ElementRef }) modal: ElementRef;
  @ViewChild('expander', { read: ElementRef }) expander: ElementRef;

  displayMenu: boolean = false;
  datos: any;
  id_cliente: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public mapaSrv: MapaProvider,
    public _zone: NgZone,
    public modalCtrl: ModalController,
    private storage: Storage
  ) {
  }

  async ionViewDidLoad() {
    this.mostrarOcultarFiltros();
    this.storage.ready()
      .then(() => {
        this.storage.get('id_cliente').then(async (id_cliente) => {
          this.id_cliente = id_cliente
          try {
            this.datos = (await this.mapaSrv.consultarTodo(this.id_cliente))[0];
            this
          } catch (error) {
            console.log("​catch -> error", error)
          }
          console.log('mostrando datos', this.datos);
        });
      })
  }

  mostrarOcultarFiltros() {
    this.search.nativeElement.classList.add('slide-in');
    this.modal.nativeElement.classList.add('slide-in');
    this.expander.nativeElement.classList.remove('slide-in');
    this.event.subscribe('user:click', () => {
      this._zone.run(() => this.displayMenu = !this.displayMenu)
      if (this.displayMenu) {
        this.search.nativeElement.classList.add('slide-in');
        this.modal.nativeElement.classList.add('slide-in');
        this.expander.nativeElement.classList.remove('slide-in');
      } else {
        this.search.nativeElement.classList.remove('slide-in');
        this.modal.nativeElement.classList.remove('slide-in');
        this.expander.nativeElement.classList.add('slide-in');
      }
    });
    this.event.subscribe('filtroPorFechas', (datos) => {
      this.datos = datos;
    })
  }

  respuestaVehiculoSelect(vehiculo){
		console.log("​HomePage -> respuestaVehiculoSelect -> vehiculo", vehiculo)
  }
}
