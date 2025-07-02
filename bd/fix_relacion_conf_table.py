import sqlite3

def fix_relacion_conf_table():
    """Migrar la tabla RELACION_CONF a estructura correcta de SQLite"""
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()

    print("=== MIGRACIÓN DE TABLA RELACION_CONF ===\n")

    try:
        # 1. Verificar si la tabla existe
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='RELACION_CONF'")
        if not cursor.fetchone():
            print("❌ La tabla RELACION_CONF no existe")
            return

        # 2. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        cursor.execute("CREATE TABLE IF NOT EXISTS RELACION_CONF_BACKUP AS SELECT * FROM RELACION_CONF")
        print("✅ Backup creado: RELACION_CONF_BACKUP")

        # Contar registros en backup
        cursor.execute("SELECT COUNT(*) FROM RELACION_CONF_BACKUP")
        count = cursor.fetchone()[0]
        print(f"   Registros en backup: {count}")

        # 3. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE IF EXISTS RELACION_CONF")
        print("✅ Tabla RELACION_CONF eliminada")

        # 4. Crear nueva tabla con estructura correcta
        print("\n3. Creando nueva tabla RELACION_CONF...")
        cursor.execute("""
            CREATE TABLE RELACION_CONF (
                ID_RELACION_CONF INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_USUARIO INTEGER NOT NULL,
                NOMBRE_COMPLETO TEXT,
                PARENTESCO TEXT,
                TIPO_PARTE_ASOC TEXT,
                TIENE_CL TEXT,
                ACTUALIZADO TEXT,
                VERSION INTEGER DEFAULT 1,
                FECHA_CREACION TEXT
            )
        """)
        print("✅ Nueva tabla RELACION_CONF creada con estructura correcta")

        # 5. Migrar datos si existen
        if count > 0:
            print(f"\n4. Migrando {count} registros...")
            cursor.execute("""
                INSERT INTO RELACION_CONF (ID_USUARIO, NOMBRE_COMPLETO, PARENTESCO, TIPO_PARTE_ASOC, TIENE_CL, ACTUALIZADO, VERSION, FECHA_CREACION)
                SELECT ID_USUARIO, NOMBRE_COMPLETO, PARENTESCO, TIPO_PARTE_ASOC, TIENE_CL, ACTUALIZADO, VERSION, FECHA_CREACION
                FROM RELACION_CONF_BACKUP
            """)
            print("✅ Datos migrados correctamente")
        else:
            print("\n4. No hay datos para migrar")

        # 6. Verificar la nueva estructura
        print("\n5. Verificando nueva estructura...")
        cursor.execute('PRAGMA table_info(RELACION_CONF)')
        columns = cursor.fetchall()
        
        print("NUEVA ESTRUCTURA:")
        for col in columns:
            pk = "PK" if col[5] else ""
            not_null = "NOT NULL" if col[3] else "NULL"
            print(f"  {col[1]} ({col[2]}) - {not_null} - {pk}")

        # 7. Verificar registros
        cursor.execute("SELECT COUNT(*) FROM RELACION_CONF")
        new_count = cursor.fetchone()[0]
        print(f"\nRegistros en nueva tabla: {new_count}")

        # 8. Commit y cerrar
        conn.commit()
        print("\n✅ Migración completada exitosamente")

    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_relacion_conf_table() 