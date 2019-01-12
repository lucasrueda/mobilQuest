import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ModalPage } from '../pages/modal/modal';
import { MapasnativoPage } from '../pages/mapasnativo/mapasnativo';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapaProvider } from '../providers/mapa/mapa';
import { LoginPage } from '../pages/login/login';
import { LoginComponent } from '../components/login/login';
import { LoginService } from '../components/login/login.service';
import { SeleccionFechaComponent } from '../components/seleccion-fecha/seleccion-fecha';
import { SeleccionFechaService } from '../components/seleccion-fecha/seleccion-fecha.service';
import { BusquedaFlotaComponent } from '../components/busqueda-flota/busqueda-flota';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MapasnativoPage,
    ModalPage,
    TabsPage,
    LoginPage,
    LoginComponent,
    SeleccionFechaComponent,
    BusquedaFlotaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      monthNames : ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthShortNames : ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      dayNames : ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      dayShortNames : ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MapasnativoPage,
    ModalPage,
    TabsPage,
    LoginPage,
    LoginComponent,
    SeleccionFechaComponent,
    BusquedaFlotaComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MapaProvider,
    LoginService,
    SeleccionFechaService
  ]
})



export class AppModule { }
