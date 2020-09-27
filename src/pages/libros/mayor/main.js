import { Storage } from '../../../storage/Storage.js';
import { LibroMayor } from '../../../clases/LibroMayor.js';

let store = Storage.getInstance('empresa1');

let res = store.getObject().getLibroDiario().mayorizar();
if(res.correcto){
  let libro = new LibroMayor(res.data);
  console.log(libro.getCuentas());
}
