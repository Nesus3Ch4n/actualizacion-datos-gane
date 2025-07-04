#!/usr/bin/env python3
"""
Script para verificar si existe el usuario en la base de datos.
"""

import requests
import json

# Configuración del backend
BACKEND_URL = "http://localhost:8080"

def check_user_exists():
    """Verifica si el usuario existe en la base de datos"""
    try:
        print("🔍 Verificando si existe el usuario en la base de datos...")
        
        # Intentar obtener información del usuario con cédula 1006101211
        # Primero, generar un token
        response = requests.get(f"{BACKEND_URL}/api/auth/generate-test-token", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            
            if token:
                print("✅ Token generado, verificando usuario...")
                
                # Intentar validar el token
                headers = {"Authorization": f"Bearer {token}"}
                validate_response = requests.post(f"{BACKEND_URL}/api/auth/validate", headers=headers, timeout=10)
                
                print(f"📊 Código de respuesta: {validate_response.status_code}")
                print(f"📋 Respuesta completa: {validate_response.text}")
                
                if validate_response.status_code == 200:
                    validate_data = validate_response.json()
                    if validate_data.get('valid'):
                        print("✅ Usuario encontrado y token válido")
                        user = validate_data.get('user', {})
                        print(f"👤 Usuario: {user}")
                    else:
                        print("❌ Token inválido")
                        print(f"Error: {validate_data.get('error', 'Error desconocido')}")
                else:
                    print(f"❌ Error en validación: {validate_response.status_code}")
                    print(f"Respuesta: {validate_response.text}")
            else:
                print("❌ No se pudo obtener el token")
        else:
            print(f"❌ Error generando token: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def create_test_user():
    """Crea un usuario de prueba en la base de datos"""
    try:
        print("🏗️ Creando usuario de prueba...")
        
        # Datos del usuario de prueba
        user_data = {
            "nombre": "JESUS FELIPE CORDOBA ECHANDIA",
            "cedula": 1006101211,
            "correo": "jesus.cordoba@test.com",
            "numeroFijo": 1234567,
            "numeroCelular": 3001234567,
            "numeroCorp": 123456,
            "cedulaExpedicion": "BOGOTA",
            "paisNacimiento": "COLOMBIA",
            "ciudadNacimiento": "BOGOTA",
            "cargo": "DESARROLLADOR",
            "area": "TECNOLOGIA",
            "estadoCivil": "SOLTERO",
            "tipoSangre": "O+"
        }
        
        # Intentar crear el usuario (esto dependerá de si hay un endpoint para crear usuarios)
        # Por ahora, solo mostraremos los datos
        print("📋 Datos del usuario a crear:")
        print(json.dumps(user_data, indent=2))
        print("\n💡 Nota: Para crear el usuario, necesitarías un endpoint específico en el backend")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Función principal"""
    print("🔍 Verificador de Usuario en Base de Datos")
    print("="*50)
    
    # Verificar si el backend está funcionando
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
    
    # Verificar si existe el usuario
    check_user_exists()
    
    print()
    
    # Mostrar cómo crear el usuario
    create_test_user()

if __name__ == "__main__":
    main() 