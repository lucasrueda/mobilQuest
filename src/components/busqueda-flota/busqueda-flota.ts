import { Component, ElementRef, ViewChild, NgZone, trigger, style, animate, transition, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'busqueda-flota',
  templateUrl: 'busqueda-flota.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(0)', opacity: 0 }),
          animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ]),
        transition(':leave', [
          style({ transform: 'translateX(0)', opacity: 1 }),
          animate('200ms', style({ transform: 'translateX(0)', opacity: 0 }))
        ])
      ]
    )
  ],
})
export class BusquedaFlotaComponent {

  @Input() vectorIdGrupo: any;
  @Input() vectorNombreGrupo: any;
  @Input() idGrupo: any;
  @Input() dominio: any;
  @Output() respuesta = new EventEmitter<any>();

  mostrarLista: boolean = false;
  flota: Array<any> = [];
  showButtonTodaFlota: boolean = false;
  searchTermVehiculo: any = '';
  private vehiculos: any; //aqui se guardan los datos originales
  public listaFlotaBusqueda: any; //este es un auxiliar

  constructor(
  ) {
  }

  ngOnInit() {
    this.parsearGrupos();
  }

  parsearGrupos() {
    for (let i in this.vectorIdGrupo) {
      this.flota.push({
        grupo: this.vectorNombreGrupo[i].toUpperCase(),
        idGrupo: this.vectorIdGrupo[i],
        vehiculos: [],
        show: false
      },
        { // para los vehiculos sin grupo
          grupo: null,
          idGrupo: null,
          vehiculos: [],
          show: false
        })
    }

    for (let i in this.idGrupo) {
      if (this.idGrupo[i]) {
        const j = this.flota.map(f => f.idGrupo).indexOf(this.idGrupo[i]);
        this.flota[j].vehiculos.push({ dominio: this.dominio[i].toUpperCase() });
      } else {
        //quiere decir que el vehiculo no tiene grupo, entonces lo agregamos a un grupo "null"
        const j = this.flota.map(f => f.idGrupo).indexOf(null);
        this.flota[j].vehiculos.push({ dominio: this.dominio[i].toUpperCase() });
      }
    }
    this.listaFlotaBusqueda = JSON.parse(JSON.stringify(this.flota));
  }

  //despues se filtra sobre esos array
  filtrarVehiculos() {
    if (this.searchTermVehiculo.length > 0) {
      this.listaFlotaBusqueda = JSON.parse(JSON.stringify(this.flota));
      // const filteredResult = this.flota.filter((item) => {
      //   return (item.vehiculos.indexOf(this.searchTermVehiculo.toLowerCase()) !== -1);
      // });
      // console.log("​BusquedaFlotaComponent -> filtrarVehiculos -> filteredResult", filteredResult)
      this.listaFlotaBusqueda = this.listaFlotaBusqueda.filter(f => {
        f.vehiculos = f.vehiculos.filter(v => {
          const coincidencia = (v.dominio.indexOf(this.searchTermVehiculo.toUpperCase()) === 0);
          if (coincidencia) {
            f.show = true;
          }
          return coincidencia
        });
        return f.vehiculos.length > 0;
      });
    } else {
      this.listaFlotaBusqueda = JSON.parse(JSON.stringify(this.flota));
    }
  }

  // despues se recupera la seleccion
  vehiculoSeleccionado(vehiculo) {
    console.log("​BusquedaFlotaComponent -> vehiculoSeleccionado -> vehiculo", vehiculo)
    this.respuesta.emit({ showAll: false, vehiculo });
    this.showButtonTodaFlota = true;
    this.mostrarLista = false;
  }

  checkFocus() {
    this.mostrarLista = true;
  }

  openGroup(grupo) {
    console.log("​HomePage -> openGroup -> grupo", grupo.nombre)
    grupo.show = !grupo.show;
  }

  verTodaFlota() {
    for (let f of this.flota) {
      f.show = false;
    }
    this.listaFlotaBusqueda = JSON.parse(JSON.stringify(this.flota));
    this.showButtonTodaFlota = false;
    this.mostrarLista = false;
    this.searchTermVehiculo = '';
    this.respuesta.emit({ showAll: true });
  }

  cancelar() {
    this.mostrarLista = false;
  }

}

// this.flota = [
//   { grupo: "camionetas", vehiculos: ["HILUX", "AMAROK",], show: false },
//   {
//     grupo: "autos", vehiculos: [
//       "FOCUS",
//       "COROLLA",
//       "CLIO",
//       "FIESTA",
//       "LOGAN",
//       "QQ",
//       "KWID",
//       "UP",
//       "GOL"
//     ], show: false
//   },
//   { grupo: "motos", vehiculos: ["X200", "WAVE"], show: false },
//   { grupo: "camion", vehiculos: ["F150", "RAM 5000"], show: false },
// ]
