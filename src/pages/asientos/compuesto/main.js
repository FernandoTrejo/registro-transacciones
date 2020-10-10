import { Money } from '../../../clases/Money.js';
import { Movimiento } from '../../../clases/Movimiento.js';
import { Asiento } from '../../../clases/Asiento.js';
import { LibroDiario } from '../../../clases/LibroDiario.js';
import { Storage } from '../../../storage/Storage.js';

let session = Storage.getSessionData();

let store = null;
//objeto asiento que se usara globalmente
let asiento = null;
let asientoCopy = null;//para respaldo
//lista de divs principales de la pagina
let divs = ['formCrearAsiento','formAgregarMovimiento','divMovimientos', "divListadoAsientos"];

function refreshStore(){
  store = Storage.getInstance(session.getObject().empresa);
}

function crearAsiento(){
  if(validarCampos()){
    let fecha = document.getElementById("dateFechaAsiento").value;
    let nombre = document.getElementById("txtNombreAsiento").value;
    let comentario = document.getElementById("txtComentariosAsiento").value;
    
    if(asiento === null){
      asiento = new Asiento(fecha, nombre, comentario, 2);
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
  document.getElementById("headerAsiento").innerHTML = `<b>CONCEPTO:</b> <b style="color:slateblue">${asiento.getConcepto()}</b>`;
  document.getElementById("headerFecha").innerHTML = `<b>FECHA:</b> <b style="color:slateblue">${asiento.getFechaString()}</b>`;
  document.getElementById("headerComentarios").innerHTML = `<b>COMENTARIOS:</b> <b style="color:slateblue">${asiento.getComentarios()}</b>`;
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
  let ind = Number(document.getElementById("txtIndAsiento").value);
  if(ind != -1){ //significa que se estaba tratando de modificar
    let asientos = store.getObject().getLibroDiario().getAsientos();
    asientos[ind] = $.extend(true,{},asientoCopy);
    store.save();
    refreshStore();
  }
  document.getElementById("txtIndAsiento").value = "-1";
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
  document.getElementById("montoCargoErroresBlock").innerText = "";
  document.getElementById("cargoErroresBlock").innerText = "";
} 

function limpiarFormAbono(){
  document.getElementById("numMontoMovimientoHaber").value = "";
  document.getElementById("txtContrapartidaCuenta").value = "";
  document.getElementById("montoAbonoErroresBlock").innerText = "";
  document.getElementById("abonoErroresBlock").innerText = "";
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
  let btn = document.getElementById("btnAgregarCargo");
  if(btn.innerText == "Cargar"){
    if(validarCamposCargo()){
      let monto = document.getElementById("numMontoMovimientoDebe").value;
      let partidaCuenta = document.getElementById("txtPartidaCuenta").value;
      let partesPartidaCuenta = partidaCuenta.trim().split("-");
      let nombrePartida = partesPartidaCuenta[1].trim();
      let codigoPartida = partesPartidaCuenta[0].trim();
      asiento.addMovimiento(new Movimiento(codigoPartida, nombrePartida, monto, 0, 1));
      
      actualizarDivMovimientos();
      limpiarFormCargo();
    }else{
      console.log("error");
    }
  }else{
    let indModify = Number(document.getElementById("indModifyCargo").value);
    let movimientos = asiento.getMovimientos();
    if(validarCamposCargo(movimientos[indModify])){
      let monto = document.getElementById("numMontoMovimientoDebe").value;
      let partidaCuenta = document.getElementById("txtPartidaCuenta").value;
      let partesPartidaCuenta = partidaCuenta.trim().split("-");
      let nombrePartida = partesPartidaCuenta[1].trim();
      let codigoPartida = partesPartidaCuenta[0].trim();
      
      movimientos[indModify] = new Movimiento(codigoPartida, nombrePartida, monto, 0, 1);
      actualizarDivMovimientos();
      limpiarFormCargo();
      btn.innerText = "Cargar";
    }
    
  }
}

function agregarMovimientoIva(){
  let res = validarMovimientoIva();
  if(res.valid){
    let btn = document.getElementById("btnAgregarMovimientoIva");
    
    let partesCuentaPrincipal = res.cuentaPrincipal.trim().split("-");
    let nombreCuentaPrincipal = partesCuentaPrincipal[1].trim();
    let codigoCuentaPrincipal = partesCuentaPrincipal[0].trim();
    
    let partesCuentaIva = res.cuentaIva.trim().split("-");
    let nombreCuentaIva = partesCuentaIva[1].trim();
    let codigoCuentaIva = partesCuentaIva[0].trim();
    
    let montoPrincipal = res.principal;
    let montoIva = res.iva;
    
    if(btn.innerText == "Cargar"){
      asiento.addMovimiento(new Movimiento(codigoCuentaPrincipal, nombreCuentaPrincipal, montoPrincipal, 0, 1));
      asiento.addMovimiento(new Movimiento(codigoCuentaIva, nombreCuentaIva, montoIva, 0, 1));
      actualizarDivMovimientos();
      limpiarFormCargo();
    }else{
      asiento.addMovimiento(new Movimiento(codigoCuentaPrincipal, nombreCuentaPrincipal, 0, montoPrincipal, 2));
      asiento.addMovimiento(new Movimiento(codigoCuentaIva, nombreCuentaIva, 0, montoIva, 2));
      actualizarDivMovimientos();
      limpiarFormAbono();
    }
  }else{
    document.getElementById("msgIvaFormFallido").innerText = "Algo salió mal";
  }
}

function validarMovimientoIva(){
  let objValid = {
    'valid': false
  };
  let montoPrincipal = document.getElementById("numMontoPrincipalCalculado").value;
  let cuentaPrincipal = document.getElementById("txtModalCuentaPrincipal").value;
  let montoIva = document.getElementById("numMontoIvaCalculado").value;
  let cuentaIva = document.getElementById("txtCuentaIva").value;
  
  let cuentas = store.getObject().getCuentasHijas();
  if(!verificarDispCuentas(cuentaIva,cuentas,3)){
    return objValid;
  }
  if(montoPrincipal == "" || Number(montoPrincipal) <= 0){
    return objValid;
  }
  if(montoIva == "" || Number(montoIva) <= 0){
    return objValid;
  }
  if(cuentaPrincipal == "" || cuentaIva.trim() == ""){
    return objValid;
  }
  
  return {
    'valid':true,
    'principal': montoPrincipal,
    'iva': montoIva,
    'cuentaIva': cuentaIva,
    'cuentaPrincipal': cuentaPrincipal
  };
}

function mostrarCargoIvaModal(){
  document.getElementById("btnAgregarMovimientoIva").innerText = "Cargar";
  document.getElementById("checkIvaIncluido").checked = false;
  if(validarCamposCargo()){
      let monto = document.getElementById("numMontoMovimientoDebe").value;
      let partidaCuenta = document.getElementById("txtPartidaCuenta").value;
      
      let iva = store.getObject().getConfig().iva;
      
      let res = Money.calculateIva(monto, iva)
      
      document.getElementById("txtModalCuentaPrincipal").value = partidaCuenta;
      document.getElementById("numMontoPrincipalCalculado").value = res.principal.amount;
      document.getElementById("numMontoIvaCalculado").value = res.iva.amount;
      
      document.getElementById("btnAgregarMovimientoIva").disabled = false;
      document.getElementById("txtCuentaIva").disabled = false;
      document.getElementById("txtCuentaIva").value = "";
      document.getElementById("checkIvaIncluido").disabled = false;
      
    }else{
      document.getElementById("txtModalCuentaPrincipal").value = "";
      document.getElementById("numMontoPrincipalCalculado").value = "";
      document.getElementById("numMontoIvaCalculado").value = "";
      document.getElementById("btnAgregarMovimientoIva").disabled = true;
      document.getElementById("txtCuentaIva").value = "";
      document.getElementById("txtCuentaIva").disabled = true;
      document.getElementById("checkIvaIncluido").disabled = true;
    }
}

function agregarAbono(){
  let btn = document.getElementById("btnAgregarAbono");
  if(btn.innerText == "Abonar"){
    if(validarCamposAbono()){
      let monto = document.getElementById("numMontoMovimientoHaber").value;
      let contrapartidaCuenta = document.getElementById("txtContrapartidaCuenta").value;
      let partesContrapartidaCuenta = contrapartidaCuenta.trim().split("-");
      let nombreContrapartida = partesContrapartidaCuenta[1].trim();
      let codigoContrapartida = partesContrapartidaCuenta[0].trim();
      asiento.addMovimiento(new Movimiento(codigoContrapartida, nombreContrapartida, 0, monto,2));
      
      actualizarDivMovimientos();
      limpiarFormAbono();
    }else{
      console.log("error");
    }
  }else{
    let indModify = Number(document.getElementById("indModifyAbono").value);
    let movimientos = asiento.getMovimientos();
    if(validarCamposAbono(movimientos[indModify])){
      let monto = document.getElementById("numMontoMovimientoHaber").value;
      let contrapartidaCuenta = document.getElementById("txtContrapartidaCuenta").value;
      let partesContrapartidaCuenta = contrapartidaCuenta.trim().split("-");
      let nombreContrapartida = partesContrapartidaCuenta[1].trim();
      let codigoContrapartida = partesContrapartidaCuenta[0].trim();
      movimientos[indModify] = new Movimiento(codigoContrapartida, nombreContrapartida, 0, monto,2);
      btn.innerText = "Abonar";
      
      actualizarDivMovimientos();
      limpiarFormAbono();
    }else{
      console.log("error");
    }
  }
}

function mostrarAbonoIvaModal(){
  document.getElementById("btnAgregarMovimientoIva").innerText = "Abonar";
  document.getElementById("checkIvaIncluido").checked = false;
  if(validarCamposAbono()){
      let monto = document.getElementById("numMontoMovimientoHaber").value;
      let contrapartidaCuenta = document.getElementById("txtContrapartidaCuenta").value;
      
      let iva = store.getObject().getConfig().iva;
      
      let res = Money.calculateIva(monto, iva)
      
      document.getElementById("txtModalCuentaPrincipal").value = contrapartidaCuenta;
      document.getElementById("numMontoPrincipalCalculado").value = res.principal.amount;
      document.getElementById("numMontoIvaCalculado").value = res.iva.amount;
      
      document.getElementById("btnAgregarMovimientoIva").disabled = false;
      document.getElementById("txtCuentaIva").disabled = false;
      document.getElementById("txtCuentaIva").value = "";
      document.getElementById("checkIvaIncluido").disabled = false;
      
    }else{
      document.getElementById("txtModalCuentaPrincipal").value = "";
      document.getElementById("numMontoPrincipalCalculado").value = "";
      document.getElementById("numMontoIvaCalculado").value = "";
      document.getElementById("btnAgregarMovimientoIva").disabled = true;
      document.getElementById("txtCuentaIva").value = "";
      document.getElementById("txtCuentaIva").disabled = true;
      document.getElementById("checkIvaIncluido").disabled = true;
    }
}

function calcularIva(){
  let monto = null; 
  let btn = document.getElementById("btnAgregarMovimientoIva");
  if(btn.innerText == "Cargar"){
    monto = document.getElementById("numMontoMovimientoDebe").value;
  }else{
    monto = document.getElementById("numMontoMovimientoHaber").value;
  }
  let iva = store.getObject().getConfig().iva;
  let res = null;
  
  if(document.getElementById("checkIvaIncluido").checked){
    res = Money.calculateIva(monto, iva, true);
  }else{
    res = Money.calculateIva(monto, iva);
  }
  document.getElementById("numMontoPrincipalCalculado").value = res.principal.amount;
  document.getElementById("numMontoIvaCalculado").value = res.iva.amount;
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

function cuentaEnUso(cuenta){ // dentro de la transaccion
  let encontrada = false;
  
  let movs = asiento.getMovimientos();
  if(movs.length > 0){
    for(let mov of movs){
      let cuentaName = mov.getCodigo() + " - " + mov.getNombreCuenta();
      if(cuentaName.trim() == cuenta){
        encontrada = true;
        break;
      }
    }
  }
  return encontrada;
}

function verificarDispCuentas(cuenta,cuentas,tipo,movimiento){
  let msg = "";
  let res = true;
  if(!cuentas.includes(cuenta.trim())){
    msg = "Esta cuenta no existe en el catálogo.";
    res = false;
  }else if(cuentaEnUso(cuenta.trim())){
    console.log('la cuenta esta en uso')
    if(movimiento == null){
      console.log('movimiento es null')
      msg = "Esta cuenta ya está siendo usada.";
      res = false;
    }else if(movimiento.cuentaToString() != cuenta.trim()){
      console.log(movimiento.cuentaToString(),cuenta.trim())
      console.log('la cuenta enviada es diferente a la del movimiemto')
      msg = "Esta cuenta ya está siendo usada.";
      res = false;
    }
  }
  /*
  if(Number(tipo) == 1){
    document.getElementById("cargoErroresBlock").innerText = msg;
  }else{
    document.getElementById("abonoErroresBlock").innerText = msg;
  }*/
  
  switch(Number(tipo)){
    case 1:
      document.getElementById("cargoErroresBlock").innerText = msg;
      break;
    case 2: 
      document.getElementById("abonoErroresBlock").innerText = msg;
      break;
    case 3:
      document.getElementById("txtCuentaIvaError").innerText = msg;
      break;
    case 4: 
      break;
  }
  return res;
}
function verificarMontoCargo(){
  let montoCargo = document.getElementById("numMontoMovimientoDebe").value;
  let msg = "";
  if(Number(montoCargo) <= 0){
    msg = "Los montos no pueden ser menores o iguales a 0.";
  }
  
  document.getElementById("montoCargoErroresBlock").innerText = msg;
}
function verificarMontoAbono(){
  let montoAbono = document.getElementById("numMontoMovimientoHaber").value;
  let msg = "";
  if(Number(montoAbono) <= 0){
    msg = "Los montos no pueden ser menores o iguales a 0.";
  }
  
  document.getElementById("montoAbonoErroresBlock").innerText = msg;
}

function validarCamposCargo(movimiento = null){
  let monto = document.getElementById("numMontoMovimientoDebe").value;
  let cuentaCargo = document.getElementById("txtPartidaCuenta").value;
  let cuentas = store.getObject().getCuentasHijas();
  if(!verificarDispCuentas(cuentaCargo,cuentas,1,movimiento)){
    return false;
  }
  if(monto == "" || Number(monto) <= 0){
    return false;
  }
  if(document.getElementById("txtPartidaCuenta").value == ""){
    return false;
  }
  
  return true;
}

function validarCamposAbono(movimiento=null){
  let monto = document.getElementById("numMontoMovimientoHaber").value;
  let cuentaAbono = document.getElementById("txtContrapartidaCuenta").value;
  let cuentas = store.getObject().getCuentasHijas();
  if(!verificarDispCuentas(cuentaAbono,cuentas,2,movimiento)){
    console.log("falla en vrrificar cuentas")
    return false;
  }
  if(monto == "" || Number(monto) <= 0){
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
  let resultDefault = `<div class="separator"></div><div class="separator"></div><h4 class="mb-0 text-center">No hay ningún asiento compuesto guardado.</h4>`;
  let result = `<div class="separator"></div><div class="separator"></div><h4 class="mb-0 text-center">Lista Asientos Compuestos</h4>`;
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
                            <div class="d-flex">
                              <div class="d-block">
                                <div class="mb-0"><b>CONCEPTO:</b> <b style="color:slateblue">${asiento.getConcepto()}</b></div>
                                <div class="mb-0"><b>FECHA:</b> <b style="color:slateblue">${asiento.getFechaString()}</b></div>
                                <p><b>COMENTARIOS:</b> <b style="color:slateblue">${asiento.getComentarios()}</b></p>
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
                                              <th>CODIGO</th>
                                              <th>CONCEPTO</th>
                                              <th>DEBE</th>
                                              <th>HABER</th>
                                          </tr>
                                      </thead>
                                      <tbody>`;
      let movimientos = asiento.getMovimientos();
      for(let movimiento of movimientos){
        result += ` <tr><td><b>${movimiento.getCodigo()}</b></td>`;
        
        let debe = movimiento.getDebe();
        let haber = movimiento.getHaber();
        
        if(debe.amount > 0){
          result += `<td><b>${movimiento.getNombreCuenta()}</b></td>`;
        }else{
          result += `<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>${movimiento.getNombreCuenta()}</b></td>`;
        }
        
        result += `<td><b>${debe.toString()}</b></td><td><b>${haber.toString()}</b></td>`;
      }
      
      result += ` <tr><td colspan="2"><b>TOTALES</b></td>`;
        
      let debe = asiento.getDebe();
      let haber = asiento.getHaber();
      
      result += `<td><b>${debe.toString()}</b></td><td><b>${haber.toString()}</b></td></tr>`;
      
      
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
    document.getElementById("txtIndAsiento").value = "-1";
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
  asientoCopy = $.extend(true,{},asiento);
  
  document.getElementById("txtIndAsiento").value = id;
  limpiarFormAbono();
  limpiarFormCargo();
  mostrarDatosAsiento();
  mostrarDatosAsientoForm();
  actualizarDivMovimientos();
  hidDivsExcept(divs, ['formAgregarMovimiento','divMovimientos']);
}

function cuadrarAbono(){
  if(asiento.tieneMovimientos()){
    if(!asiento.estaBalanceado()){
      if(Number(asiento.getHaber().amount) < Number(asiento.getDebe().amount)){
        let diferencia = Money.calculateMoneySus(asiento.getDebe(),asiento.getHaber());
        document.getElementById("numMontoMovimientoHaber").value = diferencia.amount;
      }
    }
  }
}
function cuadrarCargo(){
  if(asiento.tieneMovimientos()){
    if(!asiento.estaBalanceado()){
      //alert(asiento.getDebe().amount<asiento.getHaber().amount);
      if(Number(asiento.getDebe().amount) < Number(asiento.getHaber().amount)){
        let diferencia = Money.calculateMoneySus(asiento.getHaber(),asiento.getDebe());
        document.getElementById("numMontoMovimientoDebe").value = diferencia.amount;
      }
    }
  }
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
    autocomplete(document.getElementById("txtCuentaIva"), store.getObject().getCatalogo().getCuentasHijas());
    
    document.getElementById("btnAceptar").addEventListener("click",crearAsiento);
    document.getElementById("btnModificarAsiento").addEventListener("click",modificarAsiento);  
    document.getElementById("btnCancelarAsiento").addEventListener("click",cancelarAsiento);  
    document.getElementById("btnAgregarAbono").addEventListener("click",agregarAbono);
    document.getElementById("btnCalcularIvaCargo").addEventListener("click",mostrarCargoIvaModal);
    document.getElementById("btnAgregarCargo").addEventListener("click",agregarCargo);
    document.getElementById("btnCalcularIvaAbono").addEventListener("click",mostrarAbonoIvaModal);
    
    document.getElementById("btnAgregarMovimientoIva").addEventListener("click",agregarMovimientoIva);
    
    document.getElementById("checkIvaIncluido").addEventListener("change",calcularIva);
    
    document.getElementById("numMontoMovimientoDebe").addEventListener("keyup",verificarMontoCargo);
    document.getElementById("numMontoMovimientoHaber").addEventListener("keyup",verificarMontoAbono);
    document.getElementById("btnGuardarAsiento").addEventListener("click",guardarAsiento);
    document.getElementById("btnGuardarAsiento").disabled = true;
    
    document.getElementById("btnCuadrarAbono").addEventListener("click", cuadrarAbono);
    document.getElementById("btnCuadrarCargo").addEventListener("click", cuadrarCargo);
    
    
    mostrarLista();
    agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);
    hidDivsExcept(divs, ['formCrearAsiento','divListadoAsientos']);
});