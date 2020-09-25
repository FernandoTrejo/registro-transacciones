let capital = {
  'codigo': '3',
  'titular': 'CAPITAL',
  'subcuentas': [
    {
      'codigo': '31',
      'titular': 'CAPITAL CONTABLE',
      'subcuentas': [                   
        {
          'codigo': '3101',
          'titular': 'CAPITAL SOCIAL',
          'subcuentas': []
        }, 
        {
          'codigo': '3102',
          'titular': 'RESERVA LEGAL',
          'subcuentas': []
        }, 
        {
          'codigo': '3103',
          'titular': 'UTILIDADES RETENIDAS',
          'subcuentas': []
        }, 
        {
          'codigo': '3104',
          'titular': 'UTILIDAD DEL EJERCICIO',
          'subcuentas': []
        }, 
        {   
          'codigo': '3105',
          'titular': 'R PÉRDIDAS',
          'subcuentas': [
            {
              'codigo': '310501',
              'titular': 'R Pérdidas acumuladas',
              'subcuentas': []
            },
            {
              'codigo': '310502',
              'titular': 'R Pérdidas del presente ejercicio',
              'subcuentas': []
            }
          ]
        } 
      ]
    }
  ]
};
  
export { capital };