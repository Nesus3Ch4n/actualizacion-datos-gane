import sqlite3

def fix_contacto_table():
    """Migrar la tabla CONTACTO a estructura correcta de SQLite"""
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()

    print("=== MIGRACIÓN DE TABLA CONTACTO ===\n")

    try:
        # 1. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        cursor.execute("CREATE TABLE IF NOT EXISTS CONTACTO_BACKUP AS SELECT * FROM CONTACTO")
        print("✅ Backup creado: CONTACTO_BACKUP")

        # Contar registros en backup
        cursor.execute("SELECT COUNT(*) FROM CONTACTO_BACKUP")
        count = cursor.fetchone()[0]
        print(f"   Registros en backup: {count}")

        # 2. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE IF EXISTS CONTACTO")
        print("✅ Tabla CONTACTO eliminada")

        # 3. Crear nueva tabla con estructura correcta
        print("\n3. Creando nueva tabla CONTACTO...")
        cursor.execute("""
            CREATE TABLE CONTACTO (
                ID_CONTACTO INTEGER PRIMARY KEY AUTOINCREMENT,
                ID_USUARIO INTEGER NOT NULL,
                NOMBRE_COMPLETO TEXT,
                PARENTESCO TEXT,
                NUMERO_CELULAR TEXT,
                VERSION INTEGER DEFAULT 1
            )
        """)
        print("✅ Nueva tabla CONTACTO creada con estructura correcta")

        # 4. Migrar datos si existen
        if count > 0:
            print(f"\n4. Migrando {count} registros...")
            cursor.execute("""
                INSERT INTO CONTACTO (ID_USUARIO, NOMBRE_COMPLETO, PARENTESCO, NUMERO_CELULAR, VERSION)
                SELECT ID_USUARIO, NOMBRE_COMPLETO, PARENTESCO, NUMERO_CELULAR, VERSION
                FROM CONTACTO_BACKUP
            """)
            print("✅ Datos migrados correctamente")
        else:
            print("\n4. No hay datos para migrar")

        # 5. Verificar la nueva estructura
        print("\n5. Verificando nueva estructura...")
        cursor.execute('PRAGMA table_info(CONTACTO)')
        columns = cursor.fetchall()
        
        print("NUEVA ESTRUCTURA:")
        for col in columns:
            pk = "PK" if col[5] else ""
            not_null = "NOT NULL" if col[3] else "NULL"
            print(f"  {col[1]} ({col[2]}) - {not_null} - {pk}")

        # 6. Verificar registros
        cursor.execute("SELECT COUNT(*) FROM CONTACTO")
        new_count = cursor.fetchone()[0]
        print(f"\nRegistros en nueva tabla: {new_count}")

        # 7. Commit y cerrar
        conn.commit()
        print("\n✅ Migración completada exitosamente")

    except Exception as e:
        print(f"❌ Error durante la migración: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_contacto_table() 