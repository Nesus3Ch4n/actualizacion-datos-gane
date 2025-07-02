import requests
import json

def test_fecha_formato():
    """Probar que el formato de fechas funciona correctamente"""
    
    print("=== PRUEBA DE FORMATO DE FECHAS ===\n")
    
    # URL del endpoint
    url = "http://localhost:8080/api/USUARIO/11"
    
    # Datos de prueba con fecha en formato MM/DD/YYYY
    datos_con_fecha = {
        "nombre": "Juan Pérez",
        "cedula": 12345678,
        "correo": "juan.perez@test.com",
        "fechaNacimiento": "10/25/2001",  # Formato MM/DD/YYYY que debería ser convertido
        "estadoCivil": "Soltero",
        "tipoSangre": "O+",
        "activo": True,
        "version": 1
    }
    
    print("1. Probando con fecha en formato MM/DD/YYYY...")
    print(f"Datos a enviar: {json.dumps(datos_con_fecha, indent=2)}")
    
    try:
        response = requests.put(url, json=datos_con_fecha, headers={'Content-Type': 'application/json'})
        
        print(f"\nRespuesta del servidor:")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ ÉXITO: Fecha convertida correctamente")
            print(f"Respuesta: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ ERROR: No se pudo procesar la fecha")
            print(f"Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: No se pudo conectar al servidor")
        print("Asegúrate de que el backend esté ejecutándose en http://localhost:8080")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Probar con fecha en formato YYYY-MM-DD (formato correcto)
    print("\n2. Probando con fecha en formato YYYY-MM-DD...")
    
    datos_fecha_correcta = {
        "nombre": "María García",
        "cedula": 87654321,
        "correo": "maria.garcia@test.com",
        "fechaNacimiento": "2001-10-25",  # Formato YYYY-MM-DD (correcto)
        "estadoCivil": "Casada",
        "tipoSangre": "A+",
        "activo": True,
        "version": 1
    }
    
    print(f"Datos a enviar: {json.dumps(datos_fecha_correcta, indent=2)}")
    
    try:
        response = requests.put(url, json=datos_fecha_correcta, headers={'Content-Type': 'application/json'})
        
        print(f"\nRespuesta del servidor:")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ ÉXITO: Fecha en formato correcto procesada")
            print(f"Respuesta: {json.dumps(response.json(), indent=2)}")
        else:
            print("❌ ERROR: No se pudo procesar la fecha correcta")
            print(f"Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_fecha_formato() 