class Catalogo{
  constructor(activo, pasivo, capital, acreedoras, deudoras, cierre){
    this.activo = activo;
    this.pasivo = pasivo;
    this.capital = capital;
    this.acreedoras = acreedoras;
    this.deudoras = deudoras;
    this.cierre = cierre;
    
    this.cuentas = []; //para busquedas, cuentas que no tienen subcuentas
    this.actualizarCuentas();
  }
  
  actualizarCuentas(){
    this.extraerCuentas(this.activo);
    this.extraerCuentas(this.pasivo);
    this.extraerCuentas(this.capital);
    this.extraerCuentas(this.acreedoras);
    this.extraerCuentas(this.deudoras);
    this.extraerCuentas(this.cierre);
  }
  
  extraerCuentas(cuenta){
    if(cuenta.subcuentas.length == 0){
      this.cuentas.push(`${cuenta.codigo} - ${cuenta.titular}`)
    }else{
      for(let subcuenta of cuenta.subcuentas){
        this.extraerCuentas(subcuenta);
      }
    }
  }
  
  agregarCuenta(cuenta, codigoPadre){
    let response = this.buscarCuenta(codigoPadre, codigoPadre[0]);
    //EXTRAER PRIMER INDICE DE FORMA DISTINTA
    
    if(response.found){
      response.cuenta.subcuentas.push(cuenta);
    }else{
      console.log("La cuenta solicitada no fue encontrada.");
    }
    
  }
  
  buscarCuenta(codigo, tipoCuenta){
    switch (tipoCuenta) {
      case '1':
        return this.search(codigo, this.activo);
        
      case '2':
        return this.search(codigo, this.pasivo);
        
      case '3':
        return this.search(codigo, this.capital);
        
      case '4':
        return this.search(codigo, this.deudoras);
        
      case '5':
        return this.search(codigo, this.acreedoras);
        
      case '6':
        return this.search(codigo, this.cierre);
      
      default:
        // code
    }
  }
  
  search(codigo, cuentaRaiz){
    if(cuentaRaiz.codigo == codigo){
      return {'found': true, 'cuenta': cuentaRaiz};
    }else if(cuentaRaiz.subcuentas.length > 0){
      for(let subcuenta of cuentaRaiz.subcuentas){
        this.search(codigo, subcuenta);
      }
    }
    
    return {'found': false, 'cuenta': null};
  }
  
}

export { Catalogo };