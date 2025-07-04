#!/usr/bin/env python3
"""
Script para crear el usuario de prueba en la base de datos.
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
        
        response = requests.post(CREATE_USER_ENDPOINT, timeout=10)
        
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
            print(f"Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_token_validation():
    """Prueba la validación de token después de crear el usuario"""
    try:
        print("\n🧪 Probando validación de token...")
        
        # Generar token
        response = requests.get(f"{BACKEND_URL}/api/auth/generate-test-token", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            
            if token:
                print("✅ Token generado, validando...")
                
                # Validar token
                headers = {"Authorization": f"Bearer {token}"}
                validate_response = requests.post(f"{BACKEND_URL}/api/auth/validate", headers=headers, timeout=10)
                
                if validate_response.status_code == 200:
                    validate_data = validate_response.json()
                    if validate_data.get('valid'):
                        print("✅ Token válido y usuario encontrado!")
                        user = validate_data.get('user', {})
                        print(f"👤 Usuario validado: {user.get('nombre', 'N/A')}")
                        return True
                    else:
                        print("❌ Token inválido")
                        print(f"Error: {validate_data.get('error', 'Error desconocido')}")
                        return False
                else:
                    print(f"❌ Error en validación: {validate_response.status_code}")
                    return False
            else:
                print("❌ No se pudo obtener el token")
                return False
        else:
            print(f"❌ Error generando token: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Función principal"""
    print("🏗️ Creador de Usuario de Prueba")
    print("="*40)
    
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
        print("\n" + "="*40)
        print("🧪 PRUEBA DE VALIDACIÓN")
        print("="*40)
        
        # Probar validación de token
        if test_token_validation():
            print("\n🎉 ¡Todo funcionando correctamente!")
            print("✅ Usuario creado")
            print("✅ Token válido")
            print("✅ Sistema listo para regeneración automática")
        else:
            print("\n❌ Error en la validación del token")
    else:
        print("\n❌ No se pudo crear el usuario de prueba")

if __name__ == "__main__":
    main() 