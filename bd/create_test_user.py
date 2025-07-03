import requests
import json

def create_test_user():
    """Crear un usuario de prueba en la base de datos"""
    
    print("=== CREANDO USUARIO DE PRUEBA ===\n")
    
    # Datos del usuario de prueba
    user_data = {
        "nombre": "JESUS FELIPE CORDOBA ECHANDIA",
        "cedula": 1006101211,
        "correo": "jesus.cordoba@test.com",
        "telefono": "3001234567",
        "direccion": "Calle Test 123",
        "ciudad": "Bogotá",
        "departamento": "Cundinamarca",
        "pais": "Colombia",
        "fechaNacimiento": "1990-01-01",
        "estadoCivil": "Soltero",
        "genero": "Masculino",
        "tipoSangre": "O+",
        "eps": "EPS Test",
        "arl": "ARL Test",
        "fondoPension": "Fondo Test",
        "cajaCompensacion": "Caja Test",
        "activo": True,
        "version": 1
    }
    
    base_url = "http://localhost:8080/api"
    
    print("1. Creando usuario de prueba...")
    try:
        response = requests.post(f"{base_url}/USUARIO/test/crear-usuario", json=user_data, headers={'Content-Type': 'application/json'})
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200 or response.status_code == 201:
            print("   ✅ Usuario creado exitosamente")
            result = response.json()
            if 'data' in result:
                user = result['data']
                print(f"   ID: {user.get('id', 'N/A')}")
                print(f"   Cédula: {user.get('cedula', 'N/A')}")
                print(f"   Nombre: {user.get('nombre', 'N/A')}")
        else:
            print("   ❌ Error al crear usuario")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n2. Verificando que el usuario existe...")
    try:
        response = requests.get(f"{base_url}/USUARIO/test/cedula/1006101211")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if 'data' in result:
                user = result['data']
                print("   ✅ Usuario encontrado")
                print(f"   ID: {user.get('id', 'N/A')}")
                print(f"   Cédula: {user.get('cedula', 'N/A')}")
                print(f"   Nombre: {user.get('nombre', 'N/A')}")
        else:
            print("   ❌ Usuario no encontrado")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    create_test_user() 