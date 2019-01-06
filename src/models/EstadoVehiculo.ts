import { Vehiculo } from './Vehiculo'

export class EstadoVehiculo extends Vehiculo{
    direccion:string;
    actualizado:string;
    tiempoParada:string;
    estadoMotor:string;
    cuentaKilometros:string;
    bateriaExterna:string;
    signalGPS:string;

    constructor(nuneroDeLinea, denominacion, patente, marca, color, direccion,actualizado,tiempoparada,estadoMotor,cuantaKilometros,bateriaExterna,signalGPS){
        super(nuneroDeLinea, denominacion, patente, marca, color);
        this.direccion = direccion;
        this.actualizado = actualizado;
        this.tiempoParada = tiempoparada;
        this.estadoMotor = estadoMotor;
        this.cuentaKilometros = cuantaKilometros;
        this.bateriaExterna = bateriaExterna;
        this.signalGPS = signalGPS;
    }
}