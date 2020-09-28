import {Money} from './Money.js';

class Cuenta{
  constructor(codigo, titular, movimientos = []){
    this.codigo = codigo;
    this.titular = titular;
    this.movimientos = movimientos;
    this.haber = new Money(0);
    this.debe = new Money(0);
  }
  
  getCodigo(){
    return this.codigo;
  }
  
  getTitular(){
    return this.titular;
  }
  
  getMovimientos(){
    return this.movimientos;
  }
  
  cargar(){}
  abonar(){}
  
  getSaldo(){
    return Money.calculateMoneySus(this.debe - this.haber);
  }
  
  calculate(){
    if(this.tieneMovimientos()){
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
  
  getDebe(){
    return this.debe;
  }
  
  getHaber(){
    return this.haber;
  }
  
  estaBalanceada(){
    return this.debe.amount === this.haber.amount;
  }
  
  tieneMovimientos(){
    return this.movimientos.length > 0;
  }
}

export { Cuenta };