import { Storage } from '../../storage/Storage.js';

let session = Storage.getSessionData();
let store = null;

function modificarIva(){
  let iva = document.getElementById("numPorIva").value;
  if(iva.trim() == ""){
    document.getElementById("numPorIvaError").innerText = "Este campo es requerido";
  }else{
    if(isNaN(Number(iva.trim()))){
      document.getElementById("numPorIvaError").innerText = "El valor debe ser numérico";
    }else{
      document.getElementById("numPorIvaError").innerText = "";
      store.getObject().getConfig().iva = iva.trim();
      store.save();
    }
  }
}

function cargarDatos(){
  store = Storage.getInstance(session.getObject().empresa);
  
  let config = store.getObject().getConfig();
  
  document.getElementById("numPorIva").value = config.iva;
  document.getElementById("codigoEmpresa").value = config.empresa.codigo;
  document.getElementById("nombreFiscal").value = config.empresa.nombreFiscal;
  document.getElementById("nombreComercial").value = config.empresa.nombreComercial;
  
  for(let option of document.getElementById("selectGiro").options){
    if(option.value == config.empresa.giro){
      option.selected = true;
      break;
    }
  }
  
  document.getElementById("direccion").value = config.empresa.direccion;
  document.getElementById("telefono").value = config.empresa.telefono;
  document.getElementById("email").value = config.empresa.email;
  
  document.getElementById("pass0").value = "";
  document.getElementById("pass0").disabled = false;
  document.getElementById("btnIngresarClaveActual").disabled = false;
  
  document.getElementById("pass1").value = "";
  document.getElementById("pass1").disabled = true;
  document.getElementById("pass2").value = "";
  document.getElementById("pass2").disabled = true;
}

function ingresarClaveActual(){
  let clave = document.getElementById("pass0").value;
  let config = store.getObject().getConfig();
  
  if(clave == config.empresa.clave){
    document.getElementById("pass0Error").innerText = "";
    document.getElementById("pass1").disabled = false;
    document.getElementById("pass2").disabled = false;
    document.getElementById("pass0").disabled = true;
    document.getElementById("btnIngresarClaveActual").disabled = true;
  }else{
    document.getElementById("pass0Error").innerText = "La clave es incorrecta";
    document.getElementById("pass1").disabled = true;
    document.getElementById("pass2").disabled = true;
  }
  
}

function registrarEmpresa(){
  let campos = validarCampos();
  if(campos.valid){
    let empresa = campos.empresa;
    
    let config = store.getObject().getConfig();
    config.empresa.nombreFiscal = empresa.nombreFiscal;
    config.empresa.nombreComercial = empresa.nombreComercial;
    config.empresa.giro = empresa.giro;
    config.empresa.direccion = empresa.direccion;
    config.empresa.telefono = empresa.telefono;
    config.empresa.email = empresa.email;
    config.empresa.clave = empresa.clave;
    
    store.save();
    console.log(store);
    cargarDatos();
  }
}

function validarCampos(){
  let objValid = {
    'valid': false,
    'empresa': null
  }
  
  let nombreFiscal = document.getElementById("nombreFiscal").value;
  let nombreComercial = document.getElementById("nombreComercial").value;
  let giro = document.getElementById("selectGiro").value;
  let objValidPrincipal = validarPrincipal(nombreFiscal,nombreComercial,giro);
  
  let direccion = document.getElementById("direccion").value;
  let telefono = document.getElementById("telefono").value;
  let email = document.getElementById("email").value;
  let objValidContacto = validarContacto(direccion,telefono,email);
  
  let pass1 = document.getElementById("pass1").value;
  let pass2 = document.getElementById("pass2").value;
  let objValidClaves = validarClaves(pass1,pass2);
  
  if(objValidPrincipal.valid && objValidContacto.valid && objValidClaves.valid){
    objValid.valid = true;
    
    let empresa = {
      'nombreFiscal': objValidPrincipal.nombreFiscal,
      'nombreComercial': objValidPrincipal.nombreComercial,
      'giro': objValidPrincipal.giro,
      'direccion': objValidContacto.direccion,
      'telefono': objValidContacto.telefono,
      'email': objValidContacto.email,
      'clave': objValidClaves.pass 
    };
    
    objValid.empresa = empresa;
  }
  
  return objValid;
}

function validarPrincipal(nombreFiscal,nombreComercial,giro){
  let objValid = {
    'valid': false,
    'nombreFiscal': null,
    'nombreComercial': null,
    'giro': null
  };
  
  if(nombreFiscal.trim() != "" && nombreComercial.trim() != "" && giro != "giro"){
    objValid.valid = true;
    objValid.nombreFiscal = nombreFiscal.trim();
    objValid.nombreComercial = nombreComercial.trim();
    objValid.giro = giro.trim();
  }
  
  return objValid;
}

function validarContacto(direccion,telefono,email){
  return {
    'valid': true,
    'direccion': direccion.trim(),
    'telefono': telefono.trim(),
    'email': email.trim()
  };
}

function validarClaves(pass1,pass2){
  let objValid = {
    'valid': false,
    'pass': null
  };
  
  let pass0Control = document.getElementById("pass0");
  console.log(!pass0Control.disabled)
  if(!pass0Control.disabled){
    objValid.valid = true;
    objValid.pass = store.getObject().getConfig().empresa.clave;
    return objValid;
  }
  
  if(pass1 != "" && pass2 != ""){
    if(pass1 == pass2){
      objValid.valid = true;
      objValid.pass = pass1;
    }
  }
  
  return objValid;
}

jQuery(document).ready(function($) {
    'use strict';
    
    document.getElementById("btnModIVA").addEventListener("click", modificarIva);
    document.getElementById("btnIngresarClaveActual").addEventListener("click", ingresarClaveActual);
    document.getElementById("btnRegistrar").addEventListener("click", registrarEmpresa);
    
    document.getElementById("nombreFiscal").addEventListener("keyup", function(){
      document.getElementById("nombreFiscalError").innerText = (this.value.trim() == "") ? "Este campo es requerido" : "";
    });
    document.getElementById("nombreComercial").addEventListener("keyup", function(){
      document.getElementById("nombreComercialError").innerText = (this.value.trim() == "") ? "Este campo es requerido" : "";
    });
    document.getElementById("selectGiro").addEventListener("change", function(){
      document.getElementById("selectGiroError").innerText = (this.value == "giro") ? "Debe seleccionar una opcion" : "";
    });
    
    document.getElementById("pass1").addEventListener("keyup",function(){
      document.getElementById("pass1Error").innerText = (this.value == "") ? "Este campo es requerido" : "";
    });
    
    document.getElementById("pass2").addEventListener("keyup",function(){
      document.getElementById("pass2Error").innerText = (this.value != document.getElementById("pass1").value) ? "La clave no coincide" : "";
    });
    document.getElementById("numPorIva").addEventListener("keyup",function(){
      document.getElementById("numPorIvaError").innerText = (this.value.trim() == "") ? "Este campo es requerido" : "";
    });
    
    cargarDatos();
});