import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from './data'
/*
  Generated class for the MapaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello MapaProvider Provider');
  }

  public consultarTodo() {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://mobilequest.com.ar/acciones_mq3.php?accion=buscapuntos&id_cliente=155', { headers: headers }).toPromise();
  }

  public consultarTodoMockUp() {
    return data;
  }

}
