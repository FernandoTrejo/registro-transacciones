 let activo = {
  'codigo': '1',
  'titular': 'ACTIVO',
  'subcuentas': [
    {
      'codigo': '11',
      'titular': 'ACTIVO CORRIENTE',
      'subcuentas': [
        {
          'codigo': '1101',         
          'titular': 'EFECTIVO Y EQUIVALENTES DE EFECTIVO',
          'subcuentas': [
            {
              'codigo': '110101',
              'titular': 'Caja general',
              'subcuentas': []
            },
            {
              'codigo': '11010102',
              'titular': 'Caja chica',
              'subcuentas': []
            },
            {
              'codigo': '11010103',
              'titular': 'Bancos',
              'subcuentas': []
            },
            {
              'codigo': '1101010301',
              'titular': 'Cuenta corriente',
              'subcuentas': []
            },
            {
              'codigo': '1101010302',
              'titular': 'Cuenta de ahorro',
              'subcuentas': []
            },
            {
              'codigo': '1101010304',
              'titular': 'Depósitos a plazo',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1102',
          'titular': 'INVERSIONES A CORTO PLAZO',
          'subcuentas': [
            {
              'codigo': '110201',
              'titular': 'Acciones',
              'subcuentas': []
            },
            {
              'codigo': '110202',
              'titular': 'Bonos',
              'subcuentas': []
            },
            {
              'codigo': '110203',
              'titular': 'Otros títulos valores',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1103',
          'titular': 'CUENTAS POR COBRAR',
          'subcuentas': [
            {
              'codigo': '110301',
              'titular': 'Clientes',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1104',
          'titular': 'DOCUMENTOS POR COBRAR',
          'subcuentas': []
        },
        {
          'codigo': '1105',
          'titular': 'ACCIONISTAS',
          'subcuentas': []
        },
        {
          'codigo': '1106',
          'titular': 'PRESTAMOS A EMPLEADOS Y ACCIONISTAS',
          'subcuentas': [
            {
              'codigo': '110601',
              'titular': 'Accionistas',
              'subcuentas': []
            },
            {
              'codigo': '110602',
              'titular': 'Empleados',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1107',
          'titular': 'OTRAS CUENTAS POR COBRAR',
          'subcuentas': [
            {
              'codigo': '110701',
              'titular': 'Anticipos a proveedores',
              'subcuentas': []
            },
            {
              'codigo': '110702',
              'titular': 'Anticipos de salarios a empleados',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1108',
          'titular': 'ESTIMACION POR CUENTAS INCOBRABLES',
          'subcuentas': []
        },
        {
          'codigo': '1109',
          'titular': 'INVENTARIOS',
          'subcuentas': []
        },
        {
          'codigo': '1110',
          'titular': 'ESTIMACION PARA DETERIORO DE INVENTARIO',
          'subcuentas': []
        },
        {
          'codigo': '1111',
          'titular': 'GASTOS PAGADOS POR ANTICIPADOS',
          'subcuentas': [
            {
              'codigo': '111101',
              'titular': 'Seguros',
              'subcuentas': []
            },
            {
              'codigo': '111102',
              'titular': 'Alquileres',
              'subcuentas': []
            },
            {
              'codigo': '111103',
              'titular': 'Papelería y útiles',
              'subcuentas': []
            },
            {
              'codigo': '111104',
              'titular': 'Pago a cuenta',
              'subcuentas': []
            },
            {
              'codigo': '111105',
              'titular': 'Otros gastos pagados por anticipados',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1112',
          'titular': 'IVA CREDITO FISCAL',
          'subcuentas': []
        },
        {
          'codigo': '1113',
          'titular': 'IVA PAGADO POR ANTICIPADO',
          'subcuentas': [
            {
              'codigo': '111301',
              'titular': 'IVA Percibido',
              'subcuentas': []
            },
            {
              'codigo': '111302',
              'titular': 'IVA Retenido',
              'subcuentas': []
            }
          ]
        },
        {             
          'codigo': '1114',
          'titular': 'PAGO A CUENTA',
          'subcuentas': []
        }
      ]
    },
    {
      'codigo': '12',
      'titular': 'ACTIVOS NO CORRIENTES',
      'subcuentas': [
        {
          'codigo': '1201',
          'titular': 'PROPIEDAD PLANTA Y EQUIPO',
          'subcuentas': [               
            {
              'codigo': '120101',
              'titular': 'Terrenos',
              'subcuentas': []
            },
            {
              'codigo': '120102',
              'titular': 'Edificios',
              'subcuentas': []
            },
            {
              'codigo': '120103',
              'titular': 'Instalaciones',
              'subcuentas': []
            },
            {
              'codigo': '120104',
              'titular': 'Equipo de reparto',
              'subcuentas': []
            },
            {
              'codigo': '120105',
              'titular': 'Mobiliario y equipo',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1202',
          'titular': 'DEPRECIACIONES',
          'subcuentas': [       
            {
              'codigo': '120201',
              'titular': 'Edificio',
              'subcuentas': []
            },
            {
              'codigo': '120202',
              'titular': 'Instalaciones',
              'subcuentas': []
            },
            {
              'codigo': '120203',
              'titular': 'Equipo de reparto',
              'subcuentas': []
            },
            {
              'codigo': '120204',
              'titular': 'Mobiliario y equipo',
              'subcuentas': []
            },            
          ]
        },
        {
          'codigo': '1203',
          'titular': 'INTANGIBLES',
          'subcuentas': [         
            {
              'codigo': '120301',
              'titular': 'Crédito mercantil',
              'subcuentas': []
            },
            {
              'codigo': '120302',
              'titular': 'Patentes y marcas',
              'subcuentas': []
            },
            {
              'codigo': '120303',
              'titular': 'Licencias',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1204',
          'titular': 'AMORTIZACION DE INTANGIBLES',
          'subcuentas': [
            {
              'codigo': '120401',
              'titular': 'Crédito mercantil',
              'subcuentas': []
            },
            {
              'codigo': '120402',
              'titular': 'Patentes y marcas',
              'subcuentas': []
            },
            {
              'codigo': '120403',
              'titular': 'Licencias',
              'subcuentas': []
            }
          ]
        },
        {
          'codigo': '1205',
          'titular': 'INVERSIONES PERMANENTES',
          'subcuentas': []
        },
        {             
          'codigo': '1206',
          'titular': 'IMPUESTO SOBRE LA RENTA DIFERIDO',
          'subcuentas': []
        }
      ]
    }
  ]
};
  
export { activo };