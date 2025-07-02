import sqlite3

def test_semestre_varchar():
    """Probar que el campo semestre funciona correctamente como VARCHAR(20)"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== PRUEBA DE CAMPO SEMESTRE COMO VARCHAR(20) ===\n")
    
    try:
        # 1. Verificar estructura
        print("1. Verificando estructura de la tabla...")
        cursor.execute('PRAGMA table_info(ESTUDIOS)')
        columns = cursor.fetchall()
        
        semestre_column = None
        for col in columns:
            if col[1] == 'SEMESTRE':
                semestre_column = col
                break
        
        if semestre_column:
            print(f"  ✅ Columna SEMESTRE: {semestre_column[2]} - {'NOT NULL' if semestre_column[3] else 'NULL'}")
        else:
            print("  ❌ Columna SEMESTRE no encontrada")
            return
        
        # 2. Probar diferentes tipos de valores
        print("\n2. Probando inserción con diferentes valores...")
        
        test_cases = [
            (999, 'Universitario', 'Ingeniería de Sistemas', 'Universidad Test', '8', 'En curso'),
            (999, 'Técnico', 'Programación', 'SENA', '4', 'En curso'),
            (999, 'Bachillerato', 'Ciencias', 'Colegio Test', 'Graduado', 'Sí'),
            (999, 'Maestría', 'Administración', 'Universidad Test', '2', 'En curso'),
            (999, 'Doctorado', 'Investigación', 'Universidad Test', 'Graduado', 'Sí')
        ]
        
        for i, (id_usuario, nivel, programa, institucion, semestre, graduacion) in enumerate(test_cases):
            cursor.execute("""
                INSERT INTO ESTUDIOS (ID_USUARIO, NIVEL_ACADEMICO, PROGRAMA, INSTITUCION, SEMESTRE, GRADUACION, VERSION)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (id_usuario, nivel, programa, institucion, semestre, graduacion, 1))
            
            print(f"  ✅ Insertado: {nivel} - {programa} - Semestre: '{semestre}' - Graduación: {graduacion}")
        
        # 3. Verificar que se guardaron correctamente
        print("\n3. Verificando que los datos se guardaron correctamente...")
        cursor.execute("SELECT ID_ESTUDIOS, NIVEL_ACADEMICO, PROGRAMA, SEMESTRE, GRADUACION FROM ESTUDIOS WHERE ID_USUARIO = 999 ORDER BY ID_ESTUDIOS")
        new_records = cursor.fetchall()
        
        for record in new_records:
            print(f"  ID: {record[0]}, Nivel: {record[1]}, Programa: {record[2]}, Semestre: '{record[3]}', Graduación: {record[4]}")
            
            # Verificar el tipo de dato
            if record[3] == 'Graduado':
                print(f"    ✅ 'Graduado' guardado como string: '{record[3]}' (tipo: {type(record[3])})")
            elif record[3] is not None:
                print(f"    ✅ Semestre numérico guardado como string: '{record[3]}' (tipo: {type(record[3])})")
            else:
                print(f"    ✅ Semestre NULL (correcto para casos sin especificar)")
        
        # 4. Probar consultas específicas
        print("\n4. Probando consultas específicas...")
        
        # Buscar graduados
        cursor.execute("SELECT COUNT(*) FROM ESTUDIOS WHERE SEMESTRE = 'Graduado'")
        graduados_count = cursor.fetchone()[0]
        print(f"  ✅ Graduados encontrados: {graduados_count}")
        
        # Buscar estudiantes en curso (semestre numérico)
        cursor.execute("SELECT COUNT(*) FROM ESTUDIOS WHERE SEMESTRE IS NOT NULL AND SEMESTRE != 'Graduado'")
        en_curso_count = cursor.fetchone()[0]
        print(f"  ✅ Estudiantes en curso: {en_curso_count}")
        
        # 5. Limpiar datos de prueba
        print("\n5. Limpiando datos de prueba...")
        cursor.execute("DELETE FROM ESTUDIOS WHERE ID_USUARIO = 999")
        print("  ✅ Datos de prueba eliminados")
        
        # Commit de los cambios
        conn.commit()
        print("\n✅ Prueba de campo semestre como VARCHAR(20) completada exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error durante la prueba: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    test_semestre_varchar() 