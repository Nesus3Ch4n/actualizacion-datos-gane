import requests
import json

def test_auth():
    """Probar autenticación con el token simulado"""
    
    print("=== PRUEBA DE AUTENTICACIÓN ===\n")
    
    # Token simulado (nuevo y válido con clave secreta correcta)
    token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPVkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNpYSI6InRlc3RfZXhwZXJpZW5jZV9kYXRhIiwiaWF0IjoxNzUxNTU5MjQwLCJleHAiOjE3NTE1NjI4NDB9._nqtG2rYOLYoGYTap5jhGRStGc5xjFvoii0dhKHFO-EsbzOKIjRhuAGqAy8kJmcvy2kZZaaVd3jQ-57tKEbRRQ"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    base_url = "http://localhost:8080/api"
    
    print("1. Probando validación de token...")
    try:
        response = requests.post(f"{base_url}/auth/validate", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Token válido")
            if data.get('valid'):
                print("   ✅ Usuario encontrado en la base de datos")
                if 'user' in data:
                    user = data['user']
                    print(f"   👤 Usuario: {user.get('nombre', 'N/A')} (ID: {user.get('id', 'N/A')})")
            else:
                print("   ❌ Usuario no encontrado")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n2. Probando endpoint protegido...")
    try:
        response = requests.get(f"{base_url}/USUARIO/cedula/1006101211", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Endpoint protegido funciona")
            print(f"   👤 Usuario: {data.get('data', {}).get('nombre', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n3. Probando guardado de datos...")
    try:
        test_data = {
            "nombre": "JESUS FELIPE CORDOVA ECHANDIA",
            "cedula": "1006101211",
            "correo": "jesus.felipe@example.com"
        }
        
        response = requests.post(f"{base_url}/formulario/informacion-personal/guardar", 
                               headers=headers, 
                               json=test_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Datos guardados exitosamente")
            print(f"   📝 Respuesta: {data.get('message', 'N/A')}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_auth() 