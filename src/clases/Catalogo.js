class Catalogo{
  constructor(cuentas){
    this.cuentas = cuentas;
    console.log(cuentas)
    this.cuentasHijas = []; //para busquedas, cuentas que no tienen subcuentas
    this.actualizarCuentas();
  }
  
  hayCuentas(){
    return this.cuentas.length > 0;
  }
  
  
  getCuentasHijas(){
    return this.cuentasHijas;
  }
  
  actualizarCuentas(){
    this.cuentasHijas = [];
    
    for(let cuenta of this.cuentas){
      console.log(cuenta);
      this.extraerCuentas(cuenta);
    }
  }
  
  extraerCuentas(cuenta){
    if(cuenta.subcuentas.length == 0){
      this.cuentasHijas.push(`${cuenta.codigo} - ${cuenta.titular}`)
    }else{
      for(let subcuenta of cuenta.subcuentas){
        this.extraerCuentas(subcuenta);
      }
    }
  }
  
  agregarCuenta(cuenta, codigoPadre){
    //let response = this.buscarCuenta(codigoPadre, this.cuentas);
    //EXTRAER PRIMER INDICE DE FORMA DISTINTA
    
    /*if(response.found){
      response.cuenta.subcuentas.push(cuenta);
      this.actualizarCuentas();
    }else{
      console.log("La cuenta solicitada no fue encontrada.");
    }*/
    
  }
  
  static buscar(codigo, catalogo){
    if(catalogo.length > 0){
      for(let cuenta of catalogo){
        let res = Catalogo.search(codigo, cuenta);
        console.log(res);
        if(res.found){
          return res.cuenta;
        }
      }
    }
  
    return null;
  }

  static search(codigo, cuentaRaiz){
    console.log(codigo, cuentaRaiz.codigo)
    
    if(cuentaRaiz.codigo.trim() == codigo.trim()){
      return {'found': true, 'cuenta': cuentaRaiz};
    }else if(cuentaRaiz.subcuentas.length > 0){
      console.log("subcuentas",cuentaRaiz.subcuentas)
      for(let subcuenta of cuentaRaiz.subcuentas){
         let response = Catalogo.search(codigo, subcuenta);
         if(response.found){
           return response;
         }
      }
    }
    
    return {'found': false, 'cuenta': null};
  }
  
  static importar(cuentas){
    let catalogo = [];
    
    for(let c of cuentas){
      let codigo = c[0].trim();
      let nombre = c[1].trim();
    
      if(Catalogo.buscar(codigo, catalogo) == null){
        let obj = {
          "codigo": codigo,
          "titular": nombre,
          "subcuentas": Catalogo.hallarSubcuentas(cuentas,codigo)
        };
        catalogo.push(obj);
      }
    }
    return new Catalogo(catalogo);
  }
  
  
  static hallarSubcuentas(cuentas, codigoMadre){
    if(cuentas.length > 0){
      let subcuentas = [];
      for(let cuenta of cuentas){
        let codigo = cuenta[0].trim();
        if(codigo.substr(0, codigoMadre.length) == codigoMadre && codigo.length > codigoMadre.length){
          if(Catalogo.buscar(codigo, subcuentas) == null){
            let obj = {
              "codigo": codigo,
              "titular": cuenta[1].trim(),
              "subcuentas": Catalogo.hallarSubcuentas(cuentas, codigo)
            }
            subcuentas.push(obj);
          }
        }
      }
      return subcuentas;
    }
    
    return [];
  }
    
}

export { Catalogo };