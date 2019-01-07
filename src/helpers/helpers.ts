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
  return Geocoder.geocode({
    "position": new LatLng(lat, long)
  }).then((results: GeocoderResult[]) => {
    if (results.length == 0) {
      return Promise.resolve(null);
    }
    return Promise.resolve(results[0].extra.lines[0]);
  }).catch( e => console.log(e));
}

const tiempoDetenido = (segundos: number) => {
  let minutos = segundos / 60;
  let horas = minutos / 60;
  horas = parseInt(horas.toString());
  let msj_minutos;
  if (minutos > 59) {
    minutos = minutos - (horas * 60);
  }
  if (minutos == 1) {
    msj_minutos = " minuto.";
  } else {
    msj_minutos = " minutos.";
  }
  if (horas == 0) {
    return minutos + msj_minutos;
  } else {
    if (horas == 1) {
      return horas + " hora y " + minutos + msj_minutos;
    } else {
      return horas + " horas y " + minutos + msj_minutos;
    }
  }
}

const estadoMotor = estado => {
  return (parseInt(estado)) ? 'Encendido' : 'Apagado';
}

export { signalGPS, obtenerDireccion, tiempoDetenido, estadoMotor };