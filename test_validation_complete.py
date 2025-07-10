#!/usr/bin/env python3
"""
Script de prueba completa para verificar la validación implementada
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8080"
API_URL = f"{BASE_URL}/api"

def test_complete_validation():
    """Prueba completa de validación"""
    
    print("🔍 PRUEBA COMPLETA DE VALIDACIÓN")
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
    
    # Paso 2: Obtener token de prueba
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
    
    # Paso 3: Verificar usuarios existentes
    print("\n3️⃣ Verificando usuarios existentes...")
    try:
        response = requests.get(f"{API_URL}/usuarios")
        if response.status_code == 200:
            usuarios_data = response.json()
            usuarios = usuarios_data.get('data', [])
            print(f"✅ Usuarios encontrados: {len(usuarios)}")
            for usuario in usuarios:
                print(f"   - ID: {usuario.get('idUsuario')}, Nombre: {usuario.get('nombre')}, Cédula: {usuario.get('documento')}")
        else:
            print(f"❌ Error obteniendo usuarios: {response.status_code}")
    except Exception as e:
        print(f"❌ Error obteniendo usuarios: {e}")
    
    # Paso 4: Probar actualización con token válido (simula frontend autenticado)
    print("\n4️⃣ Probando actualización con token válido...")
    
    # Usar el primer usuario existente para la prueba
    if usuarios:
        usuario_test = usuarios[0]
        usuario_id = usuario_test.get('idUsuario')
        cedula_test = str(usuario_test.get('documento'))
        
        datos_actualizacion = {
            "id": usuario_id,
            "nombre": f"{usuario_test.get('nombre')} ACTUALIZADO",
            "cedula": cedula_test,
            "correo": "test.actualizado@gana.com.co",
            "telefono": "3001234567",
            "direccion": "Dirección de prueba actualizada",
            "informacionCompleta": {
                "informacionPersonal": {
                    "nombre": f"{usuario_test.get('nombre')} ACTUALIZADO",
                    "cedula": cedula_test,
                    "correo": "test.actualizado@gana.com.co",
                    "telefono": "3001234567",
                    "direccion": "Dirección de prueba actualizada"
                }
            }
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        
        print(f"📤 Enviando actualización para usuario ID: {usuario_id}")
        print(f"🔑 Headers: {headers}")
        
        try:
            response = requests.put(
                f"{API_URL}/usuarios/{usuario_id}", 
                json=datos_actualizacion,
                headers=headers
            )
            
            print(f"\n📥 Respuesta del backend:")
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                response_data = response.json()
                print(f"✅ Actualización exitosa: {json.dumps(response_data, indent=2)}")
            else:
                print(f"❌ Error en la actualización:")
                try:
                    error_data = response.json()
                    print(f"Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Error: {response.text}")
                    
        except Exception as e:
            print(f"❌ Error en la petición: {e}")
    else:
        print("⚠️ No hay usuarios para probar actualización")
    
    # Paso 5: Verificar auditoría después de la actualización
    print("\n5️⃣ Verificando auditoría después de la actualización...")
    time.sleep(2)  # Esperar un poco para que se registre la auditoría
    
    try:
        response = requests.get(f"{API_URL}/auditoria", headers=headers)
        if response.status_code == 200:
            auditoria_data = response.json()
            print(f"✅ Auditoría obtenida: {len(auditoria_data)} registros")
            
            # Mostrar los últimos 3 registros de auditoría
            registros_recientes = auditoria_data[-3:] if len(auditoria_data) >= 3 else auditoria_data
            for registro in registros_recientes:
                print(f"   - {registro.get('fechaModificacion')}: {registro.get('descripcion')} (Usuario: {registro.get('usuarioModificador')})")
        else:
            print(f"❌ Error obteniendo auditoría: {response.status_code}")
    except Exception as e:
        print(f"❌ Error obteniendo auditoría: {e}")
    
    # Paso 6: Probar validación de usuario inexistente
    print("\n6️⃣ Probando validación de usuario inexistente...")
    
    datos_usuario_inexistente = {
        "id": 99999,  # ID que no existe
        "nombre": "Usuario Inexistente",
        "cedula": "999999999",
        "correo": "inexistente@test.com",
        "telefono": "3001234567",
        "direccion": "Dirección de prueba",
        "informacionCompleta": {
            "informacionPersonal": {
                "nombre": "Usuario Inexistente",
                "cedula": "999999999",
                "correo": "inexistente@test.com",
                "telefono": "3001234567",
                "direccion": "Dirección de prueba"
            }
        }
    }
    
    try:
        response = requests.put(
            f"{API_URL}/usuarios/99999", 
            json=datos_usuario_inexistente,
            headers=headers
        )
        
        print(f"📥 Respuesta para usuario inexistente:")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Correctamente rechazado usuario inexistente")
        else:
            print(f"⚠️ Respuesta inesperada: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Error probando usuario inexistente: {e}")
    
    print("\n" + "=" * 60)
    print("✅ PRUEBA COMPLETA FINALIZADA")
    print("=" * 60)

if __name__ == "__main__":
    test_complete_validation() 