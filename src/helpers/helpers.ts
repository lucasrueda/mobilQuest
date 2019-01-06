import { Geocoder, GeocoderResult, LatLng } from '@ionic-native/google-maps';

const signalGPS = hdop => {
  if ((hdop > 0.1) && (hdop < 1.7)) {
    return "Muy buena";
  } else {
    if ((hdop > 1.6) && (hdop < 2.5)) {
      return "Buena";
    } else {
      if ((hdop > 2.4) && (hdop < 5.0)) {
        return "Mala";
      } else {
        return "Nula";
      }
    }
    // if (data.tiempo_sin_sat[i] > 5) {
    //     vector_sin_gps[id_marcador] = id_marcador;
    //     cod_html_sensores = "Última ubicación con señal de GPS: " + data.hora_satelite[i] + "<br>" + cod_html_sensores;
    // }
  }
}

const obtenerDireccion = (lat, long) => {
  Geocoder.geocode({
    "position": new LatLng(lat, long)
  }).then((results: GeocoderResult[]) => {
    if (results.length == 0) {
      return null;
    }
    return results[0].extra.lines[0];
  });
}

export { signalGPS, obtenerDireccion };