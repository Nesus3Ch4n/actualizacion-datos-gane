import sqlite3
import requests
import json
import time

def test_contacto_api():
    """Probar la API de contactos de emergencia con la tabla CONTACTO"""
    
    print("=== PRUEBA DE API CONTACTO ===\n")
    
    # 1. Verificar estructura de la tabla CONTACTO
    print("1. Verificando estructura de la tabla CONTACTO...")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(CONTACTO)')
    columns = cursor.fetchall()
    
    print("ESTRUCTURA DE LA TABLA CONTACTO:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
    
    conn.close()
    
    # 2. Probar API con datos correctos
    print("\n2. Probando API con datos correctos...")
    
    # Esperar un poco para que el servidor esté listo
    time.sleep(2)
    
    url = "http://localhost:8080/api/contactos-emergencia/usuario/10"
    
    # Datos de prueba que coinciden con la tabla CONTACTO
    contactos_data = [
        {
            "nombre": "Juan Pérez",
            "parentesco": "Padre",
            "telefono": "3001234567"
        },
        {
            "nombre": "María García",
            "parentesco": "Madre", 
            "telefono": "3109876543"
        }
    ]
    
    try:
        print(f"Enviando POST a: {url}")
        print(f"Datos: {json.dumps(contactos_data, indent=2)}")
        
        response = requests.post(url, json=contactos_data, headers={'Content-Type': 'application/json'})
        
        print(f"\nRespuesta del servidor:")
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("✅ ÉXITO: Contactos guardados correctamente")
            print(f"Respuesta: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ ERROR: No se pudieron guardar los contactos")
            print(f"Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se pudo conectar al servidor")
        print("Asegúrate de que el backend esté ejecutándose en http://localhost:8080")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # 3. Probar GET para obtener contactos
    print("\n3. Probando GET para obtener contactos...")
    
    try:
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            contactos = response.json()
            print("✅ ÉXITO: Contactos obtenidos correctamente")
            print(f"Contactos: {json.dumps(contactos, indent=2)}")
        else:
            print("❌ ERROR: No se pudieron obtener los contactos")
            print(f"Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_contacto_api() 