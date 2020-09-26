import { Money } from '../../../clases/Money.js';
import { Movimiento } from '../../../clases/Movimiento.js';
import { Asiento } from '../../../clases/Asiento.js';
import { LibroDiario } from '../../../clases/LibroDiario.js';
import { Storage } from '../../../storage/Storage.js';

//almacen de datos
let store = Storage.getInstance('empresa1');

//objeto asiento que se usara globalmente
let asiento = null;

//lista de divs principales de la pagina
let divs = ['formCrearAsiento','formAgregarMovimiento','divMovimientos', "divListadoAsientos"];

function crearAsiento(){
  if(validarCampos()){
    let fecha = document.getElementById("dateFechaAsiento").value;
    let nombre = document.getElementById("txtNombreAsiento").value;
    let comentario = document.getElementById("txtComentariosAsiento").value;
    
    if(asiento === null){
      asiento = new Asiento(new Date(fecha), nombre, comentario);
    }else{
      asiento.setFecha(new Date(fecha));
      asiento.setComentarios(comentario);
      asiento.setConcepto(nombre);
    }
    
    document.getElementById("headerAsiento").innerHTML = `<b>Concepto</b>: ${asiento.getConcepto()}`;
    document.getElementById("headerFecha").innerHTML = `<b>Fecha:</b> ${asiento.getFecha()}`;
    document.getElementById("headerComentarios").innerHTML = `<b>Comentarios:</b> ${asiento.getComentarios()}`;
    console.log(asiento);
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
  document.getElementById("divMovimientosTabla").innerHTML = "";
  document.getElementById("divFooterTabla").innerHTML = "";
  document.getElementById("numMontoMovimientoDebe").value = "";
  document.getElementById("numMontoMovimientoHaber").value = "";
  document.getElementById("txtPartidaCuenta").value = "";
  document.getElementById("txtContrapartidaCuenta").value = "";
  document.getElementById("dateFechaAsiento").value = "";
  document.getElementById("txtNombreAsiento").value = "";
  document.getElementById("txtComentariosAsiento").value = "";
  
  let btn = document.getElementById("btnAgregarMovimiento");
  btn.innerText = "Añadir";
  
  hidDivsExcept(divs, ['formCrearAsiento']);
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
    
    asiento.addMovimiento(new Movimiento(codigoPartida, nombrePartida, new Money(monto), new Money(0), 1));
    asiento.addMovimiento(new Movimiento(codigoContrapartida, nombreContrapartida, new Money(0), new Money(monto),2));
    
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
  if(monto == "" || Number(monto) == 0){
    return false;
  }
  if(document.getElementById("txtPartidaCuenta").value == ""){
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
    
    let lineStyle = (asiento.estaBalanceado()) ? "line-success" : "line-error";
    
    footerTabla += `<tr class="${lineStyle}"><td colspan=2">Totales</td><td>${asiento.getDebe()}</td><td>${asiento.getHaber()}</td></tr>`;
  }
  document.getElementById("divMovimientosTabla").innerHTML = result;
  document.getElementById("divFooterTabla").innerHTML = footerTabla;
}

function igualarDebe(){
  document.getElementById("numMontoMovimientoDebe").value = document.getElementById("numMontoMovimientoHaber").value;
}

function igualarHaber(){
  document.getElementById("numMontoMovimientoHaber").value = document.getElementById("numMontoMovimientoDebe").value;
}

jQuery(document).ready(function($) {
    'use strict';

    /* Calender jQuery **/

    if ($("#datepicker").length) {
        $('#datepicker').datetimepicker({
            format: 'L'
        });
    }
    console.log(store)
    autocomplete(document.getElementById("txtPartidaCuenta"), store.getObject().getCatalogo().getCuentasHijas());
    autocomplete(document.getElementById("txtContrapartidaCuenta"), store.getObject().getCatalogo().getCuentasHijas());
    
    document.getElementById("btnAceptar").addEventListener("click",crearAsiento);
    document.getElementById("btnModificarAsiento").addEventListener("click",modificarAsiento);  
    document.getElementById("btnCancelarAsiento").addEventListener("click",cancelarAsiento);  
    document.getElementById("btnAgregarMovimiento").addEventListener("click",agregarMovimiento);
    document.getElementById("numMontoMovimientoDebe").addEventListener("keyup",igualarHaber);
    document.getElementById("numMontoMovimientoHaber").addEventListener("keyup",igualarDebe);
  
    hidDivsExcept(divs, ['formCrearAsiento']);
});