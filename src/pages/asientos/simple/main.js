import { Money } from '../../../clases/Money.js';
import { Movimiento } from '../../../clases/Movimiento.js';
import { Asiento } from '../../../clases/Asiento.js';
import { LibroDiario } from '../../../clases/LibroDiario.js';
import { Storage } from '../../../storage/Storage.js';
import { Default } from '../../../storage/Default.js';

//almacen de datos
//localStorage.clear();

let store = null; 

//objeto asiento que se usara globalmente
let asiento = null;
let asientoCopy = null;//para respaldo

//lista de divs principales de la pagina
let divs = ['formCrearAsiento','formAgregarMovimiento','divMovimientos', "divListadoAsientos"];

function refreshStore(){
  store = Storage.getInstance('empresa1');
}

function crearAsiento(){
  if(validarCampos()){
    let fecha = document.getElementById("dateFechaAsiento").value;
    let nombre = document.getElementById("txtNombreAsiento").value;
    let comentario = document.getElementById("txtComentariosAsiento").value;
    
    if(asiento === null){
      asiento = new Asiento(fecha, nombre, comentario);
    }else{
      asiento.setFecha(fecha);
      asiento.setComentarios(comentario);
      asiento.setConcepto(nombre);
    }
    
    mostrarDatosAsiento();
    hidDivsExcept(divs, ['formAgregarMovimiento','divMovimientos']);
  }else{
    console.log("algo incorrecto");
  }
}

function mostrarDatosAsiento(){
  document.getElementById("headerAsiento").innerHTML = `<b>Concepto:</b> ${asiento.getConcepto()}`;
  document.getElementById("headerFecha").innerHTML = `<b>Fecha:</b> ${asiento.getFecha()}`;
  document.getElementById("headerComentarios").innerHTML = `<b>Comentarios:</b> ${asiento.getComentarios()}`;
}

function mostrarDatosAsientoForm(){
  document.getElementById("legendAsiento").innerText = "Modificar Asiento";
  document.getElementById("txtNombreAsiento").value = asiento.getConcepto();
  document.getElementById("dateFechaAsiento").value = asiento.getFechaString();
  document.getElementById("txtComentariosAsiento").value = asiento.getComentarios();
}

function modificarAsiento(){
  document.getElementById("legendAsiento").innerText = "Modificar Asiento";
  hidDivsExcept(divs, ['formCrearAsiento']);
}

//limpiar
function limpiarCamposAsiento(){
  document.getElementById("legendAsiento").innerText = "Crear Asiento";
  document.getElementById("dateFechaAsiento").value = "";
  document.getElementById("txtNombreAsiento").value = "";
  document.getElementById("txtComentariosAsiento").value = "";
}

function limpiarCamposMovimiento(){
  document.getElementById("numMontoMovimientoDebe").value = "";
  document.getElementById("numMontoMovimientoHaber").value = "";
  document.getElementById("txtPartidaCuenta").value = "";
  document.getElementById("txtContrapartidaCuenta").value = "";
  document.getElementById("btnGuardarAsiento").disabled = true;
  document.getElementById("btnAgregarMovimiento").innerText = "Añadir";
  document.getElementById("txtIndAsiento").value = "-1";
  document.getElementById("montoCargoErroresBlock").innerText = "";
  document.getElementById("montoAbonoErroresBlock").innerText = "";
  document.getElementById("cargoErroresBlock").innerText = "";
  document.getElementById("abonoErroresBlock").innerText = "";
}

function limpiarDivsMovimiento(){
  document.getElementById("divMovimientosTabla").innerHTML = "";
  document.getElementById("divFooterTabla").innerHTML = "";
}

function cancelarAsiento(){
  let ind = Number(document.getElementById("txtIndAsiento").value);
  if(ind != -1){
    let asientos = store.getObject().getLibroDiario().getAsientos();
    asientos[ind] = $.extend(true,{},asientoCopy);
    store.save();
    refreshStore();
  }
  document.getElementById("txtIndAsiento").value = "-1";
  asiento = null;
  limpiarDivsMovimiento();
  limpiarCamposMovimiento();
  limpiarCamposAsiento();
  
  hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
}

function guardarAsiento(){
  if(asiento != null){
    let indAsiento = Number(document.getElementById("txtIndAsiento").value);
    if(indAsiento != -1){
      store.save();
      refreshStore();
    }else{
      store.getObject().getLibroDiario().getAsientos().push(asiento);
      store.save();
      refreshStore();
    }
    
    limpiarDivsMovimiento();
    limpiarCamposMovimiento();
    limpiarCamposAsiento();
    
    mostrarLista();
    hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
    asiento = null;
  }
}

function agregarMovimiento(){
  if(validarCamposMovimiento()){
    let monto = document.getElementById("numMontoMovimientoDebe").value;
    let partidaCuenta = document.getElementById("txtPartidaCuenta").value;
    let partesPartidaCuenta = partidaCuenta.trim().split("-");
    let nombrePartida = partesPartidaCuenta[1].trim();
    let codigoPartida = partesPartidaCuenta[0].trim();
    
    let contrapartidaCuenta = document.getElementById("txtContrapartidaCuenta").value;
    let partesContrapartidaCuenta = contrapartidaCuenta.trim().split("-");
    let nombreContrapartida = partesContrapartidaCuenta[1].trim();
    let codigoContrapartida = partesContrapartidaCuenta[0].trim();
    
    if(asiento.tieneMovimientos()){
      asiento.vaciarMovimientos();
    }
    
    asiento.addMovimiento(new Movimiento(codigoPartida, nombrePartida, monto, 0, 1));
    asiento.addMovimiento(new Movimiento(codigoContrapartida, nombreContrapartida, 0, monto,2));
    
    let btn = document.getElementById("btnAgregarMovimiento");
    btn.innerText = "Actualizar";
    
    asiento.calcular();
    actualizarDivMovimientos();
  }else{
    console.log("faltan campos");
  }
}

function validarCamposMovimiento(){
  let monto = document.getElementById("numMontoMovimientoDebe").value;
  let cuentaCargo = document.getElementById("txtPartidaCuenta").value;
  let cuentaAbono = document.getElementById("txtContrapartidaCuenta").value;
  let cuentas = store.getObject().getCuentasHijas();
  if(!verificarDispCuentas(cuentaCargo,cuentaAbono,cuentas)){
    return false;
  }
  if(monto == "" || Number(monto) <= 0){
    return false;
  }
  if(cuentaCargo.trim() == ""){
    return false;
  }
  if(cuentaAbono.trim() == ""){
    return false;
  }
  if(cuentaAbono.trim() == cuentaCargo.trim()){
    return false;
  }
  
  return true;
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
function verificarMontos(){
  let montoCargo = document.getElementById("numMontoMovimientoDebe").value;
  let msg = "";
  if(Number(montoCargo) <= 0){
    msg = "Los montos no pueden ser menores o iguales a 0.";
  }
  
  document.getElementById("montoCargoErroresBlock").innerText = msg;
  document.getElementById("montoAbonoErroresBlock").innerText = msg;
}

function validarCampos(){
  if(document.getElementById("dateFechaAsiento").value == ""){
    return false;
  }
  
  if(document.getElementById("txtNombreAsiento").value == ""){
    return false;
  }
  
  return true;
}

function actualizarDivMovimientos(){
  let result = "";
  let footerTabla = "";
  let movimientos = asiento.getMovimientos();
  if(movimientos.length > 0){
    for(let movimiento of movimientos){
      result += ` <tr><td>${movimiento.getCodigo()}</td>`;
      
      let debe = movimiento.getDebe();
      let haber = movimiento.getHaber();
      
      if(debe.amount > 0){
        result += `<td>${movimiento.getNombreCuenta()}</td>`;
      }else{
        result += `<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${movimiento.getNombreCuenta()}</td>`;
      }
      
      result += `<td>${debe.toString()}</td><td>${haber.toString()}</td>`;
    }
    //desactivar o activar boton
    let btnGuardar = document.getElementById("btnGuardarAsiento");
    btnGuardar.disabled = !asiento.estaBalanceado();
    
    let lineStyle = (asiento.estaBalanceado()) ? "line-success" : "line-error";
    
    footerTabla += `<tr class="${lineStyle}"><td colspan=2">Totales</td><td>${asiento.getDebe()}</td><td>${asiento.getHaber()}</td></tr>`;
  }
  document.getElementById("divMovimientosTabla").innerHTML = result;
  document.getElementById("divFooterTabla").innerHTML = footerTabla;
}

function igualarDebe(){
  document.getElementById("numMontoMovimientoDebe").value = String(document.getElementById("numMontoMovimientoHaber").value);
  verificarMontos();
}

function igualarHaber(){
  document.getElementById("numMontoMovimientoHaber").value = String(document.getElementById("numMontoMovimientoDebe").value);
  verificarMontos();
}

function mostrarLista(){
  let asientos = store.getObject().getLibroDiario().getAsientos();
  let resultDefault = `<div class="separator"></div><div class="separator"></div><div class="separator"></div><h5 class="mb-0 text-center">No hay ningún asiento simple guardado.</h5>`;
  let result = `<div class="separator"></div><div class="separator"></div><div class="separator"></div><h5 class="mb-0 text-center">Lista Asientos Simples</h5>`;
  let hayAsientosSimples = false;
  
  if(asientos.length > 0){
    let ind = 0;
    for(let asiento of asientos){
      if(Number(asiento.getTipo()) != 1){
        ind++;
        continue;
      }
      hayAsientosSimples = true;
      let idBtnDelete = `delete-asi-${ind}`;
      let idBtnModify = `modify-asi-${ind}`;
      
      result += `<div class="separator"></div>`;
      result += `<div class="row">
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div class="card">
                          <div class="card-header">
                            <div class="d-flex">
                              <div class="d-block">
                                <div class="mb-0"><b>Concepto:</b> ${asiento.getConcepto()}</div>
                                <div class="mb-0"><b>Fecha:</b> ${asiento.getFecha()}</div>
                                <p><b>Comentarios:</b> ${asiento.getComentarios()}</p>
                              </div>
                              <div class="d-block ml-auto">
                                <button style="margin: 4px 1px" type="button" class="btn btn-info btn-sm modify-asi" id="${idBtnModify}">
                                  <i class="fas fa-edit" aria-hidden="true"></i>
                                </button>
                                <button type="button" class="btn btn-danger btn-sm delete-asi" id="${idBtnDelete}">
                                  <i class="fas fa-trash-alt" aria-hidden="true"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="card-body">
                              <div class="table-responsive">
                                  <table class="table table-striped table-bordered first">
                                      <thead>
                                          <tr>
                                              <th>Codigo</th>
                                              <th>Concepto</th>
                                              <th>Debe</th>
                                              <th>Haber</th>
                                          </tr>
                                      </thead>
                                      <tbody>`;
      let movimientos = asiento.getMovimientos();
      for(let movimiento of movimientos){
        result += ` <tr><td>${movimiento.getCodigo()}</td>`;
        
        let debe = movimiento.getDebe();
        let haber = movimiento.getHaber();
        
        if(debe.amount > 0){
          result += `<td>${movimiento.getNombreCuenta()}</td>`;
        }else{
          result += `<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${movimiento.getNombreCuenta()}</td>`;
        }
        
        result += `<td>${debe.toString()}</td><td>${haber.toString()}</td>`;
      }
      result += `                     </tbody>
                                      <tfoot>`;
      result += `                      </tfoot>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>`;
      ind++;
    }
    
  }
  //agregar html al div
  document.getElementById("divListadoAsientos").innerHTML = (hayAsientosSimples) ? result : resultDefault;
  
  document.querySelectorAll('.delete-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      eliminarAsiento(res[2]);
    })
  });
  document.querySelectorAll('.modify-asi').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      modificarAsientoLista(res[2]);
    })
  });
}

function eliminarAsiento(id){
  store.getObject().getLibroDiario().removeAsiento(id);
  store.save();
  refreshStore();
  mostrarLista();
}

function modificarAsientoLista(id){
  asiento = store.getObject().getLibroDiario().buscarAsiento(id);
  asientoCopy = $.extend(true,{},asiento);
  
  document.getElementById("txtIndAsiento").value = id;
  prepararFormMovimiento();
  mostrarDatosAsiento();
  mostrarDatosAsientoForm();
  actualizarDivMovimientos();
  hidDivsExcept(divs, ['formAgregarMovimiento','divMovimientos']);
}

function prepararFormMovimiento(){
  let movimientos = asiento.getMovimientos();
  let partidaCuenta = `${movimientos[0].getCodigo()} - ${movimientos[0].getNombreCuenta()}`;
  let contrapartidaCuenta = `${movimientos[1].getCodigo()} - ${movimientos[1].getNombreCuenta()}`;
  
  document.getElementById("txtPartidaCuenta").value = partidaCuenta;
  document.getElementById("txtContrapartidaCuenta").value = contrapartidaCuenta;
  document.getElementById("numMontoMovimientoDebe").value = movimientos[0].getDebe().amount;
  document.getElementById("numMontoMovimientoHaber").value = movimientos[1].getHaber().amount;
  document.getElementById("btnAgregarMovimiento").innerText = "Actualizar";
}

jQuery(document).ready(function($) {
    'use strict';

    /* Calender jQuery **/

    if ($("#datepicker").length) {
        $('#datepicker').datetimepicker({
            format: 'L'
        });
    }
    
    refreshStore();
    console.log(store);
    /*let obj = store.getObject();
    let cuentas = obj.catalogo.cuentas;
    console.log(cuentas);*/
    autocomplete(document.getElementById("txtPartidaCuenta"), store.getObject().getCuentasHijas());
    autocomplete(document.getElementById("txtContrapartidaCuenta"), store.getObject().getCuentasHijas());
    
    
    
    document.getElementById("btnAceptar").addEventListener("click",crearAsiento);
    document.getElementById("btnModificarAsiento").addEventListener("click",modificarAsiento);  
    document.getElementById("btnCancelarAsiento").addEventListener("click",cancelarAsiento);  
    document.getElementById("btnAgregarMovimiento").addEventListener("click",agregarMovimiento);
    document.getElementById("numMontoMovimientoDebe").addEventListener("keyup",igualarHaber);
    document.getElementById("numMontoMovimientoHaber").addEventListener("keyup",igualarDebe);
    
    document.getElementById("btnGuardarAsiento").addEventListener("click", guardarAsiento);
    document.getElementById("btnGuardarAsiento").disabled = true;
  
    mostrarLista();
    
    hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
});