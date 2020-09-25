import { Money } from '../../../clases/Money.js';
import { Movimiento } from '../../../clases/Movimiento.js';
import { Asiento } from '../../../clases/Asiento.js';
import { LibroDiario } from '../../../clases/LibroDiario.js';

let asiento = null;
let divs = ['formCrearAsiento','formAgregarMovimiento','divMovimientos', "divListadoAsientos"];

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
    
    document.getElementById("headerAsiento").innerHTML = `<b>Concepto</b>: ${asiento.getConcepto()}`;
    document.getElementById("headerFecha").innerHTML = `<b>Fecha:</b> ${asiento.getFecha()}`;
    document.getElementById("headerComentarios").innerHTML = `<b>Comentarios:</b> ${asiento.getComentarios()}`;
    hidDivsExcept(divs, ['formAgregarMovimiento','divMovimientos']);
  }else{
    console.log("algo incorrecto");
  }
}

function modificarAsiento(){
  hidDivsExcept(divs, ['formCrearAsiento']);
}

function cancelarAsiento(){
  asiento = null;
  limpiarFormCargo();
  limpiarFormAbono();
  document.getElementById("divMovimientosTabla").innerHTML = "";
  document.getElementById("divFooterTabla").innerHTML = "";
  document.getElementById("dateFechaAsiento").value = "";
  document.getElementById("txtNombreAsiento").value = "";
  document.getElementById("txtComentariosAsiento").value = "";
  hidDivsExcept(divs, ['formCrearAsiento']);
}

function limpiarFormCargo(){
  document.getElementById("numMontoMovimientoDebe").value = "";
  document.getElementById("txtPartidaCodigo").value = "";
  document.getElementById("txtPartidaCuenta").value = "";
}

function limpiarFormAbono(){
  document.getElementById("numMontoMovimientoHaber").value = "";
  document.getElementById("txtContrapartidaCodigo").value = ""; 
  document.getElementById("txtContrapartidaCuenta").value = "";
}


function agregarCargo(){
  if(validarCamposCargo()){
    let monto = document.getElementById("numMontoMovimientoDebe").value;
    let partidaCodigo = document.getElementById("txtPartidaCodigo").value;
    let partidaCuenta = document.getElementById("txtPartidaCuenta").value;
    
    let btn = document.getElementById("btnAgregarCargo");
    if(btn.innerText == "Cargar"){
      asiento.addMovimiento(new Movimiento(partidaCodigo, partidaCuenta, new Money(monto), new Money(0), 1));
    }else{
      let indModify = Number(document.getElementById("indModifyCargo").value);
      let movimientos = asiento.getMovimientos();
      movimientos[indModify] = new Movimiento(partidaCodigo, partidaCuenta, new Money(monto), new Money(0), 1);
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
    let contrapartidaCodigo = document.getElementById("txtContrapartidaCodigo").value;
    let contrapartidaCuenta = document.getElementById("txtContrapartidaCuenta").value;
    
    let btn = document.getElementById("btnAgregarAbono");
    if(btn.innerText == "Abonar"){
      asiento.addMovimiento(new Movimiento(contrapartidaCodigo, contrapartidaCuenta, new Money(0), new Money(monto),2));
    }else{
      let indModify = Number(document.getElementById("indModifyAbono").value);
      let movimientos = asiento.getMovimientos();
      movimientos[indModify] = new Movimiento(contrapartidaCodigo, contrapartidaCuenta, new Money(0), new Money(monto),2);
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
      document.getElementById("txtPartidaCodigo").value = movimiento.getCodigo();
      document.getElementById("txtPartidaCuenta").value = movimiento.getNombreCuenta();
      document.getElementById("btnAgregarCargo").innerText = "Actualizar";
      document.getElementById("indModifyCargo").value = id;
      break;
    
    case 2:
      document.getElementById("numMontoMovimientoHaber").value = movimiento.getHaber().amount;
      document.getElementById("txtContrapartidaCodigo").value = movimiento.getCodigo();
      document.getElementById("txtContrapartidaCuenta").value = movimiento.getNombreCuenta();
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
  if(document.getElementById("txtPartidaCodigo").value == ""){
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
  if(document.getElementById("txtContrapartidaCodigo").value == ""){
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

jQuery(document).ready(function($) {
    'use strict';

    /* Calender jQuery **/

    if ($("#datepicker").length) {
        $('#datepicker').datetimepicker({
            format: 'L'
        });

    }
    
    document.getElementById("btnAceptar").addEventListener("click",crearAsiento);
    document.getElementById("btnModificarAsiento").addEventListener("click",modificarAsiento);  
    document.getElementById("btnCancelarAsiento").addEventListener("click",cancelarAsiento);  
    document.getElementById("btnAgregarAbono").addEventListener("click",agregarAbono);
    document.getElementById("btnAgregarCargo").addEventListener("click",agregarCargo);
    
    hidDivsExcept(divs, ['formCrearAsiento']);
});