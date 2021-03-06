import { Storage } from '../../../storage/Storage.js';
import { LibroMayor } from '../../../clases/LibroMayor.js';

let session = Storage.getSessionData();
let store = null;


mostrarLista();
function mostrarLista(){
  store = Storage.getInstance(session.getObject().empresa);
  agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);
  let resultDefault = `<div class="separator"></div><h4 class="mb-0 text-center">No hay ningún asiento guardado.</h4>`;
  let result = `<div class="separator"></div><h4 class="mb-0 text-center">Lista Cuentas mayorizadas</h4>`;
  let hayAsientos = false;
  
  let res = store.getObject().getLibroDiario().mayorizar();
  if(res.correcto){
    hayAsientos = true;
    let libro = new LibroMayor(res.data);
    for(let cuenta of libro.getCuentas()){
      result += `<div class="separator"></div>`;
      result += `<div class="row">
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div class="card">
                          <div class="card-header">
                            <div class="d-flex">
                              <div class="d-block">
                                <div class="mb-0"><b>CÓDIGO: </b><b style="color:slateblue">${cuenta.getCodigo()}</b></div>
                                <div class="mb-0"><b>NOMBRE: </b><b style="color:slateblue">${cuenta.getTitular()}</b></div>
                              </div>
                            </div>
                          </div>
                          <div class="card-body">
                              <div class="table-responsive">
                                  <table class="table table-striped table-bordered first">
                                      <thead>
                                          <tr>
                                              <th>FECHA</th>
                                              <th>CONCEPTO</th>
                                              <th>DEBE</th>
                                              <th>HABER</th>
                                              <th>SALDO</th>
                                          </tr>
                                      </thead>
                                      <tbody>`;
      let movimientos = cuenta.getMovimientos();
      for(let movimiento of movimientos){
        result += ` <tr><td><b>${movimiento.getFechaString()}</b></td>`;
        
        let debe = movimiento.getDebe();
        let haber = movimiento.getHaber();
        
        if(debe.amount > 0){
          result += `<td><b>${movimiento.getConcepto()}</b></td>`;
        }else{
          result += `<td><b>${movimiento.getConcepto()}</b></td>`;
        }
        
        result += `<td><b>${debe.toString()}</b></td><td><b>${haber.toString()}</b></td><td><b>${movimiento.getSaldo().toString()}</b></td>`;
      }
      let lineStyle = (cuenta.estaBalanceada()) ? "line-success" : "line-error";
        
      let cuentaDebe = cuenta.getDebe();
      let cuentaHaber = cuenta.getHaber();
      
      result += `                     </tbody>
                                      <tfoot>`;
      result += `<tr class="${lineStyle}"><td colspan="2"><b>TOTALES</b></td>`;
      result += `<td><b>${cuentaDebe.toString()}</b></td><td><b>${cuentaHaber.toString()}</b></td><td><b>${cuenta.getSaldo().toString()}</b></td></tr>`;
      result += `                      </tfoot>
                                  </table>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>`;
             
    }
  }
  
  //agregar html al div
  document.getElementById("divListadoCuentas").innerHTML = (hayAsientos) ? result : resultDefault;
}

