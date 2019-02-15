import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { EstadoVehiculo } from '../../models/EstadoVehiculo';
import { signalGPS, obtenerDireccion, tiempoDetenido, determinarIconoRecorrido, determinarAlertas, determinarIconoDeFlota } from '../../helpers/helpers'

declare var google;
var mapa;
declare function require(text: string);
var allMarkersOnMap = [];
var inforWindowsGlobal;

const pathImgs = './assets/imgs/';

@Component({
	selector: 'mapajshtml',
	templateUrl: 'mapajshtml.html'
})
export class Mapajshtml {
	@Input() datos;
	@Input() datosSinFiltar;
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

		if (!this.datos.autoUpdate) {
			mapa = new google.maps.Map(document.getElementById('map'), mapOptions);

			google.maps.event.addListener(mapa, 'click', () => {
				this.events.publish('user:click');
			});
		} else {
			allMarkersOnMap.forEach(m => m.setMap(null));
			allMarkersOnMap = [];
		}

		if (!this.datos.recorrido) {
			this.agregarMarcadores(mapa);
		} else {
			this.dibujarRecorrido(mapa);
		}
	};

	async agregarMarcadores(mapa) {
		let zIndex = 1;
		let bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < this.datos.latitud.length; i++) {
			let latLng = new google.maps.LatLng(this.datos.latitud[i], this.datos.longitud[i]);
			let iconosURL = determinarIconoDeFlota(this.datos.estado_sensor_en_bit[i], this.datos.velocidad[i], this.datos.direcc[i], this.datos.tiempo_parada[i], this.datos.tiempo_sin_sat[i], this.datos.tiempo_sin_reporte[i], this.datos.min_buffer[i], this.datos.hora_avl_tmp[i]);
			let x = ((this.datos.dominio[i].length * 7) / 2) - 3;
			let y = 4;
			let MarkerWithLabel = require('markerwithlabel')(google.maps);
			let marker = new MarkerWithLabel({
				icon: pathImgs + iconosURL.icono + '.png',
				size: new google.maps.Size(54, 70),
				position: latLng,
				map: mapa,
				draggable: false,
				zIndex: zIndex + 1,
				labelContent: this.datos.dominio[i],
				labelAnchor: new google.maps.Point(x, y),
				labelClass: "labels",
				labelStyle: { opacity: 0.75 }
			});
			allMarkersOnMap.push(marker);
			let iconEscudo = new MarkerWithLabel({
				icon: new google.maps.MarkerImage(pathImgs + iconosURL.icono_escudo + '.png', null, null, new google.maps.Point(5, 35)),
				position: latLng,
				map: mapa,
				draggable: false,
				zIndex: zIndex + 2,
				labelContent: "" + iconosURL.info_label,
				labelAnchor: new google.maps.Point(29, 65),
				labelClass: "labels2",
			});
			allMarkersOnMap.push(iconEscudo);
			let iconContorno = new MarkerWithLabel({
				icon: pathImgs + iconosURL.icono_contorno + '.png',
				position: latLng,
				map: mapa,
				draggable: false,
				zIndex: zIndex,
			});
			allMarkersOnMap.push(iconContorno);
			google.maps.event.addListener(marker, 'click', () => {
				this.verInformacion(i);
			});
			google.maps.event.addListener(iconEscudo, 'click', () => {
				this.verInformacion(i);
			});
			google.maps.event.addListener(iconContorno, 'click', () => {
				this.verInformacion(i);
			});

			bounds.extend(marker.position);
			zIndex = zIndex + 3;
		}
		if (!this.datos.autoUpdate) {
			mapa.fitBounds(bounds);
			google.maps.event.addListenerOnce(mapa, 'idle', () => {
				(this.datos.dominio.length > 1)
					? mapa.setZoom(mapa.getZoom() - 1)
					: mapa.setZoom(mapa.getZoom() - 4)
			});
		}
	}

	async verInformacion(i: number) {
		let vehiculo: EstadoVehiculo = new EstadoVehiculo(
			this.datos.imei[i],
			this.datos.numero[i],
			this.datos.dominio[i],
			this.datos.dominio[i],
			this.datos.marca[i],
			this.datos.color[i],
			await obtenerDireccion(this.datos.latitud[i], this.datos.longitud[i]),
			this.datos.hora_avl[i],
			tiempoDetenido(this.datos.tiempo_parada[i] * 60),
			this.obtenerSensores(this.datos.dominio[i]),
			Math.round(parseFloat(this.datos.km_total_usuario[i]) * 100) / 100,//cuenta Kilometros
			this.datos.voltaje_vehiculo[i],
			signalGPS(this.datos.hdop[i])
		);
		console.log(vehiculo);
		this.events.publish('mapClickEvent', vehiculo);
	}

	async dibujarRecorrido(mapa) {
		let zIndex = 3;
		let cantidadParadas = 0;
		let tiempo_min_detencion = 5;
		let bounds = new google.maps.LatLngBounds();
		for (let i = 0; i < this.datos.latitud.length; i++) {
			let latLng = new google.maps.LatLng(this.datos.latitud[i], this.datos.longitud[i]);
			let state = determinarIconoRecorrido(this.datos, i, tiempo_min_detencion);
			cantidadParadas += state.parada;
			let marker = new google.maps.Marker({
				position: latLng,
				icon: pathImgs + state.icono + '.png',
				map: mapa
			});
			let infowindow = new google.maps.InfoWindow({
				content: state.titulo
			});
			google.maps.event.addListener(marker, 'click', () => {
				if (inforWindowsGlobal)
					inforWindowsGlobal.close();
				inforWindowsGlobal = infowindow;
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
					zIndex: zIndex,
					labelContent: this.datos.tipo_alarma[i].length,
					labelAnchor: new google.maps.Point(-30, 47),
				});
				let infowindow = new google.maps.InfoWindow({
					content: state.titulo
				});
				google.maps.event.addListener(AlertaMarker, 'click', () => {
					if (inforWindowsGlobal)
						inforWindowsGlobal.close();
					inforWindowsGlobal = infowindow;
					infowindow.open(mapa, AlertaMarker);
				});
			}
			bounds.extend(marker.position);
			zIndex++;
		}
		const duracion = tiempoDetenido(this.datos.duracion);
		const total_detenido = parseInt(this.datos.tiempo_detenido.reduce((a, b) => a + b));
		const tiempo_movimiento = ((this.datos.duracion - total_detenido) / 3600);
		const resumen = {
			inicio_analisis: this.datos.inicio_analisis,
			fin_analisis: this.datos.fin_analisis,
			duracion,
			cantidadParadas,
			tiempo_min_detencion,
			kilometraje: Math.round(this.datos.kilometraje * 100) / 100,
			velocidad_maxima: Math.max(...this.datos.velocidad),
			get velocidad_promedio() { return Math.round((this.kilometraje / tiempo_movimiento) * 100) / 100 }
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

	obtenerSensores(dominio) {
		let indices = this.datosSinFiltar.dominio.reduce((a, e, i) => {
			if (e === dominio)
				a.push(i);
			return a;
		}, []);
		return indices.map(i => {
			return { nombre: this.datosSinFiltar.nombre_sensor[i], valor: this.datosSinFiltar.estado_sensor[i] }
		});
	}
}

