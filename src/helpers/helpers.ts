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
  }).catch(e => console.log(e));
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

const sumaMinutosHorario = (tiempo, hora) => { //FUNCION PARA SUMAR UNA CANTIDAD DE MINUTOS A UN HORARIO -- hora ES LA HORA DE LA PARADA EXPRESADA EN MINUTOS	  
  /*CANTIDAD DE MINUTOS DEL TIEMPO DE PARADA*/
  let m = parseInt(tiempo) / 60;
  let parte_hora;
  let suma_total;
  hora = hora.split(":");
  let pm = 0; // variable para saber si pongo 07 en caso de que sea a la mañana o 19 en caso de que sea a la tarde
  if (hora[0] > 12) {
    hora[0] = hora[0] - 12;
    pm = 1;
  }
  let h_p_m = parseInt(hora[0]) * 60 + parseInt(hora[1]);
  let suma = m + h_p_m; //LA SUMA DE EL TIEMPO DE PARADA MAS EL HORARIO, EXPRESADO EN MINUTOS
  if (suma >= 60) {
    if (pm == 1) {
      parte_hora = suma / 60 + 12;
    } else {
      parte_hora = suma / 60;
    }
    if (parte_hora > 24) {
      parte_hora = parte_hora - 24;
    } else {
      if (parte_hora == 24) {
        parte_hora = "00";
      }
    }
    let parte_minuto = suma % 60;
    if (parseInt(parte_hora) < 10 && parte_hora != "00") {
      parte_hora = "0" + parte_hora + ":";
    }
    else {
      parte_hora = parte_hora + ":";
    }
    if (parte_minuto < 10) {
      parte_minuto = 0 + parte_minuto;
    }
    suma_total = parte_hora + parte_minuto;
  }
  else {
    suma_total = "00:" + suma;
  }
  return suma_total;	//alert("HORA="+hora+" H="+hora_inicio+" M="+minutos_inicio+ "\n" + "Le tengo que sumar "+tiempo+" segundos, que son "+m);
}

const analizarRecorrido = (data) => {
  let puntos_para_recorrido = [];
  let matriz_alertas = [];
  let contador_paradas = 0;
  let total_detenido = 0;
  let kilometraje = 0;
  let kilometraje_sensor = 0;
  let velocidad_maxima = 0;
  let velocidad_promedio = 0;
  let icono_png;
  let icono_png_pelota = "";
  let cod_html = "";
  let state = {
    latitud: '',
    longitud: '',
    icono: '',
    titulo: '',
  }
  let tiempo_min_detencion = 5;

  for (let i = 0; i < data.latitud.length; i++) {
    state.latitud = data.latitud[i];
    state.longitud = data.longitud[i]
    switch (i) {
      case (0):
        if (tiempo_min_detencion <= data.tiempo_detenido[i] / 60) {
          if (data.latitud.length == 1) {
            state.icono = "parada";
            state.titulo = "Desde las " + data.hora_avl[i] + " el vehículo estuvo detenido " + tiempoDetenido(data.tiempo_detenido[i]) + "<br>Sin recorrido.";
          } else {
            state.icono = "inicio_parada";//icono inicio con manito		
            state.titulo = "Desde las " + data.hora_avl[i] + " el vehículo estuvo detenido durante " + tiempoDetenido(data.tiempo_detenido[i]) + "<br>Inicio el recorrido a las " + sumaMinutosHorario(data.tiempo_detenido[i], data.hora_avl[i]) + ".";
          }
          contador_paradas = contador_paradas + 1;
        } else {
          state.icono = "inicio";//solamente icono inicio
          state.titulo = "Inicio del recorrido.<br>Velocidad: " + data.velocidad[i] + "<br>Hora: " + data.hora_avl[i];
        }
        total_detenido = total_detenido + parseInt(data.tiempo_detenido[i]);
        if (data.velocidad[i] > velocidad_maxima) {
          velocidad_maxima = data.velocidad[i];
        }
        if (data.latitud.length - 1 != 0) {
          break;
        }
      case (data.latitud.length - 1):
        if (data.latitud.length - 1 != 0) {
          if (tiempo_min_detencion <= data.tiempo_detenido[i] / 60) {
            icono_png = "fin_parada";//icono Final con manito
            contador_paradas = contador_paradas + 1;
            cod_html = "A las " + data.hora_avl[i] + " el vehículo se detuvo durante " + tiempoDetenido(data.tiempo_detenido[i]) + "<br>Fin del recorrido.";
          } else {
            icono_png = "fin";//solamente icono Final
            cod_html = "Fin del recorrido.<br>Velocidad: " + data.velocidad[i] + "<br>Hora: " + data.hora_avl[i];
          }
        }
        duracion = tiempoDetenido(data.duracion);
        total_detenido = total_detenido + parseInt(data.tiempo_detenido[i]);
        kilometraje = Math.round(data.kilometraje * 100) / 100;
        kilometraje_sensor = Math.round(data.kilometraje_sensor * 100) / 100;
        tiempo_movimiento = ((data.duracion - total_detenido) / 3600);
        velocidad_promedio = Math.round((kilometraje / tiempo_movimiento) * 100) / 100;
        if (data.velocidad[i] > velocidad_maxima) {
          velocidad_maxima = data.velocidad[i];
        }
        $("#resumen_del_recorrido").append('<br>- Duración del recorrido: ' + duracion + '<br>- Cantidad de paradas de más de ' + $("#tiempo_min_detencion").val() + ' min: ' + contador_paradas + '<br>- Total detenido: ' + tiempo_detenido(total_detenido) + '<br>- Kilometraje: ' + kilometraje + ' km.<br>');
        if (vector_cuenta_km[$("#dominios").val()]) {
          $("#resumen_del_recorrido").append('- Cuenta km de ' + vector_cuenta_km[$("#dominios").val()] + ': ' + kilometraje_sensor + ' km.<br>');
        }
        $("#resumen_del_recorrido").append('- Velocidad máxima: ' + velocidad_maxima + ' Km/h.<br>- Velocidad promedio: ' + velocidad_promedio + ' Km/h.');
        break;
      default:
        if ($('#tiempo_min_detencion').val() <= data.tiempo_detenido[i] / 60) {
          contador_paradas = contador_paradas + 1;
          icono_png = "parada";//icono manito	
          cod_html = "A las " + data.hora_avl[i] + " el vehículo se detuvo durante " + tiempo_detenido(data.tiempo_detenido[i]) + " Inició nuevamente el recorrido a las " + suma_minutos_horario(data.tiempo_detenido[i], data.hora_avl[i]) + ".";
        } else {
          if (data.cod_trama[i] == 32 || data.cod_trama[i] == 77) {//agregado para distinguir cuando es puntito de giro, el codigo 77 es para T_zone
            icono_png = "puntitogiro";
          }
          else {
            icono_png = "puntito";//solamente puntito
          }
          cod_html = "Velocidad: " + data.velocidad[i] + " Km/h. <br>Hora: " + data.hora_avl[i];
        }
        total_detenido = total_detenido + parseInt(data.tiempo_detenido[i]);
        if (data.velocidad[i] > velocidad_maxima) {
          velocidad_maxima = data.velocidad[i];
        }
        break;
    }
    var codigo_unificado = 0; // Voy a unificar el codigo, siempre me voy a quedar con el menor del grupo
    if (data.tipo_alarma[i] != '') {
      icono_png_pelota = "alertas";
      for (j = 0; j < data.tipo_alarma[i].length && data.nombre_alerta[i] != ''; j++) {
        if (data.tipo_alarma[i][j] == 101 || data.tipo_alarma[i][j] == 104 || data.tipo_alarma[i][j] == 106 || data.tipo_alarma[i][j] == 108 || data.tipo_alarma[i][j] == 112 || data.tipo_alarma[i][j] == 115) {
          codigo_unificado = data.tipo_alarma[i][j] - 1;
          data.estado_sensor[i][j] = 1; //emulo que esta en 1
        }
        else {
          codigo_unificado = data.tipo_alarma[i][j];
        }
        if (!matriz_alertas[codigo_unificado]) {//Si no existe el elemento con ese num de codigo...
          matriz_alertas[codigo_unificado] = new Array(data.nombre_alerta[i][j], new Array(), '', new Array(), '', new Array());
          //Una fila X de la matriz tiene las sig columnas: (la X siempre va a ser un codigo de alarma)
          //col 0:nombre de alerta, col 1:array de indice de posiciones donde aparece. col 2:nombre para el estado_sensor = 1. 
          //col 3: idem col 1 pero para col 2. Col 4 y 5 son idem con la 2 y 3 pero para el estado_sensor = 0
        }
        if (!cod_html_alertas[i]) {
          cod_html_alertas[i] = "";
        } else {
          cod_html_alertas[i] = cod_html_alertas[i] + "<br>";
        }
        if (data.caso_alerta[i][j]) {
          if (data.estado_sensor[i][j] == 1) {//Aqui Si o Si el estado es 0 o 1
            if (matriz_alertas[codigo_unificado][2] == '') {
              matriz_alertas[codigo_unificado][2] = data.caso_alerta[i][j];
            }
            matriz_alertas[codigo_unificado][3].push(i);
          } else {
            if (matriz_alertas[codigo_unificado][4] == '') {
              matriz_alertas[codigo_unificado][4] = data.caso_alerta[i][j];
            }
            matriz_alertas[codigo_unificado][5].push(i);
          }
          cod_html_alertas[i] = cod_html_alertas[i] + data.nombre_alerta[i][j] + ": " + data.caso_alerta[i][j] + ". Hora: " + data.hora_alerta[i][j];
          matriz_alertas[codigo_unificado][1].push(i);
        } else {
          if (codigo_unificado == 103) {
            cod_html_alertas[i] = cod_html_alertas[i] + data.nombre_alerta[i][j] + ": " + data.velocidad[i] + " Km/h. Hora: " + data.hora_alerta[i][j];
          } else {
            cod_html_alertas[i] = cod_html_alertas[i] + data.nombre_alerta[i][j] + ". Hora: " + data.hora_alerta[i][j];
          }
          switch (data.tipo_alarma[i][j]) {
            case 100:// como si fuese el estado de sensor =0
              matriz_alertas[codigo_unificado][0] = "Estado de batería interna";
              matriz_alertas[codigo_unificado][4] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][5].push(i);
              break;
            case 101:// como si fuese el estado de sensor =1
              matriz_alertas[codigo_unificado][0] = "Estado de batería interna";
              matriz_alertas[codigo_unificado][2] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][3].push(i);
              data.tipo_alarma[i][j] = codigo_unificado;
              break;
            case 103:
              matriz_alertas[codigo_unificado][0] = "Velocidad";
              matriz_alertas[codigo_unificado][4] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][5].push(i);
              break;
            case 104:
              matriz_alertas[codigo_unificado][0] = "Velocidad";
              matriz_alertas[codigo_unificado][2] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][3].push(i);
              data.tipo_alarma[i][j] = codigo_unificado;
              break;
            case 105:
              matriz_alertas[codigo_unificado][0] = "Aceleración";
              matriz_alertas[codigo_unificado][4] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][5].push(i);
              break;
            case 106:
              matriz_alertas[codigo_unificado][0] = "Aceleración";
              matriz_alertas[codigo_unificado][2] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][3].push(i);
              data.tipo_alarma[i][j] = codigo_unificado;
              break;
            case 107:
              matriz_alertas[codigo_unificado][0] = "Reporte";
              matriz_alertas[codigo_unificado][4] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][5].push(i);
              break;
            case 108:
              matriz_alertas[codigo_unificado][0] = "Reporte";
              matriz_alertas[codigo_unificado][2] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][3].push(i);
              data.tipo_alarma[i][j] = codigo_unificado;
              break;
            case 111:
              matriz_alertas[codigo_unificado][0] = "Estado de batería externa";
              matriz_alertas[codigo_unificado][4] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][5].push(i);
              break;
            case 112:
              matriz_alertas[codigo_unificado][0] = "Estado de batería externa";
              matriz_alertas[codigo_unificado][2] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][3].push(i);
              data.tipo_alarma[i][j] = codigo_unificado;
              break;
            case 114:
              matriz_alertas[codigo_unificado][0] = "Ahorro de datos";
              matriz_alertas[codigo_unificado][4] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][5].push(i);
              break;
            case 115:
              matriz_alertas[codigo_unificado][0] = "Ahorro de datos";
              matriz_alertas[codigo_unificado][2] = data.nombre_alerta[i][j];
              matriz_alertas[codigo_unificado][3].push(i);
              data.tipo_alarma[i][j] = codigo_unificado;
              break;
            default:
              caso = "";
              break;
          }
          matriz_alertas[codigo_unificado][1].push(i);
        }
        cod_html_alertas_backup = cod_html_alertas.slice(0);
      }
    }
    if (icono_png_pelota != "alertas" || icono_png != "puntito" || icono_png != "puntitogiro") {
      agrego_marcador_recorrido(latlng, icono_png, i, cod_html, icono_png, 8);
    }
    if (icono_png_pelota == "alertas") {
      agrego_marcador_recorrido(latlng, icono_png_pelota, i, cod_html_alertas[i], icono_png_pelota, data.tipo_alarma[i].length);
    }
    puntos_para_recorrido.push(latlng);
    //gestion de sentido del recorrido
    if (i > 0) {
      var p0 = new google.maps.LatLng(data.latitud[i - 1], data.longitud[i - 1]);
      var p1 = new google.maps.LatLng(data.latitud[i], data.longitud[i]);
      var vector = new google.maps.LatLng(p1.lat() - p0.lat(), p1.lng() - p0.lng());
      var length = Math.sqrt(vector.lat() * vector.lat() + vector.lng() * vector.lng());
      var normal = new google.maps.LatLng(vector.lat() / length, vector.lng() / length);
      var middle = new google.maps.LatLng((p1.lat() + p0.lat()) / 2, (p1.lng() + p0.lng()) / 2);
      var constante = 0.00055;
      if (length < 0.0019) {
        constante = 0.00015;
      }
      var offsetMiddle = new google.maps.LatLng(normal.lat() * constante, normal.lng() * constante),
        arrowPart1 = new google.maps.LatLng(-offsetMiddle.lng() * 0.4, offsetMiddle.lat() * 0.4),
        arrowPart2 = new google.maps.LatLng(offsetMiddle.lng() * 0.4, -offsetMiddle.lat() * 0.4),
        arrowPoint1 = new google.maps.LatLng(middle.lat() - offsetMiddle.lat() + arrowPart1.lat(), middle.lng() - offsetMiddle.lng() + arrowPart1.lng()),
        arrowPoint2 = new google.maps.LatLng(middle.lat() - offsetMiddle.lat() + arrowPart2.lat(), middle.lng() - offsetMiddle.lng() + arrowPart2.lng());
      flechitas_coordenadas = ([arrowPoint1, middle, arrowPoint2]);
      if (length > 0.0009) {
        agrego_poligono(flechitas_coordenadas);
        //flecha[flecha.length-1].setMap(map);	
      }
    }
    icono_png_pelota = "";
  }
  establecer_zoom();
  polilinea_recorrido.setPath(puntos_para_recorrido);
  polilinea_recorrido.setMap(map);
}

export { signalGPS, obtenerDireccion, tiempoDetenido, estadoMotor, analizarRecorrido };