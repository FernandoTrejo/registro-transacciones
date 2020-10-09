function buscar(codigo, catalogo){
    if(catalogo.length > 0){
      for(let cuenta of catalogo){
        let res = search(codigo, cuenta);
        console.log(res);
        if(res.found){
          return res.cuenta;
        }
      }
    }
  
    return null;
  }

  function search(codigo, cuentaRaiz){
    console.log(codigo, cuentaRaiz.codigo)
    
    if(cuentaRaiz.codigo.trim() == codigo.trim()){
      return {'found': true, 'cuenta': cuentaRaiz};
    }else if(cuentaRaiz.subcuentas.length > 0){
      console.log("subcuentas",cuentaRaiz.subcuentas)
      for(let subcuenta of cuentaRaiz.subcuentas){
         let response = search(codigo, subcuenta);
         if(response.found){
           return response;
         }
      }
    }
    
    return {'found': false, 'cuenta': null};
  }
  
  
  
  
  function hallarSubcuentas(cuentas, codigoMadre){
    if(cuentas.length > 0){
      let subcuentas = [];
      for(let cuenta of cuentas){
        let codigo = cuenta[0].trim();
        if(codigo.substr(0, codigoMadre.length) == codigoMadre && codigo.length > codigoMadre.length){
          if(buscar(codigo, subcuentas) == null){
            let obj = {
              "codigo": codigo,
              "titular": cuenta[1].trim(),
              "subcuentas": hallarSubcuentas(cuentas, codigo)
            }
            subcuentas.push(obj);
          }
        }
      }
      return subcuentas;
    }
    
    return [];
  }

onmessage = function(event) {
  let res = {'catalogo': [], 'valid': false, 'percentage': 0};
  let data = [];
  let results = event.data;
  
  if(results.length > 0){
    let i = -1;
    for(let row of results){
      i++;
      if(i==0) continue;
      
      if(row.length == 2){
        data.push([row[0],row[1]]);
      }
    }
    
    let catalogo = [];
    let ind = 0;
    let percentage = 0;
    let totalElements = data.length;
    
    for(let c of data){
      let codigo = c[0].trim();
      let nombre = c[1].trim();
      console.log(c)
      if(buscar(codigo, catalogo) == null){
        let obj = {
          "codigo": codigo,
          "titular": nombre,
          "subcuentas": hallarSubcuentas(data,codigo)
        };
        catalogo.push(obj);
      }
      ind++;
      percentage = Number((Number(ind) * 100) / totalElements).toFixed(2);
      res.percentage = percentage;
      postMessage(res);
    }
    
    res.catalogo = catalogo;
    res.valid = true;
    postMessage(res);
  }
 };
 
