import { Storage } from '../../../storage/Storage.js';

let session = Storage.getSessionData();

let store = null; 

mostrarLista();

function mostrarLista(){
  store = Storage.getInstance(session.getObject().empresa);
  let asientos = store.getObject().getLibroDiario().getAsientos();
  let resultDefault = `<div class="separator"></div><h5 class="mb-0 text-center">No hay ningún asiento guardado.</h5>`;
  let result = `<div class="separator"></div><h5 class="mb-0 text-center">Lista Asientos</h5>`;
  let hayAsientos = false;
  if(asientos.length > 0){
    hayAsientos = true;
    for(let asiento of asientos){
      result += `<div class="separator"></div>`;
      result += `<div class="row">
                  <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div class="card">
                          <div class="card-header">
                            <div class="d-flex">
                              <div class="d-block">
                                <div class="mb-0"><b>Concepto:</b> ${asiento.getConcepto()}</div>
                                <div class="mb-0"><b>Fecha:</b> ${asiento.getFechaString()}</div>
                                <p><b>Comentarios:</b> ${asiento.getComentarios()}</p>
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

      let asientoDebe = asiento.getDebe();
      let asientoHaber = asiento.getHaber();
      
      result += `                     </tbody>
                                      <tfoot>`;
      result += ` <tr class="line-success"><td colspan="2">Totales</td>`;
      result += `<td>${asientoDebe.toString()}</td><td>${asientoHaber.toString()}</td></tr>`;
      
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
  document.getElementById("divListadoAsientos").innerHTML = (hayAsientos) ? result : resultDefault;
}

