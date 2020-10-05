import {Default} from './Default.js';
import {Catalogo} from '../clases/Catalogo.js';
import {LibroDiario} from '../clases/LibroDiario.js';
import {Asiento} from '../clases/Asiento.js';
import {Movimiento} from '../clases/Movimiento.js';

class Storage{
  constructor(name, object){
    this.name = name;
    this.object = object;
  }
  
  save(){
    // Convirte el JSON string con JSON.stringify()
    // entonces guarda con localStorage con el nombre de la sesión
    localStorage.setItem(this.name, JSON.stringify(this.object));
  }
  
  static getSessionData(){
    if(!Storage.sessionExists('session')){
      console.log('aqui no existe la ses')
      return new Storage('session',{'is_auth': false,'empresa': null});
    }
    console.log('exise')
    return new Storage('session', JSON.parse(localStorage.getItem('session')));
  }
      
  static getInstance(name){
    if(!Storage.sessionExists(name)){
      return new Storage(name, new Default());
    }
    return Storage.buildStorageObject(name,Storage.parseJSON(name));
  }
  
  static sessionExists(name){
    return localStorage[name];
  }
  
  static parseJSON(name){
    return JSON.parse(localStorage.getItem(name));
  }
  
  static buildStorageObject(name,obj){
    let temp = obj.catalogo.cuentas;
    console.log(temp)
    let cuentasMadre = [];
    for(let c of temp){
      cuentasMadre.push(c);
    }
    let catalogo = new Catalogo(cuentasMadre);
    
    let asientos = [];
    for(let asiento of obj.libroDiario.asientos){
      let movimientos= [];
      
      for(let movimiento of asiento.movimientos){
        movimientos.push(new Movimiento(movimiento.codigo, movimiento.nombreCuenta, Number(movimiento.debe.quantity), Number(movimiento.haber.quantity), Number(movimiento.tipo)));
      }
      asientos.push(new Asiento(asiento.fechaString, asiento.concepto, asiento.comentarios, Number(asiento.tipo), movimientos));
    }
    let libroDiario = new LibroDiario(asientos);
    
    let finalObject = new Default(catalogo,libroDiario,obj.config);
    return new Storage(name, finalObject); 
  }
  
  getObject(){
    return this.object;
  }
  
  setObject(object){
    this.object = object;
    this.save();
  }
}

export {Storage};