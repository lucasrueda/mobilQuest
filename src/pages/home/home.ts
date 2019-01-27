import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, Events, ModalController, NavParams } from 'ionic-angular';
import { MapasnativoPage } from '../mapasnativo/mapasnativo';
import { MapaProvider } from '../../providers/mapa/mapa';
import { Storage } from '@ionic/storage';
import { obtenerDireccion } from '../../helpers/helpers';
import { SearchFilterPage } from '../search-filter/search-filter';

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
  datosDinamicos: any;
  id_cliente: number;
  timerCount: number = 5;
  timerControl: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public mapaSrv: MapaProvider,
    public _zone: NgZone,
    public modalCtrl: ModalController,
    private storage: Storage
  ) { }

  async ionViewDidLoad() {
    this.mostrarOcultarFiltros();
    this.event.subscribe('filtroPorFechas', (datos) => {
      let datosRecorrido = datos;
      datosRecorrido['recorrido'] = true;
      datosRecorrido['autoUpdate'] = false;
      this.datosDinamicos = [];
      this.datosDinamicos = datosRecorrido;
    })
    this.event.subscribe('filtradoDeBusqueda', autos => {
      this.datosDinamicos.autoUpdate = false;
      this.datosDinamicos = this.filtrarDatos(autos);
    })
    this.consultarTodo();
    this.timerControl = setInterval(() => {
      ((this.timerCount - 1) > 0)
        ? this.timerCount--
        : this.timerCount = 60;
    }, 1000);
  }

  public consultarTodo(autoUpdate = false) {
    this.storage.ready()
      .then(() => {
        this.storage.get('id_cliente').then(async (id_cliente) => {
          this.id_cliente = id_cliente
          try {
            this.datos = (await this.mapaSrv.consultarTodo(this.id_cliente))[0];
            if(!autoUpdate)
              this.datosDinamicos = this.datos
            else
              this.datosDinamicos = this.filtrarDatos(this.datosDinamicos.dominio);
            this.datosDinamicos.autoUpdate = autoUpdate;
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
  }

  openSearch() {
    let data = {
      vectorIdGrupo: this.datos.vector_id_grupo,
      vectorNombreGrupo: this.datos.vector_nombre_grupo,
      idGrupo: this.datos.id_grupo,
      dominio: this.datos.dominio
    }
    this.navCtrl.push(SearchFilterPage, { data }, { animation: 'wp-transition', duration: 50 });
  }

  filtrarDatos(data) {
    let auxObject = {};
    data.forEach((patente, i) => {
      let index = this.datos.dominio.indexOf(patente);
      Object.keys(this.datos).forEach(key => {
        if (!auxObject[key]) auxObject[key] = [];
        if (this.datos[key][index] !== undefined)
          auxObject[key][i] = this.datos[key][index];
      })
    });
    return auxObject;
  }

  filtroRapidoApagadoEncendido(estado){
    let arrayAutos = [];
    for (let index = 0; index < this.datos.dominio.length; index++) {
      if(this.datos.estado_sensor_en_bit[index] === estado){
        arrayAutos.push(this.datos.dominio[index]);
      }
    }
    this.datosDinamicos = this.filtrarDatos(arrayAutos);
  }
}
