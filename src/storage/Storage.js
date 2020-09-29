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
    let temp = obj.catalogo;
    let catalogo = new Catalogo(temp.activo,temp.pasivo,temp.capital,temp.acreedoras,temp.deudoras,temp.cierre);
    
    let asientos = [];
    for(let asiento of obj.libroDiario.asientos){
      let movimientos= [];
      
      for(let movimiento of asiento.movimientos){
        movimientos.push(new Movimiento(movimiento.codigo, movimiento.nombreCuenta, Number(movimiento.debe.quantity), Number(movimiento.haber.quantity), Number(movimiento.tipo)));
      }
      asientos.push(new Asiento(asiento.fechaString, asiento.concepto, asiento.comentarios, Number(asiento.tipo), movimientos));
    }
    let libroDiario = new LibroDiario(asientos);
    
    let finalObject = new Default(catalogo,libroDiario);
    return new Storage(name, finalObject); 
  }
  
  getObject(){
    return this.object;
  }
}

export {Storage};