import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import {
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMaps,
  LatLngBounds,
  LatLng,
  Polygon,
  PolygonOptions,
} from '@ionic-native/google-maps';
import { EstadoVehiculo } from '../../models/EstadoVehiculo';
import { signalGPS, obtenerDireccion, tiempoDetenido, estadoMotor } from '../../helpers/helpers'
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

  async loadMap() {
    if (!this.map) {
      this.map = GoogleMaps.create('map')

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
        console.log('Map is ready!');
        this.agregarMarcadores();
      });
    } else {
      console.log(this.datos)
      await this.map.clear();
      //this.agregarMarcadores();
      this.dibujarPolygono();
      this.dubujarPolilneas();
    }

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
      this.events.publish('user:click');
    })
  }

  async agregarMarcadores() {
    let bounds = new LatLngBounds();
    for (let i = 0; i < this.datos.latitud.length; i++) {
      let iconoURL = this.determinarIcono(parseInt("1"));
      // let iconoURL = this.determinarIcono(parseInt(this.datos.estado_sensor_en_bit[i]));
      let iconoFinal = await this.escrbirCanvas(iconoURL, 'TEST');
      // let iconoFinal = await this.escrbirCanvas(iconoURL, this.datos.patente[i]);
      let marker: Marker = this.map.addMarkerSync({
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

  async verInformacion(i: number) {
    let vehiculo: EstadoVehiculo = new EstadoVehiculo(
      this.datos.imei[i],
      this.datos.numero[i],
      this.datos.dominio[i],
      this.datos.patente[i],
      this.datos.marca[i],
      this.datos.color[i],
      await obtenerDireccion(this.datos.latitud[i], this.datos.longitud[i]),
      this.datos.hora_avl[i],
      tiempoDetenido(this.datos.tiempo_parada[i] * 60),
      estadoMotor(this.datos.estado_sensor_en_bit[i]),
      Math.round(parseFloat(this.datos.km_total_usuario[i]) * 100) / 100,//cuenta Kilometros
      this.datos.voltaje_vehiculo[i],
      signalGPS(this.datos.hdop[i])
    );
    console.log(vehiculo);
    this.events.publish('mapClickEvent', vehiculo);
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

  async dibujarPolygono() {
    // puntos_para_recorrido.push(latlng);
    //gestion de sentido del recorrido
    for (let i = 1; i < (this.datos.latitud.length + 1); i++) {
      // if (i > 0) {
      let p0 = new LatLng(data.latitud[i - 1], data.longitud[i - 1]);
      let p1 = new LatLng(data.latitud[i], data.longitud[i]);
      let vector = new LatLng(p1.lat - p0.lat, p1.lng - p0.lng);
      let length = Math.sqrt(vector.lat * vector.lat + vector.lng * vector.lng);
      let normal = new LatLng(vector.lat / length, vector.lng / length);
      let middle = new LatLng((p1.lat + p0.lat) / 2, (p1.lng + p0.lng) / 2);
      let constante = 0.00055;
      if (length < 0.0019) {
        constante = 0.00015;
      }
      let offsetMiddle = new LatLng(normal.lat * constante, normal.lng * constante),
        arrowPart1 = new LatLng(-offsetMiddle.lng * 0.4, offsetMiddle.lat * 0.4),
        arrowPart2 = new LatLng(offsetMiddle.lng * 0.4, -offsetMiddle.lat * 0.4),
        arrowPoint1 = new LatLng(middle.lat - offsetMiddle.lat + arrowPart1.lat, middle.lng - offsetMiddle.lng + arrowPart1.lng),
        arrowPoint2 = new LatLng(middle.lat - offsetMiddle.lat + arrowPart2.lat, middle.lng - offsetMiddle.lng + arrowPart2.lng);
      let flechitas_coordenadas = ([arrowPoint1, middle, arrowPoint2]);
      if (length > 0.0009) {
        let options = {
          //path: flechitas_coordenadas,
          points: flechitas_coordenadas,
          strokeColor: "#09F",
          strokeOpacity: 1,
          fillOpacity: 1,
          fillColor: "#09F",//Esta linea no la entiende el firefox, por eso muestra el triangulo del sentido negro
          strokeWidth: 10,
          zIndex: 11,
          visible: true,
          clickable: false
        }
        this.map.addPolygon(options);
      }
      // }
    }
  }

  dubujarPolilneas() {
    let coordinates = [];
    for (let i = 0; i < this.datos.latitud.length; i++) {
      coordinates.push(new LatLng(this.datos.latitud[i], this.datos.longitud[i]));
    }
    this.map.addPolyline({
      points: coordinates,
      color: '#AA00FF',
      width: 10,
      geodesic: true
    });
  }

//   var flecha_de_recorrido = {
//     path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
//     strokeColor: "#F3510C",//"#E67817",
//     strokeWeight: 4,
//     scale: 2.5
//   };
//   var movil = {
//     path: google.maps.SymbolPath.CIRCLE,
//     scale: 8,
//     strokeColor: 'red'
//   }; 
//   var polilinea_recorrido = new google.maps.Polyline({
//     strokeColor: "#000",
//     strokeOpacity: 1,
//     strokeWeight: 3.5,
//     zIndex:9,
//     clickable: false,
//     icons: [{
//     icon: flecha_de_recorrido,
//     offset: '50%',
//     repeat: '100px'}]
//   });
}



