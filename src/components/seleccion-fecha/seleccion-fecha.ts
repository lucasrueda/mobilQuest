import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { SeleccionFechaService } from './seleccion-fecha.service';
import * as moment from 'moment';

@Component({
  selector: 'seleccion-fecha',
  templateUrl: 'seleccion-fecha.html'
})
export class SeleccionFechaComponent {

  @Input() imei: string;
  @Output() respuesta = new EventEmitter<any>();
  @Output() advFilterOn = new EventEmitter<any>();

  filtroAvanzado: boolean = false;
  filtroRapido: any;
  fechaNow: any;
  horaNow: any;

  fechaDesde: any;
  horaDesde: any;
  horaDesdeMax: any;

  fechaHasta: any;
  horaHasta: any;
  fechaHastaMax: any;
  fechaHastaMin: any;
  horaHastaMax: any;
  horaHastaMin: any;

  loading: any;

  constructor(
    public alertCtrl: AlertController,
    private selectFechaSrv: SeleccionFechaService,
    public loadingCtrl: LoadingController
  ) {
  }

  ngOnInit() {
    this.fechaNow = moment().format('YYYY-MM-DD');
    this.horaNow = moment().format('HH:mm');
  }

  filtroAvanzadoOption() {
    this.filtroAvanzado = !this.filtroAvanzado;
    this.advFilterOn.emit(this.filtroAvanzado);
  }

  buscarFiltroRapido() {
    this.fechaNow = moment().format('YYYY-MM-DD');
    this.horaNow = moment().format('HH:mm');
    const fecha_hasta = `${this.fechaNow} ${this.horaNow}`
    const cantidad = this.filtroRapido.substring(0, this.filtroRapido.length - 1);
    const magnitud = this.filtroRapido[this.filtroRapido.length - 1];
    const fecha_desde = moment(moment(fecha_hasta).subtract(cantidad, magnitud).format('YYYY-MM-DD HH:mm')).format('YYYY-MM-DD HH:mm');
    this.buscar(fecha_desde, fecha_hasta)
  }

  fechaDesdeSelect() {
    this.horaDesde = '00:00'
    if (this.fechaDesde === this.fechaNow) {
      this.horaDesdeMax = this.horaNow
    } else {
      this.horaDesdeMax = '23:59'
    }
    this.fechaHasta = null;
    this.horaHasta = null;
    this.horaDesdeSelect();
  }

  horaDesdeSelect() {
    this.fechaNow = moment().format('YYYY-MM-DD');
    this.horaNow = moment().format('HH:mm');
    if (this.fechaDesde && this.horaDesde) {
      const fechaElegida = `${this.fechaDesde} ${this.horaDesde}`;
      let fechaHastaLimiteMax: any = moment(moment(fechaElegida).add('1', 'd').format('YYYY-MM-DD HH:mm'));
      const isAfter = moment(fechaHastaLimiteMax).isAfter(`${this.fechaNow} ${this.horaNow}`);
      if (isAfter) {
        fechaHastaLimiteMax = moment().format(`${this.fechaNow} ${this.horaNow}`);
      } else {
        fechaHastaLimiteMax = moment(moment(fechaElegida).add('1', 'd').format('YYYY-MM-DD HH:mm')).format('YYYY-MM-DD HH:mm');
      }

      this.fechaHastaMax = fechaHastaLimiteMax.split(' ')[0];
      this.fechaHastaMin = this.fechaDesde;
      this.horaHastaMax = fechaHastaLimiteMax.split(' ')[1];
      this.horaHasta = null;
    }
  }

  fechaHastaSelect() {
    if (this.fechaDesde === this.fechaHasta) {
      this.horaHastaMax = '23:59';
      this.horaHastaMin = this.horaDesde;
    } else {
      this.horaHastaMax = this.horaDesde;
      this.horaHastaMin = '00:00';
    }
    this.horaHasta = this.horaHastaMin;
  }

  buscarAvanzado() {
    const fechaElegida = `${this.fechaDesde} ${this.horaDesde}`;
    let fechaHastaLimiteMax: any = moment(moment(fechaElegida).add('1', 'd').format('YYYY-MM-DD HH:mm'));
    const isSame = moment(fechaElegida).isSame(`${this.fechaHasta} ${this.horaHasta}`);
    const isSameOrAfter = moment(fechaHastaLimiteMax).isSameOrAfter(`${this.fechaHasta} ${this.horaHasta}`);
    console.log("​SeleccionFechaComponent -> buscarAvanzado -> isSameOrAfter", isSameOrAfter)
    if (isSame) {
      this.presentAlert('Rango de fechas no permitido', 'Las fechas son iguales. Ingrese un nuevo intervalo de fechas')

    } else {
      // isSameOrAfter tiene que ser true, es decir, la fecha limite son 24 hs despues, y eso se cumple con TRUE
      if (!isSameOrAfter) {
        this.presentAlert('Rango de fechas no permitido', 'La consulta no puede superar las 24 hs. Ingrese un nuevo intervalo de fechas')
      } else {
        const fecha_desde = `${this.fechaDesde} ${this.horaDesde}`
        const fecha_hasta = `${this.fechaHasta} ${this.horaHasta}`
        this.buscar(fecha_desde, fecha_hasta)
      }
    }

  }

  buscar(fecha_desde, fecha_hasta) {
    this.showLoader();
    this.selectFechaSrv.buscar(fecha_desde, fecha_hasta, this.imei)
      .then((res: any) => {
        this.loading.dismiss();
        if (res.hasOwnProperty('respuesta')) {
          console.log("error: ", res.respuesta)
          if (res.respuesta === "SIN_REGISTROS") {
            this.presentAlert('Sin registros', 'Por favor ingrese otro intervalo de fechas')
          } else {
            this.presentAlert(`Error (${res.respuesta})`, 'Por favor ingrese otro intervalo de fechas')
          }
        } else {
          console.log("Todo ok")
          this.respuesta.emit(res);
        }
      })
      .catch(err => {
        this.loading.dismiss();
        console.log("​SeleccionFechaComponent -> buscarFiltroRapido -> err", err)
        this.presentAlert(`Error (${err})`, 'Comuniquese con un asistente')
      })
  }

  presentAlert(title, mensaje) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: mensaje,
      buttons: ['Aceptar']
    });
    alert.present();
  }

  showLoader(mensaje = ''){
    this.loading = this.loadingCtrl.create({
    content: mensaje
    });
    this.loading.present();
  }  

}
