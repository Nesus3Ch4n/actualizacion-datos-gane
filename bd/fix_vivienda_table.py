import sqlite3
import os

def fix_vivienda_table():
    """Migrar la tabla VIVIENDA a estructura correcta de SQLite"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== MIGRACIÓN DE TABLA VIVIENDA ===\n")
    
    try:
        # 1. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        cursor.execute("CREATE TABLE IF NOT EXISTS VIVIENDA_BACKUP AS SELECT * FROM VIVIENDA")
        print("✅ Backup creado: VIVIENDA_BACKUP")
        
        # Contar registros en backup
        cursor.execute("SELECT COUNT(*) FROM VIVIENDA_BACKUP")
        count = cursor.fetchone()[0]
        print(f"   Registros en backup: {count}")
        
        # 2. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE IF EXISTS VIVIENDA")
        print("✅ Tabla VIVIENDA eliminada")
        
        # 3. Crear nueva tabla con estructura correcta
        print("\n3. Creando nueva tabla con estructura correcta...")
        cursor.execute("""
            CREATE TABLE VIVIENDA (
                ID_VIVIENDA INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_USUARIO INTEGER NOT NULL,
                TIPO_VIVIENDA TEXT,
                DIRECCION TEXT,
                INFO_ADICIONAL TEXT,
                BARRIO TEXT,
                CIUDAD TEXT,
                VIVIENDA TEXT,
                ENTIDAD TEXT,
                ANIO INTEGER,
                TIPO_ADQUISICION TEXT
            )
        """)
        print("✅ Nueva tabla VIVIENDA creada con estructura correcta")
        
        # 4. Verificar estructura
        print("\n4. Verificando nueva estructura...")
        cursor.execute('PRAGMA table_info(VIVIENDA)')
        columns = cursor.fetchall()
        
        print("ESTRUCTURA NUEVA:")
        for col in columns:
            print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
        
        # 5. Migrar datos del backup si existen
        if count > 0:
            print(f"\n5. Migrando {count} registros del backup...")
            
            # Obtener datos del backup
            cursor.execute("SELECT * FROM VIVIENDA_BACKUP")
            old_data = cursor.fetchall()
            
            # Insertar en nueva tabla
            for row in old_data:
                cursor.execute("""
                    INSERT INTO VIVIENDA (
                        ID_USUARIO, TIPO_VIVIENDA, DIRECCION, INFO_ADICIONAL,
                        BARRIO, CIUDAD, VIVIENDA, ENTIDAD, ANIO, TIPO_ADQUISICION
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, row[1:])  # Excluir el ID original
            
            print(f"✅ {len(old_data)} registros migrados exitosamente")
        else:
            print("\n5. No hay datos para migrar")
        
        # 6. Verificar datos migrados
        cursor.execute("SELECT COUNT(*) FROM VIVIENDA")
        new_count = cursor.fetchone()[0]
        print(f"\n6. Registros en nueva tabla: {new_count}")
        
        # 7. Probar inserción de datos de prueba
        print("\n7. Probando inserción de datos de prueba...")
        test_data = (
            10,  # ID_USUARIO
            'Casa',  # TIPO_VIVIENDA
            'Calle 123 #45-67',  # DIRECCION
            'Casa de 2 pisos',  # INFO_ADICIONAL
            'Centro',  # BARRIO
            'Bogotá',  # CIUDAD
            'Propia',  # VIVIENDA
            'Banco XYZ',  # ENTIDAD
            2020,  # ANIO
            'Compra'  # TIPO_ADQUISICION
        )
        
        cursor.execute("""
            INSERT INTO VIVIENDA (
                ID_USUARIO, TIPO_VIVIENDA, DIRECCION, INFO_ADICIONAL,
                BARRIO, CIUDAD, VIVIENDA, ENTIDAD, ANIO, TIPO_ADQUISICION
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, test_data)
        
        # Verificar inserción
        cursor.execute("SELECT * FROM VIVIENDA WHERE ID_USUARIO = 10")
        result = cursor.fetchone()
        
        if result:
            print(f"✅ Inserción de prueba exitosa: ID={result[0]}, {result[2]} en {result[5]}")
        else:
            print("❌ Error en inserción de prueba")
        
        # Limpiar datos de prueba
        cursor.execute("DELETE FROM VIVIENDA WHERE ID_USUARIO = 10")
        print("✅ Datos de prueba eliminados")
        
        # 8. Eliminar backup
        print("\n8. Eliminando backup...")
        cursor.execute("DROP TABLE IF EXISTS VIVIENDA_BACKUP")
        print("✅ Backup eliminado")
        
        # Commit cambios
        conn.commit()
        print("\n✅ Migración completada exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error durante la migración: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    fix_vivienda_table() 