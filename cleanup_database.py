import sqlite3

def cleanup_database():
    """
    Limpiar registros duplicados y de prueba en la base de datos
    """
    
    try:
        conn = sqlite3.connect('bd/bd.db')
        cursor = conn.cursor()
        
        print("=== LIMPIEZA DE BASE DE DATOS ===")
        
        # 1. Mostrar estado actual
        cursor.execute("SELECT ID_USUARIO, DOCUMENTO, NOMBRE, CORREO FROM USUARIO ORDER BY ID_USUARIO")
        todos_usuarios = cursor.fetchall()
        
        print(f"\n📋 Estado actual ({len(todos_usuarios)} registros):")
        for usuario in todos_usuarios:
            print(f"  ID: {usuario[0]} | Cédula: {usuario[1]} | Nombre: {usuario[2]} | Email: {usuario[3]}")
        
        # 2. Eliminar registro de prueba (cédula 99999999)
        cursor.execute("DELETE FROM USUARIO WHERE DOCUMENTO = ?", (99999999,))
        prueba_eliminados = cursor.rowcount
        if prueba_eliminados > 0:
            print(f"\n🧹 Eliminados {prueba_eliminados} registro(s) de prueba (cédula 99999999)")
        
        # 3. Buscar y manejar duplicados por cédula
        cursor.execute("""
            SELECT DOCUMENTO, COUNT(*) as count 
            FROM USUARIO 
            GROUP BY DOCUMENTO 
            HAVING COUNT(*) > 1
        """)
        duplicados = cursor.fetchall()
        
        if duplicados:
            print(f"\n⚠️ Cédulas duplicadas encontradas:")
            for cedula, count in duplicados:
                print(f"  Cédula {cedula}: {count} registros")
                
                # Obtener todos los registros de esta cédula
                cursor.execute("""
                    SELECT ID_USUARIO, DOCUMENTO, NOMBRE, CORREO, FECHA_ACTUALIZACION 
                    FROM USUARIO 
                    WHERE DOCUMENTO = ? 
                    ORDER BY ID_USUARIO
                """, (cedula,))
                registros_cedula = cursor.fetchall()
                
                print(f"    Registros encontrados:")
                for reg in registros_cedula:
                    print(f"      ID: {reg[0]} | Nombre: {reg[2]} | Email: {reg[3]} | Fecha: {reg[4]}")
                
                # Mantener solo el primer registro (ID más bajo) y eliminar los demás
                ids_a_eliminar = [reg[0] for reg in registros_cedula[1:]]  # Todos excepto el primero
                
                if ids_a_eliminar:
                    print(f"    🗑️ Eliminando registros duplicados con IDs: {ids_a_eliminar}")
                    for id_eliminar in ids_a_eliminar:
                        cursor.execute("DELETE FROM USUARIO WHERE ID_USUARIO = ?", (id_eliminar,))
        else:
            print(f"\n✅ No se encontraron duplicados por cédula")
        
        # 4. Confirmar cambios
        conn.commit()
        
        # 5. Mostrar estado final
        cursor.execute("SELECT ID_USUARIO, DOCUMENTO, NOMBRE, CORREO FROM USUARIO ORDER BY ID_USUARIO")
        usuarios_finales = cursor.fetchall()
        
        print(f"\n📋 Estado final ({len(usuarios_finales)} registros):")
        for usuario in usuarios_finales:
            print(f"  ID: {usuario[0]} | Cédula: {usuario[1]} | Nombre: {usuario[2]} | Email: {usuario[3]}")
        
        conn.close()
        print(f"\n✅ Limpieza completada exitosamente")
        
    except Exception as e:
        print(f"❌ Error en la limpieza: {e}")

if __name__ == "__main__":
    cleanup_database() 