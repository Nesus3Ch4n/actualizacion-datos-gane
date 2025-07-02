import requests
import json
import sqlite3
from datetime import datetime

def test_complete_flow():
    """
    Probar el flujo completo: Frontend -> Backend -> Base de datos con auto-incremento
    """
    
    # URL del backend
    base_url = "http://localhost:8080/api/formulario"
    
    print("=== PRUEBA COMPLETA DEL FLUJO ===")
    
    # 1. Preparar datos de prueba
    usuario_test = {
        "nombre": "Usuario Prueba Completa",
        "cedula": 123456789,
        "correo": "usuario.prueba@test.com",
        "numeroCelular": 3001234567,
        "numeroFijo": 6012345678,
        "cedulaExpedicion": "Bogotá",
        "paisNacimiento": "Colombia",
        "ciudadNacimiento": "Bogotá",
        "cargo": "Desarrollador",
        "area": "Tecnología",
        "estadoCivil": "Soltero",
        "tipoSangre": "O+",
        "fechaNacimiento": "1990-05-15"
    }
    
    print(f"\n📋 Datos de prueba preparados:")
    print(f"  Nombre: {usuario_test['nombre']}")
    print(f"  Cédula: {usuario_test['cedula']}")
    print(f"  Email: {usuario_test['correo']}")
    
    try:
        # 2. Verificar que el backend esté ejecutándose
        print(f"\n🔗 Verificando conexión con el backend...")
        try:
            response = requests.get(f"{base_url}/estado/123456789", timeout=5)
            print(f"✅ Backend está ejecutándose")
        except requests.exceptions.RequestException as e:
            print(f"❌ Backend no está disponible: {e}")
            print(f"💡 Asegúrate de que el servidor Spring Boot esté ejecutándose en puerto 8080")
            return
        
        # 3. Enviar datos al endpoint de información personal
        print(f"\n📤 Enviando datos al backend...")
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        response = requests.post(
            f"{base_url}/informacion-personal/guardar",
            json=usuario_test,
            headers=headers,
            timeout=10
        )
        
        print(f"📊 Respuesta del backend:")
        print(f"  Status Code: {response.status_code}")
        print(f"  Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"  Response JSON: {response_data}")
            
            if response_data.get('success'):
                usuario_guardado = response_data.get('data', {})
                id_generado = usuario_guardado.get('id')
                
                if id_generado:
                    print(f"✅ Usuario guardado exitosamente con ID: {id_generado}")
                    
                    # 4. Verificar en la base de datos
                    print(f"\n🔍 Verificando en la base de datos...")
                    conn = sqlite3.connect('bd/bd.db')
                    cursor = conn.cursor()
                    
                    cursor.execute("""
                        SELECT ID_USUARIO, DOCUMENTO, NOMBRE, CORREO 
                        FROM USUARIO 
                        WHERE ID_USUARIO = ?
                    """, (id_generado,))
                    
                    usuario_db = cursor.fetchone()
                    
                    if usuario_db:
                        print(f"✅ Usuario encontrado en BD:")
                        print(f"  ID: {usuario_db[0]}")
                        print(f"  Cédula: {usuario_db[1]}")
                        print(f"  Nombre: {usuario_db[2]}")
                        print(f"  Email: {usuario_db[3]}")
                        
                        # 5. Limpiar usuario de prueba
                        cursor.execute("DELETE FROM USUARIO WHERE ID_USUARIO = ?", (id_generado,))
                        conn.commit()
                        print(f"\n🧹 Usuario de prueba eliminado de la BD")
                        
                    else:
                        print(f"❌ Usuario no encontrado en la BD")
                    
                    conn.close()
                    
                else:
                    print(f"❌ No se retornó ID del usuario guardado")
            else:
                print(f"❌ Error en el backend: {response_data.get('message')}")
        else:
            print(f"❌ Error HTTP {response.status_code}: {response.text}")
        
        print(f"\n✅ Prueba completada")
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {e}")

if __name__ == "__main__":
    test_complete_flow() 