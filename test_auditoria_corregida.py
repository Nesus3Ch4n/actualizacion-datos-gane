#!/usr/bin/env python3
"""
Script para probar la auditoría corregida
- Verificar que no hay auditoría duplicada
- Verificar que funciona para actualizaciones
- Verificar que funciona para eliminaciones
"""

import requests
import json
import time
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8080"
API_BASE = f"{BASE_URL}/api"

def obtener_token():
    """Obtener token de autenticación"""
    try:
        response = requests.post(f"{API_BASE}/auth/login", json={
            "documento": "1006101211",
            "password": "password123"
        })
        
        if response.status_code == 200:
            data = response.json()
            return data.get('token')
        else:
            print(f"❌ Error al obtener token: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def obtener_auditoria():
    """Obtener registros de auditoría"""
    try:
        response = requests.get(f"{API_BASE}/auditoria/todas")
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Error al obtener auditoría: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return []

def crear_usuario_y_estudios(token):
    """Crear un usuario y estudios académicos"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # 1. Crear usuario
    usuario_data = {
        "idUsuario": 999,
        "documento": "999999999",
        "nombre": "USUARIO PRUEBA AUDITORIA",
        "correo": "prueba@test.com",
        "fechaNacimiento": "1990-01-01",
        "cedulaExpedicion": "BOGOTA",
        "paisNacimiento": "COLOMBIA",
        "ciudadNacimiento": "BOGOTA",
        "cargo": "DESARROLLADOR",
        "area": "TECNOLOGIA",
        "estadoCivil": "SOLTERO",
        "tipoSangre": "O+",
        "numeroFijo": "1234567",
        "numeroCelular": "3001234567",
        "numeroCorp": "1234"
    }
    
    print("📝 Creando usuario...")
    response = requests.post(f"{API_BASE}/formulario/informacion-personal/guardar", 
                           json=usuario_data, headers=headers)
    
    if response.status_code == 200:
        print("✅ Usuario creado exitosamente")
        usuario_guardado = response.json()['data']
        id_usuario = usuario_guardado['idUsuario']
        
        # 2. Crear estudios académicos
        estudios_data = [
            {
                "institucion": "Universidad Test",
                "titulo": "Ingeniería de Sistemas",
                "nivelEducativo": "UNIVERSITARIO",
                "fechaInicio": "2015-01-01",
                "fechaFin": "2020-01-01",
                "estado": "COMPLETADO"
            },
            {
                "institucion": "Instituto Test",
                "titulo": "Técnico en Programación",
                "nivelEducativo": "TECNICO",
                "fechaInicio": "2013-01-01",
                "fechaFin": "2014-12-31",
                "estado": "COMPLETADO"
            }
        ]
        
        print("📚 Creando estudios académicos...")
        response = requests.post(f"{API_BASE}/formulario/estudios/guardar", 
                               params={"idUsuario": id_usuario},
                               json=estudios_data, headers=headers)
        
        if response.status_code == 200:
            print("✅ Estudios académicos creados exitosamente")
            return id_usuario
        else:
            print(f"❌ Error al crear estudios: {response.status_code}")
            return None
    else:
        print(f"❌ Error al crear usuario: {response.status_code}")
        return None

def actualizar_estudios(token, id_usuario):
    """Actualizar estudios académicos"""
    headers = {"Authorization": f"Bearer {token}"}
    
    estudios_actualizados = [
        {
            "institucion": "Universidad Test Actualizada",
            "titulo": "Ingeniería de Sistemas Actualizada",
            "nivelEducativo": "UNIVERSITARIO",
            "fechaInicio": "2015-01-01",
            "fechaFin": "2020-01-01",
            "estado": "COMPLETADO"
        }
    ]
    
    print("🔄 Actualizando estudios académicos...")
    response = requests.post(f"{API_BASE}/formulario/estudios/guardar", 
                           params={"idUsuario": id_usuario},
                           json=estudios_actualizados, headers=headers)
    
    if response.status_code == 200:
        print("✅ Estudios académicos actualizados exitosamente")
        return True
    else:
        print(f"❌ Error al actualizar estudios: {response.status_code}")
        return False

def eliminar_estudios(token, id_usuario):
    """Eliminar estudios académicos"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Enviar lista vacía para eliminar
    print("🗑️ Eliminando estudios académicos...")
    response = requests.post(f"{API_BASE}/formulario/estudios/guardar", 
                           params={"idUsuario": id_usuario},
                           json=[], headers=headers)
    
    if response.status_code == 200:
        print("✅ Estudios académicos eliminados exitosamente")
        return True
    else:
        print(f"❌ Error al eliminar estudios: {response.status_code}")
        return False

def analizar_auditoria(auditoria_inicial, auditoria_final):
    """Analizar los cambios en la auditoría"""
    print("\n" + "="*60)
    print("📊 ANÁLISIS DE AUDITORÍA")
    print("="*60)
    
    # Contar registros por tipo de operación
    inserts = [a for a in auditoria_final if a['tipoPeticion'] == 'INSERT']
    updates = [a for a in auditoria_final if a['tipoPeticion'] == 'UPDATE']
    deletes = [a for a in auditoria_final if a['tipoPeticion'] == 'DELETE']
    
    print(f"📈 Total registros de auditoría: {len(auditoria_final)}")
    print(f"➕ INSERTs: {len(inserts)}")
    print(f"🔄 UPDATEs: {len(updates)}")
    print(f"🗑️ DELETEs: {len(deletes)}")
    
    # Verificar duplicados
    descripciones = [a['descripcion'] for a in auditoria_final]
    duplicados = [d for d in set(descripciones) if descripciones.count(d) > 1]
    
    if duplicados:
        print(f"⚠️  Descripciones duplicadas encontradas: {duplicados}")
    else:
        print("✅ No se encontraron descripciones duplicadas")
    
    # Mostrar últimos registros
    print("\n📋 Últimos 5 registros de auditoría:")
    for i, registro in enumerate(auditoria_final[-5:], 1):
        print(f"{i}. [{registro['tipoPeticion']}] {registro['tablaModificada']} - {registro['descripcion']}")

def main():
    print("🧪 INICIANDO PRUEBAS DE AUDITORÍA CORREGIDA")
    print("="*60)
    
    # Obtener token
    token = obtener_token()
    if not token:
        print("❌ No se pudo obtener token. Abortando...")
        return
    
    print(f"✅ Token obtenido: {token[:20]}...")
    
    # Obtener auditoría inicial
    print("\n📊 Obteniendo auditoría inicial...")
    auditoria_inicial = obtener_auditoria()
    print(f"📈 Registros iniciales: {len(auditoria_inicial)}")
    
    # Crear usuario y estudios
    id_usuario = crear_usuario_y_estudios(token)
    if not id_usuario:
        print("❌ No se pudo crear usuario. Abortando...")
        return
    
    time.sleep(2)  # Esperar a que se procese
    
    # Actualizar estudios
    actualizar_estudios(token, id_usuario)
    time.sleep(2)  # Esperar a que se procese
    
    # Eliminar estudios
    eliminar_estudios(token, id_usuario)
    time.sleep(2)  # Esperar a que se procese
    
    # Obtener auditoría final
    print("\n📊 Obteniendo auditoría final...")
    auditoria_final = obtener_auditoria()
    print(f"📈 Registros finales: {len(auditoria_final)}")
    
    # Analizar resultados
    analizar_auditoria(auditoria_inicial, auditoria_final)
    
    print("\n✅ Pruebas completadas")

if __name__ == "__main__":
    main() 