import { Storage } from '../../storage/Storage.js';
import { LibroMayor } from '../../clases/LibroMayor.js';
import { Money } from '../../clases/Money.js';

let store = null;
let divs = ['divComprobacion','mensaje'];
mostrarBalance();


function mostrarBalance(){
  store = Storage.getInstance('empresa1');
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
                                                <td>Cuenta</td>
                                                <td>Deudor</td>
                                                <td>Acreedor</td>
                                                <td>Deudor</td>
                                                <td>Acreedor</td>
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
                  <td>${cuenta.getCodigo()}</td>
                  <td>${cuenta.getTitular()}</td>
                  <td>${debe.toString()}</td>
                  <td>${haber.toString()}</td>
                  <td></td>
                  <td></td>
              </tr>`;
      }else{
        result += `<tr>
                  <td>${cuenta.getCodigo()}</td>
                  <td>${cuenta.getTitular()}</td>
                  <td>${debe.toString()}</td>
                  <td>${haber.toString()}</td>`;
        
        if(saldo.amount > 0){
          saldosDeudores.push(saldo);
          result += `<td>${saldo.toString()}</td><td></td></tr>`;
        }else{
          saldosAcreedores.push(saldo);
          result +=  `<td></td><td>${saldo.toString()}</td></tr>`;
        }
      }
      
    }
    
    let saldoDeudor = Money.calculateMoneySum(saldosDeudores);
    let saldoAcreedor = Money.calculateMoneySum(saldosAcreedores);
    
    footer = `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr>
                  <td></td>
                  <td>Sumas Iguales</td>
                  <td>${debeDiario.toString()}</td>
                  <td>${haberDiario.toString()}</td>
                  <td>${saldoDeudor.toString()}</td>
                  <td>${saldoAcreedor.toString()}</td>
                  </tr>`;
  }
  //agregar html al div
  if(hayAsientos){
    document.getElementById("listaCuentas").innerHTML = result;
    document.getElementById("footerCuentas").innerHTML = footer;
    hidDivsExcept(divs, ['divComprobacion']);
  }else{
    hidDivsExcept(divs, ['mensaje']);
  }
}