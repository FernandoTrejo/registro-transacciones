import { Storage } from '../../../storage/Storage.js';

let store = null;
let divs = ['divComprobacion','mensaje'];
mostrarBalance();


function mostrarBalance(){
  let asientos = store.getObject().getLibroDiario().getAsientos();

  let result = ``;
  let hayAsientos = false;
  let res = store.getObject().getLibroDiario().mayorizar();
  console.log(res)
  if(res.correcto){
    hayAsientos = true;
    let libro = new LibroMayor(res.data);
    for(let cuenta of libro.getCuentas()){
      let debe = asiento.getDebe();
      let haber = asiento.getHaber();
      let saldo = asiento.getSaldo();
      
      if(cuenta.estaBalanceada){
        result += `<tr class="line-success">
                  <td>${cuenta.getCodigo()}</td>
                  <td>${cuenta.getNombreCuenta()}</td>
                  <td>${debe.toString()}</td>
                  <td>${haber.toString()}</td>
                  <td>${saldo.toString()}</td>
                  <td>${saldo.toString()}</td>
              </tr>`;
      }else{
        result += `<tr>
                  <td>${cuenta.getCodigo()}</td>
                  <td>${cuenta.getNombreCuenta()}</td>
                  <td>${debe.toString()}</td>
                  <td>${haber.toString()}</td>`;
        
        result += (saldo.amount > 0) ? `<td>${saldo.toString()}</td><td></td></tr>` :  `<td></td><td>${saldo.toString()}</td></tr>`; 
      }
      
    }
  }
  //agregar html al div
  if(hayAsientos){
    document.getElementById("listaCuentas").innerHTML = result;
    hidDivsExcept(divs, ['divComprobacion']);
  }else{
    hidDivsExcept(divs, ['mensaje']);
  }
}