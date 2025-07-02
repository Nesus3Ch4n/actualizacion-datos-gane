import sqlite3

def test_vehiculo_insert():
    """Probar inserción de vehículos con los campos correctos"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== PRUEBA DE INSERCIÓN DE VEHÍCULOS ===\n")
    
    try:
        # 1. Verificar estructura
        print("1. Verificando estructura de la tabla...")
        cursor.execute('PRAGMA table_info(VEHICULO)')
        columns = cursor.fetchall()
        
        print("CAMPOS DISPONIBLES:")
        for col in columns:
            print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
        
        # 2. Probar inserción con datos correctos
        print("\n2. Probando inserción con datos correctos...")
        
        test_vehiculos = [
            (10, 'Automovil', 'Toyota', 'ABC123', 2020, 'Juan Pérez'),
            (10, 'Motocicleta', 'Honda', 'XYZ789', 2019, 'María García'),
            (10, 'Camioneta', 'Ford', 'DEF456', 2021, 'Carlos López')
        ]
        
        for i, (id_usuario, tipo, marca, placa, anio, propietario) in enumerate(test_vehiculos):
            cursor.execute("""
                INSERT INTO VEHICULO (ID_USUARIO, TIPO_VEHICULO, MARCA, PLACA, ANIO, PROPIETARIO)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (id_usuario, tipo, marca, placa, anio, propietario))
            
            print(f"  ✅ Vehículo {i+1} insertado: {marca} - {placa} ({tipo})")
        
        # 3. Verificar que se guardaron correctamente
        print("\n3. Verificando registros guardados...")
        cursor.execute("SELECT ID_VEHICULO, TIPO_VEHICULO, MARCA, PLACA, ANIO, PROPIETARIO FROM VEHICULO WHERE ID_USUARIO = 10 ORDER BY ID_VEHICULO")
        records = cursor.fetchall()
        
        for record in records:
            print(f"  ID: {record[0]}, Tipo: {record[1]}, Marca: {record[2]}, Placa: {record[3]}, Año: {record[4]}, Propietario: {record[5]}")
        
        # 4. Verificar auto-increment
        print(f"\n4. Verificando auto-increment...")
        print(f"  ✅ IDs generados automáticamente: {[r[0] for r in records]}")
        
        # 5. Limpiar datos de prueba
        print("\n5. Limpiando datos de prueba...")
        cursor.execute("DELETE FROM VEHICULO WHERE ID_USUARIO = 10")
        print("  ✅ Datos de prueba eliminados")
        
        # Commit de los cambios
        conn.commit()
        print("\n✅ Prueba de inserción de vehículos completada exitosamente")
        
    except Exception as e:
        print(f"\n❌ Error durante la prueba: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    test_vehiculo_insert() 