import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  endpoint: string;
  logoUrl: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.endpoint = "http://www.mobilequest.com.ar/session.php"
    this.logoUrl = "assets/imgs/login_logo.png"
  }

  ionViewDidLoad() {
  }

  onRespuesta(respuesta) {
    let mensaje: string;
    if (respuesta.login) {
      mensaje = "Ha iniciado sesión correctamente";
      this.navCtrl.setRoot(HomePage)
    } else {
      if (respuesta.err.pass) mensaje = "Contraseña incorrecta"
      else mensaje = "Usuario incorrecto"
    }
    this.presentToast(mensaje)
  }

  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }


}
