export class Vehiculo {
    numeroDeLinea:string;
    denominacion:string;
    patente:string;
    marca:string;
    color:string;

    constructor(numeroDeLinea, denominacion, patente, marca, color){
        this.numeroDeLinea = numeroDeLinea;
        this.denominacion = denominacion;
        this.patente = patente;
        this.marca = marca;
        this.color = color;
    }
}