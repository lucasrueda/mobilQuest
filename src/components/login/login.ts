import { Component, Input } from '@angular/core';
import { AlertController, App, LoadingController, IonicPage, Form, ToastController } from 'ionic-angular';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginComponent {
  @Input() logoUrl: string;
  @Input() endpoint: string;



  private loginForm: FormGroup;
  private loading: any;

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public loginSrv: LoginService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.formBuilder.group({
      usua_nombre: ['', Validators.required],
      usua_pass: ['', Validators.required],
      button: ['Entrar'],
    });
  }

  ionViewDidLoad() {
  }

  login() {
    this.showLoading();
    this.loginSrv.login(this.loginForm.value, this.endpoint)
      .then(res => {
        // Nunca entra por el then la consulta al servidor por mala configuracion de MobileQuest.
        this.loading.dismiss();
      })
      .catch(err => {
        this.loading.dismiss();
        console.log("​LoginComponent -> login -> err", err.error.text)
        // si las credenciales estan mal, aparece un alert("Nombre de usuario incorrecto")
        // sino, aparece dentro de un <p> el numero de id del cliente
        const respuesta = err.error.text;
        if (respuesta.includes('incorrecto')) {
          //todo mal, no existe el usuario
          console.log("todo mal")
          this.presentToast("Usuario y/o contraseña incorrectos. Vuelva a intentar")
        } else {
          // existe el usuario
          console.log("todo ok")
          this.presentToast("Ha iniciado sesión correctamente")
        }

      })
    // const loading = this.loadingCtrl.create({
    //   duration: 500
    // });

    // loading.onDidDismiss(() => {
    //   const alert = this.alertCtrl.create({
    //     title: 'Logged in!',
    //     subTitle: 'Thanks for logging in.',
    //     buttons: ['Dismiss']
    //   });
    //   alert.present();
    // });

    // loading.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      // content: 'Por favor espere...',
      spinner: 'crescent',
    });
    this.loading.present();
  }

  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  goToSignup() {
    // this.navCtrl.push(SignupPage);
  }

  // Gradient logic from https://codepen.io/quasimondo/pen/lDdrF
  // NOTE: I'm not using this logic anymore, but if you want to use somehow, somewhere,
  // A programmatically way to make a nice rainbow effect, there you go.
  // NOTE: It probably won't work because it will crash your phone as this method is heavy \o/
  colors = new Array(
    [62, 35, 255],
    [60, 255, 60],
    [255, 35, 98],
    [45, 175, 230],
    [255, 0, 255],
    [255, 128, 0]);

  step = 0;
  // color table indices for:
  // [current color left,next color left,current color right,next color right]
  colorIndices = [0, 1, 2, 3];

  // transition speed
  gradientSpeed = 0.00005;
  gradient = '';

  updateGradient() {

    const c00 = this.colors[this.colorIndices[0]];
    const c01 = this.colors[this.colorIndices[1]];
    const c10 = this.colors[this.colorIndices[2]];
    const c11 = this.colors[this.colorIndices[3]];

    const istep = 1 - this.step;
    const r1 = Math.round(istep * c00[0] + this.step * c01[0]);
    const g1 = Math.round(istep * c00[1] + this.step * c01[1]);
    const b1 = Math.round(istep * c00[2] + this.step * c01[2]);
    const color1 = 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')';

    const r2 = Math.round(istep * c10[0] + this.step * c11[0]);
    const g2 = Math.round(istep * c10[1] + this.step * c11[1]);
    const b2 = Math.round(istep * c10[2] + this.step * c11[2]);
    const color2 = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';

    this.gradient = `-webkit-gradient(linear, left top, right bottom, from(${color1}), to(${color2}))`;
    this.step += this.gradientSpeed;
    if (this.step >= 1) {
      this.step %= 1;
      this.colorIndices[0] = this.colorIndices[1];
      this.colorIndices[2] = this.colorIndices[3];

      // pick two new target color indices
      // do not pick the same as the current one
      this.colorIndices[1] =
        (this.colorIndices[1] + Math.floor(1 + Math.random() * (this.colors.length - 1)))
        % this.colors.length;

      this.colorIndices[3] =
        (this.colorIndices[3] + Math.floor(1 + Math.random() * (this.colors.length - 1)))
        % this.colors.length;

    }

    setInterval(() => { this.updateGradient(); }, 40);
  }
}
