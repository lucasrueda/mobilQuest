import { Vehiculo } from './Vehiculo'

export class EstadoVehiculo extends Vehiculo {
    direccion: string;
    actualizado: string;
    tiempoParada: string;
    sensores: Array<{ nombre: string, valor: string }>;
    cuentaKilometros: string;
    bateriaExterna: string;
    signalGPS: string;
    horometro: string;

    constructor(imei, numeroDeLinea, denominacion, patente, marca, modelo, color, direccion, actualizado, tiempoParada, sensores, cuentaKilometros, bateriaExterna, signalGPS, horometro) {
        super(imei, numeroDeLinea, denominacion, patente, marca, modelo, color);
        this.direccion = direccion;
        this.actualizado = actualizado;
        this.tiempoParada = tiempoParada;
        this.sensores = sensores;
        this.cuentaKilometros = cuentaKilometros;
        this.bateriaExterna = bateriaExterna;
        this.signalGPS = signalGPS;
        this.horometro = horometro;
    }
}