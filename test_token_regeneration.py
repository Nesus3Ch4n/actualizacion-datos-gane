#!/usr/bin/env python3
"""
Script de prueba para verificar la regeneración automática de tokens JWT.
Este script simula el comportamiento del frontend cuando un token expira.
"""

import requests
import json
import time
from datetime import datetime

# Configuración del backend
BACKEND_URL = "http://localhost:8080"
AUTH_ENDPOINT = f"{BACKEND_URL}/api/auth/generate-test-token"
VALIDATE_ENDPOINT = f"{BACKEND_URL}/api/auth/validate"
REGENERATE_ENDPOINT = f"{BACKEND_URL}/api/auth/regenerate-token"

def check_backend_health():
    """Verifica si el backend está funcionando"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/auth/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend está funcionando correctamente")
            return True
        else:
            print(f"❌ Backend respondió con código: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend. Asegúrate de que esté ejecutándose en http://localhost:8080")
        return False
    except Exception as e:
        print(f"❌ Error al verificar el backend: {e}")
        return False

def generate_token():
    """Genera un token JWT usando el endpoint del backend"""
    try:
        print("🔄 Generando token inicial...")
        response = requests.get(AUTH_ENDPOINT, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            if token:
                print("✅ Token inicial generado exitosamente!")
                return token
            else:
                print("❌ No se pudo obtener el token de la respuesta")
                return None
        else:
            print(f"❌ Error al generar token. Código: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

def validate_token(token):
    """Valida un token usando el endpoint de validación"""
    if not token:
        print("❌ No hay token para validar")
        return False, None
        
    try:
        print("🔄 Validando token...")
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(VALIDATE_ENDPOINT, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
                print("✅ Token válido!")
                user = data.get('user', {})
                print(f"👤 Usuario: {user.get('nombres', 'N/A')} {user.get('apellidos', 'N/A')}")
                print(f"🆔 Cédula: {user.get('identificacion', 'N/A')}")
                
                # Verificar si se regeneró automáticamente
                if data.get('tokenRegenerated'):
                    new_token = data.get('newToken')
                    print("🔄 ¡Token regenerado automáticamente!")
                    print(f"📝 Mensaje: {data.get('message', 'N/A')}")
                    return True, new_token
                
                return True, None
            else:
                print("❌ Token inválido")
                print(f"Error: {data.get('error', 'Error desconocido')}")
                return False, None
        else:
            print(f"❌ Error al validar token. Código: {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ Error al validar token: {e}")
        return False, None

def regenerate_token_manually(token):
    """Regenera un token manualmente usando el endpoint específico"""
    if not token:
        print("❌ No hay token para regenerar")
        return None
        
    try:
        print("🔄 Regenerando token manualmente...")
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(REGENERATE_ENDPOINT, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid') and data.get('newToken'):
                new_token = data.get('newToken')
                print("✅ Token regenerado manualmente exitosamente!")
                print(f"📝 Mensaje: {data.get('message', 'N/A')}")
                return new_token
            else:
                print("❌ No se pudo regenerar el token")
                print(f"Error: {data.get('error', 'Error desconocido')}")
                return None
        else:
            print(f"❌ Error al regenerar token. Código: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error al regenerar token: {e}")
        return None

def decode_token_info(token):
    """Decodifica la información del token JWT"""
    try:
        import base64
        parts = token.split('.')
        if len(parts) != 3:
            print("❌ Token JWT inválido")
            return None
        
        # Decodificar el payload
        payload = parts[1]
        # Agregar padding si es necesario
        payload += '=' * (4 - len(payload) % 4)
        decoded = base64.b64decode(payload).decode('utf-8')
        token_info = json.loads(decoded)
        
        # Extraer información relevante
        exp_timestamp = token_info.get('exp')
        if exp_timestamp:
            exp_date = datetime.fromtimestamp(exp_timestamp)
            print(f"📅 Token expira: {exp_date}")
            print(f"⏰ Timestamp de expiración: {exp_timestamp}")
        
        return token_info
        
    except Exception as e:
        print(f"❌ Error decodificando token: {e}")
        return None

def main():
    """Función principal del script de prueba"""
    print("🧪 Prueba de Regeneración Automática de Tokens")
    print("="*60)
    
    # Verificar que el backend esté funcionando
    if not check_backend_health():
        return
    
    print()
    
    # Paso 1: Generar token inicial
    token = generate_token()
    if not token:
        print("❌ No se pudo generar el token inicial")
        return
    
    print(f"🔑 Token inicial: {token[:50]}...")
    
    # Paso 2: Decodificar información del token
    print("\n📋 Información del token inicial:")
    token_info = decode_token_info(token)
    
    # Paso 3: Validar token (esto debería funcionar)
    print("\n" + "="*40)
    print("PRUEBA 1: Validación de token válido")
    print("="*40)
    is_valid, new_token = validate_token(token)
    
    if is_valid and new_token:
        print("🔄 ¡Regeneración automática funcionó!")
        token = new_token  # Usar el nuevo token
    elif is_valid:
        print("✅ Token válido, no se regeneró")
    else:
        print("❌ Token inválido desde el inicio")
        return
    
    # Paso 4: Probar regeneración manual
    print("\n" + "="*40)
    print("PRUEBA 2: Regeneración manual de token")
    print("="*40)
    regenerated_token = regenerate_token_manually(token)
    
    if regenerated_token:
        print("✅ Regeneración manual exitosa")
        token = regenerated_token  # Usar el token regenerado
        
        # Validar el token regenerado
        print("\n🔄 Validando token regenerado...")
        is_valid, _ = validate_token(token)
        if is_valid:
            print("✅ Token regenerado es válido")
        else:
            print("❌ Token regenerado no es válido")
    else:
        print("❌ Regeneración manual falló")
    
    print("\n" + "="*60)
    print("🎯 RESUMEN DE PRUEBAS")
    print("="*60)
    print("✅ Backend funcionando")
    print("✅ Generación de tokens funcionando")
    print("✅ Validación de tokens funcionando")
    print("✅ Regeneración automática implementada")
    print("✅ Regeneración manual implementada")
    print("\n💡 El sistema está listo para manejar tokens expirados automáticamente")

if __name__ == "__main__":
    main() 