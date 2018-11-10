import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  Marker,
  GoogleMaps,
  LatLngBounds,
  CameraPosition
} from '@ionic-native/google-maps';
import { data } from '../../providers/mapa/data';


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
    for (let i = 0; i < data.patente.length; i++) {
      let iconoURL = this.determinarIcono(parseInt(data.estado_sensor_en_bit[i]));
      let iconoFinal = await this.escrbirCanvas(iconoURL, data.patente[i]);
      let marker: Marker = this.map.addMarkerSync({
        title: 'Ionic',
        icon: iconoFinal,
        position: {
          lat: data.latitud[i],
          lng: data.longitud[i]
        }
      });
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        alert('clicked');
      });
      bounds.extend(marker.getPosition());
    }
    //Termino de centrar el mapa
    this.moveCamara(bounds);
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



