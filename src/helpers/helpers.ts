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
    return parseInt(minutos.toString()) + msj_minutos;
  } else {
    if (horas == 1) {
      return parseInt(horas.toString()) + " hora y " + parseInt(minutos.toString()) + msj_minutos;
    } else {
      return parseInt(horas.toString()) + " horas y " + parseInt(minutos.toString()) + msj_minutos;
    }
  }
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
      parte_hora = parseInt(parte_hora) + ":";
    }
    if (parte_minuto < 10) {
      parte_minuto = 0 + parte_minuto;
    }
    suma_total = parte_hora + parseInt(parte_minuto.toString());
  }
  else {
    suma_total = "00:" + suma;
  }
  return suma_total;	//alert("HORA="+hora+" H="+hora_inicio+" M="+minutos_inicio+ "\n" + "Le tengo que sumar "+tiempo+" segundos, que son "+m);
}

const determinarIconoRecorrido = (data, i, tiempo_min_detencion) => {
  let ultimoElemento = data.latitud.length - 1;
  let primerElemento = 0;
  let state = {
    icono: '',
    titulo: '',
    parada: 0
  }
  switch (i) {
    case (primerElemento):
      if (tiempo_min_detencion <= data.tiempo_detenido[i] / 60) {
        if (data.latitud.length == 1) {
          state.icono = "parada";
          state.titulo = "Desde las " + data.hora_avl[i] + " el vehículo estuvo detenido " + tiempoDetenido(data.tiempo_detenido[i]) + "<br>Sin recorrido.";
        } else {
          state.icono = "inicio_parada";//icono inicio con manito		
          state.titulo = "Desde las " + data.hora_avl[i] + " el vehículo estuvo detenido durante " + tiempoDetenido(data.tiempo_detenido[i]) + "<br>Inicio el recorrido a las " + sumaMinutosHorario(data.tiempo_detenido[i], data.hora_avl[i]) + ".";
        }
        state.parada++;
      } else {
        state.icono = "inicio";//solamente icono inicio
        state.titulo = "Inicio del recorrido.<br>Velocidad: " + data.velocidad[i] + "<br>Hora: " + data.hora_avl[i];
      }
      break;
      case (ultimoElemento):
      if (data.latitud.length - 1 != 0) {
        if (tiempo_min_detencion <= data.tiempo_detenido[i] / 60) {
          state.icono = "fin_parada";//icono Final con manito
          state.titulo = "A las " + data.hora_avl[i] + " el vehículo se detuvo durante " + tiempoDetenido(data.tiempo_detenido[i]) + "<br>Fin del recorrido.";
          state.parada++;
        } else {
          state.icono = "fin";//solamente icono Final
          state.titulo = "Fin del recorrido.<br>Velocidad: " + data.velocidad[i] + "<br>Hora: " + data.hora_avl[i];
        }
      }
      break;
      default:
      if (tiempo_min_detencion <= data.tiempo_detenido[i] / 60) {
        state.icono = "parada";//icono manito	
        state.titulo = "A las " + data.hora_avl[i] + " el vehículo se detuvo durante " + tiempoDetenido(data.tiempo_detenido[i]) + " Inició nuevamente el recorrido a las " + sumaMinutosHorario(data.tiempo_detenido[i], data.hora_avl[i]) + ".";
        state.parada++;
      } else {
        if (data.cod_trama[i] == 32 || data.cod_trama[i] == 77) {//agregado para distinguir cuando es puntito de giro, el codigo 77 es para T_zone
          state.icono = "puntitogiro";
        }
        else {
          state.icono = "puntito";//solamente puntito
        }
        state.titulo = "Velocidad: " + data.velocidad[i] + " Km/h. <br>Hora: " + data.hora_avl[i];
      }
      break;
  }
  return state;
}

const determinarAlertas = (data, i) => {
  let matriz_alertas = [];
  let cod_html_alertas = [];
  let state = {
    icono: '',
    titulo: ''
  }
  let codigo_unificado = 0; // Voy a unificar el codigo, siempre me voy a quedar con el menor del grupo
  state.icono = "alertas";
  for (let j = 0; j < data.tipo_alarma[i].length && data.nombre_alerta[i] != ''; j++) {
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
          break;
      }
      matriz_alertas[codigo_unificado][1].push(i);
    }
  }
  state.titulo = cod_html_alertas[i];
  return state;
}

const determinarIconoDeFlota = (estado_motor, velocidad, direccion, tiempo_parada, tiempo_sin_sat, tiempo_sin_reporte, buffer, hora_avl_tmp) => {
  let icono = "";
  let icono_escudo = "";
  let icono_contorno = "transparente";
  let label = 0;
  let tiempo_min_detencion = 5;
  let info_label;
  let explica_buffer
  if ((buffer > 12)) {
    label = 1;
    info_label = "";
    icono = "buffer";
    icono_escudo = "transparente";
    explica_buffer = "<span id='contenedor_explica_buffer' style='background-color: #FFC'>El rastreador se encuentra descargando datos de memoria.<br> Mientras el dispositivo realiza la descarga, puede generar un recorrido hasta el " + hora_avl_tmp + ". Una vez finalizado este proceso, podrá generar el recorrido con normalidad.<br></span>";
  } else {
    if (estado_motor == 1) {
      if (tiempo_parada >= tiempo_min_detencion) {
        icono = "encendido_parada";
        icono_escudo = "transparente";
      } else {
        if (velocidad > 0) {
          icono = "encendido_movimiento";
          icono_escudo = "flechita";
        } else {
          icono = "encendido_movimiento";
          icono_escudo = "esfera";
        }
      }
    } else {
      if (tiempo_parada >= tiempo_min_detencion) {
        icono = "apagado_parada";
        icono_escudo = "transparente";
      } else {
        if (velocidad > 5) {
          icono = "apagado_movimiento";
          icono_escudo = "flechita";
        } else {
          icono = "apagado_movimiento";
          icono_escudo = "esfera";
        }
      }
    }
  }
  if (icono_escudo == "flechita") {
    if ((direccion >= 0 && direccion < 22.5) || (direccion < 360 && direccion >= 337.5)) {
      icono_escudo = "flecha_norte";
    }
    if (direccion >= 22.5 && direccion < 67.5) {
      icono_escudo = "flecha_noreste";
    }
    if (direccion >= 67.5 && direccion < 112.5) {
      icono_escudo = "flecha_este";
    }
    if (direccion >= 112.5 && direccion < 157.5) {
      icono_escudo = "flecha_sureste";
    }
    if (direccion >= 157.5 && direccion < 202.5) {
      icono_escudo = "flecha_sur";
    }
    if (direccion >= 202.5 && direccion < 247.5) {
      icono_escudo = "flecha_suroeste";
    }
    if (direccion >= 247.5 && direccion < 292.5) {
      icono_escudo = "flecha_oeste";
    }
    if (direccion >= 292.5 && direccion < 337.5) {
      icono_escudo = "flecha_noroeste";
    }
  }
  if (tiempo_sin_reporte > 20 || tiempo_sin_sat > 5) {
    if (tiempo_sin_reporte > 20) {
      icono_contorno = "contorno_rojo";
      if (label == 1) {
        explica_buffer = "<span id='contenedor_explica_buffer' style='background-color: #FFC'>El rastreador se encontraba descargando datos de memoria cuando dejó de reportarse.<br> Hasta que el dispositivo recupere la señal, podrá generar un recorrido completo hasta el " + hora_avl_tmp + ".<br></span>";
      }
      if (tiempo_sin_sat > 5) {
        icono_contorno = "contorno_rojo_amarillo";
      }
    } else {
      icono_contorno = "contorno_amarillo";
    }
  }
  if (label == 0) {
    if (icono_escudo == "transparente") {
      if (tiempo_parada > 60) {
        info_label = "+60";
      } else {
        info_label = tiempo_parada;
      }
    } else {
      info_label = Math.round(parseFloat(velocidad));
    }
  }
  return {
    icono, icono_escudo, icono_contorno, label, info_label
  }
}

const filtrarDatos = (data, datos) => {
  let auxObject = {};
  data.forEach((patente, i) => {
    let index = datos.dominio.indexOf(patente);
    Object.keys(datos).forEach(key => {
      if (!auxObject[key]) auxObject[key] = [];
      if (datos[key][index] !== undefined)
        auxObject[key][i] = datos[key][index];
    })
  });
  return auxObject;
}

export {
  signalGPS,
  obtenerDireccion,
  tiempoDetenido,
  determinarIconoRecorrido,
  determinarAlertas,
  determinarIconoDeFlota,
  filtrarDatos
};