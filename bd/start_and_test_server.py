import requests
import json
import time
import subprocess
import sys
import os

def check_server_running():
    """Verificar si el servidor está ejecutándose"""
    try:
        response = requests.get("http://localhost:8080/actuator/health", timeout=5)
        return response.status_code == 200
    except:
        return False

def start_server():
    """Iniciar el servidor Spring Boot"""
    print("🚀 Iniciando servidor Spring Boot...")
    
    # Cambiar al directorio del backend
    backend_dir = "../BD_actualizacion_datos"
    
    try:
        # Iniciar el servidor en segundo plano
        process = subprocess.Popen(
            ["./mvnw", "spring-boot:run"],
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        print("⏳ Esperando que el servidor inicie...")
        
        # Esperar hasta 60 segundos para que el servidor inicie
        for i in range(60):
            if check_server_running():
                print("✅ Servidor iniciado exitosamente en puerto 8080")
                return True
            time.sleep(1)
            if i % 10 == 0:
                print(f"   Esperando... ({i}s)")
        
        print("❌ El servidor no inició en el tiempo esperado")
        return False
        
    except Exception as e:
        print(f"❌ Error al iniciar el servidor: {e}")
        return False

def create_test_user():
    """Crear usuario de prueba"""
    print("\n👤 Creando usuario de prueba...")
    
    user_data = {
        "nombre": "JESUS FELIPE CORDOBA ECHANDIA",
        "cedula": 1006101211,
        "correo": "jesus.cordoba@test.com",
        "telefono": "3001234567",
        "direccion": "Calle Test 123",
        "ciudad": "Bogotá",
        "departamento": "Cundinamarca",
        "pais": "Colombia",
        "fechaNacimiento": "1990-01-01",
        "estadoCivil": "Soltero",
        "genero": "Masculino",
        "tipoSangre": "O+",
        "eps": "EPS Test",
        "arl": "ARL Test",
        "fondoPension": "Fondo Test",
        "cajaCompensacion": "Caja Test",
        "activo": True,
        "version": 1
    }
    
    try:
        response = requests.post(
            "http://localhost:8080/api/USUARIO/test/crear-usuario",
            json=user_data,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            if result.get('success'):
                print("✅ Usuario de prueba creado exitosamente")
                return True
            else:
                print(f"❌ Error al crear usuario: {result.get('message')}")
                return False
        else:
            print(f"❌ Error HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error al crear usuario: {e}")
        return False

def test_jwt_authentication():
    """Probar autenticación JWT"""
    print("\n🔐 Probando autenticación JWT...")
    
    # Token generado con la clave secreta correcta
    token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoidGVzdF9leHBlcmllbmNlX2RhdGEiLCJpYXQiOjE3NTE0ODkxOTIsImV4cCI6MTc1MTQ5Mjc5Mn0.I_gd1QqXA4NAcJGBnEzmWLbpsV6Th18GLjDpSirXHhd2WTumtc3PCLeE6dra7pDQW34jTD35yvgGDqMDhHAmKw"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Probar validación de token
    print("1. Probando validación de token...")
    try:
        response = requests.post("http://localhost:8080/api/auth/validate", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("   ✅ Token válido")
            if data.get('valid'):
                print("   ✅ Usuario encontrado en la base de datos")
                if 'user' in data:
                    user = data['user']
                    print(f"   👤 Usuario: {user.get('nombre', 'N/A')} (ID: {user.get('id', 'N/A')})")
            else:
                print("   ❌ Usuario no encontrado")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Probar endpoint protegido
    print("\n2. Probando endpoint protegido...")
    try:
        response = requests.get("http://localhost:8080/api/USUARIO", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Endpoint protegido accesible")
            data = response.json()
            if isinstance(data, dict) and 'data' in data:
                usuarios = data['data']
                print(f"   📊 Usuarios encontrados: {len(usuarios)}")
        else:
            print(f"   ❌ Error: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Probar sin token (debe fallar)
    print("\n3. Probando sin token (debe fallar)...")
    try:
        response = requests.get("http://localhost:8080/api/USUARIO")
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 401:
            print("   ✅ Correctamente rechazado sin token")
        else:
            print("   ❌ Debería haber sido rechazado")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

def main():
    """Función principal"""
    print("=== INICIO Y PRUEBA DEL SERVIDOR JWT ===\n")
    
    # Verificar si el servidor ya está ejecutándose
    if check_server_running():
        print("✅ Servidor ya está ejecutándose en puerto 8080")
    else:
        # Iniciar el servidor
        if not start_server():
            print("❌ No se pudo iniciar el servidor")
            return
    
    # Crear usuario de prueba
    if not create_test_user():
        print("❌ No se pudo crear el usuario de prueba")
        return
    
    # Probar autenticación JWT
    test_jwt_authentication()
    
    print("\n🎉 ¡Pruebas completadas!")
    print("📝 El servidor está listo para recibir tokens JWT de la plataforma PAU")
    print("🔗 URL del servidor: http://localhost:8080")
    print("📚 Documentación API: http://localhost:8080/swagger-ui/index.html")

if __name__ == "__main__":
    main() 