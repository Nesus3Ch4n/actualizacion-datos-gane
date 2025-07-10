#!/usr/bin/env python3
"""
Script de prueba para verificar el sistema de auditoría
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8080"
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}

def test_crear_usuario():
    """Prueba crear un usuario nuevo"""
    print("🧪 Probando creación de usuario...")
    
    usuario_data = {
        "idUsuario": 1,
        "documento": 123456789,
        "nombre": "JESUS FELIPE CORDOBA ECHANDIA",
        "correo": "jesus.cordoba@test.com",
        "fechaNacimiento": "1990-01-01",
        "cargo": "Desarrollador",
        "area": "Tecnología",
        "estadoCivil": "Soltero",
        "tipoSangre": "O+",
        "numeroFijo": 1234567,
        "numeroCelular": 3001234567,
        "numeroCorp": 123456
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/formulario/informacion-personal/guardar", 
                               json=usuario_data, headers=HEADERS)
        
        if response.status_code == 200:
            print("✅ Usuario creado exitosamente")
            return response.json()
        else:
            print(f"❌ Error al crear usuario: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_actualizar_usuario():
    """Prueba actualizar un usuario existente"""
    print("🧪 Probando actualización de usuario...")
    
    # Primero obtener el usuario
    try:
        response = requests.get(f"{BASE_URL}/api/consulta/datos-completos/123456789", headers=HEADERS)
        if response.status_code != 200:
            print(f"❌ Error al obtener usuario: {response.status_code}")
            return None
        
        usuario = response.json()
        print(f"📋 Usuario encontrado: {usuario.get('nombre', 'N/A')}")
        
        # Actualizar algunos campos
        usuario_actualizado = {
            "idUsuario": 1,
            "documento": 123456789,
            "nombre": "JESUS FELIPE CORDOBA ECHANDIA ACTUALIZADO",
            "correo": "jesus.cordoba.actualizado@test.com",
            "fechaNacimiento": "1990-01-01",
            "cargo": "Desarrollador Senior",
            "area": "Tecnología e Innovación",
            "estadoCivil": "Casado",
            "tipoSangre": "O+",
            "numeroFijo": 1234567,
            "numeroCelular": 3001234567,
            "numeroCorp": 123456
        }
        
        response = requests.post(f"{BASE_URL}/api/formulario/informacion-personal/guardar", 
                               json=usuario_actualizado, headers=HEADERS)
        
        if response.status_code == 200:
            print("✅ Usuario actualizado exitosamente")
            return response.json()
        else:
            print(f"❌ Error al actualizar usuario: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_obtener_auditoria():
    """Prueba obtener los registros de auditoría"""
    print("🧪 Obteniendo registros de auditoría...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/auditoria", headers=HEADERS)
        
        if response.status_code == 200:
            auditorias = response.json()
            print(f"📊 Total de registros de auditoría: {len(auditorias)}")
            
            for i, auditoria in enumerate(auditorias[-5:], 1):  # Mostrar los últimos 5
                print(f"\n📝 Registro {i}:")
                print(f"   Tabla: {auditoria.get('tablaModificada', 'N/A')}")
                print(f"   Tipo: {auditoria.get('tipoPeticion', 'N/A')}")
                print(f"   Campo: {auditoria.get('campoModificado', 'N/A')}")
                print(f"   Valor Anterior: {auditoria.get('valorAnterior', 'N/A')}")
                print(f"   Valor Nuevo: {auditoria.get('valorNuevo', 'N/A')}")
                print(f"   Usuario: {auditoria.get('usuarioModificador', 'N/A')}")
                print(f"   Fecha: {auditoria.get('fechaModificacion', 'N/A')}")
                print(f"   Descripción: {auditoria.get('descripcion', 'N/A')}")
            
            return auditorias
        else:
            print(f"❌ Error al obtener auditoría: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas del sistema de auditoría...")
    print("=" * 50)
    
    # Esperar un momento para que el backend esté listo
    time.sleep(2)
    
    # Prueba 1: Crear usuario
    usuario_creado = test_crear_usuario()
    if usuario_creado:
        print(f"✅ Usuario creado con ID: {usuario_creado.get('idUsuario', 'N/A')}")
    
    print("\n" + "=" * 50)
    
    # Prueba 2: Actualizar usuario
    usuario_actualizado = test_actualizar_usuario()
    if usuario_actualizado:
        print(f"✅ Usuario actualizado con ID: {usuario_actualizado.get('idUsuario', 'N/A')}")
    
    print("\n" + "=" * 50)
    
    # Prueba 3: Verificar auditoría
    auditorias = test_obtener_auditoria()
    
    print("\n" + "=" * 50)
    print("🏁 Pruebas completadas")
    
    if auditorias:
        # Buscar registros de actualización
        updates = [a for a in auditorias if a.get('tipoPeticion') == 'UPDATE']
        if updates:
            print(f"✅ Se encontraron {len(updates)} registros de actualización")
            print("🎉 El sistema de auditoría está funcionando correctamente!")
        else:
            print("⚠️ No se encontraron registros de actualización")
            print("🔍 Revisar si el sistema de auditoría está capturando los cambios")

if __name__ == "__main__":
    main() 