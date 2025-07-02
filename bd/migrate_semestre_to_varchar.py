import sqlite3
import os

def migrate_semestre_to_varchar():
    """Migrar el campo SEMESTRE de INTEGER a VARCHAR(20)"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== MIGRACIÓN DE CAMPO SEMESTRE A VARCHAR(20) ===\n")
    
    try:
        # 1. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        cursor.execute("CREATE TABLE IF NOT EXISTS ESTUDIOS_BACKUP_V2 AS SELECT * FROM ESTUDIOS")
        print("✅ Backup creado: ESTUDIOS_BACKUP_V2")
        
        # Contar registros en backup
        cursor.execute("SELECT COUNT(*) FROM ESTUDIOS_BACKUP_V2")
        count = cursor.fetchone()[0]
        print(f"   Registros en backup: {count}")
        
        # 2. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE ESTUDIOS")
        print("✅ Tabla ESTUDIOS eliminada")
        
        # 3. Crear la nueva tabla con SEMESTRE como VARCHAR(20)
        print("\n3. Creando nueva tabla con SEMESTRE como VARCHAR(20)...")
        
        create_sql = """
        CREATE TABLE ESTUDIOS (
            ID_ESTUDIOS     INTEGER PRIMARY KEY AUTOINCREMENT,
            ID_USUARIO      INTEGER NOT NULL,
            NIVEL_ACADEMICO TEXT NOT NULL,
            INSTITUCION     TEXT NOT NULL,
            PROGRAMA        TEXT,
            SEMESTRE        VARCHAR(20),
            GRADUACION      TEXT,
            VERSION         INTEGER DEFAULT 1,
            FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO)
        )
        """
        
        cursor.execute(create_sql)
        print("✅ Nueva tabla ESTUDIOS creada con SEMESTRE como VARCHAR(20)")
        
        # 4. Migrar datos del backup a la nueva tabla
        print("\n4. Migrando datos del backup...")
        
        # Obtener datos del backup
        cursor.execute("SELECT NIVEL_ACADEMICO, PROGRAMA, INSTITUCION, SEMESTRE, GRADUACION, VERSION, ID_USUARIO FROM ESTUDIOS_BACKUP_V2")
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
        
        # 6. Verificar registros
        cursor.execute("SELECT COUNT(*) FROM ESTUDIOS")
        count = cursor.fetchone()[0]
        print(f"\nRegistros en la nueva tabla: {count}")
        
        if count > 0:
            cursor.execute("SELECT * FROM ESTUDIOS LIMIT 3")
            records = cursor.fetchall()
            print("\nPRIMEROS 3 REGISTROS:")
            for record in records:
                print(f"  {record}")
        
        # 7. Probar inserción con "Graduado"
        print("\n7. Probando inserción con 'Graduado'...")
        test_data = (999, 'Universitario', 'Ingeniería de Sistemas', 'Universidad Test', 'Graduado', 'Sí', 1)
        cursor.execute("""
            INSERT INTO ESTUDIOS (ID_USUARIO, NIVEL_ACADEMICO, PROGRAMA, INSTITUCION, SEMESTRE, GRADUACION, VERSION)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, test_data)
        
        # Verificar que se guardó correctamente
        cursor.execute("SELECT ID_ESTUDIOS, SEMESTRE FROM ESTUDIOS WHERE ID_USUARIO = 999")
        result = cursor.fetchone()
        
        if result and result[1] == 'Graduado':
            print(f"  ✅ 'Graduado' guardado correctamente como string: {result[1]} (tipo: {type(result[1])})")
        else:
            print(f"  ❌ 'Graduado' no se guardó correctamente: {result[1] if result else 'No encontrado'}")
        
        # Limpiar datos de prueba
        cursor.execute("DELETE FROM ESTUDIOS WHERE ID_USUARIO = 999")
        
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
    print("⚠️  ADVERTENCIA: Esta operación modificará el campo SEMESTRE")
    print("   - Se creará un backup automático")
    print("   - Se cambiará SEMESTRE de INTEGER a VARCHAR(20)")
    print("   - Se migrarán los datos existentes")
    print("   - Se podrá almacenar 'Graduado' como string")
    print()
    
    response = input("¿Continuar con la migración? (s/N): ").strip().lower()
    
    if response in ['s', 'si', 'sí', 'y', 'yes']:
        migrate_semestre_to_varchar()
    else:
        print("❌ Migración cancelada") 