import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CheckConnectionProvider } from '../../providers/checkConnection';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-error404',
  templateUrl: 'error404.html',
})
export class Error404Page {

  botonReintentar: boolean;
  mensaje: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private checkConnPrv: CheckConnectionProvider,
    private storage: Storage,
  ) {
    this.botonReintentar = this.navParams.get('botonReintentar');
    this.mensaje = this.navParams.get('mensaje');
  }


  async checkConnection(e) {
    e.preventDefault();
    const loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
    this.checkConnPrv.checkConn()
      .then((res: any) => {
        this.checkLogin();
      })
      .catch(err => console.log(err));
  }

  checkLogin() {
    this.storage.ready()
      .then(() => {
        this.storage.get('id_cliente').then((id_cliente) => {
          if (id_cliente) {
            this.navCtrl.setRoot(HomePage);
          } else {
            this.navCtrl.setRoot(LoginPage);
          }
        });
      })
  }
}
