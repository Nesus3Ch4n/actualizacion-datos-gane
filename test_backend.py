import requests
import json

def test_backend():
    """Probar si el backend está funcionando"""
    
    print("=== PRUEBA DEL BACKEND ===\n")
    
    base_url = "http://localhost:8080/api"
    
    print("1. Probando endpoint de salud...")
    try:
        response = requests.get(f"{base_url}/auth/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Backend funcionando")
            print(f"   📝 Respuesta: {response.json()}")
        else:
            print(f"   ❌ Error: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n2. Probando crear usuario...")
    try:
        test_data = {
            "nombre": "TEST USER",
            "cedula": "999999999",
            "correo": "test@test.com"
        }
        
        response = requests.post(f"{base_url}/USUARIO/test/crear-usuario", 
                               json=test_data,
                               headers={'Content-Type': 'application/json'})
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("   ✅ Usuario creado exitosamente")
            print(f"   📝 Respuesta: {data.get('message', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_backend() 