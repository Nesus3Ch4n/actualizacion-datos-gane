import requests
import json

def test_new_token():
    """Probar la autenticación JWT con el nuevo token generado"""
    
    print("=== PRUEBA CON NUEVO TOKEN JWT ===\n")
    
    # Token generado con la clave secreta correcta
    token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoidGVzdF9leHBlcmllbmNlX2RhdGEiLCJpYXQiOjE3NTE0ODkxOTIsImV4cCI6MTc1MTQ5Mjc5Mn0.I_gd1QqXA4NAcJGBnEzmWLbpsV6Th18GLjDpSirXHhd2WTumtc3PCLeE6dra7pDQW34jTD35yvgGDqMDhHAmKw"
    
    # Headers con el token
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
            print(f"   Usuario encontrado: {data.get('valid', False)}")
            if 'user' in data:
                user = data['user']
                print(f"   ID Usuario: {user.get('id', 'N/A')}")
                print(f"   Cédula: {user.get('cedula', 'N/A')}")
                print(f"   Nombre: {user.get('nombre', 'N/A')}")
        else:
            print("   ❌ Token inválido o error")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n2. Probando obtener usuario actual...")
    try:
        response = requests.get(f"{base_url}/auth/me", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            user = response.json()
            print("   ✅ Usuario obtenido correctamente")
            print(f"   ID: {user.get('id', 'N/A')}")
            print(f"   Cédula: {user.get('cedula', 'N/A')}")
            print(f"   Nombre: {user.get('nombre', 'N/A')}")
        else:
            print("   ❌ Error al obtener usuario")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n3. Probando endpoint protegido (USUARIO)...")
    try:
        response = requests.get(f"{base_url}/USUARIO", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Endpoint protegido accesible")
            data = response.json()
            print(f"   Usuarios encontrados: {len(data) if isinstance(data, list) else 'N/A'}")
        else:
            print("   ❌ Error en endpoint protegido")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_new_token() 