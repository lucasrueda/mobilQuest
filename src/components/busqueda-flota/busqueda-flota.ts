import { Component, ElementRef, ViewChild, NgZone, trigger, style, animate, transition  } from '@angular/core';

@Component({
  selector: 'busqueda-flota',
  templateUrl: 'busqueda-flota.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(0)', opacity: 0}),
          animate('300ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('200ms', style({transform: 'translateX(0)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class BusquedaFlotaComponent {

  mostrarLista: boolean = false;
  grupos: any;

  constructor() {
    this.grupos = [
      { nombre: "camionetas", vehiculos: ["hilux","amarok"], show: false},
      { nombre: "autos", vehiculos: ["focus","corolla"],show: false},
 
     ]
  }


  input(){
    console.log("Hola")
  }
  
  checkFocus(){
    this.mostrarLista = true;
    console.log("focus")
  }

  cancelar(){
    console.log("cancelar")
  }

  openGroup(grupo){
		console.log("​HomePage -> openGroup -> grupo", grupo.nombre)
    grupo.show = !grupo.show;
  }


}
