import {Storage} from '../storage/Storage.js';

let store = Storage.getInstance('empresa1');

function guardarDatos(){
  store.save();
}

function getCatalogo(){
  let obj = store.getObject();
  return obj.getCatalogo();
}

function getCuentasBusqueda(){
  let catalogo = getCatalogo();
  return catalogo.getCuentasHijas();
}

function getLibroDiario(){
  let obj = store.getObject();
  return obj.getLibroDiario();
}

function getConfig(){
  let obj = store.getObject();
  return obj.getConfig();
}