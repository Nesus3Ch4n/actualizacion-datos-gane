import sqlite3
import requests
import json
import time

def test_declaracion_conflicto_api():
    """Probar la API de declaraciones de conflicto con la tabla RELACION_CONF"""
    
    print("=== PRUEBA DE API DECLARACIONES DE CONFLICTO ===\n")
    
    # 1. Verificar estructura de la tabla RELACION_CONF
    print("1. Verificando estructura de la tabla RELACION_CONF...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(RELACION_CONF)')
    columns = cursor.fetchall()
    
    print("ESTRUCTURA DE LA TABLA RELACION_CONF:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
    
    conn.close()
    
    # 2. Probar API con datos correctos
    print("\n2. Probando API con datos correctos...")
    
    # Esperar un poco para que el servidor esté listo
    time.sleep(2)
    
    url = "http://localhost:8080/api/declaraciones-conflicto/usuario/10"
    
    # Datos de prueba que coinciden con la tabla RELACION_CONF
    declaraciones_data = [
        {
            "nombre": "Juan Pérez",
            "parentesco": "Padre",
            "tipoParteInteresada": "Demandante"
        },
        {
            "nombre": "María García",
            "parentesco": "Hermana",
            "tipoParteInteresada": "Demandado"
        }
    ]
    
    try:
        print(f"Enviando POST a: {url}")
        print(f"Datos: {json.dumps(declaraciones_data, indent=2)}")
        
        response = requests.post(url, json=declaraciones_data, headers={'Content-Type': 'application/json'})
        
        print(f"\nRespuesta del servidor:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ ÉXITO: Declaraciones guardadas correctamente")
            print(f"Respuesta: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ ERROR: No se pudieron guardar las declaraciones")
            print(f"Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se pudo conectar al servidor")
        print("Asegúrate de que el backend esté ejecutándose en http://localhost:8080")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # 3. Probar GET para obtener declaraciones
    print("\n3. Probando GET para obtener declaraciones...")
    
    try:
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            declaraciones = response.json()
            print("✅ ÉXITO: Declaraciones obtenidas correctamente")
            print(f"Declaraciones: {json.dumps(declaraciones, indent=2)}")
        else:
            print("❌ ERROR: No se pudieron obtener las declaraciones")
            print(f"Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_declaracion_conflicto_api() 