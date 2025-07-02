import sqlite3
from datetime import datetime

def fix_usuario_ids():
    """
    Script para corregir los IDs faltantes en la tabla USUARIO
    """
    
    try:
        conn = sqlite3.connect('bd/bd.db')
        cursor = conn.cursor()
        
        print("=== CORRECCIÓN DE IDs FALTANTES EN TABLA USUARIO ===")
        
        # 1. Verificar registros sin ID
        cursor.execute("SELECT rowid, DOCUMENTO, NOMBRE, ID_USUARIO FROM USUARIO WHERE ID_USUARIO IS NULL")
        registros_sin_id = cursor.fetchall()
        
        print(f"\n🔍 Registros sin ID encontrados: {len(registros_sin_id)}")
        
        if not registros_sin_id:
            print("✅ Todos los registros ya tienen ID asignado")
            return
        
        # 2. Mostrar registros problemáticos
        for i, registro in enumerate(registros_sin_id):
            print(f"  {i+1}. ROWID: {registro[0]} | Cédula: {registro[1]} | Nombre: {registro[2]} | ID: {registro[3]}")
        
        # 3. Obtener el máximo ID actual
        cursor.execute("SELECT MAX(ID_USUARIO) FROM USUARIO WHERE ID_USUARIO IS NOT NULL")
        max_id_result = cursor.fetchone()[0]
        siguiente_id = (max_id_result + 1) if max_id_result else 1
        
        print(f"\n🆔 Próximo ID disponible: {siguiente_id}")
        
        # 4. Asignar IDs a los registros que no los tienen
        print("\n🔧 Asignando IDs a registros faltantes...")
        
        for i, registro in enumerate(registros_sin_id):
            nuevo_id = siguiente_id + i
            rowid = registro[0]
            
            # Actualizar el registro usando rowid
            cursor.execute(
                "UPDATE USUARIO SET ID_USUARIO = ? WHERE rowid = ?", 
                (nuevo_id, rowid)
            )
            
            print(f"  ✅ Registro ROWID {rowid} (Cédula: {registro[1]}) ahora tiene ID: {nuevo_id}")
        
        # 5. Confirmar cambios
        conn.commit()
        print(f"\n💾 Cambios guardados en la base de datos")
        
        # 6. Verificar que se corrigieron todos
        cursor.execute("SELECT COUNT(*) FROM USUARIO WHERE ID_USUARIO IS NULL")
        registros_pendientes = cursor.fetchone()[0]
        
        if registros_pendientes == 0:
            print("✅ Todos los registros ahora tienen ID asignado")
        else:
            print(f"⚠️ Aún quedan {registros_pendientes} registros sin ID")
        
        # 7. Mostrar estado final
        cursor.execute("SELECT ID_USUARIO, DOCUMENTO, NOMBRE FROM USUARIO ORDER BY ID_USUARIO")
        todos_usuarios = cursor.fetchall()
        
        print(f"\n📋 Estado final de la tabla USUARIO ({len(todos_usuarios)} registros):")
        for usuario in todos_usuarios:
            print(f"  ID: {usuario[0]} | Cédula: {usuario[1]} | Nombre: {usuario[2]}")
        
        conn.close()
        print(f"\n✅ Corrección completada exitosamente")
        
    except Exception as e:
        print(f"❌ Error al corregir IDs: {e}")

def verify_autoincrement():
    """
    Verificar que el auto-incremento funcione correctamente
    """
    try:
        conn = sqlite3.connect('bd/bd.db')
        cursor = conn.cursor()
        
        print("\n=== VERIFICACIÓN DE AUTO-INCREMENTO ===")
        
        # Obtener información del esquema de la tabla
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='USUARIO'")
        schema = cursor.fetchone()
        
        if schema:
            print(f"\n📋 Esquema actual de la tabla:")
            print(schema[0])
            
            if 'AUTOINCREMENT' in schema[0].upper():
                print("✅ Auto-incremento está configurado")
            else:
                print("⚠️ Auto-incremento NO está configurado explícitamente")
                print("💡 SQLite usará auto-incremento por defecto para INTEGER PRIMARY KEY")
        
        # Probar inserción para verificar auto-incremento
        print(f"\n🧪 Probando auto-incremento...")
        
        # Obtener máximo ID actual
        cursor.execute("SELECT MAX(ID_USUARIO) FROM USUARIO")
        max_id = cursor.fetchone()[0] or 0
        
        # Insertar usuario de prueba sin especificar ID
        test_documento = 88888888
        cursor.execute("""
            INSERT INTO USUARIO (DOCUMENTO, NOMBRE, CORREO) 
            VALUES (?, ?, ?)
        """, (test_documento, 'Usuario Auto-Test', 'autotest@test.com'))
        
        nuevo_id = cursor.lastrowid
        print(f"✅ Usuario insertado con ID auto-generado: {nuevo_id}")
        print(f"📊 ID anterior máximo: {max_id}, nuevo ID: {nuevo_id}")
        
        if nuevo_id > max_id:
            print("✅ Auto-incremento funciona correctamente")
        else:
            print("⚠️ Posible problema con auto-incremento")
        
        # Limpiar usuario de prueba
        cursor.execute("DELETE FROM USUARIO WHERE ID_USUARIO = ?", (nuevo_id,))
        conn.commit()
        print(f"🧹 Usuario de prueba eliminado")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error en verificación de auto-incremento: {e}")

if __name__ == "__main__":
    fix_usuario_ids()
    verify_autoincrement() 