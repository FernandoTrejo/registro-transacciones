import { Storage } from '../../storage/Storage.js';
import { LibroMayor } from '../../clases/LibroMayor.js';
import { Money } from '../../clases/Money.js';
import { Catalogo } from '../../clases/Catalogo.js';



let session = Storage.getSessionData();
let store = null;
let divs = ['divEstado','mensaje'];
let activo = new Money(0);
let pasivo_capital = new Money(0);
let codigos = {
  'activo': '1',
  'pasivo': '2',
  'capital': '3',
  'ingresos': '5',
  'egresos': '4'
};

mostrarBalance();

function mostrarBalance(){
  store = Storage.getInstance(session.getObject().empresa);
  agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);

  let hayAsientos = false;
  let res = store.getObject().getLibroDiario().mayorizar();
  let cuentasIngresos = [];
  let cuentasEgresos = [];
  let cuentasActivo = [];
  let cuentasPasivo = [];
  let cuentasCapital = [];
  if(res.correcto){
    hayAsientos = true;
    let libro = new LibroMayor(res.data);
    
    for(let cuenta of libro.getCuentas()){
      let codigoNaturaleza = cuenta.getCodigo().substring(0,1);
      if(Number(codigoNaturaleza) == Number(codigos.ingresos)){
        cuentasIngresos.push(cuenta);
      }
      if(Number(codigoNaturaleza) == Number(codigos.egresos)){
        cuentasEgresos.push(cuenta);
      }
      if(Number(codigoNaturaleza) == Number(codigos.activo)){
        cuentasActivo.push(cuenta);
      }
      if(Number(codigoNaturaleza) == Number(codigos.pasivo)){
        cuentasPasivo.push(cuenta);
      }
      if(Number(codigoNaturaleza) == Number(codigos.capital)){
        cuentasCapital.push(cuenta);
      }
    }

  }
  //agregar html al div
  if(hayAsientos){
    document.getElementById("txtNombreEmpresa").innerText = store.getObject().getConfig().empresa.nombreComercial;
    hidDivsExcept(divs, ['divEstado']);
    let utilidad = calcularUtilidad(cuentasIngresos, cuentasEgresos);
    
    let act = mostrarActivo(cuentasActivo);
    let cap = mostrarCapital(cuentasCapital, utilidad);
    let pas = mostrarPasivo(cuentasPasivo);
    
    mostrarResultados(act, cap, pas);
  }else{
    hidDivsExcept(divs, ['mensaje']);
  }
}

function calcularUtilidad(cuentasIngresos,cuentasEgresos){
  let saldosIngresos = [];
  for(let cuenta of cuentasIngresos){
    saldosIngresos.push(cuenta.getSaldo());
  }
  
  let saldosEgresos = [];
  for(let cuenta of cuentasEgresos){
    saldosEgresos.push(cuenta.getSaldo());
  }
  
  let ingresos = Money.calculateMoneySum(saldosIngresos);
  let egresos = Money.calculateMoneySum(saldosEgresos);
  
  return Money.calculateSum([Math.abs(ingresos.amount), Number(egresos.amount) * -1]);
}

function mostrarActivo(cuentas){
  let result = `<tr>
                  <th scope="row"></th>
                  <td><b>CUENTA</b></td>
                  <td><b>DEUDOR</b></td>
                  <td><b>ACREEDOR</b></td>
                  <td><b>DEUDOR</b></td>
                  <td><b>ACREEDOR</b></td>
              </tr>`;
  let saldosAcreedores = [];
  let saldosDeudores = [];
  let debeGenerales = [];
  let haberGenerales = [];
  
  for(let cuenta of cuentas){
    let debe = cuenta.getDebe();
    let haber =  cuenta.getHaber();
    let saldo = cuenta.getSaldo();
    
    if(!cuenta.estaBalanceada()){
      debeGenerales.push(debe);
      haberGenerales.push(haber);
      
      result += `<tr class="">
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
  
  let debeGeneral = Money.calculateMoneySum(debeGenerales);
  let haberGeneral = Money.calculateMoneySum(haberGenerales);
  
  let footer = `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="">
                <td></td>
                <td><b>Resultados</td>
                <td><b>${debeGeneral.toString()}</b></td>
                <td><b>${haberGeneral.toString()}</b></td>
                <td><b>${saldoDeudor.toString()}</b></td>
                <td><b>${saldoAcreedor.toString()}</b></td>
                </tr>`;
                
  let finalRes = Money.calculateMoneySum([saldoDeudor, saldoAcreedor]);
  
  let cardFoot = `<p class="mb-0"><b>Activo: ${finalRes.toString()} </b></p>`;   
  
  document.getElementById("listaCuentasActivo").innerHTML = result;
  document.getElementById("footerCuentasActivo").innerHTML = footer;
  document.getElementById("cardFootActivo").innerHTML = cardFoot;
  
  return finalRes;
}

function mostrarPasivo(cuentas){
  let result = `<tr>
                  <th scope="row"></th>
                  <td><b>CUENTA</b></td>
                  <td><b>DEUDOR</b></td>
                  <td><b>ACREEDOR</b></td>
                  <td><b>DEUDOR</b></td>
                  <td><b>ACREEDOR</b></td>
              </tr>`;
  let saldosAcreedores = [];
  let saldosDeudores = [];
  let debeGenerales = [];
  let haberGenerales = [];
  
  for(let cuenta of cuentas){
    let debe = cuenta.getDebe();
    let haber =  cuenta.getHaber();
    let saldo = cuenta.getSaldo();
    
    if(!cuenta.estaBalanceada()){
      debeGenerales.push(debe);
      haberGenerales.push(haber);
      
      result += `<tr class="">
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
  
  let debeGeneral = Money.calculateMoneySum(debeGenerales);
  let haberGeneral = Money.calculateMoneySum(haberGenerales);
  
  let footer = `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="">
                <td></td>
                <td><b>Resultados</td>
                <td><b>${debeGeneral.toString()}</b></td>
                <td><b>${haberGeneral.toString()}</b></td>
                <td><b>${saldoDeudor.toString()}</b></td>
                <td><b>${saldoAcreedor.toString()}</b></td>
                </tr>`;
                
  let finalRes = Money.calculateMoneySum([saldoDeudor, saldoAcreedor]);
  
  let cardFoot = `<p class="mb-0"><b>Pasivo: ${finalRes.toString()} </b></p>`;   
  
  document.getElementById("listaCuentasPasivo").innerHTML = result;
  document.getElementById("footerCuentasPasivo").innerHTML = footer;
  document.getElementById("cardFootPasivo").innerHTML = cardFoot;
  
  return finalRes;
}

function mostrarCapital(cuentas, utilidad){
  let result = `<tr>
                  <th scope="row"></th>
                  <td><b>CUENTA</b></td>
                  <td><b>DEUDOR</b></td>
                  <td><b>ACREEDOR</b></td>
                  <td><b>DEUDOR</b></td>
                  <td><b>ACREEDOR</b></td>
              </tr>`;
  let saldosAcreedores = [];
  let saldosDeudores = [];
  let debeGenerales = [];
  let haberGenerales = [];
  
  for(let cuenta of cuentas){
    let debe = cuenta.getDebe();
    let haber =  cuenta.getHaber();
    let saldo = cuenta.getSaldo();
    
    if(!cuenta.estaBalanceada()){
      debeGenerales.push(debe);
      haberGenerales.push(haber);
      
      result += `<tr class="">
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
  
  let debeGeneral = Money.calculateMoneySum(debeGenerales);
  let haberGeneral = Money.calculateMoneySum(haberGenerales);
  
  let footer = `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="">
                <td></td>
                <td><b>Resultados</td>
                <td><b>${debeGeneral.toString()}</b></td>
                <td><b>${haberGeneral.toString()}</b></td>
                <td><b>${saldoDeudor.toString()}</b></td>
                <td><b>${saldoAcreedor.toString()}</b></td>
                </tr>`;
                
  let finalRes = Money.calculateMoneySum([saldoDeudor, saldoAcreedor, utilidad]);
  let finalRes02 =Money.calculateMoneySum([saldoDeudor, saldoAcreedor]);
  
  let cardFoot = `<p class="mb-0"><b>Utilidad del ejercicio:  ${utilidad.toString()}</b></p>`;
  cardFoot += `<p class="mb-0"><b>Capital: ${finalRes02.toString()} + ${utilidad.toString()} = ${finalRes.toString()}</b></p>`;   
  
  document.getElementById("listaCuentasCapital").innerHTML = result;
  document.getElementById("footerCuentasCapital").innerHTML = footer;
  document.getElementById("cardFootCapital").innerHTML = cardFoot;
  
  return finalRes;
}

function mostrarResultados(act, cap, pas){
  let pascap = Money.calculateMoneySum([cap, pas]);
  
  let result = `<tr><td>Activo</td><td>${act.toString()}</td></tr>`;
  result += `<tr><td>Pasivo + Capital</td><td>${pascap.toString()}</td></tr>`;
  
  let lineStyle = (Number(act.amount) != Number(pascap.amount)) ? "line-error" : "line-success";
  let footer = `<tr class="${lineStyle}"><td>Cantidades Iguales</td><td></td></tr>`;
  
  let cardFoot = `<p class="mb-0"><b></b></p>`;   
  document.getElementById("listaResultados").innerHTML = result
  document.getElementById("footerResultados").innerHTML = footer;
  document.getElementById("cardFootResultados").innerHTML = cardFoot;
}
