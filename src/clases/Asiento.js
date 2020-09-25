import {Money} from './Money.js';

class Asiento{
  constructor(fecha, concepto, comentarios = "", tipo = 1){ //tipo 1. simple, 2.compuesto
    this.fecha = fecha;
    this.concepto = concepto;
    this.comentarios = comentarios;
    this.tipo = tipo;
    this.movimientos = [];
    this.debe = new Money(0);
    this.haber = new Money(0);
  }
  getComentarios(){
    return this.comentarios;
  }
  
  setComentarios(comentarios){
    this.comentarios = comentarios;
  }
  
  getTipo(){
    return this.tipo;
  }
  
  getFecha(){
    return this.fecha.toString();
  }
  
  setFecha(fecha){
    this.fecha = fecha;
  }
  
  getConcepto(){
    return this.concepto;
  }
  
  setConcepto(concepto){
    this.concepto = concepto;
  }
  
  getMovimientos(){
    return this.movimientos;
  }
  
  getDebe(){
    return this.debe;
  }
  
  getHaber(){
    return this.haber;
  }
  
  addMovimiento(movimiento){
    movimiento.setFecha(this.fecha);
    movimiento.setConcepto(this.concepto);
    this.movimientos.push(movimiento);
  }
  
  removeMovimiento(indice){
    //eliminar
    this.movimientos.splice(indice, 1);
  }
  
  vaciarMovimientos(){
    this.movimientos = [];
  }
  
  tieneMovimientos(){
    return this.movimientos.length > 0;
  }
  
  ordenar(){
    this.movimientos.sort(((a,b)=> a.tipo - b.tipo));
  }
  
  calcular(){
    if(this.movimientos.length > 0){
      let coleccionDebe = [];
      let coleccionHaber = [];
      for(let movimiento of this.movimientos){
        coleccionDebe.push(movimiento.getDebe()); //tipo money
        coleccionHaber.push(movimiento.getHaber());
      }
      
      this.debe = Money.calculateMoneySum(coleccionDebe);
      this.haber = Money.calculateMoneySum(coleccionHaber);
    }
  }
  
  estaBalanceado(){
    return this.debe.amount === this.haber.amount;
  }
}

export { Asiento };