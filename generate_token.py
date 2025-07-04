#!/usr/bin/env python3
"""
Script para generar tokens JWT para la aplicación de actualización de datos.
Este script se conecta al backend Spring Boot para generar tokens válidos.
"""

import requests
import json
import sys
from datetime import datetime

# Configuración del backend
BACKEND_URL = "http://localhost:8080"
AUTH_ENDPOINT = f"{BACKEND_URL}/api/auth/generate-test-token"
HEALTH_ENDPOINT = f"{BACKEND_URL}/api/auth/health"

def check_backend_health():
    """Verifica si el backend está funcionando"""
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=5)
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
        print("🔄 Generando token...")
        response = requests.get(AUTH_ENDPOINT, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            if token:
                print("✅ Token generado exitosamente!")
                print(f"📅 Timestamp: {datetime.fromtimestamp(data.get('timestamp', 0)/1000)}")
                print(f"🔑 Token: {token}")
                print("\n" + "="*80)
                print("TOKEN COMPLETO (copia y pega en tu aplicación):")
                print("="*80)
                print(token)
                print("="*80)
                return token
            else:
                print("❌ No se pudo obtener el token de la respuesta")
                print(f"Respuesta: {data}")
                return None
        else:
            print(f"❌ Error al generar token. Código: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend. Asegúrate de que esté ejecutándose.")
        return None
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

def validate_token(token):
    """Valida un token usando el endpoint de validación"""
    if not token:
        print("❌ No hay token para validar")
        return False
        
    try:
        print("🔄 Validando token...")
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.post(f"{BACKEND_URL}/api/auth/validate", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('valid'):
                print("✅ Token válido!")
                user = data.get('user', {})
                print(f"👤 Usuario: {user.get('nombres', 'N/A')} {user.get('apellidos', 'N/A')}")
                print(f"🆔 Cédula: {user.get('identificacion', 'N/A')}")
                return True
            else:
                print("❌ Token inválido")
                print(f"Error: {data.get('error', 'Error desconocido')}")
                return False
        else:
            print(f"❌ Error al validar token. Código: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error al validar token: {e}")
        return False

def main():
    """Función principal del script"""
    print("🚀 Generador de Tokens JWT - Actualización de Datos")
    print("="*50)
    
    # Verificar que el backend esté funcionando
    if not check_backend_health():
        print("\n💡 Soluciones:")
        print("1. Asegúrate de que el backend Spring Boot esté ejecutándose")
        print("2. Verifica que esté en el puerto 8080")
        print("3. Ejecuta: cd BD_actualizacion_datos && ./mvnw spring-boot:run")
        sys.exit(1)
    
    print()
    
    # Generar token
    token = generate_token()
    
    if token:
        print("\n" + "="*50)
        print("VALIDACIÓN DEL TOKEN")
        print("="*50)
        
        # Validar el token generado
        validate_token(token)
        
        print("\n" + "="*50)
        print("INSTRUCCIONES DE USO")
        print("="*50)
        print("1. Copia el token completo de arriba")
        print("2. En tu aplicación Angular, usa este token en el localStorage:")
        print("   localStorage.setItem('token', 'TU_TOKEN_AQUI');")
        print("3. O en el interceptor de autenticación")
        print("4. El token es válido por 24 horas")
        print("\n💡 Para generar un nuevo token, ejecuta este script nuevamente")

if __name__ == "__main__":
    main() 