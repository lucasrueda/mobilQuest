import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })
};

@Injectable()
export class LoginService {
  private url: string;
  constructor(public http: HttpClient) {
    console.log('Hello MapaProvider Provider');

  }

  public login(usuario, password, url) {
		console.log("​LoginService -> publiclogin -> usuario", usuario)
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var body = "usua_nombre=" + usuario + "&usua_pass=" + password + "&button=Entrar";
    return this.http.post(url, body, httpOptions).toPromise();

  }

  public consultarTodo() {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://mobilequest.com.ar/acciones_mq3.php?accion=buscapuntos&id_cliente=155', {headers: headers}).toPromise();
  }

}