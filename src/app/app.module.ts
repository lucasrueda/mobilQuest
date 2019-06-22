import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { ModalPage } from '../pages/modal/modal';
import { MapasnativoPage } from '../pages/mapasnativo/mapasnativo';
import { Mapajshtml } from '../pages/mapajshtml/mapajshtml';
import { SearchFilterPage } from '../pages/search-filter/search-filter';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapaProvider } from '../providers/mapa/mapa';
import { LoginPage } from '../pages/login/login';
import { LoginComponent } from '../components/login/login';
import { LoginService } from '../components/login/login.service';
import { SeleccionFechaComponent } from '../components/seleccion-fecha/seleccion-fecha';
import { SeleccionFechaService } from '../components/seleccion-fecha/seleccion-fecha.service';
import { BusquedaFlotaComponent } from '../components/busqueda-flota/busqueda-flota';
import { CheckConnectionProvider } from '../providers/checkConnection';
import { Error404Page } from '../pages/error404/error404';
import { ReferenciaPage } from '../pages/referencia/referencia';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapasnativoPage,
    ModalPage,
    Mapajshtml,
    LoginPage,
    SearchFilterPage,
    LoginComponent,
    SeleccionFechaComponent,
    ReferenciaPage,
    BusquedaFlotaComponent,
    Error404Page
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      monthNames : ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthShortNames : ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      dayNames : ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
      dayShortNames : ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'],
      mode: 'md'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapasnativoPage,
    ModalPage,
    Mapajshtml,
    LoginPage,
    SearchFilterPage,
    LoginComponent,
    SeleccionFechaComponent,
    ReferenciaPage,
    BusquedaFlotaComponent,
    Error404Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MapaProvider,
    LoginService,
    Keyboard,
    SeleccionFechaService,
    CheckConnectionProvider,
  ]
})



export class AppModule { }
