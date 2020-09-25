class Movimiento{
  constructor(codigo, nombreCuenta, debe, haber, tipo){
    this.fecha = "";
    this.concepto = "";
    this.nombreCuenta = nombreCuenta;
    this.codigo = codigo;
    this.debe = debe;
    this.haber = haber;
    this.tipo = tipo;
  }
  
  setFecha(fecha){
    this.fecha = fecha;
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