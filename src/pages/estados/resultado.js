import { Storage } from '../../storage/Storage.js';
import { LibroMayor } from '../../clases/LibroMayor.js';
import { Money } from '../../clases/Money.js';
import { Catalogo } from '../../clases/Catalogo.js';



let session = Storage.getSessionData();
let store = null;
let divs = ['divEstado','mensaje'];
let ingresos = new Money(0);
let egresos = new Money(0);
let codigos = {
  'ingresos': '5',
  'egresos': '4'
};

mostrarEstado();

function mostrarEstado(){
  store = Storage.getInstance(session.getObject().empresa);
  agregarNombreEmpresa(store.getObject().getConfig().empresa.nombreComercial);

  let hayAsientos = false;
  let res = store.getObject().getLibroDiario().mayorizar();
  let cuentasIngresos = [];
  let cuentasEgresos = [];
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
    }

  }
  //agregar html al div
  if(hayAsientos){
    document.getElementById("txtNombreEmpresa").innerText = "Estado de Resultados: " + store.getObject().getConfig().empresa.nombreComercial;
    hidDivsExcept(divs, ['divEstado']);
    mostrarIngresos(cuentasIngresos);
    mostrarEgresos(cuentasEgresos);
    mostrarResultados();
  }else{
    hidDivsExcept(divs, ['mensaje']);
  }
}

function mostrarIngresos(cuentas){
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
  ingresos = finalRes;
  let cardFoot = `<p class="mb-0"><b>Ingresos: ${finalRes.toString()} </b></p>`;           
  document.getElementById("listaCuentasIngresos").innerHTML = result;
  document.getElementById("footerCuentasIngresos").innerHTML = footer;
  document.getElementById("cardFootIngresos").innerHTML = cardFoot;
}

function mostrarEgresos(cuentas){
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
  egresos = finalRes;
  let cardFoot = `<p class="mb-0"><b>Egresos: ${finalRes.toString()} </b></p>`;   
  
  document.getElementById("listaCuentasEgresos").innerHTML = result;
  document.getElementById("footerCuentasEgresos").innerHTML = footer;
  document.getElementById("cardFootEgresos").innerHTML = cardFoot;
}

function mostrarResultados(){
  let ing = new Money(Math.abs(ingresos.amount));
  let eg = new Money(egresos.amount * -1);
  let result = `<tr><td>Ingresos</td><td>${ing.toString()}</td></tr>`;
  result += `<tr><td>Egresos (costos/gastos)</td><td>${eg.toString()}</td></tr>`;
  
  let utilidad = Money.calculateMoneySum([ing, eg]);
  let lineStyle = (Number(utilidad.amount) <= 0) ? "line-error" : "line-success";
  let footer = `<tr class="${lineStyle}"><td>Utilidad del Ejercicio</td><td>${utilidad.toString()}</td></tr>`;
  
  let cardFoot = `<p class="mb-0"><b>Utilidad: ${utilidad.toString()} </b></p>`;   
  document.getElementById("listaResultados").innerHTML = result
  document.getElementById("footerResultados").innerHTML = footer;
  document.getElementById("cardFootResultados").innerHTML = cardFoot;
}

document.getElementById('getPDF').addEventListener("click", function(){
  alert('Su documento se está procesando, tenga paciencia, este proceso puede tardar años. Ja! Perdón, aún no funciona ;c');
});
/*
document.getElementById("getPDF").addEventListener("click", getPDF);

function getPDF() {
  var doc = new jsPDF();
 //console.log(doc)
  // We'll make our own renderer to skip this editor
  var specialElementHandlers = {
    '#getPDF': function(element, renderer){
      return true;
    },
    '.controls': function(element, renderer){
      return true;
    }
  };

  // All units are in the set measurement for the document
  // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
  doc.fromHTML(document.getElementById('divEstado'), 15, 15, {
    'width': 170, 
    'elementHandlers': specialElementHandlers
  });

  doc.save('Generated.pdf');
}
*/