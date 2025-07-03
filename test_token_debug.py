import requests
import json

def test_token_debug():
    """Probar el endpoint de debug de tokens"""
    
    print("=== PRUEBA DE DEBUG DE TOKEN ===\n")
    
    # Token simulado
    token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPVkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNpYSI6InRlc3RfZXhwZXJpZW5jZV9kYXRhIiwiaWF0IjoxNzUxNTU5MjQwLCJleHAiOjE3NTE1NjI4NDB9._nqtG2rYOLYoGYTap5jhGRStGc5xjFvoii0dhKHFO-EsbzOKIjRhuAGqAy8kJmcvy2kZZaaVd3jQ-57tKEbRRQ"
    
    base_url = "http://localhost:8080/api"
    
    print("1. Probando endpoint de debug de token...")
    try:
        response = requests.post(f"{base_url}/auth/test-validate", 
                               json={"token": token},
                               headers={'Content-Type': 'application/json'})
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   📝 Respuesta completa:")
            print(json.dumps(data, indent=2))
            
            if data.get('valid'):
                print("   ✅ Token válido y usuario encontrado")
            else:
                print(f"   ❌ Error: {data.get('error', 'Error desconocido')}")
        else:
            print(f"   ❌ Error HTTP: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    test_token_debug() 