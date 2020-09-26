import {Money} from './Money.js';

class LibroDiario{
  constructor(asientos = []){
    this.asientos = asientos;
    this.debe = new Money(0);
    this.haber = new Money(0);
    this.calcular();
  }
  
  getAsientos(){
    this.ordenarPorFecha();
    return this.asientos;
  }
  
  getDebe(){
    return this.debe;
  }
  
  getHaber(){
    return this.haber;
  }
  
  addAsiento(asiento){
    this.asientos.push(asiento);
  }
  
  removeAsiento(indice){
    this.asientos.splice(indice,1);
  }
  
  ordenarPorFecha(){
    this.asientos.sort(((a,b)=> a.fecha - b.fecha));
  }
  
  buscarAsiento(id){
    return this.asientos[id];
  }
  
  calcular(){
    if(this.asientos.length > 0){
      let coleccionDebe = [];
      let coleccionHaber = [];
      for(let asiento of this.asientos){
        asiento.calcular();
        coleccionDebe.push(asiento.getDebe()); //tipo money
        coleccionHaber.push(asiento.getHaber());
      }
      this.debe = Money.calculateMoneySum(coleccionDebe);
      this.haber = Money.calculateMoneySum(coleccionHaber);
    }
  }
  
  estaBalanceado(){
    return this.debe.amount === this.haber.amount;
  }
  
  mayorizar(){
    //unir todos los movimientos de asientos en un solo Array
    if(this.asientos.length > 0){
      let movimientos = [];
      for(let asiento of this.asientos){
        movimientos = movimientos.concat(asiento.getMovimientos());
      }
      
      let movimientosCuentas = {};
      for(let movimiento of movimientos){
        let codigo = movimiento.getCodigo();
        if(!movimientosCuentas.hasOwnProperty(codigo)){
          movimientosCuentas[codigo] = [];
        }
        movimientosCuentas[codigo].push(movimiento);
      }
    
      return {
        'correcto': true,
        'data': movimientosCuentas
      };
    }
    return {
      'correcto': false,
      'data': null
    };
  }
}

export { LibroDiario };