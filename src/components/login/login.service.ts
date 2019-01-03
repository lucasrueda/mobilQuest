import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const headers = new HttpHeaders();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
headers.append('Access-Control-Allow-Origin', '*');

@Injectable()
export class LoginService {
  private url: string;
  constructor(public http: HttpClient) {
    console.log('Hello MapaProvider Provider');

  }

  public login(credenciales, url) {
    console.log("​LoginService -> publiclogin -> credenciales", credenciales)
    const usuario = credenciales.usuario;
    const password = credenciales.password;

    const body = new FormData();
    body.append("usua_nombre", usuario);
    body.append("usua_pass", password);
    body.append("button", "Entrar");
    return this.http.post(url, body, { headers: headers }).toPromise();

  }

  public consultarTodo() {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://mobilequest.com.ar/acciones_mq3.php?accion=buscapuntos&id_cliente=155', { headers: headers }).toPromise();
  }

}