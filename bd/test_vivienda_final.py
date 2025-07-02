import sqlite3
import requests
import json
import time

def test_vivienda_final():
    """Prueba final de la tabla VIVIENDA y API"""
    
    print("=== PRUEBA FINAL DE VIVIENDA ===\n")
    
    # 1. Verificar estructura de la tabla
    print("1. Verificando estructura de la tabla VIVIENDA...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(VIVIENDA)')
    columns = cursor.fetchall()
    
    print("ESTRUCTURA ACTUAL:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
    
    # 2. Probar inserción directa en SQLite
    print("\n2. Probando inserción directa en SQLite...")
    
    test_data = (10, 'Casa', 'Calle 123 #45-67', 'Casa de 2 pisos', 'Centro', 'Bogotá', 'Propia', 'Banco XYZ', 2020, 'Compra')
    cursor.execute("""
        INSERT INTO VIVIENDA (ID_USUARIO, TIPO_VIVIENDA, DIRECCION, INFO_ADICIONAL, BARRIO, CIUDAD, VIVIENDA, ENTIDAD, ANIO, TIPO_ADQUISICION)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, test_data)
    
    # Verificar inserción
    cursor.execute("SELECT * FROM VIVIENDA WHERE ID_USUARIO = 10")
    result = cursor.fetchone()
    
    if result:
        print(f"  ✅ Inserción SQLite exitosa: ID={result[0]}, {result[2]} en {result[5]}")
    else:
        print("  ❌ Error en inserción SQLite")
    
    conn.commit()
    conn.close()
    
    # 3. Probar API del backend
    print("\n3. Probando API del backend...")
    
    # Esperar un poco para que el servidor esté listo
    time.sleep(2)
    
    url = "http://localhost:8080/api/formulario/vivienda/guardar"
    
    vivienda_data = {
        "tipoVivienda": "Apartamento",
        "direccion": "Carrera 78 #90-12",
        "infoAdicional": "Apartamento en 5to piso",
        "barrio": "Chapinero",
        "ciudad": "Bogotá",
        "vivienda": "Arrendada",
        "entidad": "Inmobiliaria ABC",
        "anio": 2019,
        "tipoAdquisicion": "Arriendo"
    }
    
    params = {"idUsuario": 10}
    
    try:
        print("   Enviando datos al backend...")
        response = requests.post(url, params=params, json=vivienda_data, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"   ✅ API exitosa: {response_data.get('message', 'Sin mensaje')}")
            
            if response_data.get('success'):
                print("   ✅ Vivienda guardada correctamente")
                
                # Probar obtener vivienda
                print("\n4. Probando obtener vivienda...")
                get_url = "http://localhost:8080/api/formulario/vivienda/obtener"
                get_response = requests.get(get_url, params=params)
                
                if get_response.status_code == 200:
                    get_data = get_response.json()
                    if get_data.get('success'):
                        vivienda = get_data.get('data', {})
                        print(f"   ✅ Vivienda obtenida: {vivienda.get('tipoVivienda')} en {vivienda.get('ciudad')}")
                        print(f"      Dirección: {vivienda.get('direccion')}")
                        print(f"      Barrio: {vivienda.get('barrio')}")
                        print(f"      Tipo: {vivienda.get('vivienda')}")
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
    cursor.execute("DELETE FROM VIVIENDA WHERE ID_USUARIO = 10")
    conn.commit()
    conn.close()
    print("   ✅ Datos de prueba eliminados")
    
    print("\n=== PRUEBA FINALIZADA ===")

if __name__ == "__main__":
    test_vivienda_final() 