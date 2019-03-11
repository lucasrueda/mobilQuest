export class Vehiculo {
    imei: string;
    numeroDeLinea: string;
    denominacion: string;
    patente: string;
    marca: string;
    modelo: string;
    color: string;

    constructor(imei, numeroDeLinea, denominacion, patente, marca, modelo, color) {
        this.imei = imei;
        this.numeroDeLinea = numeroDeLinea;
        this.denominacion = denominacion;
        this.patente = patente;
        this.marca = marca;
        this.modelo = modelo;
        this.color = color;
    }
}