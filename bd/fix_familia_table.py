import sqlite3


def fix_familia_table():
    """Migrar la tabla FAMILIA a estructura correcta de SQLite"""
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()

    print("=== MIGRACIÓN DE TABLA FAMILIA ===\n")

    try:
        # 1. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        cursor.execute("CREATE TABLE IF NOT EXISTS FAMILIA_BACKUP AS SELECT * FROM FAMILIA")
        print("✅ Backup creado: FAMILIA_BACKUP")

        # Contar registros en backup
        cursor.execute("SELECT COUNT(*) FROM FAMILIA_BACKUP")
        count = cursor.fetchone()[0]
        print(f"   Registros en backup: {count}")

        # 2. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE IF EXISTS FAMILIA")
        print("✅ Tabla FAMILIA eliminada")

        # 3. Crear nueva tabla con estructura correcta
        print("\n3. Creando nueva tabla con estructura correcta...")
        cursor.execute("""
            CREATE TABLE FAMILIA (
                ID_FAMILIA INTEGER PRIMARY KEY AUTOINCREMENT,
                NOMBRE TEXT,
                PARENTESCO TEXT,
                FECHA_NACIMIENTO TEXT,
                EDAD INTEGER,
                VERSION INTEGER,
                ID_USUARIO INTEGER
            )
        """)
        print("✅ Nueva tabla FAMILIA creada con estructura correcta")

        # 4. Verificar estructura
        print("\n4. Verificando nueva estructura...")
        cursor.execute('PRAGMA table_info(FAMILIA)')
        columns = cursor.fetchall()
        print("ESTRUCTURA NUEVA:")
        for col in columns:
            print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")

        # 5. Migrar datos del backup si existen
        if count > 0:
            print(f"\n5. Migrando {count} registros del backup...")
            cursor.execute("SELECT * FROM FAMILIA_BACKUP")
            old_data = cursor.fetchall()
            for row in old_data:
                cursor.execute("""
                    INSERT INTO FAMILIA (
                        NOMBRE, PARENTESCO, FECHA_NACIMIENTO, EDAD, VERSION, ID_USUARIO
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, row[1:])  # Excluir el ID original
            print(f"✅ {len(old_data)} registros migrados exitosamente")
        else:
            print("\n5. No hay datos para migrar")

        # 6. Verificar datos migrados
        cursor.execute("SELECT COUNT(*) FROM FAMILIA")
        new_count = cursor.fetchone()[0]
        print(f"\n6. Registros en nueva tabla: {new_count}")

        # 7. Probar inserción de datos de prueba
        print("\n7. Probando inserción de datos de prueba...")
        test_data = (
            'Juan Perez',  # NOMBRE
            'Hijo',        # PARENTESCO
            '2010-05-15',  # FECHA_NACIMIENTO (YYYY-MM-DD)
            13,            # EDAD
            1,             # VERSION
            10             # ID_USUARIO
        )
        cursor.execute("""
            INSERT INTO FAMILIA (
                NOMBRE, PARENTESCO, FECHA_NACIMIENTO, EDAD, VERSION, ID_USUARIO
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, test_data)
        cursor.execute("SELECT * FROM FAMILIA WHERE ID_USUARIO = 10")
        result = cursor.fetchone()
        if result:
            print(f"✅ Inserción de prueba exitosa: ID={result[0]}, {result[1]} ({result[2]})")
        else:
            print("❌ Error en inserción de prueba")
        cursor.execute("DELETE FROM FAMILIA WHERE ID_USUARIO = 10")
        print("✅ Datos de prueba eliminados")

        # 8. Eliminar backup
        print("\n8. Eliminando backup...")
        cursor.execute("DROP TABLE IF EXISTS FAMILIA_BACKUP")
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
    fix_familia_table() 