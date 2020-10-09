import { Storage } from '../../storage/Storage.js';
import { Default } from '../../storage/Default.js';

import {Catalogo} from '../../clases/Catalogo.js';
import {LibroDiario} from '../../clases/LibroDiario.js';

import {activo} from '../../storage/catalogo/activo.js';
import {acreedoras} from '../../storage/catalogo/acreedoras.js';
import {pasivo} from '../../storage/catalogo/pasivo.js';
import {capital} from '../../storage/catalogo/capital.js';
import {deudoras} from '../../storage/catalogo/deudoras.js';
import {cierre} from '../../storage/catalogo/cierre.js';

let divs = ["formEmpresas","formCrearEmpresa"];
let catalogoDefecto = new Catalogo([activo,pasivo,capital,deudoras,acreedoras,cierre]);
let catalogoImportado = null;

function listarEmpresas(){
  let hayEmpresas = false;
  let resultHtml = "";
  if(localStorage.length > 0){
    for(let i=0; i<localStorage.length; i++){
      let key = localStorage.key(i);
      if(key != 'session'){
        hayEmpresas = true;
        let obj = JSON.parse(localStorage.getItem(key));
        console.log(obj)
        resultHtml += `<div class="row d-flex justify-content-center">
                  <div class="col-xl-6 col-lg-6 col-md-10 col-sm-12 col-12">
                    <div class="card">
                      <div class="card-header">
                        ${obj.config.empresa.nombreComercial}
                      </div>
                      <div class="card-body">
                        <div class="form-group d-flex">
                          <input class="form-control" id="txtClave${key}" type="password" value="" placeholder="Ingresar Clave" />
                          <button class="btn btn-success iniciar-sesion" id="btn-iniciar-${key}" type="button">Iniciar</button>
                        </div>
                      </div>
                      <div class="card-footer">
                        <small id="inicioClaveError${key}" class="form-text text-danger">
                          </small>
                      </div>
                    </div>
                  </div>
                  </div>`;
        
      }
    }
  }
  
  document.getElementById("listadoEmpresas").innerHTML = resultHtml;
  
  if(hayEmpresas){
    document.getElementById("msgSelectEmpresas").innerText = "Seleccionar Empresa";
    document.querySelectorAll('.iniciar-sesion').forEach(item => {
      item.addEventListener('click', event => {
        let res = item.id.split("-");
        iniciarSesion(res[2]);
      })
    });
  }else{
    document.getElementById("msgSelectEmpresas").innerText = "No hay ninguna empresa registrada";
  }
  
  hidDivsExcept(divs,['formEmpresas']);
}

function registrarEmpresa(){
  let campos = validarCampos();
  if(campos.valid){
    let empresa = campos.empresa;
    let catalogo = campos.catalogo;
    let config = {
      'empresa': empresa,
      'iva': 13
    };
    
    let obj = new Default(catalogo, new LibroDiario(), config);
    let clave = empresa.codigo;
    
    if(existeCodigo(clave)){
      document.getElementById("codigoEmpresaError").innerText = "Este código ya existe";
    }else{
      let store = new Storage(clave,obj);
      console.log(store);
      store.save();
      listarEmpresas();
    }
  }
}

function validarCampos(){
  let objValid = {
    'valid': false,
    'empresa': null,
    'catalogo': null
  }
  
  let codigo = document.getElementById("codigoEmpresa").value;
  let nombreFiscal = document.getElementById("nombreFiscal").value;
  let nombreComercial = document.getElementById("nombreComercial").value;
  let giro = document.getElementById("selectGiro").value;
  let objValidPrincipal = validarPrincipal(codigo,nombreFiscal,nombreComercial,giro);
  
  let direccion = document.getElementById("direccion").value;
  let telefono = document.getElementById("telefono").value;
  let email = document.getElementById("email").value;
  let objValidContacto = validarContacto(direccion,telefono,email);
  
  let pass1 = document.getElementById("pass1").value;
  let pass2 = document.getElementById("pass2").value;
  let objValidClaves = validarClaves(pass1,pass2);
  
  let radImportar = document.getElementById("radImportar");
  let objValidCatalogo = validarCatalogo(radImportar.checked);
  
  if(objValidPrincipal.valid && objValidContacto.valid && objValidClaves.valid && objValidCatalogo.valid){
    objValid.valid = true;
    
    let empresa = {
      'codigo': objValidPrincipal.codigo,
      'nombreFiscal': objValidPrincipal.nombreFiscal,
      'nombreComercial': objValidPrincipal.nombreComercial,
      'giro': objValidPrincipal.giro,
      'direccion': objValidContacto.direccion,
      'telefono': objValidContacto.telefono,
      'email': objValidContacto.email,
      'clave': objValidClaves.pass 
    };
    
    objValid.empresa = empresa;
    objValid.catalogo = objValidCatalogo.catalogo;
  }
  
  return objValid;
}

function validarPrincipal(codigo,nombreFiscal,nombreComercial,giro){
  let objValid = {
    'valid': false,
    'codigo': null,
    'nombreFiscal': null,
    'nombreComercial': null,
    'giro': null
  };
  
  if(codigo.trim() != "" && nombreFiscal.trim() != "" && nombreComercial.trim() != "" && giro != "giro"){
    objValid.valid = true;
    objValid.codigo = codigo.trim();
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
  
  if(pass1 != "" && pass2 != ""){
    if(pass1 == pass2){
      objValid.valid = true;
      objValid.pass = pass1;
    }
  }
  
  return objValid;
}

function validarCatalogo(importado){
  let objValid = {
    'valid': false,
    'catalogo': null
  };
  
  if(importado){
    if(catalogoImportado != null){
      objValid.valid = true;
      objValid.catalogo = catalogoImportado;
    }
  }else{
    objValid.valid = true;
    objValid.catalogo = catalogoDefecto;
  }
  
  return objValid;
}

function importarCatalogo(){
  try {
    let files = document.getElementById('csv').files;
    if (!files.length) {
      alert('Please select a file!');
      return;
    }
  
    let file = files[0];
    let delim = (document.getElementById("delimComa").checked) ? ",":";";
  
    console.log(file)
    
    Papa.parse(file, {
      delimiter: delim,
    	complete: function(results) {
    	  console.log(results)
    		llenarDatos(results.data);
    	}
    });
  } catch (e) {
    alert(e)
  }
}

function llenarDatos(results){
    var worker = new Worker("src/pages/inicio/importarCatalogo.js");
  
    worker.onmessage = function(event) {
      console.log(event.data);
      if(event.data.valid){
        document.getElementById("msgImportPercentage").innerText = "";
        catalogoImportado = new Catalogo(event.data.catalogo);
        if(!catalogoImportado.hayCuentas()){
          document.getElementById("msgImportFallido").classList.remove("d-none");
          document.getElementById("msgImportExito").classList.add("d-none");
          catalogoImportado = null;
          document.getElementById("catalogoError").innerText = "No se ha importado el catálogo";
        }else{
          document.getElementById("msgImportFallido").classList.add("d-none");
          document.getElementById("msgImportExito").classList.remove("d-none");
          document.getElementById("catalogoError").innerText = "";
        }
      }else{
        
        document.getElementById("msgImportPercentage").innerText = "Porcentaje: " + event.data.percentage + "%";
      }
    };

    worker.onerror = function(error) {
      console.log("Worker error: " + error.message + "\n");
      throw error;
    };

    worker.postMessage(results);
    
  
}

function iniciarSesion(key){
  let obj = JSON.parse(localStorage.getItem(key));
  let claveReal = obj.config.empresa.clave;
  let clave = document.getElementById("txtClave"+key).value;
  let msg = "";
  if(clave == ""){
    msg = "Debe ingresar una clave";
  }else{
    if(clave != claveReal){
      msg = "La clave es incorrecta";
    }else{
      let session = Storage.getSessionData();
      session.setObject({'is_auth': true,'empresa': key});
      window.location.href = "index.html";
    }
  }
  
  document.getElementById("inicioClaveError"+key).innerText = msg;
}

function existeCodigo(codigo){
  for(let i=0; i<localStorage.length; i++){
    let key = localStorage.key(i);
    if(codigo.trim() == key){
      return true;
    }
  }
  return false;
}


//funciones de los controles
function mostrarFormRegistro(){
  hidDivsExcept(divs,["formCrearEmpresa"]);
}

function mostrarFormEmpresas(){
  hidDivsExcept(divs,["formEmpresas"]);
}

function activarBtnImportar(){
  let rad = document.getElementById("radImportar");
  let btn = document.getElementById("btnAbrirMenuImportacion");
  if(rad.checked){
    btn.disabled = false;
  }else{
    btn.disabled = true;
  }
}


jQuery(document).ready(function($) {
    'use strict';
    
    
    document.getElementById("btnCrearEmpresa").addEventListener("click",mostrarFormRegistro);
    document.getElementById("btnCancelar").addEventListener("click",mostrarFormEmpresas);  
    document.getElementById("btnRegistrar").addEventListener("click",registrarEmpresa);
    
    document.getElementById("radDefecto").addEventListener("change",activarBtnImportar);
    document.getElementById("radImportar").addEventListener("change",activarBtnImportar);
    
    document.getElementById("btnAbrirMenuImportacion").disabled = true;
    
    document.getElementById("btnCSV").addEventListener("click",importarCatalogo);
    
    //campos requeridos
    document.getElementById("codigoEmpresa").addEventListener("keyup", function(){
      document.getElementById("codigoEmpresaError").innerText = (this.value == "") ? "Este campo es requerido" : "";
    });
    
    document.getElementById("nombreFiscal").addEventListener("keyup", function(){
      document.getElementById("nombreFiscalError").innerText = (this.value == "") ? "Este campo es requerido" : "";
    });
    
    document.getElementById("nombreComercial").addEventListener("keyup", function(){
      document.getElementById("nombreComercialError").innerText = (this.value == "") ? "Este campo es requerido" : "";
    });
    
    document.getElementById("selectGiro").addEventListener("change", function(){
      console.log(document.getElementById("selectGiro").value)
      document.getElementById("selectGiroError").innerText = (this.value == "giro") ? "Debe seleccionar una opción" : "";
    });
    
    document.getElementById("pass1").addEventListener("keyup",function(){
      document.getElementById("pass1Error").innerText = (this.value == "") ? "Este campo es requerido" : "";
    });
    
    document.getElementById("pass2").addEventListener("keyup",function(){
      document.getElementById("pass2Error").innerText = (this.value != document.getElementById("pass1").value) ? "La clave no coincide" : "";
    });
    
    document.getElementById("radDefecto").addEventListener("change",function(){
      if(!this.checked){
        if(catalogoImportado == null){
          document.getElementById("catalogoError").innerText = "No se ha importado el catálogo";
        }else{
          document.getElementById("catalogoError").innerText = "";
        }
      }else{
        document.getElementById("catalogoError").innerText = "";
      }
    });
    
    document.getElementById("radImportar").addEventListener("change",function(){
      if(this.checked){
        if(catalogoImportado == null){
          document.getElementById("catalogoError").innerText = "No se ha importado el catálogo";
        }else{
          document.getElementById("catalogoError").innerText = "";
        }
      }else{
        document.getElementById("catalogoError").innerText = "";
      }
    });
    let session = Storage.getSessionData();
    session.setObject({'is_auth': false,'empresa': null});
    
    listarEmpresas();
    
});