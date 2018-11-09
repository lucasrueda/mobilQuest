import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import {
    GoogleMap,
    GoogleMapsEvent,
    LatLng,
    Marker,
    GoogleMaps,
    CameraPosition
} from '@ionic-native/google-maps';


@Component({
    selector: 'page-mapasnativo',
    templateUrl: 'mapasnativo.html'
})
export class MapasnativoPage {
    @Input() latitud;
    @Input() longitud;
    @Input() data;

    map: GoogleMap;

    constructor(public navCtrl: NavController,
                public events: Events,
                public platform: Platform) {}

    ngOnChanges() {
        this.platform.ready().then(() => {
            this.loadMap();
        })
    }

    loadMap() {

        let location = new LatLng(this.latitud, this.longitud);
        console.log('latitud', location.lat);
        console.log('longitud', location.lng);
        this.map = GoogleMaps.create('map')

        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!');
            //this.moveCamara(location);
            let marker: Marker = this.map.addMarkerSync({
              title: 'Ionic',
              icon: 'blue',
              animation: 'DROP',
              position: {
                lat: 43.0741904,
                lng: -89.3809802
              }
            });
            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
              alert('clicked');
            });

        });

        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe( () => {
            this.events.publish('user:click');
        })
    }

    moveCamara(location) {
        let options: CameraPosition<object> = {
            target: location,
            //tilt: 0,
            zoom: 15,
            //bearing: 50
        }
        this.map.animateCamera({
            target: location,
            zoom: 15,
            duration: 2500
        });
    }
}



