import jwt
import json
import base64
from urllib.parse import unquote

def decode_new_token():
    """Decodificar el nuevo token JWT proporcionado"""
    
    print("=== DECODIFICANDO NUEVO TOKEN JWT ===\n")
    
    # Token codificado en URL
    encoded_data = "%7B%22token%22:%22eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXRoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNTQ4ODIxLCJleHAiOjE3NTE1NTIxMjF9.yJWZ2YtGkehRR5UccOtGFCOkYh1-MQS2nRS6mbRTa9t4UIlkodi-R1M22I3qmSyxd_RLiZR4ltPmvWdHkpi6cw%22,%22token_expiry%22:%221751552396751%22%7D"
    
    # Decodificar la URL
    decoded_data = unquote(encoded_data)
    print("1. Datos decodificados de URL:")
    print(f"   {decoded_data}")
    print()
    
    # Parsear el JSON
    try:
        data = json.loads(decoded_data)
        token = data['token']
        token_expiry = data['token_expiry']
        
        print("2. Token extraído:")
        print(f"   {token}")
        print()
        print("3. Expiración del token:")
        print(f"   {token_expiry}")
        print()
        
        # Decodificar el JWT sin verificar la firma
        parts = token.split('.')
        if len(parts) != 3:
            print("❌ Token JWT inválido")
            return
        
        header_b64, payload_b64, signature = parts
        
        # Decodificar header
        print("4. Header (decodificado):")
        header_json = base64.urlsafe_b64decode(header_b64 + '==').decode('utf-8')
        header = json.loads(header_json)
        print(f"   {json.dumps(header, indent=2)}")
        print()
        
        # Decodificar payload
        print("5. Payload (decodificado):")
        payload_json = base64.urlsafe_b64decode(payload_b64 + '==').decode('utf-8')
        payload = json.loads(payload_json)
        print(f"   {json.dumps(payload, indent=2)}")
        print()
        
        # Extraer información importante
        print("6. Información extraída:")
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
            print(f"7. Cédula extraída: {cedula_raw}")
        else:
            print("7. ❌ No se pudo extraer la cédula")
        
        # Verificar algoritmo
        print(f"\n8. Algoritmo de firma: {header.get('alg', 'N/A')}")
        
        return token
        
    except Exception as e:
        print(f"❌ Error al procesar el token: {e}")

if __name__ == "__main__":
    decode_new_token() 