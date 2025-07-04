#!/usr/bin/env python3
"""
Script simple para crear el usuario de prueba sin usar el interceptor de Angular.
"""

import requests
import json

# Configuración del backend
BACKEND_URL = "http://localhost:8080"
CREATE_USER_ENDPOINT = f"{BACKEND_URL}/api/auth/create-test-user"

def create_test_user():
    """Crea el usuario de prueba en la base de datos"""
    try:
        print("🏗️ Creando usuario de prueba...")
        
        # Hacer la petición sin headers de autorización
        response = requests.post(CREATE_USER_ENDPOINT, timeout=10)
        
        print(f"📊 Código de respuesta: {response.status_code}")
        print(f"📋 Respuesta: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Usuario de prueba creado exitosamente!")
                user = data.get('user', {})
                print(f"👤 Usuario creado:")
                print(f"   ID: {user.get('id', 'N/A')}")
                print(f"   Nombre: {user.get('nombre', 'N/A')}")
                print(f"   Cédula: {user.get('cedula', 'N/A')}")
                print(f"   Correo: {user.get('correo', 'N/A')}")
                return True
            else:
                print("❌ Error creando usuario de prueba")
                print(f"Error: {data.get('error', 'Error desconocido')}")
                return False
        else:
            print(f"❌ Error en la petición. Código: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal"""
    print("🏗️ Creador de Usuario de Prueba (Simple)")
    print("="*50)
    
    # Verificar que el backend esté funcionando
    try:
        health_response = requests.get(f"{BACKEND_URL}/api/auth/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Backend está funcionando")
        else:
            print("❌ Backend no responde correctamente")
            return
    except Exception as e:
        print(f"❌ No se puede conectar al backend: {e}")
        return
    
    print()
    
    # Crear usuario de prueba
    if create_test_user():
        print("\n🎉 ¡Usuario creado exitosamente!")
        print("💡 Ahora puedes probar la regeneración automática de tokens")
    else:
        print("\n❌ No se pudo crear el usuario de prueba")

if __name__ == "__main__":
    main() 