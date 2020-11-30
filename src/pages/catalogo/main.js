import { Storage } from '../../storage/Storage.js';
import { Catalogo } from '../../clases/Catalogo.js';

let session = Storage.getSessionData();
let store = null;

function armarCatalogo(cuentas,cuentaMadre = null){
  let resultHtml = ``;
  for(let cuenta of cuentas){
    let tieneSubcuentas = (cuenta.subcuentas.length > 0);
    let parent = (cuentaMadre == null) ? "start" : cuentaMadre.codigo;
    if(tieneSubcuentas){
       resultHtml += `
       <div class="card">
          <div class="card-header d-flex">
            <div>
             <a class="btn btn-link" data-toggle="collapse" data-parent="#accordion-${parent}" href="#collapse-${cuenta.codigo}">
               <span class="fas fa-angle-down mr-3"></span>${cuenta.codigo} - ${cuenta.titular}
             </a>
            </div>
            <button style="border-radius: 25%" id="btn-subcuentas-${cuenta.codigo}" type="button" class="ml-auto btn btn-warning btn-sm crear-subcuentas" data-toggle="modal" data-target="#exampleModalCenter"><i class="fas fa-plus-circle"></i></button>
          </div>
          <div id="collapse-${cuenta.codigo}" class="collapse in">
            <div class="card-body">
              <div class="accrodion-regular" id="accordion-${cuenta.codigo}">`;
                
        resultHtml += armarCatalogo(cuenta.subcuentas,cuenta);
        
        resultHtml += `
              </div>
            </div>
          </div>
        </div>`;
     }else{
       resultHtml += `
       <div class="card">
          <div class="card-header d-flex">
            <div>
             <a class="btn btn-link" data-parent="#accordion-${parent}">
               <span class="fas fa-long-arrow-alt-right mr-3"></span>${cuenta.codigo} - ${cuenta.titular}
             </a>
            </div>
            <button style="border-radius: 25%" id="btn-subcuentas-${cuenta.codigo}" type="button" class="ml-auto btn btn-warning btn-sm crear-subcuentas" data-toggle="modal" data-target="#exampleModalCenter"><i class="fas fa-plus-circle"></i></button>
          </div>
          
        </div>`;
     }
  }
  return resultHtml;
}

function mostrarCatalogo(){
   store = Storage.getInstance(session.getObject().empresa);
   let catalogo = store.getObject().getCatalogo();
   let resultHtml = `<h5 class="mb-0 text-center">No hay cuentas</h5>`;
   
   if(catalogo.hayCuentas()){
     resultHtml = `<div class="accrodion-regular" id="accordion-start">`;
     resultHtml += armarCatalogo(catalogo.getCuentas())
     resultHtml += "</div>";
   }
   
   document.getElementById("catalogo").innerHTML = resultHtml;
   
   document.querySelectorAll('.crear-subcuentas').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      mostrarMenuSubcuenta(res[2]);
    })
  });
}

function mostrarMenuSubcuenta(codigo){
  //desactivar
  document.getElementById("txtCuentaMadre").value = "";
  document.getElementById("txtCuentaMadre").disabled = true;
  document.getElementById("txtCuentaMadreError").innerText = "";
  document.getElementById("btnAceptarCuentaMadre").disabled = true;
  
  document.getElementById("codigoMadre").innerText = codigo + "/";
  document.getElementById("txtCodigoCuenta").value = "";
  document.getElementById("txtCodigoCuenta").disabled = false;
  document.getElementById("txtCodigoError").innerText = "Este campo es obligatorio";
  document.getElementById("txtTitular").value = "";
  document.getElementById("txtTitular").disabled = false;
  document.getElementById("txtTitularError").innerText = "Este campo es obligatorio";
  document.getElementById("btnAgregarCuenta").disabled = false;
}

function mostrarMenuCreacion(){
  document.getElementById("txtCuentaMadre").value = "";
  document.getElementById("txtCuentaMadre").disabled = false;
  document.getElementById("txtCuentaMadreError").innerText = "Este campo es obligatorio";
  document.getElementById("btnAceptarCuentaMadre").disabled = false;
  
  document.getElementById("codigoMadre").innerText = "codigo/";
  document.getElementById("txtCodigoCuenta").value = "";
  document.getElementById("txtCodigoCuenta").disabled = true;
  document.getElementById("txtCodigoError").innerText = "";
  document.getElementById("txtTitular").value = "";
  document.getElementById("txtTitular").disabled = true;
  document.getElementById("txtTitularError").innerText = "";
  document.getElementById("btnAgregarCuenta").disabled = true;
}

function verificarDispCuentas(cuentaCargo,cuentaAbono,cuentas){
  let msgCargo = "";
  let msgAbono = "";
  let res = true;
  if(!cuentas.includes(cuentaCargo.trim())){
    msgCargo = "Esta cuenta no existe en el catálogo.";
    res = false;
  }else if(cuentaCargo.trim() == cuentaAbono.trim()){
    msgCargo = "No puede elegir la misma cuenta en ambos lados.";
    res = false;
  }
  
  if(!cuentas.includes(cuentaAbono.trim())){
    msgAbono = "Esta cuenta no existe en el catálogo.";
    res = false;
  }else if(cuentaCargo.trim() == cuentaAbono.trim()){
    msgAbono = "No puede elegir la misma cuenta en ambos lados.";
    res = false;
  }
  
  document.getElementById("cargoErroresBlock").innerText = msgCargo;
  document.getElementById("abonoErroresBlock").innerText = msgAbono;
  return res;
}

function aceptarCuentaMadre(){
  let txtCuentaMadre = document.getElementById("txtCuentaMadre").value;
  let cuentas = store.getObject().getCatalogo().getCuentasArrayString();
  
  if(txtCuentaMadre.trim() == ""){
    document.getElementById("txtCuentaMadreError").innerText = "Este campo es obligatorio";
  }else{
    if(!cuentas.includes(txtCuentaMadre)){
      document.getElementById("txtCuentaMadreError").innerText = "Esta cuenta no existe en el catálogo";
    }else{
      let cuentaPartes = txtCuentaMadre.split("-");
      let codigo = cuentaPartes[0].trim();
      document.getElementById("txtCuentaMadreError").innerText = "";
      document.getElementById("codigoMadre").innerText = codigo + "/";
      document.getElementById("txtCodigoCuenta").disabled = false;
      document.getElementById("txtCodigoError").innerText = "Este campo es obligatorio";
      document.getElementById("txtTitular").disabled = false;
      document.getElementById("txtTitularError").innerText = "Este campo es obligatorio";
      document.getElementById("btnAgregarCuenta").disabled = false; 
    }
  }
}

function crearSubcuenta(){
  let res = validarCampos();
  if(res.valid){
    let catalogo = store.getObject().getCatalogo().getCuentas();
    let txtCodigoMadre = document.getElementById("codigoMadre").innerHTML;
    let codigoMadre = txtCodigoMadre.substr(0,txtCodigoMadre.length - 1);
    
    let codigo = codigoMadre + res.campos.codigo;
    let titular = res.campos.titular;
    
    let found = Catalogo.buscar(codigo, catalogo);
    if(found != null){
      document.getElementById("txtCodigoError").innerText = "Esta cuenta ya existe en el catálogo";
    }else{
      document.getElementById("txtCodigoError").innerText = "";
      let cuenta = {'codigo': codigo,'titular': titular, 'subcuentas': []};
      Catalogo.agregarCuenta(cuenta,codigoMadre,catalogo);
      store.save();
      mostrarCatalogo();
      autocomplete(document.getElementById("txtCuentaMadre"), store.getObject().getCatalogo().getCuentasArrayString());
    }
  }
}

function validarCampos(){
  let objValid = {'valid': false, 'campos': null};
  let codigo = document.getElementById("txtCodigoCuenta").value;
  let titular = document.getElementById("txtTitular").value;
  if(codigo.trim() != "" && titular.trim() != ""){
    objValid.valid = true;
    objValid.campos = {
      'codigo': codigo.trim(),
      'titular': titular.trim()
    };
  }
  
  return objValid;
}

jQuery(document).ready(function($) {
    'use strict';
    document.getElementById("btnAgregarCuenta").addEventListener("click",crearSubcuenta);
    document.getElementById("btnAbrirMenuCrearCuenta").addEventListener("click",mostrarMenuCreacion);
    document.getElementById("btnAceptarCuentaMadre").addEventListener("click",aceptarCuentaMadre);
    document.getElementById("txtCodigoCuenta").addEventListener("keyup", function(){
      document.getElementById("txtCodigoError").innerText = (this.value.trim() != "") ? "" : "Este campo es obligatorio";
    });
    
    document.getElementById("txtTitular").addEventListener("keyup", function(){
      document.getElementById("txtTitularError").innerText = (this.value.trim() != "") ? "" : "Este campo es obligatorio";
    });
    
    
    mostrarCatalogo();
    agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);
    autocomplete(document.getElementById("txtCuentaMadre"), store.getObject().getCatalogo().getCuentasArrayString());
});