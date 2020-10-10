import { Storage } from '../../storage/Storage.js';
import { LibroMayor } from '../../clases/LibroMayor.js';
import { Money } from '../../clases/Money.js';

let session = Storage.getSessionData();
let store = null;
let divs = ['divComprobacion','mensaje'];

mostrarBalance();


function mostrarBalance(){
  store = Storage.getInstance(session.getObject().empresa);
  agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);
  let asientos = store.getObject().getLibroDiario().getAsientos();

  let result = ``;
  let footer= ``;
  let hayAsientos = false;
  let res = store.getObject().getLibroDiario().mayorizar();
  console.log(res)
  if(res.correcto){
    hayAsientos = true;
    let libro = new LibroMayor(res.data);
    
    result += `<tr>
                                                <th scope="row"></th>
                                                <td><b>CUENTA</b></td>
                                                <td><b>DEUDOR</b></td>
                                                <td><b>ACREEDOR</b></td>
                                                <td><b>DEUDOR</b></td>
                                                <td><b>ACREEDOR</b></td>
                                            </tr>`;
    let saldosAcreedores = [];
    let saldosDeudores = [];
    
    let debeDiario = store.getObject().getLibroDiario().getDebe();
    let haberDiario = store.getObject().getLibroDiario().getHaber();
    for(let cuenta of libro.getCuentas()){
      let debe = cuenta.getDebe();
      let haber =  cuenta.getHaber();
      let saldo = cuenta.getSaldo();
      
      if(cuenta.estaBalanceada()){
        result += `<tr class="">
                  <td><b>${cuenta.getCodigo()}</b></td>
                  <td><b>${cuenta.getTitular()}</b></td>
                  <td><b>${debe.toString()}</b></td>
                  <td><b>${haber.toString()}</b></td>
                  <td></td>
                  <td></td>
              </tr>`;
      }else{
        result += `<tr>
                  <td><b>${cuenta.getCodigo()}</b></td>
                  <td><b>${cuenta.getTitular()}</b></td>
                  <td><b>${debe.toString()}</b></td>
                  <td><b>${haber.toString()}</b></td>`;
        
        if(saldo.amount > 0){
          saldosDeudores.push(saldo);
          result += `<td><b>${saldo.toString()}</b></td><td></td></tr>`;
        }else{
          saldosAcreedores.push(saldo);
          result +=  `<td></td><td><b>${saldo.toString()}</b></td></tr>`;
        }
      }
      
    }
    
    let saldoDeudor = Money.calculateMoneySum(saldosDeudores);
    let saldoAcreedor = Money.calculateMoneySum(saldosAcreedores);
    
    footer = `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr class="line-success">
                  <td></td>
                  <td><b>SUMAS IGUALES</td>
                  <td><b>${debeDiario.toString()}</b></td>
                  <td><b>${haberDiario.toString()}</b></td>
                  <td><b>${saldoDeudor.toString()}</b></td>
                  <td><b>${saldoAcreedor.toString()}</b></td>
                  </tr>`;
  }
  //agregar html al div
  if(hayAsientos){
    document.getElementById("txtNombreEmpresa").innerText = store.getObject().getConfig().empresa.nombreComercial;
    document.getElementById("listaCuentas").innerHTML = result;
    document.getElementById("footerCuentas").innerHTML = footer;
    hidDivsExcept(divs, ['divComprobacion']);
  }else{
    hidDivsExcept(divs, ['mensaje']);
  }
}