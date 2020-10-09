import { Storage } from '../../../storage/Storage.js';
import { LibroMayor } from '../../../clases/LibroMayor.js';

let session = Storage.getSessionData();
let store = null;
mostrarLista();
function mostrarLista(){
  store = Storage.getInstance(session.getObject().empresa);
  
  let resultDefault = `<div class="separator"></div><h5 class="mb-0 text-center">No hay ningún asiento guardado.</h5>`;
  let result = `<div class="separator"></div><h5 class="mb-0 text-center">Lista Cuentas mayorizadas</h5>`;
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
                                <div class="mb-0"><b>Código:</b> ${cuenta.getCodigo()}</div>
                                <div class="mb-0"><b>Nombre:</b> ${cuenta.getTitular()}</div>
                              </div>
                            </div>
                          </div>
                          <div class="card-body">
                              <div class="table-responsive">
                                  <table class="table table-striped table-bordered first">
                                      <thead>
                                          <tr>
                                              <th>Fecha</th>
                                              <th>Concepto</th>
                                              <th>Debe</th>
                                              <th>Haber</th>
                                          </tr>
                                      </thead>
                                      <tbody>`;
      let movimientos = cuenta.getMovimientos();
      for(let movimiento of movimientos){
        result += ` <tr><td>${movimiento.getFechaString()}</td>`;
        
        let debe = movimiento.getDebe();
        let haber = movimiento.getHaber();
        
        if(debe.amount > 0){
          result += `<td>${movimiento.getConcepto()}</td>`;
        }else{
          result += `<td>${movimiento.getConcepto()}</td>`;
        }
        
        result += `<td>${debe.toString()}</td><td>${haber.toString()}</td>`;
      }
      let lineStyle = (cuenta.estaBalanceada()) ? "line-success" : "line-error";
        
      let cuentaDebe = cuenta.getDebe();
      let cuentaHaber = cuenta.getHaber();
      
      result += `                     </tbody>
                                      <tfoot>`;
      result += `<tr class="${lineStyle}"><td colspan="2">Totales</td>`;
      result += `<td>${cuentaDebe.toString()}</td><td>${cuentaHaber.toString()}</td></tr>`;
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

