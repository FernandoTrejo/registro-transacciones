import {Catalogo} from '../clases/Catalogo.js';
import {LibroDiario} from '../clases/LibroDiario.js';

import {activo} from './catalogo/activo.js';
import {acreedoras} from './catalogo/acreedoras.js';
import {pasivo} from './catalogo/pasivo.js';
import {capital} from './catalogo/capital.js';
import {deudoras} from './catalogo/deudoras.js';
import {cierre} from './catalogo/cierre.js';

class Default{
  constructor(){
    this.catalogo = new Catalogo(activo,pasivo,capital,acreedoras,deudoras,cierre);
    this.libroDiario = new LibroDiario();
    this.config = [];
  }
  
  getCatalogo(){
    return this.catalogo;
  }
  
  getLibroDiario(){
    return this.libroDiario;
  }
  
  getConfig(){
    return this.config;
  }
}

export {Default};