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

  agregarMarcadores(){
    let bounds = new LatLngBounds();
      for (let i = 0; i < data.patente.length; i++) {
        let marker: Marker = this.map.addMarkerSync({
          title: 'Ionic',
          icon: this.determinarIcono(parseInt(data.estado_sensor_en_bit[i])),
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

  determinarIcono(estadoMotor){
    if(estadoMotor){
      return './assets/imgs/encendido_movimiento.png';
    }else{
      return './assets/imgs/apagado_parada.png';
    }
  }

  async moveCamara(location: LatLngBounds) {
    let center = location.getCenter();
    await this.map.moveCamera({
      target: location,
    })
    let zoom = await this.map.getCameraZoom() - 2;
    await this.map.moveCamera({
      target: center,
      zoom: zoom
    })
  }
}



