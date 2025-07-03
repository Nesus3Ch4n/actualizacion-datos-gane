import jwt
import datetime
import json

def generate_test_token():
    """Generar un token JWT de prueba con la misma estructura que el token de PAU"""
    
    print("=== GENERANDO TOKEN JWT DE PRUEBA ===\n")
    
    # Clave secreta (debe coincidir con la del backend)
    secret_key = "defaultSecretKeyForDevelopmentOnlyChangeThisInProduction"
    
    # Payload del token (similar al token de PAU)
    payload = {
        "sub": "CP1006101211",  # Subject (cédula con prefijo)
        "idtipodocumento": "1",
        "identificacion": "1006101211",  # Cédula sin prefijo
        "nombres": "JESUS FELIPE",
        "apellidos": "CORDOBA ECHANDIA",
        "idroles": "5",
        "idpantallas": "16,67,42,12,13,14,15",
        "experience": "test_experience_data",
        "iat": datetime.datetime.utcnow(),  # Issued at
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expires in 1 hour
    }
    
    # Generar token
    token = jwt.encode(payload, secret_key, algorithm="HS512")
    
    print("Token generado:")
    print(f"   {token}")
    print()
    
    # Decodificar para verificar
    try:
        decoded = jwt.decode(token, secret_key, algorithms=["HS512"])
        print("Token decodificado:")
        print(f"   {json.dumps(decoded, indent=2, default=str)}")
        print()
        
        print("Información extraída:")
        print(f"   🔑 Subject: {decoded.get('sub', 'N/A')}")
        print(f"   🆔 Identificación: {decoded.get('identificacion', 'N/A')}")
        print(f"   👤 Nombres: {decoded.get('nombres', 'N/A')}")
        print(f"   📝 Apellidos: {decoded.get('apellidos', 'N/A')}")
        print(f"   ⏰ Expira: {decoded.get('exp', 'N/A')}")
        
        return token
        
    except Exception as e:
        print(f"❌ Error al decodificar token: {e}")
        return None

if __name__ == "__main__":
    generate_test_token() 