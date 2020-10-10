import { Storage } from '../../../storage/Storage.js';

let session = Storage.getSessionData();

let store = null; 


mostrarLista();

function mostrarLista(){
  store = Storage.getInstance(session.getObject().empresa);
  agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);
  let asientos = store.getObject().getLibroDiario().getAsientos();
  let resultDefault = `<div class="separator"></div><h4 class="mb-0 text-center">No hay ningún asiento guardado.</h4>`;
  let result = `<div class="separator"></div><h4 class="mb-0 text-center">Lista Asientos</h4>`;
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
                                <div class="mb-0"><b>CONCEPTO: </b><b style="color:slateblue">${asiento.getConcepto()}</b></div>
                                <div class="mb-0"><b>FECHA: </b><b style="color:slateblue">${asiento.getFechaString()}</b></div>
                                <p><b>COMENTARIOS: </b><b style="color:slateblue">${asiento.getComentarios()}</b></p>
                              </div>
                            </div>
                          </div>
                          <div class="card-body">
                              <div class="table-responsive">
                                  <table class="table table-striped table-bordered first">
                                      <thead>
                                          <tr>
                                              <th>CÓDIGO</th>
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
          result += `<td><b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${movimiento.getNombreCuenta()}</b></td>`;
        }
        
        result += `<td><b>${debe.toString()}</b></td><td><b>${haber.toString()}</b></td>`;
      }

      let asientoDebe = asiento.getDebe();
      let asientoHaber = asiento.getHaber();
      
      result += `                     </tbody>
                                      <tfoot>`;
      result += ` <tr class="line-success"><td colspan="2"><b>TOTALES</b></td>`;
      result += `<td><b>${asientoDebe.toString()}</b></td><td><b>${asientoHaber.toString()}</b></td></tr>`;
      
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

