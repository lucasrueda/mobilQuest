import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from './data'

const headers = new HttpHeaders();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
headers.append('Access-Control-Allow-Origin', '*');

@Injectable()
export class MapaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello MapaProvider Provider');
  }

  public consultarTodo(id_cliente) {
    // en consultar todo serian 3 las consultas:
    // 1: url acciones_mq3 con el form accion: buscapuntos
    // 2: url acciones_mq3 con el form accion: mensajes
    // 3: url acciones_informes con el form es accion_restricciones
    // todas las consultas se le agrega el id_cliente en el form
    const c1 = this.consulta_1(id_cliente)
    const c2 = this.consulta_2(id_cliente)
    const c3 = this.consulta_3(id_cliente)
    // el promise.all resuelve todas las promises en paralelo, si alguna falla, falla la funcion con un reject.
    // esto nos asegura q se cumplan todas las peticiones o nada..
    // si se cumplen, esto devuelve un array, en donde cada elemento del array es la respuesta a una promise.
    return Promise.all([c1, c2, c3]);
  }

  private consulta_1(id_cliente) {
    const body = new FormData();
    body.append("accion", 'buscapuntos');
    body.append("id_cliente", id_cliente);
    return this.http.post('http://mobilequest.com.ar/acciones_mq3.php', body, { headers: headers }).toPromise();
  }
  private consulta_2(id_cliente) {
    const body = new FormData();
    body.append("accion", 'mensajes');
    body.append("id_cliente", id_cliente);
    return this.http.post('http://mobilequest.com.ar/acciones_mq3.php', body, { headers: headers }).toPromise();
  }
  private consulta_3(id_cliente) {
    const body = new FormData();
    body.append("accion", 'restricciones');
    body.append("id_cliente", id_cliente);
    return this.http.post('http://mobilequest.com.ar/acciones_informes.php', body, { headers: headers }).toPromise();
  }

  public consultarTodoMockUp() {
    return data;
  }

}
