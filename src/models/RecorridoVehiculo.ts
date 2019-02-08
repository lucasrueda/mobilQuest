import { Vehiculo } from './Vehiculo'

export class RecorridoVehiculo extends Vehiculo {
    latitud: number;
    longitud: number;
    velocidad: number;
    direcc: number;
    hdop: string;
    hora_avl: string;
    voltaje_avl: number;
    tiempo_sin_sat: number;
    tiempo_parada: number;
    tiempo_sin_reporte: number;
    nombre_sensor


    estado_sensor
    cod_sensor
    estado_sensor_en_bit
    estado_panico
    cliente
    relay: number
    estado_bateria: string
    numero: string;
    hora_update: string;
    cuenta_km: number;
    km_total_usuario: number;
    km_sensor_total_usuario: number;
    id_grupo: number;
    min_buffer: number;
    voltaje_vehiculo: number
}