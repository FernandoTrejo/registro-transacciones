import { Cuenta } from './Cuenta.js';

class LibroMayor{
  constructor(movimientosCuentas){ //object cuentas {codigo: [movimientos]}
    this.cuentas = [];
    this.calcular(movimientosCuentas);
  }
  
  calcular(movimientosCuentas){
    for(let codigo in movimientosCuentas){
      let cuenta = new Cuenta(codigo, 'pendiente', movimientosCuentas[codigo]);
      cuenta.calculate();
      this.cuentas.push(cuenta);
    }
  }
  
  getCuentas(){
    return this.cuentas;
  }
  
}

export {LibroMayor};