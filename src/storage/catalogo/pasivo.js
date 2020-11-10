let pasivo = {
  'codigo': '2',
  'titular': 'PASIVO',
  'subcuentas': [
    {
      'codigo': '21',
      'titular': 'PASIVOS CORRIENTES',
      'subcuentas': [     
        {
          'codigo': '2101',
          'titular': 'SOBREGIROS BANCARIOS',
          'subcuentas': []
        },
        {
          'codigo': '2102',
          'titular': 'PROVEEDORES',
          'subcuentas': [
            {
              'codigo': '210201',
              'titular': 'Locales',
              'subcuentas': []
            },
            {
              'codigo': '210202',
              'titular': 'Extranjeros',
              'subcuentas': []
            },
            {
              'codigo': '210203',
              'titular': 'Proveedores',
              'subcuentas': []
            }
          ]
        },
        {               
          'codigo': '2103',
          'titular': 'DOCUMENTOS POR COBRAR DESCONTADOS',
          'subcuentas': [
            {
              'codigo': '210301',
              'titular': 'Pagares',
              'subcuentas': []
            },
            {
              'codigo': '210302',
              'titular': 'Letras de cambio',
              'subcuentas': []
            },
            {
              'codigo': '210303',
              'titular': 'Bonos',
              'subcuentas': []
            },
            {
              'codigo': '210304',
              'titular': 'Otros títulos valores',
              'subcuentas': []
            }
          ]
        },
        { 
          'codigo': '2104',
          'titular': 'DOCUMENTOS POR PAGAR',
          'subcuentas': [
            {
              'codigo': '210401',
              'titular': 'Pagares',
              'subcuentas': []
            },
            {
              'codigo': '210402',
              'titular': 'Letras de cambio',
              'subcuentas': []
            },
            {
              'codigo': '210403',
              'titular': 'Bonos',
              'subcuentas': []
            },
            {
              'codigo': '210404',
              'titular': 'Otros títulos valores',
              'subcuentas': []
            }
          ]
        },
        {                
          'codigo': '2105',
          'titular': 'PRESTAMOS POR PAGAR',
          'subcuentas': [
            {
              'codigo': '210501',
              'titular': 'Bancarios',
              'subcuentas': []
            },
            {
              'codigo': '210502',
              'titular': 'Accionistas',
              'subcuentas': []
            },
            {
              'codigo': '210503',
              'titular': 'Otros',
              'subcuentas': []
            }
          ]
        },
        {                                    
          'codigo': '2106',
          'titular': 'RETENCIONES POR PAGAR',
          'subcuentas': [
            {
              'codigo': '210601',
              'titular': 'ISSS (salud)',
              'subcuentas': []
            },
            {
              'codigo': '210602',
              'titular': 'ISSS (pensión)',
              'subcuentas': []
            },
            {
              'codigo': '210603',
              'titular': 'AFP',
              'subcuentas': []
            },
            {
              'codigo': '210604',
              'titular': 'RENTA',
              'subcuentas': []
            },
            {
              'codigo': '210605',
              'titular': 'IVA',
              'subcuentas': []
            },
          ]
        },
        {                                    
          'codigo': '2107',
          'titular': 'PROVISIONES POR PAGAR',
          'subcuentas': [
            {
              'codigo': '210701',
              'titular': 'ISSS (salud)',
              'subcuentas': []
            },
            {
              'codigo': '210702',
              'titular': 'ISSS (pensión)',
              'subcuentas': []
            },
            {
              'codigo': '210703',
              'titular': 'AFP',
              'subcuentas': []
            },
            {
              'codigo': '210704',
              'titular': 'INSAFORP',
              'subcuentas': []
            },
            {
              'codigo': '210705',
              'titular': 'Pago a Cuenta',
              'subcuentas': []
            },
          ]
        },
        {                                
          'codigo': '2108',
          'titular': 'DIVIDENDOS POR PAGAR',
          'subcuentas': []
        },
        {                                    
          'codigo': '2109',
          'titular': 'IVA DEBITO FISCAL',
          'subcuentas': []
        },
        {                                    
          'codigo': '2110',
          'titular': 'IVA PERCIBIDO Y RETENIDO POR PAGAR',
          'subcuentas': [
            {
              'codigo': '211001',
              'titular': 'IVA Percibido',
              'subcuentas': []
            },
            {
              'codigo': '211002',
              'titular': 'IVA Retenido',
              'subcuentas': []
            }
          ]
        },
        {                                 
          'codigo': '2111',
          'titular': 'IMPUESTO POR PAGAR',
          'subcuentas': [
            {
              'codigo': '211101',
              'titular': 'Pago a Cuenta',
              'subcuentas': []
            },
            {
              'codigo': '211102',
              'titular': 'RENTA',
              'subcuentas': []
            },
            {
              'codigo': '211103',
              'titular': 'IVA',
              'subcuentas': []
            },
            {
              'codigo': '211104',
              'titular': 'Otros',
              'subcuentas': []
            }
          ]
        },
        {                                              
          'codigo': '2112',
          'titular': 'CUENTAS POR PAGAR',
          'subcuentas': []
        },
        {                                 
          'codigo': '2113',
          'titular': 'INTERESES POR PAGAR',
          'subcuentas': []
        }
      ]
    },
    {
      'codigo': '22',
      'titular': 'PASIVOS NO CORRIENTES',
      'subcuentas': [
        {  
          'codigo': '2201',
          'titular': 'PRESTAMOS POR PAGAR',
          'subcuentas': []
        },
        {
          'codigo': '2202',
          'titular': 'DOCUMENTOS POR PAGAR',
          'subcuentas': []
        },
        { 
          'codigo': '2203',
          'titular': 'INGRESOS DIFERIDOS',
          'subcuentas': []
        },
        { 
          'codigo': '2204',
          'titular': 'PROVISION PARA OBLIGACIONES LABORALES',
          'subcuentas': []
        },
        {
          'codigo': '2205',
          'titular': 'PASIVO POR IMPUESTO DE RENTA DIFERIDO',
          'subcuentas': []
        }
      ]
    }
  ]
};
  
export { pasivo };