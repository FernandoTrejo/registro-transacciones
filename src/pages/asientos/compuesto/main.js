import { Money } from '../../../clases/Money.js';
import { Movimiento } from '../../../clases/Movimiento.js';
import { Asiento } from '../../../clases/Asiento.js';
import { LibroDiario } from '../../../clases/LibroDiario.js';
import { Storage } from '../../../storage/Storage.js';

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
      asiento = new Asiento(new Date(fecha), nombre, comentario, 2);
    }else{
      asiento.setFecha(new Date(fecha));
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
  document.getElementById("headerAsiento").innerHTML = `<b>Concepto</b>: ${asiento.getConcepto()}`;
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

function cancelarAsiento(){
  asiento = Object.create(asientoCopy);
  asiento = null;
  limpiarFormCargo();
  limpiarFormAbono();
  limpiarDivsMovimiento();
  limpiarCamposAsiento();
  hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
}

function limpiarFormCargo(){
  document.getElementById("numMontoMovimientoDebe").value = "";
  document.getElementById("txtPartidaCuenta").value = "";
}

function limpiarFormAbono(){
  document.getElementById("numMontoMovimientoHaber").value = "";
  document.getElementById("txtContrapartidaCuenta").value = "";
}

function limpiarDivsMovimiento(){
  document.getElementById("divMovimientosTabla").innerHTML = "";
  document.getElementById("divFooterTabla").innerHTML = "";
}

function limpiarCamposAsiento(){
  document.getElementById("legendAsiento").innerText = "Crear Asiento";
  document.getElementById("dateFechaAsiento").value = "";
  document.getElementById("txtNombreAsiento").value = "";
  document.getElementById("txtComentariosAsiento").value = "";
}

function agregarCargo(){
  if(validarCamposCargo()){
    let monto = document.getElementById("numMontoMovimientoDebe").value;
    let partidaCuenta = document.getElementById("txtPartidaCuenta").value;
    let partesPartidaCuenta = partidaCuenta.trim().split("-");
    let nombrePartida = partesPartidaCuenta[1].trim();
    let codigoPartida = partesPartidaCuenta[0].trim();
    
    let btn = document.getElementById("btnAgregarCargo");
    if(btn.innerText == "Cargar"){
      asiento.addMovimiento(new Movimiento(codigoPartida, nombrePartida, monto, 0, 1));
    }else{
      let indModify = Number(document.getElementById("indModifyCargo").value);
      let movimientos = asiento.getMovimientos();
      movimientos[indModify] = new Movimiento(codigoPartida, nombrePartida, monto, 0, 1);
      btn.innerText = "Cargar";
    }
    
    actualizarDivMovimientos();
    limpiarFormCargo();
  }else{
    console.log("error");
  }
}

function agregarAbono(){
  if(validarCamposAbono()){
    let monto = document.getElementById("numMontoMovimientoHaber").value;
    let contrapartidaCuenta = document.getElementById("txtContrapartidaCuenta").value;
    let partesContrapartidaCuenta = contrapartidaCuenta.trim().split("-");
    let nombreContrapartida = partesContrapartidaCuenta[1].trim();
    let codigoContrapartida = partesContrapartidaCuenta[0].trim();
    
    let btn = document.getElementById("btnAgregarAbono");
    if(btn.innerText == "Abonar"){
      asiento.addMovimiento(new Movimiento(codigoContrapartida, nombreContrapartida, 0, monto,2));
    }else{
      let indModify = Number(document.getElementById("indModifyAbono").value);
      let movimientos = asiento.getMovimientos();
      movimientos[indModify] = new Movimiento(codigoContrapartida, nombreContrapartida, 0, monto,2);
      btn.innerText = "Abonar";
    }
    
    actualizarDivMovimientos();
    
    limpiarFormAbono();
  }else{
    console.log("error");
  }
}
function modificarMovimiento(id){
  let movimientos = asiento.getMovimientos();
  let movimiento = movimientos[id];
  switch (Number(movimiento.getTipo())) {
    case 1:
      document.getElementById("numMontoMovimientoDebe").value = movimiento.getDebe().amount;
      let partidaCuenta = `${movimiento.getCodigo()} - ${movimiento.getNombreCuenta()}`;
      document.getElementById("txtPartidaCuenta").value =  partidaCuenta;
      document.getElementById("btnAgregarCargo").innerText = "Actualizar";
      document.getElementById("indModifyCargo").value = id;
      break;
    
    case 2:
      document.getElementById("numMontoMovimientoHaber").value = movimiento.getHaber().amount;
      let contrapartidaCuenta = `${movimiento.getCodigo()} - ${movimiento.getNombreCuenta()}`;
      document.getElementById("txtContrapartidaCuenta").value = contrapartidaCuenta;
      document.getElementById("btnAgregarAbono").innerText = "Actualizar";
      document.getElementById("indModifyAbono").value = id;
      break;
  }
}

function eliminarMovimiento(id){
  asiento.removeMovimiento(id);
  actualizarDivMovimientos();
}

function validarCamposCargo(){
  let monto = document.getElementById("numMontoMovimientoDebe").value;
  if(monto == "" || Number(monto) == 0){
    return false;
  }
  if(document.getElementById("txtPartidaCuenta").value == ""){
    return false;
  }
  
  return true;
}

function validarCamposAbono(){
  let monto = document.getElementById("numMontoMovimientoHaber").value;
  if(monto == "" || Number(monto) == 0){
    return false;
  }
  if(document.getElementById("txtContrapartidaCuenta").value == ""){
    return false;
  }
  
  return true;
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

function actualizarDivMovimientos(){ //ordenar antes de mostrar
  asiento.calcular();
  asiento.ordenar();
  let result = "";
  let footerTabla = "";
  let ind = 0;
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
      
      let idBtnDelete = `delete-mov-${ind}`;
      let idBtnModify = `modify-mov-${ind}`;

      result += `<td>${debe.toString()}</td><td>${haber.toString()}</td>`;
      result += `<td><button id="${idBtnModify}" class="btn btn-info btn-sm modify-mov"><i class="fas fa-edit" aria-hidden="true"></i></button></td>`;
      
      result += `<td><button id="${idBtnDelete}" class="btn btn-danger btn-sm delete-mov"><i class="fas fa-trash-alt" aria-hidden="true"></i></button></td></tr>`;
      ind++;
    }
    //desactivar o activar boton
    let btnGuardar = document.getElementById("btnGuardarAsiento");
    btnGuardar.disabled = !asiento.estaBalanceado();
    let lineStyle = (asiento.estaBalanceado()) ? "line-success" : "line-error";
    
    footerTabla += `<tr class="${lineStyle}"><td colspan="2">Totales</td><td>${asiento.getDebe()}</td><td>${asiento.getHaber()}</td>`;
    footerTabla += `<td></td><td></td></tr>`;
  }
  document.getElementById("divMovimientosTabla").innerHTML = result;
  document.getElementById("divFooterTabla").innerHTML = footerTabla;
  document.querySelectorAll('.delete-mov').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      eliminarMovimiento(res[2]);
    })
  });
  document.querySelectorAll('.modify-mov').forEach(item => {
    item.addEventListener('click', event => {
      let res = item.id.split("-");
      modificarMovimiento(res[2]);
    })
  });
}

function mostrarLista(){
  let asientos = store.getObject().getLibroDiario().getAsientos();
  let resultDefault = `<div class="separator"></div><div class="separator"></div><h5 class="mb-0 text-center">No hay ningún asiento compuesto guardado.</h5>`;
  let result = `<div class="separator"></div><div class="separator"></div><h5 class="mb-0 text-center">Lista Asientos Compuestos</h5>`;
  let hayAsientosCompuestos = false;
  
  if(asientos.length > 0){
    let ind = 0;
    for(let asiento of asientos){
      if(Number(asiento.getTipo()) != 2){
        ind++;
        continue;
      }
      asiento.calcular();
      hayAsientosCompuestos = true;
      let idBtnDelete = `delete-asi-${ind}`;
      let idBtnModify = `modify-asi-${ind}`;
      
      result += `<div class="separator"></div>`;
      result += `<div class="row">
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div class="card">
                          <div class="card-header">
                              <div class="mb-0"><b>Concepto:</b> ${asiento.getConcepto()}</div>
                              <div class="mb-0"><b>Fecha:</b> ${asiento.getFecha()}</div>
                              <p><b>Comentarios:</b> ${asiento.getComentarios()}</p>
                              <button type="button" class="btn btn-info modify-asi" id="${idBtnModify}">Modificar</button>
                              <button type="button" class="btn btn-danger delete-asi" id="${idBtnDelete}">Eliminar</button>
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
      
      result += ` <tr><td colspan="2">Totales</td>`;
        
      let debe = asiento.getDebe();
      let haber = asiento.getHaber();
      
      result += `<td>${debe.toString()}</td><td>${haber.toString()}</td></tr>`;
      
      
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
  document.getElementById("divListadoAsientos").innerHTML = (hayAsientosCompuestos) ? result : resultDefault;
  
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
    document.getElementById("txtIndAsiento").value == "-1";
    limpiarFormAbono();
    limpiarFormCargo();
    limpiarCamposAsiento();
    
    mostrarLista();
    hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
    asiento = null;
  }
}

function eliminarAsiento(id){
  store.getObject().getLibroDiario().removeAsiento(id);
  store.save();
  refreshStore();
  mostrarLista();
}

function modificarAsientoLista(id){
  asiento = store.getObject().getLibroDiario().buscarAsiento(id);
  
  asientoCopy = Object.create(asiento);
  
  document.getElementById("txtIndAsiento").value = id;
  limpiarFormAbono();
  limpiarFormCargo();
  mostrarDatosAsiento();
  mostrarDatosAsientoForm();
  actualizarDivMovimientos();
  hidDivsExcept(divs, ['formAgregarMovimiento','divMovimientos']);
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
    
    autocomplete(document.getElementById("txtPartidaCuenta"), store.getObject().getCatalogo().getCuentasHijas());
    autocomplete(document.getElementById("txtContrapartidaCuenta"), store.getObject().getCatalogo().getCuentasHijas());
    
    document.getElementById("btnAceptar").addEventListener("click",crearAsiento);
    document.getElementById("btnModificarAsiento").addEventListener("click",modificarAsiento);  
    document.getElementById("btnCancelarAsiento").addEventListener("click",cancelarAsiento);  
    document.getElementById("btnAgregarAbono").addEventListener("click",agregarAbono);
    document.getElementById("btnAgregarCargo").addEventListener("click",agregarCargo);
    document.getElementById("btnGuardarAsiento").addEventListener("click",guardarAsiento);
    document.getElementById("btnGuardarAsiento").disabled = false;
    
    mostrarLista();
    hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
});