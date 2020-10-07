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
            <h5 class="mb-0">
             <a class="btn btn-link" data-toggle="collapse" data-parent="#accordion-${parent}" href="#collapse-${cuenta.codigo}">
               <span class="fas fa-angle-down mr-3"></span>${cuenta.codigo} - ${cuenta.titular}
             </a>
            </h5>
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
       resultHtml += `<div class="card"><div class="card-body">${cuenta.codigo} - ${cuenta.titular}</div></div>`;
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
  document.getElementById("codigoMadre").innerText = codigo + "/";
}

function crearSubcuenta(){
  let txtCodigoMadre = document.getElementById("codigoMadre").innerHTML;
  let codigoMadre = txtCodigoMadre.substr(0,txtCodigoMadre.length - 1);
  
  let codigo = codigoMadre + document.getElementById("txtCodigoCuenta").value;
  let titular = document.getElementById("txtTitular").value;
  let catalogo = store.getObject().getCatalogo().getCuentas();
  let cuenta = {
    'codigo': codigo,
    'titular': titular,
    'subcuentas': []
  };
  
  Catalogo.agregarCuenta(cuenta, codigoMadre, catalogo);
  catalogo.actualizarCuentas();
  mostrarCatalogo();
}

jQuery(document).ready(function($) {
    'use strict';
    document.getElementById("btnAgregarCuenta").addEventListener("click",crearSubcuenta);
    mostrarCatalogo();
});