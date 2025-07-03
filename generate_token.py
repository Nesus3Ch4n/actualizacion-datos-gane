import jwt
import time
from datetime import datetime, timedelta

def generate_token():
    """Generar un nuevo token JWT válido"""
    
    # Clave secreta del backend (exacta del application.properties)
    secret_key = "defaultSecretKeyForDevelopmentOnlyChangeThisInProduction"
    
    # Payload del token
    payload = {
        "sub": "CP1006101211",
        "idtipodocumento": "1",
        "identificacion": "1006101211",
        "nombres": "JESUS FELIPE",
        "apellidos": "CORDOVA ECHANDIA",
        "idroles": "5",
        "idpantallas": "16,67,42,12,13,14,15",
        "experiencia": "test_experience_data",
        "iat": int(time.time()),
        "exp": int(time.time()) + 3600  # Expira en 1 hora
    }
    
    # Generar token
    token = jwt.encode(payload, secret_key, algorithm="HS512")
    
    print("=== NUEVO TOKEN JWT GENERADO ===\n")
    print(f"Token: {token}")
    print(f"\nExpira: {datetime.fromtimestamp(payload['exp'])}")
    print(f"Usuario: {payload['nombres']} {payload['apellidos']}")
    print(f"Cédula: {payload['identificacion']}")
    
    return token

if __name__ == "__main__":
    generate_token() 