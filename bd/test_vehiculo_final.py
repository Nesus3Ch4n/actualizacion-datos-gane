import sqlite3
import requests
import json
import time

def test_vehiculo_final():
    """Prueba final de la tabla VEHICULO y API"""
    
    print("=== PRUEBA FINAL DE VEHÍCULOS ===\n")
    
    # 1. Verificar estructura de la tabla
    print("1. Verificando estructura de la tabla VEHICULO...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(VEHICULO)')
    columns = cursor.fetchall()
    
    print("ESTRUCTURA ACTUAL:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
    
    # 2. Probar inserción directa en SQLite
    print("\n2. Probando inserción directa en SQLite...")
    
    test_data = (10, 'Automovil', 'Toyota', 'ABC123', 2020, 'Juan Pérez')
    cursor.execute("""
        INSERT INTO VEHICULO (ID_USUARIO, TIPO_VEHICULO, MARCA, PLACA, ANIO, PROPIETARIO)
        VALUES (?, ?, ?, ?, ?, ?)
    """, test_data)
    
    # Verificar inserción
    cursor.execute("SELECT * FROM VEHICULO WHERE ID_USUARIO = 10")
    result = cursor.fetchone()
    
    if result:
        print(f"  ✅ Inserción SQLite exitosa: ID={result[0]}, {result[3]} - {result[4]}")
    else:
        print("  ❌ Error en inserción SQLite")
    
    conn.commit()
    conn.close()
    
    # 3. Probar API del backend
    print("\n3. Probando API del backend...")
    
    # Esperar un poco para que el servidor esté listo
    time.sleep(2)
    
    url = "http://localhost:8080/api/formulario/vehiculo/guardar"
    
    vehiculos_data = [
        {
            "tipoVehiculo": "Motocicleta",
            "marca": "Honda",
            "placa": "XYZ789",
            "anio": 2019,
            "propietario": "María García"
        },
        {
            "tipoVehiculo": "Camioneta",
            "marca": "Ford",
            "placa": "DEF456",
            "anio": 2021,
            "propietario": "Carlos López"
        }
    ]
    
    params = {"idUsuario": 10}
    
    try:
        print("   Enviando datos al backend...")
        response = requests.post(url, params=params, json=vehiculos_data, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"   ✅ API exitosa: {response_data.get('message', 'Sin mensaje')}")
            
            if response_data.get('success'):
                print("   ✅ Vehículos guardados correctamente")
                
                # Probar obtener vehículos
                print("\n4. Probando obtener vehículos...")
                get_url = "http://localhost:8080/api/formulario/vehiculo/obtener"
                get_response = requests.get(get_url, params=params)
                
                if get_response.status_code == 200:
                    get_data = get_response.json()
                    if get_data.get('success'):
                        vehiculos = get_data.get('data', [])
                        print(f"   ✅ Vehículos obtenidos: {len(vehiculos)} registros")
                        for i, vehiculo in enumerate(vehiculos):
                            print(f"     {i+1}. {vehiculo.get('marca')} - {vehiculo.get('placa')} ({vehiculo.get('tipoVehiculo')})")
                    else:
                        print(f"   ❌ Error al obtener: {get_data.get('message')}")
                else:
                    print(f"   ❌ Error HTTP al obtener: {get_response.status_code}")
            else:
                print(f"   ❌ Error en la respuesta: {response_data.get('message')}")
        else:
            print(f"   ❌ Error HTTP: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Error: No se pudo conectar al servidor. Asegúrate de que esté corriendo.")
    except Exception as e:
        print(f"   ❌ Error inesperado: {e}")
    
    # 5. Limpiar datos de prueba
    print("\n5. Limpiando datos de prueba...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM VEHICULO WHERE ID_USUARIO = 10")
    conn.commit()
    conn.close()
    print("   ✅ Datos de prueba eliminados")
    
    print("\n=== PRUEBA FINALIZADA ===")

if __name__ == "__main__":
    test_vehiculo_final() 