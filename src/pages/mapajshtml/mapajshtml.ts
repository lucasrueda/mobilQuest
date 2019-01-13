import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { EstadoVehiculo } from '../../models/EstadoVehiculo';
import { signalGPS, obtenerDireccion, tiempoDetenido, estadoMotor, determinarIconoRecorrido, determinarAlertas } from '../../helpers/helpers'

declare var google;
declare function require(text:string);

const pathImgs = './assets/imgs/';

@Component({
	selector: 'mapajshtml',
	templateUrl: 'mapajshtml.html'
})
export class Mapajshtml {
	@Input() datos;
	apiKey: any = 'AIzaSyA4h0qNqE_K6GuDT5-BH2g2Mx_XcwbLSys';
	
	constructor(public navCtrl: NavController, public events: Events) { }
	
	ngOnChanges() {
		if (this.datos) {
			this.loadGoogleMaps();
		}
	}
	
	public loadGoogleMaps() {
		if (typeof google == "undefined" || typeof google.maps == "undefined") {
			//Load the SDK
			window['mapInit'] = () => {
				this.initMap();
			}

			let script = document.createElement("script");
			script.id = "googleMaps";

			if (this.apiKey) {
				script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
			} else {
				script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
			}
			document.body.appendChild(script);
		}
		else {
			this.initMap();
		}
	}

	public initMap() {
		let mapOptions = {
			scrollwheel: false,
			navigationControl: false,
			mapTypeControl: false,
			scaleControl: false,
			draggable: true,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}

		var mapa = new google.maps.Map(document.getElementById('map'), mapOptions);

		google.maps.event.addListener(mapa, 'click', () => {
			this.events.publish('user:click');
		});

		if (!this.datos.recorrido) {
			this.agregarMarcadores(mapa);
		} else {
			this.dibujarRecorrido(mapa);
		}
	};

	async agregarMarcadores(mapa) {
		let bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < this.datos.latitud.length; i++) {
			let latLng = new google.maps.LatLng(this.datos.latitud[i], this.datos.longitud[i]);
			let iconoURL = this.determinarIcono(parseInt(this.datos.estado_sensor_en_bit[i]));
			let iconoFinal = await this.escrbirCanvas(iconoURL, this.datos.patente[i]);

			let marker = new google.maps.Marker({
				position: latLng,
				icon: iconoFinal,
				map: mapa
			});

			google.maps.event.addListener(marker, 'click', () => {
				this.verInformacion(i);
			});

			bounds.extend(marker.position);
		}
		mapa.fitBounds(bounds);
		mapa.setZoom(mapa.getZoom() - 1.4);
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
			return pathImgs + 'encendido_movimiento.png';
		} else {
			return pathImgs + 'apagado_parada.png';
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

	async dibujarRecorrido(mapa) {
		let bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < this.datos.latitud.length; i++) {
			let latLng = new google.maps.LatLng(this.datos.latitud[i], this.datos.longitud[i]);
			let state = determinarIconoRecorrido(this.datos, i);
			let marker = new google.maps.Marker({
				position: latLng,
				icon: pathImgs + state.icono + '.png',
				map: mapa
			});
			let infowindow = new google.maps.InfoWindow({
				content: state.titulo
			});
			google.maps.event.addListener(marker, 'click', () => {
				infowindow.open(mapa, marker);
			});
			if (this.datos.tipo_alarma[i] != '') {
				let state = determinarAlertas(this.datos, i);
				let MarkerWithLabel = require('markerwithlabel')(google.maps);
				let AlertaMarker = new MarkerWithLabel({
					icon: new google.maps.MarkerImage(pathImgs + state.icono + '.png', null, null, new google.maps.Point(2, 52)),
					position: latLng,
					map: mapa,
					draggable: false,
					title: state.titulo,
					zIndex: 3,
					labelContent: 1,
					labelAnchor: new google.maps.Point(-30, 47),
				});
				let infowindow = new google.maps.InfoWindow({
					content: state.titulo
				});
				google.maps.event.addListener(AlertaMarker, 'click', () => {
					infowindow.open(mapa, AlertaMarker);
				});
			}
			bounds.extend(marker.position);
		}
		this.dubujarPolilneas(mapa);
		mapa.fitBounds(bounds);
		mapa.setZoom(mapa.getZoom() - 1.4);
	}

	dubujarPolilneas(mapa) {
		let coordinates = [];
		for (let i = 0; i < this.datos.latitud.length; i++) {
			coordinates.push(new google.maps.LatLng(this.datos.latitud[i], this.datos.longitud[i]));
		}
		let flecha_de_recorrido = {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
			strokeColor: "#F3510C",//"#E67817",
			strokeWeight: 4,
			scale: 2.5
		};
		let polilinea_recorrido = new google.maps.Polyline({
			strokeColor: "#000",
			strokeOpacity: 1,
			strokeWeight: 3.5,
			zIndex: 9,
			clickable: false,
			icons: [{
				icon: flecha_de_recorrido,
				offset: '50%',
				repeat: '100px'
			}]
		});
		polilinea_recorrido.setPath(coordinates);
		polilinea_recorrido.setMap(mapa);
	}
}

