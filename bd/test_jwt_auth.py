import requests
import json

def test_jwt_authentication():
    """Probar la autenticación JWT con el token real de la plataforma PAU"""
    
    print("=== PRUEBA DE AUTENTICACIÓN JWT ===\n")
    
    # Token real de la plataforma PAU
    token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXRoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNDg4MTI5LCJleHAiOjE3NTE0OTE0Mjl9.4Drc1fZ99F1I4djrg_j3O8W5G2HHmdg8O7RGpUaif_uIlecMpR1yKWaDpphskFDvEFz8Y978vmArO17djL1CNA"
    
    # Headers con el token
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    base_url = "http://localhost:8080/api"
    
    print("1. Probando endpoint de salud (sin autenticación)...")
    try:
        response = requests.get(f"{base_url}/auth/health")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Endpoint de salud funciona")
            print(f"   Respuesta: {response.json()}")
        else:
            print("   ❌ Error en endpoint de salud")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n2. Probando validación de token...")
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
    
    print("\n3. Probando obtener usuario actual...")
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
    
    print("\n4. Probando endpoint protegido (USUARIO)...")
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
    
    print("\n5. Probando sin token (debe fallar)...")
    try:
        response = requests.get(f"{base_url}/USUARIO")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 401:
            print("   ✅ Correctamente rechazado sin token")
        else:
            print("   ❌ Debería haber sido rechazado")
            print(f"   Respuesta: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_jwt_authentication() 