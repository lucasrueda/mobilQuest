import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { NavController, Events, ModalController, NavParams, LoadingController } from 'ionic-angular';
import { MapasnativoPage } from '../mapasnativo/mapasnativo';
import { MapaProvider } from '../../providers/mapa/mapa';
import { Storage } from '@ionic/storage';
import { filtrarDatos } from '../../helpers/helpers';
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
  datosSinFiltrar: any;
  datosDinamicos: any;
  id_cliente: number;
  timerCount: number = 60;
  timerControl: any;
  pausedInterval: boolean = false;
  loading: any;
  autosOnOff: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
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
    });
    this.event.subscribe('filtradoDeBusqueda', autos => {
      const dataTemp = filtrarDatos(autos, this.datos);
      dataTemp['autoUpdate'] = false;
      this.datosDinamicos = dataTemp;
    });
    this.event.subscribe('verVehiculo', data => {
      const dataTemp = filtrarDatos([data], this.datos);
      dataTemp['autoUpdate'] = false;
      this.datosDinamicos = dataTemp;
    })
    this.consultarTodo();
    this.iniciarIntervalo();
  }

  iniciarIntervalo() {
    this.timerControl = setInterval(() => {
      if ((this.timerCount - 1) > 0) {
        this.timerCount--;
      } else {
        this.timerCount = 60;
        this.consultarTodo(true);
      }
    }, 1000);
  }

  pausarIntervalo() {
    if (!this.pausedInterval) {
      clearInterval(this.timerControl);
      this.pausedInterval = true;
    } else {
      this.iniciarIntervalo();
      this.pausedInterval = false;
    }
  }

  public consultarTodo(autoUpdate = false) {
    this.showLoader();
    this.storage.ready()
      .then(() => {
        setTimeout(() => {
          this.loading.dismiss();
        }, 1000);
        this.storage.get('id_cliente').then(async (id_cliente) => {
          this.id_cliente = id_cliente
          try {
            this.datosSinFiltrar = (await this.mapaSrv.consultarTodo(this.id_cliente))[0];
            this.datos = this.filtroVehiculosRepetidos(this.datosSinFiltrar);
            let autosEncendidos = this.obtenerAutosEncendidos();
            let autosApagados = this.datos.dominio.length - this.obtenerAutosEncendidos();
            this.autosOnOff = { autosEncendidos, autosApagados }
            if (!autoUpdate)
              this.datosDinamicos = this.datos
            else
              this.datosDinamicos = filtrarDatos(this.datosDinamicos.dominio, this.datos);
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

  filtroVehiculosRepetidos(datosTemp) {
    let auxObject = {};
    let index = 0;
    datosTemp.nombre_sensor.forEach((nombreSensor, i) => {
      if(nombreSensor == "Estado del motor"){
        Object.keys(datosTemp).forEach(key => {
          if (!auxObject[key]) auxObject[key] = [];
          if (datosTemp[key][i] !== undefined)
            auxObject[key][index] = datosTemp[key][i];
        })
        index++;
      }
    });
    return auxObject;
  }

  filtroRapidoApagadoEncendido(estado) {
    let arrayAutos = [];
    for (let index = 0; index < this.datos.dominio.length; index++) {
      if (this.datos.estado_sensor_en_bit[index] === estado) {
        arrayAutos.push(this.datos.dominio[index]);
      }
    }
    const dataTemp = filtrarDatos(arrayAutos, this.datos);
    dataTemp['autoUpdate'] = false;
    this.datosDinamicos = dataTemp;
  }

  obtenerAutosEncendidos() {
    let arrayAutos = [];
    for (let index = 0; index < this.datos.dominio.length; index++) {
      if (this.datos.estado_sensor_en_bit[index] === '1') {
        arrayAutos.push(this.datos.dominio[index]);
      }
    }
    return arrayAutos.length;
  }

  showLoader(mensaje = '') {
    this.loading = this.loadingCtrl.create({
      content: mensaje
    });
    this.loading.present();
  }
}
