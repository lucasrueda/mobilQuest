import { Vehiculo } from './Vehiculo'

export class EstadoVehiculo extends Vehiculo {
    direccion: string;
    actualizado: string;
    tiempoParada: string;
    estadoMotor: string;
    cuentaKilometros: number;
    estado_bateria: string;
    signalGPS: string;
}