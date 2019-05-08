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
  @ViewChild('nombreRecorrido', { read: ElementRef }) nombreRecorrido: ElementRef;

  displayMenu: boolean = false;
  datos: any;
  datosSinFiltrar: any;
  datosDinamicos: any;
  id_cliente: number;
  timerCount: number = 60;
  timerControl: any;
  pausedInterval: boolean = false;
  loading: any;
  filtrosAlertas: any;
  recorrido: boolean = false;
  nombreVehiculo: string;
  datosPreFiltros: { seAplicoFiltro: boolean, datos: any; } = { seAplicoFiltro: false, datos: [] };
  mostrarDatosfiltradoDeBusqueda: { nombre: string, activo: boolean } = { nombre: '', activo: false };

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
      this.recorrido = true;
      this.mostrarDatosfiltradoDeBusqueda = { nombre: '', activo: false };
      this.event.publish('user:click');
      this.nombreVehiculo = datos.nombreVehiculo;
      let datosRecorrido = datos;
      datosRecorrido['recorrido'] = true;
      datosRecorrido['autoUpdate'] = false;
      this.datosDinamicos = [];
      this.datosDinamicos = datosRecorrido;
    });
    this.event.subscribe('filtradoDeBusqueda', datos => {
      this.recorrido = false;
      const dataTemp = filtrarDatos(datos.vehiculos, this.datos);
      dataTemp['autoUpdate'] = false;
      this.calcularFiltrosAlertas(dataTemp);
      //esto lo hago para mostrar el cartel flotante que diga el nombre
      this.mostrarDatosfiltradoDeBusqueda = { 
        nombre: datos.nombre,
        activo: true
      }
      if (datos.vehiculos.length === 1) {
        this.datosPreFiltros.seAplicoFiltro = true;
        this.datosPreFiltros.datos = this.datos;
      } else {
        this.datosPreFiltros.seAplicoFiltro = false;
      }
      this.datosDinamicos = dataTemp;
    });
    this.event.subscribe('verVehiculo', data => {
      this.recorrido = false;
      const dataTemp = filtrarDatos([data], this.datos);
      dataTemp['autoUpdate'] = false;
      this.datosDinamicos = dataTemp;
    })
    this.event.subscribe('consultarTodo', () => {
      this.consultarTodo();
    })
    this.consultarTodo();
    this.iniciarIntervalo();
  }

  ionViewWillUnload() {
    this.pausarIntervalo();
  }

  iniciarIntervalo() {
    this.timerControl = setInterval(() => {
      if ((this.timerCount - 1) > 0) {
        this.timerCount--;
      } else {
        this.timerCount = 60;
        !this.recorrido && this.consultarTodo(true);
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
    !autoUpdate && this.showLoader();
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
            if (!autoUpdate) {
              this.mostrarDatosfiltradoDeBusqueda = { nombre: '', activo: false };
              this.datosDinamicos = this.datos;
              this.datosPreFiltros.seAplicoFiltro = false;
            } else {
              this.datosDinamicos = filtrarDatos(this.datosDinamicos.dominio, this.datos);
            }
            this.calcularFiltrosAlertas(this.datosDinamicos);
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
    this.nombreRecorrido.nativeElement.classList.remove('slide-in');
    this.event.subscribe('user:click', () => {
      this._zone.run(() => this.displayMenu = !this.displayMenu)
      if (this.displayMenu) {
        this.search.nativeElement.classList.add('slide-in');
        this.modal.nativeElement.classList.add('slide-in');
        this.expander.nativeElement.classList.remove('slide-in');
        this.nombreRecorrido.nativeElement.classList.remove('slide-in');
      } else {
        this.search.nativeElement.classList.remove('slide-in');
        this.modal.nativeElement.classList.remove('slide-in');
        this.expander.nativeElement.classList.add('slide-in');
        this.nombreRecorrido.nativeElement.classList.add('slide-in');
      }
    });
  }

  openSearch() {
    let arrayToSearch =
      this.datosPreFiltros.seAplicoFiltro
        ? this.datosPreFiltros.datos
        : this.recorrido
          ? this.datos
          : this.datosDinamicos;
    let data = {
      vectorIdGrupo: arrayToSearch.vector_id_grupo,
      vectorNombreGrupo: arrayToSearch.vector_nombre_grupo,
      idGrupo: arrayToSearch.id_grupo,
      dominio: arrayToSearch.dominio,
      patente: arrayToSearch.patente,
      todos: this.datos
    }
    this.navCtrl.push(SearchFilterPage, { data }, { animation: 'wp-transition', duration: 50 });
  }

  filtroVehiculosRepetidos(datosTemp) {
    let auxObject: any = {};
    let index = 0;
    let arrayAutos = []
    datosTemp.imei.forEach((imei, i) => {
      if (arrayAutos.indexOf(imei) === -1) {
        arrayAutos.push(imei);
        Object.keys(datosTemp).forEach(key => {
          if (!auxObject[key]) auxObject[key] = [];
          if (datosTemp[key][i] !== undefined)
            auxObject[key][index] = datosTemp[key][i];
        })
        index++;
      }
    });
    auxObject['vector_id_grupo'] = [];
    auxObject['vector_nombre_grupo'] = [];
    auxObject.id_grupo.forEach(idGrupoVehiculo => {
      if (idGrupoVehiculo) {
        if (auxObject.vector_id_grupo.indexOf(idGrupoVehiculo) === -1) {
          let index = datosTemp.vector_id_grupo.indexOf(idGrupoVehiculo);
          auxObject.vector_id_grupo.push(datosTemp.vector_id_grupo[index]);
          auxObject.vector_nombre_grupo.push(datosTemp.vector_nombre_grupo[index]);
        }
      }
    });
    return auxObject;
  }

  filtroModal(arrayAutos) {
    this.recorrido = false;
    const dataTemp = filtrarDatos(arrayAutos, this.datos);
    dataTemp['autoUpdate'] = false;
    if (!this.datosPreFiltros.seAplicoFiltro) {
      this.datosPreFiltros.datos = this.datosDinamicos;
      this.datosPreFiltros.seAplicoFiltro = true;
    }
    this.datosDinamicos = dataTemp;
  }

  obtenerAutosEncendidos(datos) {
    this.recorrido = false;
    let autosEncendidos = [];
    let autosApagados = [];
    for (let index = 0; index < datos.dominio.length; index++) {
      let indices = this.datosSinFiltrar.dominio.reduce((a, e, i) => {
        if (e === datos.dominio[index])
          a.push(i);
        return a;
      }, []);
      indices.forEach(i => {
        if (this.datosSinFiltrar.cod_sensor[i] === 1) {
          if (this.datosSinFiltrar.estado_sensor_en_bit[i] === "1") {
            if (autosEncendidos.indexOf(datos.dominio[index]) === -1)
              autosEncendidos.push(datos.dominio[index]);
          } else {
            if (autosApagados.indexOf(datos.dominio[index]) === -1)
              autosApagados.push(datos.dominio[index]);
          }
        }
      });
    }
    return { encendidos: autosEncendidos, apagados: autosApagados };
  }

  autosEnReposoMovimiento(datos) {
    this.recorrido = false;
    let arrayReposo = [];
    let arrayMovimiento = [];
    for (let index = 0; index < datos.dominio.length; index++) {
      if (datos.cod_sensor[index] === 15) {
        if (datos.estado_sensor_en_bit[index] == 1) {
          arrayMovimiento.push(datos.dominio[index]);
        } else {
          arrayReposo.push(datos.dominio[index]);
        }
      }
    }
    return { reposo: arrayReposo, movimiento: arrayMovimiento };
  }

  calcularAlertas(datos) {
    this.recorrido = false;
    let vector_baja_bat = [];
    let vector_sin_reporte = [];
    let vector_sin_bat = [];
    let vector_sin_gps = [];
    let vector_estado_panico = [];
    for (let index = 0; index < datos.dominio.length; index++) {
      if (datos.voltaje_avl[index] <= datos.bateria_baja[index]) {
        vector_baja_bat.push(datos.dominio[index]);
      }
      if (datos.voltaje_vehiculo[index] < 5) {
        vector_sin_bat.push(datos.dominio[index]);
      }
      if (datos.tiempo_sin_sat[index] > 5) {
        vector_sin_gps.push(datos.dominio[index]);
      }
      if (datos.tiempo_sin_reporte[index] > 20) {
        vector_sin_reporte.push(datos.dominio[index]);
      }
      if (datos.estado_panico[index] != null) {
        vector_estado_panico.push(datos.dominio[index]);
      }
    }
    return { vector_baja_bat, vector_sin_bat, vector_sin_reporte, vector_sin_gps, vector_estado_panico };
  }

  calcularFiltrosAlertas(datos) {
    // Autos encendidos y apagados
    let autosEncendidosApagados = this.obtenerAutosEncendidos(datos);
    // En movimiento y reposo
    let autosEnReposoMovimiento = this.autosEnReposoMovimiento(datos);
    //Calculo de alertas
    let alertas = this.calcularAlertas(datos);
    this.filtrosAlertas = { autosEncendidosApagados, autosEnReposoMovimiento, alertas }
  }

  showLoader(mensaje = '') {
    this.loading = this.loadingCtrl.create({
      content: mensaje
    });
    this.loading.present();
  }
}
