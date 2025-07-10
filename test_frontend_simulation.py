#!/usr/bin/env python3
"""
Script para simular las peticiones del frontend Angular
y verificar si el problema está en la autenticación
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8080"
API_URL = f"{BASE_URL}/api"

def test_frontend_simulation():
    """Simular las peticiones del frontend Angular"""
    
    print("🔍 SIMULANDO PETICIONES DEL FRONTEND ANGULAR")
    print("=" * 60)
    
    # Paso 1: Verificar conexión con el backend
    print("\n1️⃣ Verificando conexión con el backend...")
    try:
        response = requests.get(f"{API_URL}/auth/health")
        if response.status_code == 200:
            print("✅ Backend conectado correctamente")
        else:
            print(f"❌ Backend respondió con status: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error conectando al backend: {e}")
        return
    
    # Paso 2: Obtener token de prueba (como hace el frontend)
    print("\n2️⃣ Obteniendo token de prueba...")
    try:
        response = requests.get(f"{API_URL}/auth/generate-test-token")
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('token')
            print(f"✅ Token obtenido: {token[:50]}...")
        else:
            print(f"❌ Error obteniendo token: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error obteniendo token: {e}")
        return
    
    # Paso 3: Simular petición de actualización de usuario (como hace el frontend)
    print("\n3️⃣ Simulando actualización de usuario (como el frontend)...")
    
    # Datos de prueba (similares a los que envía el frontend)
    # Usar ID 2 que sí existe en la base de datos
    datos_actualizacion = {
        "id": 2,  # Cambiar a ID 2 que sí existe
        "nombre": "Jesús David Córdoba ACTUALIZADO",
        "cedula": "1006101211",
        "correo": "jesus.cordoba.actualizado@gana.com.co",
        "telefono": "3001234567",
        "direccion": "Calle 123 # 45-67 ACTUALIZADA",
        "informacionCompleta": {
            "informacionPersonal": {
                "nombre": "Jesús David Córdoba ACTUALIZADO",
                "cedula": "1006101211",
                "correo": "jesus.cordoba.actualizado@gana.com.co",
                "telefono": "3001234567",
                "direccion": "Calle 123 # 45-67 ACTUALIZADA"
            }
        }
    }
    
    # Headers como los envía el frontend (con token)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    print(f"📤 Enviando petición PUT a: {API_URL}/usuarios/2")
    print(f"🔑 Headers: {headers}")
    print(f"📋 Datos: {json.dumps(datos_actualizacion, indent=2)}")
    
    try:
        response = requests.put(
            f"{API_URL}/usuarios/2", 
            json=datos_actualizacion,
            headers=headers
        )
        
        print(f"\n📥 Respuesta del backend:")
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ Respuesta exitosa: {json.dumps(response_data, indent=2)}")
        else:
            print(f"❌ Error en la respuesta:")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Error en la petición: {e}")
    
    # Paso 4: Verificar auditoría
    print("\n4️⃣ Verificando auditoría...")
    time.sleep(2)  # Esperar un poco para que se registre la auditoría
    
    try:
        response = requests.get(f"{API_URL}/auditoria", headers=headers)
        if response.status_code == 200:
            auditoria_data = response.json()
            print(f"✅ Auditoría obtenida: {json.dumps(auditoria_data, indent=2)}")
        else:
            print(f"❌ Error obteniendo auditoría: {response.status_code}")
    except Exception as e:
        print(f"❌ Error obteniendo auditoría: {e}")

if __name__ == "__main__":
    test_frontend_simulation() 