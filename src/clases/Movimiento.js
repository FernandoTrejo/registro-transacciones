import {Money} from './Money.js';

class Movimiento{
  constructor(codigo, nombreCuenta, debe, haber, tipo){
    this.fecha = "";
    this.fechaString = "";
    this.concepto = "";
    this.nombreCuenta = nombreCuenta;
    this.codigo = codigo;
    this.debe = new Money(debe);
    this.haber = new Money(haber);
    this.tipo = tipo;
  }
  
  getFechaString(){
    return this.fechaString;
  }
  setFecha(fecha){
    this.fechaString = fecha;
    this.fecha = new Date(fecha);
  }
  
  getFecha(){
    return this.fecha;
  }
  
  getCodigo(){
    return this.codigo;
  }
  
  getNombreCuenta(){
    return this.nombreCuenta;
  }
  
  getConcepto(){
    return this.concepto;
  }
  
  setConcepto(concepto){
    this.concepto = concepto;
  }
  
  getDebe(){
    return this.debe;
  }
  
  getHaber(){
    return this.haber;
  }
  
  getTipo(){
    return this.tipo;
  }
  
  getSaldo(){
    return Money.calculateMoneySus(this.debe - this.haber);
  }
}

export { Movimiento };