import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MapaProvider } from '../../providers/mapa/mapa';

const headers = new HttpHeaders();
headers.append('Content-Type', 'application/x-www-form-urlencoded');
headers.append('Access-Control-Allow-Origin', '*');

@Injectable()
export class LoginService {
  private url: string;
  constructor(
    public http: HttpClient,
    private storage: Storage,
    private mapaPrv: MapaProvider
  ) {

  }

  public login(credenciales, url) {
    const usuario = credenciales.usuario;
    const password = credenciales.password;

    const body = new FormData();
    body.append("usua_nombre", usuario);
    body.append("usua_pass", password);
    body.append("button", "Entrar");
    return this.http.post(url, body, { headers: headers }).toPromise()
      .then(() => {
        // Nunca entra por el then la consulta al servidor por mala configuracion de MobileQuest.
      })
      .catch(res => {
        console.log("​LoginService -> publiclogin -> res", res)
        const respuesta = res.error.text;
        if (respuesta.includes('Clave incorrecta') || respuesta.includes('Nombre de usuario incorrecto') || respuesta.includes('<error></error>')) {
          //todo mal
          const err = {
            usuario: false,
            pass: false,
            denegado: false,
          }
          if (respuesta.includes('Clave incorrecta')) err.pass = true;
          if (respuesta.includes('Nombre de usuario incorrecto')) err.usuario = true;
          if (respuesta.includes('<error></error>')) err.denegado = true;
          return Promise.reject(err)
        } else {
          // todo ok.
          let index0 = respuesta.search("<p>")
          let index1 = respuesta.search("</p>")
          const id_cliente = parseInt(respuesta.substring(index0 + 3, index1));
          return this.storageInfo(id_cliente);
        }
      })
  }

  storageInfo(id_cliente) {
    return new Promise((resolve, reject) => {
      this.mapaPrv.consultarTodo(id_cliente).then(res => {
        this.storage.ready()
          .then((res: any) => {
            this.storage.set('id_cliente', id_cliente);
            //this.storage.set('nombre', res.cliente[0]);
            return resolve(id_cliente)
          })
      })
    })
  }

}