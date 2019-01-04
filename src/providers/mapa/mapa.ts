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
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    const body = new FormData();
    body.append("accion", 'buscapuntos');
    body.append("id_cliente", id_cliente);
    return this.http.post('http://mobilequest.com.ar/acciones_mq3.php', body, { headers: headers }).toPromise();
  }

  public consultarTodoMockUp() {
    return data;
  }

}
