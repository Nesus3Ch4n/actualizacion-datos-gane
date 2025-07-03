import jwt
import json
import base64
from urllib.parse import unquote

def analyze_token():
    """Analizar el token JWT de la plataforma PAU"""
    
    print("=== ANÁLISIS DEL TOKEN JWT ===\n")
    
    # Token original (URL encoded)
    token_encoded = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXRoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNDg4MTI5LCJleHAiOjE3NTE0OTE0Mjl9.4Drc1fZ99F1I4djrg_j3O8W5G2HHmdg8O7RGpUaif_uIlecMpR1yKWaDpphskFDvEFz8Y978vmArO17djL1CNA"
    
    print("1. Token JWT original:")
    print(f"   {token_encoded}")
    print()
    
    # Decodificar las partes del JWT sin verificar la firma
    try:
        # Separar las partes del JWT
        parts = token_encoded.split('.')
        
        if len(parts) != 3:
            print("❌ Token JWT inválido: debe tener 3 partes")
            return
        
        header_b64, payload_b64, signature = parts
        
        # Decodificar header
        print("2. Header (decodificado):")
        header_json = base64.urlsafe_b64decode(header_b64 + '==').decode('utf-8')
        header = json.loads(header_json)
        print(f"   {json.dumps(header, indent=2)}")
        print()
        
        # Decodificar payload
        print("3. Payload (decodificado):")
        payload_json = base64.urlsafe_b64decode(payload_b64 + '==').decode('utf-8')
        payload = json.loads(payload_json)
        print(f"   {json.dumps(payload, indent=2)}")
        print()
        
        # Extraer información importante
        print("4. Información extraída:")
        print(f"   🔑 Subject (sub): {payload.get('sub', 'N/A')}")
        print(f"   🆔 Identificación: {payload.get('identificacion', 'N/A')}")
        print(f"   👤 Nombres: {payload.get('nombres', 'N/A')}")
        print(f"   📝 Apellidos: {payload.get('apellidos', 'N/A')}")
        print(f"   🎭 Roles: {payload.get('idroles', 'N/A')}")
        print(f"   🏢 Pantallas: {payload.get('idpantallas', 'N/A')}")
        print(f"   ⏰ Issued At (iat): {payload.get('iat', 'N/A')}")
        print(f"   ⏰ Expires At (exp): {payload.get('exp', 'N/A')}")
        print()
        
        # Calcular cédula (sin el prefijo CP)
        cedula_raw = payload.get('identificacion', '')
        if cedula_raw:
            print(f"5. Cédula extraída: {cedula_raw}")
        else:
            print("5. ❌ No se pudo extraer la cédula")
        
        # Verificar algoritmo
        print(f"\n6. Algoritmo de firma: {header.get('alg', 'N/A')}")
        
    except Exception as e:
        print(f"❌ Error al decodificar el token: {e}")

if __name__ == "__main__":
    analyze_token() 