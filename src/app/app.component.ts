import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform, Nav, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { SeleccionFechaComponent } from '../components/seleccion-fecha/seleccion-fecha';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { EstadoVehiculo } from '../models/EstadoVehiculo';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('content', { read: ElementRef }) contenedor: ElementRef;
  @ViewChild('fecha', { read: ElementRef }) fecha: ElementRef;
  altoMenu: number;
  vehiculo: EstadoVehiculo;

  rootPage: any;
  pages: Array<{ title: string, component: any, active: boolean, icon: string }>;
  nombreCliente: string;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    public event: Events,
    public menuCtrl: MenuController,
    splashScreen: SplashScreen,
    public _zone: NgZone,
    private storage: Storage,
  ) {
    this.pages = [
      { title: 'Home', component: 'HomePage', active: true, icon: 'home' },
      { title: 'Mapa', component: 'HomePage', active: true, icon: 'map' }
    ];

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkLogin();
      this.getNombre();
    });
  }

  checkLogin() {
    this.storage.ready()
      .then(() => {
        this.storage.get('id_cliente').then((id_cliente) => {
          if (id_cliente) {
            this.rootPage = HomePage;
            this.handleMapClickEvent();
          } else {
            this.rootPage = LoginPage;
          }
        });
      })
  }

  getNombre(){
    this.storage.ready()
      .then(() => {
        this.storage.get('nombre').then((nombre) => {
          this.nombreCliente = nombre;
        });
      })
  }

  ngAfterViewInit() {
    this.altoMenu = (this.contenedor.nativeElement.offsetHeight) - 208;
  }

  advFilterOn(isOn) {
    if (isOn) {
      this.altoMenu = (this.contenedor.nativeElement.offsetHeight) - 330;
    } else {
      this.altoMenu = (this.contenedor.nativeElement.offsetHeight) - 208;
    }
  }


  logout() {
    this.storage.clear()
      .then(() => {
        this.nav.setRoot(LoginPage);
      })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  handleMapClickEvent() {
    this.event.subscribe('mapClickEvent', (vehiculo: EstadoVehiculo) => {
      this._zone.run(() => this.vehiculo = vehiculo);
      this.menuCtrl.open('right');
    })
  }

  handleDateFilterResponse(datos) {
    this.event.publish('filtroPorFechas', datos);
  }
}
