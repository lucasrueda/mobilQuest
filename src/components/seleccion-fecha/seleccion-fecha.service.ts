import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const headers = new HttpHeaders();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
headers.append('Access-Control-Allow-Origin', '*');

const url = 'http://www.mobilequest.com.ar/acciones_mq3.php';

@Injectable()
export class SeleccionFechaService {
  private url: string;
  constructor(
    public http: HttpClient,
    private storage: Storage
  ) {

  }

  public buscar(fecha_desde, fecha_hasta, imei) {
    
    fecha_desde = fecha_desde.replace(/-/g, '/')
    fecha_hasta = fecha_hasta.replace(/-/g, '/') 
    const body = new FormData();
    body.append("accion", "recorrido");
    body.append("fecha_desde", fecha_desde);
    body.append("fecha_hasta", fecha_hasta);
    body.append("imei", imei);
    return this.http.post(url, body, { headers: headers }).toPromise();
  }

  storageId(id_cliente) {
    return new Promise((resolve, reject) => {
      this.storage.ready()
        .then((res) => {
          this.storage.set('id_cliente', id_cliente);
          return resolve(id_cliente)
        })
    })
  }

}