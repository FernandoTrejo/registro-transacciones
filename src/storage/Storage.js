import {Default} from './Default.js';

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
    
    return new Storage(name, Storage.parseJSON(name)); 
  }
  
  static sessionExists(name){
    return localStorage[name];
  }
  
  static parseJSON(name){
    return JSON.parse(localStorage.getItem(name));
  }
  
  getObject(){
    return this.object;
  }
}

export {Storage};