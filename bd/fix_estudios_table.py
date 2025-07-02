import sqlite3
import os

def backup_table(cursor, table_name):
    """Crear backup de la tabla existente"""
    backup_name = f"{table_name}_BACKUP"
    
    # Verificar si ya existe un backup
    cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{backup_name}'")
    if cursor.fetchone():
        print(f"⚠️  Backup {backup_name} ya existe, eliminando...")
        cursor.execute(f"DROP TABLE {backup_name}")
    
    # Crear backup
    cursor.execute(f"CREATE TABLE {backup_name} AS SELECT * FROM {table_name}")
    print(f"✅ Backup creado: {backup_name}")
    
    # Contar registros en backup
    cursor.execute(f"SELECT COUNT(*) FROM {backup_name}")
    count = cursor.fetchone()[0]
    print(f"   Registros en backup: {count}")

def migrate_estudios_table():
    """Migrar la tabla ESTUDIOS a la estructura correcta"""
    
    # Conectar a la base de datos
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== MIGRACIÓN DE LA TABLA ESTUDIOS ===\n")
    
    try:
        # 1. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        backup_table(cursor, "ESTUDIOS")
        
        # 2. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE ESTUDIOS")
        print("✅ Tabla ESTUDIOS eliminada")
        
        # 3. Crear la nueva tabla con estructura correcta
        print("\n3. Creando nueva tabla con estructura correcta...")
        
        create_sql = """
        CREATE TABLE ESTUDIOS (
            ID_ESTUDIOS     INTEGER PRIMARY KEY AUTOINCREMENT,
            ID_USUARIO      INTEGER NOT NULL,
            NIVEL_ACADEMICO TEXT NOT NULL,
            INSTITUCION     TEXT NOT NULL,
            PROGRAMA        TEXT,
            SEMESTRE        INTEGER,
            GRADUACION      TEXT,
            VERSION         INTEGER DEFAULT 1,
            FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO)
        )
        """
        
        cursor.execute(create_sql)
        print("✅ Nueva tabla ESTUDIOS creada con estructura correcta")
        
        # 4. Migrar datos del backup a la nueva tabla
        print("\n4. Migrando datos del backup...")
        
        # Obtener datos del backup
        cursor.execute("SELECT NIVEL_ACADEMICO, PROGRAMA, INSTITUCION, SEMESTRE, GRADUACION, VERSION, ID_USUARIO FROM ESTUDIOS_BACKUP")
        records = cursor.fetchall()
        
        if records:
            # Insertar datos en la nueva tabla
            insert_sql = """
            INSERT INTO ESTUDIOS (NIVEL_ACADEMICO, PROGRAMA, INSTITUCION, SEMESTRE, GRADUACION, VERSION, ID_USUARIO)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            
            cursor.executemany(insert_sql, records)
            print(f"✅ {len(records)} registros migrados exitosamente")
        else:
            print("ℹ️  No hay datos para migrar")
        
        # 5. Verificar la nueva estructura
        print("\n5. Verificando nueva estructura...")
        cursor.execute('PRAGMA table_info(ESTUDIOS)')
        columns = cursor.fetchall()
        
        print("ESTRUCTURA NUEVA:")
        for col in columns:
            print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
        
        # 6. Verificar autoincrement
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='ESTUDIOS'")
        create_sql = cursor.fetchone()[0]
        
        if "AUTOINCREMENT" in create_sql.upper():
            print("\n✅ ID_ESTUDIOS ahora tiene AUTOINCREMENT")
        else:
            print("\n❌ ID_ESTUDIOS NO tiene AUTOINCREMENT")
        
        # 7. Verificar registros
        cursor.execute("SELECT COUNT(*) FROM ESTUDIOS")
        count = cursor.fetchone()[0]
        print(f"\nRegistros en la nueva tabla: {count}")
        
        if count > 0:
            cursor.execute("SELECT * FROM ESTUDIOS LIMIT 3")
            records = cursor.fetchall()
            print("\nPRIMEROS 3 REGISTROS (con IDs generados):")
            for record in records:
                print(f"  {record}")
        
        # 8. Commit de los cambios
        conn.commit()
        print("\n✅ Migración completada exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error durante la migración: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    # Verificar que el archivo de base de datos existe
    if not os.path.exists('bd.db'):
        print("❌ Error: No se encontró el archivo bd.db")
        exit(1)
    
    # Confirmar antes de proceder
    print("⚠️  ADVERTENCIA: Esta operación modificará la tabla ESTUDIOS")
    print("   - Se creará un backup automático")
    print("   - Se eliminará la tabla actual")
    print("   - Se creará una nueva tabla con estructura correcta")
    print("   - Se migrarán los datos existentes")
    print()
    
    response = input("¿Continuar con la migración? (s/N): ").strip().lower()
    
    if response in ['s', 'si', 'sí', 'y', 'yes']:
        migrate_estudios_table()
    else:
        print("❌ Migración cancelada") 