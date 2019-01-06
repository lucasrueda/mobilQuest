export class Vehiculo {
    nuneroDeLinea:string;
    denominacion:string;
    patente:string;
    marca:string;
    color:string;

    constructor(nuneroDeLinea, denominacion, patente, marca, color){
        this.nuneroDeLinea = nuneroDeLinea;
        this.denominacion = denominacion;
        this.patente = patente;
        this.marca = marca;
        this.color = color;
    }
}