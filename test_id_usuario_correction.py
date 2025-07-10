#!/usr/bin/env python3
"""
Script para verificar que las relaciones por id_usuario funcionan correctamente
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8080"
API_URL = f"{BASE_URL}/api"

def test_id_usuario_relationships():
    """Probar que todas las relaciones usen id_usuario correctamente"""
    
    print("🔍 PRUEBA DE RELACIONES POR ID_USUARIO")
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
            return
    except Exception as e:
        print(f"❌ Error obteniendo usuarios: {e}")
        return
    
    if not usuarios:
        print("⚠️ No hay usuarios para probar")
        return
    
    # Usar el primer usuario para las pruebas
    usuario_test = usuarios[0]
    usuario_id = usuario_test.get('idUsuario')
    cedula_test = str(usuario_test.get('documento'))
    
    print(f"\n🎯 Usando usuario para pruebas:")
    print(f"   - ID: {usuario_id}")
    print(f"   - Cédula: {cedula_test}")
    print(f"   - Nombre: {usuario_test.get('nombre')}")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
    
    # Paso 4: Probar guardado de estudio académico con id_usuario
    print("\n4️⃣ Probando guardado de estudio académico...")
    
    estudio_data = {
        # Remover idUsuario del cuerpo, se enviará como parámetro
        "nivelAcademico": "Pregrado",
        "programa": "Ingeniería de Sistemas",
        "institucion": "Universidad de Prueba",
        "semestre": 8,
        "graduacion": "2024-12-15"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/formulario/estudios/guardar?idUsuario={usuario_id}",
            json=[estudio_data],  # Enviar como array
            headers=headers
        )
        
        print(f"📥 Respuesta del estudio académico:")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ Estudio académico guardado exitosamente: {json.dumps(response_data, indent=2)}")
        else:
            print(f"❌ Error guardando estudio académico:")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Error en la petición de estudio académico: {e}")
    
    # Paso 5: Probar guardado de vehículo con id_usuario
    print("\n5️⃣ Probando guardado de vehículo...")
    
    vehiculo_data = {
        # Remover idUsuario del cuerpo, se enviará como parámetro
        "tipoVehiculo": "Automóvil",
        "marca": "Toyota",
        "modelo": "Corolla",
        "anio": 2020,
        "placa": "ABC123",
        "color": "Blanco"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/formulario/vehiculos/guardar?idUsuario={usuario_id}",
            json=[vehiculo_data],  # Enviar como array
            headers=headers
        )
        
        print(f"📥 Respuesta del vehículo:")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"✅ Vehículo guardado exitosamente: {json.dumps(response_data, indent=2)}")
        else:
            print(f"❌ Error guardando vehículo:")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Error: {response.text}")
                
    except Exception as e:
        print(f"❌ Error en la petición de vehículo: {e}")
    
    # Paso 6: Verificar auditoría para confirmar que se registra con id_usuario
    print("\n6️⃣ Verificando auditoría...")
    time.sleep(2)  # Esperar un poco para que se registre la auditoría
    
    try:
        response = requests.get(f"{API_URL}/auditoria", headers=headers)
        if response.status_code == 200:
            auditoria_data = response.json()
            print(f"✅ Auditoría obtenida: {len(auditoria_data)} registros")
            
            # Mostrar los últimos 3 registros de auditoría
            registros_recientes = auditoria_data[-3:] if len(auditoria_data) >= 3 else auditoria_data
            for registro in registros_recientes:
                print(f"   - {registro.get('fechaModificacion')}: {registro.get('descripcion')} (Usuario ID: {registro.get('idUsuario')})")
        else:
            print(f"❌ Error obteniendo auditoría: {response.status_code}")
    except Exception as e:
        print(f"❌ Error obteniendo auditoría: {e}")
    
    print("\n" + "=" * 60)
    print("✅ PRUEBA DE ID_USUARIO FINALIZADA")
    print("=" * 60)

if __name__ == "__main__":
    test_id_usuario_relationships() 