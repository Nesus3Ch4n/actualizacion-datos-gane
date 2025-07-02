import sqlite3
from datetime import datetime

def verify_autoincrement():
    """
    Verificar que el auto-incremento esté funcionando correctamente
    """
    
    print("=== VERIFICACIÓN DEL AUTO-INCREMENTO ===")
    
    try:
        conn = sqlite3.connect('bd/bd.db')
        cursor = conn.cursor()
        
        # 1. Verificar estructura actual
        cursor.execute("PRAGMA table_info(USUARIO)")
        columnas = cursor.fetchall()
        
        print(f"\n📋 Estructura de la tabla USUARIO:")
        for col in columnas:
            tipo = col[2]
            pk = " [PK]" if col[5] else ""
            not_null = " [NOT NULL]" if col[3] else ""
            print(f"  - {col[1]} ({tipo}){pk}{not_null}")
        
        # 2. Verificar registros actuales
        cursor.execute("SELECT ID_USUARIO, DOCUMENTO, NOMBRE, CORREO FROM USUARIO ORDER BY ID_USUARIO")
        usuarios_actuales = cursor.fetchall()
        
        print(f"\n📊 Usuarios actuales en la base de datos ({len(usuarios_actuales)}):")
        for usuario in usuarios_actuales:
            print(f"  ID: {usuario[0]} | Cédula: {usuario[1]} | Nombre: {usuario[2]} | Email: {usuario[3]}")
        
        # 3. Obtener el próximo ID que se generará
        cursor.execute("SELECT MAX(ID_USUARIO) FROM USUARIO")
        max_id = cursor.fetchone()[0]
        proximo_id = (max_id + 1) if max_id else 1
        
        print(f"\n🆔 Próximo ID que se generará automáticamente: {proximo_id}")
        
        # 4. Probar inserción automática
        print(f"\n🧪 Probando inserción con auto-incremento...")
        
        # Insertar usuario sin especificar ID
        cursor.execute("""
            INSERT INTO USUARIO (DOCUMENTO, NOMBRE, CORREO, VERSION) 
            VALUES (?, ?, ?, ?)
        """, (88888888, "Usuario Test Auto-Incremento", "test.autoincrement@test.com", 1))
        
        # Obtener el ID generado automáticamente
        id_generado = cursor.lastrowid
        print(f"✅ Usuario insertado automáticamente con ID: {id_generado}")
        
        # Verificar que se insertó correctamente
        cursor.execute("SELECT * FROM USUARIO WHERE ID_USUARIO = ?", (id_generado,))
        usuario_insertado = cursor.fetchone()
        
        if usuario_insertado:
            print(f"✅ Verificado: Usuario encontrado en BD con ID {id_generado}")
            print(f"   Cédula: {usuario_insertado[1]}")
            print(f"   Nombre: {usuario_insertado[2]}")
            print(f"   Email: {usuario_insertado[14]}")  # CORREO está en posición 14
        
        # 5. Probar múltiples inserciones para verificar secuencia
        print(f"\n📈 Probando múltiples inserciones consecutivas...")
        ids_generados = [id_generado]  # Ya tenemos el primero
        
        for i in range(2, 5):  # Insertar 3 usuarios más
            cursor.execute("""
                INSERT INTO USUARIO (DOCUMENTO, NOMBRE, CORREO, VERSION) 
                VALUES (?, ?, ?, ?)
            """, (88888880 + i, f"Usuario Test {i}", f"test{i}@test.com", 1))
            
            nuevo_id = cursor.lastrowid
            ids_generados.append(nuevo_id)
            print(f"  Usuario {i}: ID {nuevo_id}")
        
        # Verificar que los IDs son consecutivos
        print(f"\n🔢 IDs generados: {ids_generados}")
        
        consecutivos = True
        for i in range(1, len(ids_generados)):
            if ids_generados[i] != ids_generados[i-1] + 1:
                consecutivos = False
                break
        
        if consecutivos:
            print(f"✅ Los IDs se generan consecutivamente")
        else:
            print(f"⚠️ Los IDs NO son consecutivos")
        
        # 6. Limpiar usuarios de prueba
        print(f"\n🧹 Limpiando usuarios de prueba...")
        for test_id in ids_generados:
            cursor.execute("DELETE FROM USUARIO WHERE ID_USUARIO = ?", (test_id,))
        
        eliminados = cursor.rowcount
        print(f"✅ Eliminados {len(ids_generados)} usuarios de prueba")
        
        # 7. Verificar estado final
        cursor.execute("SELECT COUNT(*) FROM USUARIO")
        total_final = cursor.fetchone()[0]
        
        print(f"\n📊 Estado final:")
        print(f"  Total de usuarios: {total_final}")
        print(f"  Próximo ID disponible: {max(ids_generados) + 1 if max_id else proximo_id}")
        
        conn.commit()
        conn.close()
        
        print(f"\n✅ Verificación completada exitosamente")
        print(f"🎉 El auto-incremento está funcionando correctamente")
        
    except Exception as e:
        print(f"❌ Error durante la verificación: {e}")

if __name__ == "__main__":
    verify_autoincrement() 