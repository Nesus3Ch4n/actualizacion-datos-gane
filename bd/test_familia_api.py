import sqlite3
import requests
import json
import time

def test_familia_api():
    """Probar la API de personas a cargo con la tabla FAMILIA"""
    
    print("=== PRUEBA DE API FAMILIA ===\n")
    
    # 1. Verificar estructura de la tabla FAMILIA
    print("1. Verificando estructura de la tabla FAMILIA...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(FAMILIA)')
    columns = cursor.fetchall()
    
    print("ESTRUCTURA DE LA TABLA FAMILIA:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
    
    conn.close()
    
    # 2. Probar API con datos correctos
    print("\n2. Probando API con datos correctos...")
    
    # Esperar un poco para que el servidor esté listo
    time.sleep(2)
    
    url = "http://localhost:8080/api/personas-cargo/usuario/10"
    
    # Datos de prueba con formato de fecha correcto (YYYY-MM-DD)
    test_data = [
        {
            "nombre": "Juan Pérez",
            "parentesco": "Hijo",
            "edad": 15,
            "fechaNacimiento": "2010-05-15",  # Formato correcto YYYY-MM-DD
            "ocupacion": "Estudiante",
            "ingresos": 0,
            "observaciones": "Estudiante de secundaria"
        },
        {
            "nombre": "María Pérez",
            "parentesco": "Hija", 
            "edad": 12,
            "fechaNacimiento": "2013-08-22",  # Formato correcto YYYY-MM-DD
            "ocupacion": "Estudiante",
            "ingresos": 0,
            "observaciones": "Estudiante de primaria"
        }
    ]
    
    try:
        print(f"Enviando POST a: {url}")
        print(f"Datos: {json.dumps(test_data, indent=2)}")
        
        response = requests.post(url, json=test_data, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"\nRespuesta del servidor:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ ÉXITO: Datos guardados correctamente")
            print(f"Respuesta: {response.text}")
        else:
            print("❌ ERROR: No se pudieron guardar los datos")
            print(f"Error: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se pudo conectar al servidor")
        print("Asegúrate de que el backend esté ejecutándose en http://localhost:8080")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # 3. Verificar datos en la base de datos
    print("\n3. Verificando datos en la base de datos...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM FAMILIA WHERE ID_USUARIO = 10")
    results = cursor.fetchall()
    
    if results:
        print(f"✅ Se encontraron {len(results)} registros para el usuario 10:")
        for row in results:
            print(f"  ID: {row[0]}, Nombre: {row[1]}, Parentesco: {row[2]}, Fecha: {row[3]}, Edad: {row[4]}")
    else:
        print("❌ No se encontraron registros para el usuario 10")
    
    conn.close()

if __name__ == "__main__":
    test_familia_api() 