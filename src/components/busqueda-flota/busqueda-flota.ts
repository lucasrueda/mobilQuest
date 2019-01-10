import { Component, ElementRef, ViewChild, NgZone, trigger, style, animate, transition } from '@angular/core';

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

  mostrarLista: boolean = false;
  grupos: any;
  todaLaFlota: boolean = true;
  searchTermVehiculo: any = '';
  private vehiculos: any; //aqui se guardan los datos originales
  public listaVehiculosBusqueda: any; //este es un auxiliar

  constructor() {
    this.grupos = [
      { nombre: "camionetas", vehiculos: [{ nombre: "hilux" }, { nombre: "amarok" }], show: false },
      {
        nombre: "autos", vehiculos: [
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "focus" },
          { nombre: "corolla" }
        ], show: false
      },
      { nombre: "motos", vehiculos: [{ nombre: "x200" }, { nombre: "crypton" }], show: false },


    ]
  }



  // primero se guardan los datos a filtrar en 2 variables diferentes
  listarVehiculos() {
    // this.planillaProv.listarTransportes().then((respuesta: any) => {
    //   console.log("llistar transportes respuesta", respuesta)
    //   if (respuesta.codigo != 0) {
    //     this.transportes = respuesta;
    //     this.listaTransportesBusqueda = respuesta;
    //   } else {
    //     swal("¡Error!", respuesta.mensaje, "error");
    //   }
    // }, (err) => {
    //   swal("¡Error!", "Problemas de conexion con el sistema", "error");
    // });
    this.grupos = [
      { nombre: "camionetas", vehiculos: [{ nombre: "hilux" }, { nombre: "amarok" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },
      { nombre: "autos", vehiculos: [{ nombre: "focus" }, { nombre: "corolla" }], show: false },

    ]
  }
  //despues se filtra sobre esos array
  filtrarVehiculos() {
    // this.datos.transporte = null;
    if (this.listaVehiculosBusqueda == null) {
      this.listarVehiculos();
    }
    if (this.searchTermVehiculo.length > 0) {
      this.listaVehiculosBusqueda = this.grupos.filter((item) => {
        // IndexOf() devuelvo la passicion de letra que esta buscando, entonces si yo
        // hago === 0 significa que le digo que quiero que me devuelvas todos los valores
        // donde el appellido comienze con R.
        // si por ejemplo hago > -1 hago que donde encuentre la coincidencia lo devuelva
        // osea que si un apellido es juarez, y aprieto la R lo va a devolver.
        return item.vehiculos.toLowerCase().indexOf(this.searchTermVehiculo.toLowerCase()) === 0;
      });
    } else {
      this.listaVehiculosBusqueda = this.grupos.filter((item) => {
        return item.vehiculos.toLowerCase().indexOf('') > -1;
      });
    }
  }
  // despues se recupera la seleccion
  vehiculoSeleccionado(vehiculo) {
    console.log("​BusquedaFlotaComponent -> vehiculoSeleccionado -> vehiculo", vehiculo)
    // this.searchTermTransporte = transporte.razonSocial;
    // this.listaTransportesBusqueda = null;
    // this.datos.transporte = transporte;
    // console.log(this.datos)
  }


  checkFocus() {
    this.mostrarLista = true;
    console.log("focus")
  }

  cancelar() {
    console.log("cancelar")
  }

  openGroup(grupo) {
    console.log("​HomePage -> openGroup -> grupo", grupo.nombre)
    grupo.show = !grupo.show;
    this.todaLaFlota = false;
  }

  allFlota() {
    for (let g of this.grupos) {
      g.show = false;
    }
    this.todaLaFlota = true;
  }


}
