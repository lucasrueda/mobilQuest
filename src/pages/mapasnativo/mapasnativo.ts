import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMaps,
  LatLngBounds,
} from '@ionic-native/google-maps';
import { EstadoVehiculo } from '../../models/EstadoVehiculo';
import { signalGPS, obtenerDireccion, tiempoDetenido, estadoMotor } from '../../helpers/helpers'

@Component({
  selector: 'page-mapasnativo',
  templateUrl: 'mapasnativo.html'
})
export class MapasnativoPage {
  @Input() datos;
  map: GoogleMap;

  constructor(public navCtrl: NavController,
    public events: Events,
    public platform: Platform) { }

  ngOnChanges() {
    if (this.datos) {
      this.platform.ready().then(() => {
        this.loadMap();
      })
    }
  }

  loadMap() {
    this.map = GoogleMaps.create('map')

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
      this.agregarMarcadores();
    });

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
      this.events.publish('user:click');
    })
  }

  async agregarMarcadores() {
    let bounds = new LatLngBounds();
    for (let i = 0; i < this.datos.patente.length; i++) {
      let iconoURL = this.determinarIcono(parseInt(this.datos.estado_sensor_en_bit[i]));
      let iconoFinal = await this.escrbirCanvas(iconoURL, this.datos.patente[i]);
      let marker: Marker = this.map.addMarkerSync({
        title: 'Ionic',
        icon: iconoFinal,
        position: {
          lat: this.datos.latitud[i],
          lng: this.datos.longitud[i]
        }
      });
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.verInformacion(i);
      });
      bounds.extend(marker.getPosition());
    }
    //Termino de centrar el mapa
    this.moveCamara(bounds);
  }

  async verInformacion(i:number){
    let vehiculo:EstadoVehiculo = new EstadoVehiculo(
      this.datos.numero[i],
      this.datos.dominio[i],
      this.datos.patente[i],
      this.datos.marca[i],
      this.datos.color[i],
      await obtenerDireccion(this.datos.latitud[i], this.datos.longitud[i]),
      this.datos.hora_avl[i],
      tiempoDetenido(this.datos.tiempo_parada[i]*60),
      estadoMotor(this.datos.estado_sensor_en_bit[i]),
      Math.round(parseFloat(this.datos.km_total_usuario[i])*100)/100,//cuenta Kilometros
      this.datos.voltaje_vehiculo[i],
      signalGPS(this.datos.hdop[i])
    );
    console.log(vehiculo);
  }

  determinarIcono(estadoMotor) {
    if (estadoMotor) {
      return './assets/imgs/encendido_movimiento.png';
    } else {
      return './assets/imgs/apagado_parada.png';
    }
  }

  escrbirCanvas(iconoURL, nombre) {
    return new Promise((resolve, reject) => {
      //Creo el canvas 
      let canvas, ctx;
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");

      // Creo el objeto de la imagen 
      let imageObj = new Image();
      imageObj.crossOrigin = "Anonymous";
      imageObj.src = iconoURL;
      // Espero que ser cargue para poder obtener sus propiedades
      imageObj.onload = (() => {
        canvas.width = imageObj.width + 50;
        canvas.crossOrigin = "Anonymous";
        canvas.height = imageObj.height + 50;
        ctx.font = "bold 12pt Arial";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageObj, 0, 0);
        ctx.fillStyle = "blue";
        ctx.fillText(nombre, 8, 82);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.font = "bold 6pt Arial";
        ctx.fillText('60+', 12, 15);
        resolve(canvas.toDataURL("image/jpg"));
      })
    })
  }

  async moveCamara(location: LatLngBounds) {
    let center = location.getCenter();
    await this.map.moveCamera({
      target: location,
    })
    let zoom = await this.map.getCameraZoom() - 1.5;
    await this.map.moveCamera({
      target: center,
      zoom: zoom
    })
  }
}



