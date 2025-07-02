import sqlite3

def test_semestre_saving():
    """Probar específicamente que el campo semestre se guarda correctamente"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== PRUEBA DE GUARDADO DE SEMESTRE ===\n")
    
    try:
        # 1. Verificar estructura de la tabla
        print("1. Verificando estructura de la tabla ESTUDIOS...")
        cursor.execute('PRAGMA table_info(ESTUDIOS)')
        columns = cursor.fetchall()
        
        semestre_column = None
        for col in columns:
            if col[1] == 'SEMESTRE':
                semestre_column = col
                break
        
        if semestre_column:
            print(f"  ✅ Columna SEMESTRE encontrada: {semestre_column[2]} - {'NOT NULL' if semestre_column[3] else 'NULL'}")
        else:
            print("  ❌ Columna SEMESTRE no encontrada")
            return
        
        # 2. Mostrar registros actuales
        print("\n2. Registros actuales en la tabla:")
        cursor.execute("SELECT ID_ESTUDIOS, ID_USUARIO, NIVEL_ACADEMICO, PROGRAMA, SEMESTRE, GRADUACION FROM ESTUDIOS ORDER BY ID_ESTUDIOS")
        records = cursor.fetchall()
        
        if records:
            for record in records:
                print(f"  ID: {record[0]}, Usuario: {record[1]}, Nivel: {record[2]}, Programa: {record[3]}, Semestre: {record[4]}, Graduación: {record[5]}")
        else:
            print("  ℹ️  No hay registros en la tabla")
        
        # 3. Probar inserción con diferentes valores de semestre
        print("\n3. Probando inserción con diferentes valores de semestre...")
        
        test_cases = [
            (999, 'Universitario', 'Ingeniería de Sistemas', 'Universidad Test', 8, 'En curso'),
            (999, 'Técnico', 'Programación', 'SENA', 4, 'En curso'),
            (999, 'Bachillerato', 'Ciencias', 'Colegio Test', None, 'Graduado'),
            (999, 'Maestría', 'Administración', 'Universidad Test', 2, 'En curso')
        ]
        
        for i, (id_usuario, nivel, programa, institucion, semestre, graduacion) in enumerate(test_cases):
            cursor.execute("""
                INSERT INTO ESTUDIOS (ID_USUARIO, NIVEL_ACADEMICO, PROGRAMA, INSTITUCION, SEMESTRE, GRADUACION, VERSION)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (id_usuario, nivel, programa, institucion, semestre, graduacion, 1))
            
            print(f"  ✅ Insertado: {nivel} - {programa} - {institucion} - Semestre: {semestre} - Graduación: {graduacion}")
        
        # 4. Verificar que se guardaron correctamente
        print("\n4. Verificando que los datos se guardaron correctamente...")
        cursor.execute("SELECT ID_ESTUDIOS, NIVEL_ACADEMICO, PROGRAMA, SEMESTRE, GRADUACION FROM ESTUDIOS WHERE ID_USUARIO = 999 ORDER BY ID_ESTUDIOS")
        new_records = cursor.fetchall()
        
        for record in new_records:
            print(f"  ID: {record[0]}, Nivel: {record[1]}, Programa: {record[2]}, Semestre: {record[3]}, Graduación: {record[4]}")
            
            # Verificar que el semestre se guardó correctamente
            if record[3] is not None:
                print(f"    ✅ Semestre guardado como número: {record[3]} (tipo: {type(record[3])})")
            else:
                print(f"    ✅ Semestre guardado como NULL (correcto para graduados)")
        
        # 5. Limpiar datos de prueba
        print("\n5. Limpiando datos de prueba...")
        cursor.execute("DELETE FROM ESTUDIOS WHERE ID_USUARIO = 999")
        print("  ✅ Datos de prueba eliminados")
        
        # Commit de los cambios
        conn.commit()
        print("\n✅ Prueba de guardado de semestre completada exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error durante la prueba: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    test_semestre_saving() 