import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { SeleccionFechaService } from './seleccion-fecha.service';
import * as moment from 'moment';

@Component({
  selector: 'seleccion-fecha',
  templateUrl: 'seleccion-fecha.html'
})
export class SeleccionFechaComponent {

  fechaNow: any;
  horaNow: any;

  fechaDesde: Date;
  horaDesde: any;
  horaDesdeMax: any;

  fechaHasta: Date;
  horaHasta: Date;
  fechaHastaMax: any;
  fechaHastaMin: any;
  horaHastaMax: any;

  constructor() {
    console.log(moment())
    this.fechaNow = moment().format('YYYY-MM-DD');
    this.horaNow = moment().format('HH:mm');
  }

  fechaDesdeSelect() {
    if (this.fechaDesde === this.fechaNow) {
      this.horaDesdeMax = this.horaNow
      this.horaDesde = moment().format();
    }else{
      this.horaDesdeMax = '23:59'
    }
   
  }

  horaDesdeSelect() {
    if (this.fechaDesde && this.horaDesde) {
      const fechaElegida = `${this.fechaDesde} ${this.horaDesde}`;
      let fechaHastaLimiteMax: any = moment(moment(fechaElegida).add('1', 'd').format('YYYY-MM-DD HH:mm'));
      const isAfter = moment(fechaHastaLimiteMax).isAfter(`${this.fechaNow} ${this.horaNow}`);
      if (isAfter) {
        fechaHastaLimiteMax = moment().format(`${this.fechaNow} ${this.horaNow}`);
      }else{
        fechaHastaLimiteMax = moment(moment(fechaElegida).add('1', 'd').format('YYYY-MM-DD HH:mm')).format('YYYY-MM-DD HH:mm');
      }
      
      this.fechaHastaMax = fechaHastaLimiteMax.split(' ')[0];
      this.fechaHastaMin = this.fechaDesde;
      this.horaHastaMax = fechaHastaLimiteMax.split(' ')[1];
    }
  }

  hastaSelect(){
    if(this.fechaDesde === this.fechaHasta){
      
    }
  }

}
