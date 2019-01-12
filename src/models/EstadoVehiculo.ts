import { Vehiculo } from './Vehiculo'

export class EstadoVehiculo extends Vehiculo{
    direccion:string;
    actualizado:string;
    tiempoParada:string;
    estadoMotor:string;
    cuentaKilometros:string;
    bateriaExterna:string;
    signalGPS:string;

    constructor(imei, numeroDeLinea, denominacion, patente, marca, color, direccion,actualizado,tiempoParada,estadoMotor,cuentaKilometros,bateriaExterna,signalGPS){
        super(imei, numeroDeLinea, denominacion, patente, marca, color);
        this.direccion = direccion;
        this.actualizado = actualizado;
        this.tiempoParada = tiempoParada;
        this.estadoMotor = estadoMotor;
        this.cuentaKilometros = cuentaKilometros;
        this.bateriaExterna = bateriaExterna;
        this.signalGPS = signalGPS;
    }
}