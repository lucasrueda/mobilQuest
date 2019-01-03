import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Accept': 'application/x-www-form-urlencoded',
//     'Access-Control-Allow-Origin': '*'
//   })
// };

@Injectable()
export class LoginService {
  private url: string;
  constructor(public http: HttpClient) {
    console.log('Hello MapaProvider Provider');

  }

  public login(credenciales, url) {
	console.log("​LoginService -> publiclogin -> credenciales", credenciales)
    const usuario = credenciales.usua_nombre;
    const password = credenciales.usua_pass;
    const button = credenciales.button;
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');
    const body = new FormData();
    body.append("usua_nombre",usuario);
    body.append("usua_pass",password);
    body.append("button",button);
    return this.http.post(url, body, {headers:headers}).toPromise();

  }

  public consultarTodo() {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://mobilequest.com.ar/acciones_mq3.php?accion=buscapuntos&id_cliente=155', {headers: headers}).toPromise();
  }

}