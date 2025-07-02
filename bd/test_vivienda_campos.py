import sqlite3
import requests
import json
import time

def test_vivienda_campos():
    """Probar que los campos de vivienda se envían correctamente"""
    
    print("=== PRUEBA DE CAMPOS DE VIVIENDA ===\n")
    
    # 1. Verificar estructura de la tabla
    print("1. Verificando campos de la tabla VIVIENDA...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(VIVIENDA)')
    columns = cursor.fetchall()
    
    print("CAMPOS REALES DE LA TABLA:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    
    conn.close()
    
    # 2. Probar API con campos correctos
    print("\n2. Probando API con campos correctos...")
    
    # Esperar un poco para que el servidor esté listo
    time.sleep(2)
    
    url = "http://localhost:8080/api/formulario/vivienda/guardar"
    
    # Datos CORRECTOS que coinciden con la tabla
    vivienda_data_correcta = {
        "tipoVivienda": "Casa",
        "direccion": "CRA 50 # 50 - 50",
        "infoAdicional": "Casa de 2 pisos",
        "barrio": "Centro",
        "ciudad": "Bogotá",
        "vivienda": "Propia",
        "entidad": "Banco XYZ",
        "anio": 2020,
        "tipoAdquisicion": "Compra"
    }
    
    # Datos INCORRECTOS que estabas enviando antes
    vivienda_data_incorrecta = {
        "tipoVivienda": "Casa",
        "tenencia": "Alquilada",  # ❌ Campo incorrecto
        "direccion": "CRA 50 # 50 - 50",
        "ciudad": "50",
        "barrio": "50",
        "estrato": 1,  # ❌ Campo incorrecto
        "observaciones": "this"  # ❌ Campo incorrecto
    }
    
    params = {"idUsuario": 10}
    
    try:
        print("   Enviando datos CORRECTOS al backend...")
        print(f"   Datos: {json.dumps(vivienda_data_correcta, indent=2)}")
        
        response = requests.post(url, params=params, json=vivienda_data_correcta, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"   ✅ API exitosa: {response_data.get('message', 'Sin mensaje')}")
            
            if response_data.get('success'):
                print("   ✅ Vivienda guardada correctamente con campos correctos")
                
                # Verificar en base de datos
                print("\n3. Verificando datos en base de datos...")
                conn = sqlite3.connect('bd.db')
                cursor = conn.cursor()
                
                cursor.execute("SELECT * FROM VIVIENDA WHERE ID_USUARIO = 10 ORDER BY ID_VIVIENDA DESC LIMIT 1")
                result = cursor.fetchone()
                
                if result:
                    print("   ✅ Datos guardados en BD:")
                    print(f"      ID_VIVIENDA: {result[0]}")
                    print(f"      TIPO_VIVIENDA: {result[2]}")
                    print(f"      DIRECCION: {result[3]}")
                    print(f"      INFO_ADICIONAL: {result[4]}")
                    print(f"      BARRIO: {result[5]}")
                    print(f"      CIUDAD: {result[6]}")
                    print(f"      VIVIENDA: {result[7]}")
                    print(f"      ENTIDAD: {result[8]}")
                    print(f"      ANIO: {result[9]}")
                    print(f"      TIPO_ADQUISICION: {result[10]}")
                else:
                    print("   ❌ No se encontraron datos en BD")
                
                conn.close()
            else:
                print(f"   ❌ Error en la respuesta: {response_data.get('message')}")
        else:
            print(f"   ❌ Error HTTP: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Error: No se pudo conectar al servidor. Asegúrate de que esté corriendo.")
    except Exception as e:
        print(f"   ❌ Error inesperado: {e}")
    
    # 4. Limpiar datos de prueba
    print("\n4. Limpiando datos de prueba...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM VIVIENDA WHERE ID_USUARIO = 10")
    conn.commit()
    conn.close()
    print("   ✅ Datos de prueba eliminados")
    
    print("\n=== RESUMEN ===")
    print("✅ Campos correctos de la tabla VIVIENDA:")
    print("   - tipoVivienda")
    print("   - direccion") 
    print("   - infoAdicional")
    print("   - barrio")
    print("   - ciudad")
    print("   - vivienda")
    print("   - entidad")
    print("   - anio")
    print("   - tipoAdquisicion")
    print("\n❌ Campos incorrectos que NO existen:")
    print("   - tenencia (debe ser 'vivienda')")
    print("   - estrato (no existe en la tabla)")
    print("   - observaciones (debe ser 'infoAdicional')")

if __name__ == "__main__":
    test_vivienda_campos() 