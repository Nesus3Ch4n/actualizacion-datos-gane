import sqlite3
import os

def fix_vehiculo_table():
    """Migrar la tabla VEHICULO a estructura correcta de SQLite"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== MIGRACIÓN DE TABLA VEHICULO ===\n")
    
    try:
        # 1. Crear backup de la tabla actual
        print("1. Creando backup de la tabla actual...")
        cursor.execute("CREATE TABLE IF NOT EXISTS VEHICULO_BACKUP AS SELECT * FROM VEHICULO")
        print("✅ Backup creado: VEHICULO_BACKUP")
        
        # Contar registros en backup
        cursor.execute("SELECT COUNT(*) FROM VEHICULO_BACKUP")
        count = cursor.fetchone()[0]
        print(f"   Registros en backup: {count}")
        
        # 2. Eliminar la tabla actual
        print("\n2. Eliminando tabla actual...")
        cursor.execute("DROP TABLE VEHICULO")
        print("✅ Tabla VEHICULO eliminada")
        
        # 3. Crear la nueva tabla con estructura correcta
        print("\n3. Creando nueva tabla con estructura correcta...")
        
        create_sql = """
        CREATE TABLE VEHICULO (
            ID_VEHICULO     INTEGER PRIMARY KEY AUTOINCREMENT,
            ID_USUARIO      INTEGER NOT NULL,
            TIPO_VEHICULO   TEXT NOT NULL,
            MARCA           TEXT NOT NULL,
            PLACA           TEXT NOT NULL,
            ANIO            INTEGER NOT NULL,
            PROPIETARIO     TEXT NOT NULL,
            VERSION         INTEGER DEFAULT 1,
            FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO)
        )
        """
        
        cursor.execute(create_sql)
        print("✅ Nueva tabla VEHICULO creada con estructura correcta")
        
        # 4. Migrar datos del backup a la nueva tabla
        print("\n4. Migrando datos del backup...")
        
        # Obtener datos del backup
        cursor.execute("SELECT TIPO_VEHICULO, MARCA, PLACA, ANIO, PROPIETARIO, ID_USUARIO FROM VEHICULO_BACKUP")
        records = cursor.fetchall()
        
        if records:
            # Insertar datos en la nueva tabla
            insert_sql = """
            INSERT INTO VEHICULO (TIPO_VEHICULO, MARCA, PLACA, ANIO, PROPIETARIO, ID_USUARIO)
            VALUES (?, ?, ?, ?, ?, ?)
            """
            
            cursor.executemany(insert_sql, records)
            print(f"✅ {len(records)} registros migrados exitosamente")
        else:
            print("ℹ️  No hay datos para migrar")
        
        # 5. Verificar la nueva estructura
        print("\n5. Verificando nueva estructura...")
        cursor.execute('PRAGMA table_info(VEHICULO)')
        columns = cursor.fetchall()
        
        print("ESTRUCTURA NUEVA:")
        for col in columns:
            print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
        
        # 6. Verificar registros
        cursor.execute("SELECT COUNT(*) FROM VEHICULO")
        count = cursor.fetchone()[0]
        print(f"\nRegistros en la nueva tabla: {count}")
        
        if count > 0:
            cursor.execute("SELECT * FROM VEHICULO LIMIT 3")
            records = cursor.fetchall()
            print("\nPRIMEROS 3 REGISTROS:")
            for record in records:
                print(f"  {record}")
        
        # 7. Probar inserción
        print("\n7. Probando inserción...")
        test_data = (999, 'Automovil', 'Toyota', 'ABC123', 2020, 'Juan Pérez')
        cursor.execute("""
            INSERT INTO VEHICULO (ID_USUARIO, TIPO_VEHICULO, MARCA, PLACA, ANIO, PROPIETARIO)
            VALUES (?, ?, ?, ?, ?, ?)
        """, test_data)
        
        # Verificar que se guardó correctamente
        cursor.execute("SELECT ID_VEHICULO, MARCA, PLACA FROM VEHICULO WHERE ID_USUARIO = 999")
        result = cursor.fetchone()
        
        if result:
            print(f"  ✅ Vehículo de prueba guardado correctamente: ID={result[0]}, {result[1]} - {result[2]}")
        else:
            print("  ❌ Vehículo de prueba no se guardó correctamente")
        
        # Limpiar datos de prueba
        cursor.execute("DELETE FROM VEHICULO WHERE ID_USUARIO = 999")
        
        # 8. Commit de los cambios
        conn.commit()
        print("\n✅ Migración de tabla VEHICULO completada exitosamente")
        
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
    print("⚠️  ADVERTENCIA: Esta operación modificará la tabla VEHICULO")
    print("   - Se creará un backup automático")
    print("   - Se cambiará la estructura a SQLite correcta")
    print("   - Se agregará AUTOINCREMENT al ID_VEHICULO")
    print("   - Se migrarán los datos existentes")
    print()
    
    response = input("¿Continuar con la migración? (s/N): ").strip().lower()
    
    if response in ['s', 'si', 'sí', 'y', 'yes']:
        fix_vehiculo_table()
    else:
        print("❌ Migración cancelada") 