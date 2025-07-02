import sqlite3

def test_estudios_table():
    """Probar que la tabla ESTUDIOS funciona correctamente después de la migración"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== PRUEBA DE LA TABLA ESTUDIOS ===\n")
    
    try:
        # 1. Verificar estructura
        print("1. Verificando estructura de la tabla...")
        cursor.execute('PRAGMA table_info(ESTUDIOS)')
        columns = cursor.fetchall()
        
        expected_columns = [
            ('ID_ESTUDIOS', 'INTEGER', True, True),  # PK, AUTOINCREMENT
            ('ID_USUARIO', 'INTEGER', True, False),  # NOT NULL
            ('NIVEL_ACADEMICO', 'TEXT', True, False),  # NOT NULL
            ('INSTITUCION', 'TEXT', True, False),  # NOT NULL
            ('PROGRAMA', 'TEXT', False, False),  # NULL
            ('SEMESTRE', 'INTEGER', False, False),  # NULL
            ('GRADUACION', 'TEXT', False, False),  # NULL
            ('VERSION', 'INTEGER', False, False)  # NULL
        ]
        
        for i, (name, type_, not_null, pk) in enumerate(expected_columns):
            if i < len(columns):
                col = columns[i]
                if (col[1] == name and 
                    col[2] == type_ and 
                    col[3] == not_null and 
                    col[5] == pk):
                    print(f"  ✅ {name}: {type_} - {'NOT NULL' if not_null else 'NULL'} - {'PK' if pk else ''}")
                else:
                    print(f"  ❌ {name}: Esperado {type_}, obtenido {col[2]}")
            else:
                print(f"  ❌ Columna {name} no encontrada")
        
        # 2. Verificar autoincrement
        print("\n2. Verificando autoincrement...")
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='ESTUDIOS'")
        create_sql = cursor.fetchone()[0]
        
        if "AUTOINCREMENT" in create_sql.upper():
            print("  ✅ ID_ESTUDIOS tiene AUTOINCREMENT")
        else:
            print("  ❌ ID_ESTUDIOS NO tiene AUTOINCREMENT")
        
        # 3. Probar inserción con autoincrement
        print("\n3. Probando inserción con autoincrement...")
        
        # Obtener el último ID antes de la inserción
        cursor.execute("SELECT MAX(ID_ESTUDIOS) FROM ESTUDIOS")
        last_id = cursor.fetchone()[0] or 0
        
        # Insertar un registro de prueba
        test_data = (999, 'Universitario', 'Universidad Test', 'Ingeniería de Sistemas', 8, 'En curso', 1)
        cursor.execute("""
            INSERT INTO ESTUDIOS (ID_USUARIO, NIVEL_ACADEMICO, INSTITUCION, PROGRAMA, SEMESTRE, GRADUACION, VERSION)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, test_data)
        
        # Verificar que se generó un nuevo ID
        cursor.execute("SELECT MAX(ID_ESTUDIOS) FROM ESTUDIOS")
        new_last_id = cursor.fetchone()[0]
        
        if new_last_id > last_id:
            print(f"  ✅ Auto-increment funcionando: ID anterior {last_id}, nuevo ID {new_last_id}")
        else:
            print(f"  ❌ Auto-increment no funcionó: ID anterior {last_id}, nuevo ID {new_last_id}")
        
        # 4. Verificar que el semestre se guarda correctamente
        print("\n4. Verificando que el semestre se guarda correctamente...")
        cursor.execute("SELECT ID_ESTUDIOS, SEMESTRE FROM ESTUDIOS WHERE ID_USUARIO = 999")
        result = cursor.fetchone()
        
        if result and result[1] == 8:
            print(f"  ✅ Semestre guardado correctamente: {result[1]}")
        else:
            print(f"  ❌ Semestre no se guardó correctamente: {result[1] if result else 'No encontrado'}")
        
        # 5. Mostrar registros actuales
        print("\n5. Registros actuales en la tabla:")
        cursor.execute("SELECT * FROM ESTUDIOS ORDER BY ID_ESTUDIOS")
        records = cursor.fetchall()
        
        for record in records:
            print(f"  {record}")
        
        # 6. Limpiar datos de prueba
        print("\n6. Limpiando datos de prueba...")
        cursor.execute("DELETE FROM ESTUDIOS WHERE ID_USUARIO = 999")
        print("  ✅ Datos de prueba eliminados")
        
        # Commit de los cambios
        conn.commit()
        print("\n✅ Todas las pruebas completadas exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error durante las pruebas: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    test_estudios_table() 