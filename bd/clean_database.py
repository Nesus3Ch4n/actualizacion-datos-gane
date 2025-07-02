import sqlite3

# Conectar a la base de datos
conn = sqlite3.connect('bd.db')
cursor = conn.cursor()

print("=== LIMPIEZA DE LA BASE DE DATOS ===\n")

# 1. Eliminar tablas en minúsculas que no necesitamos
tablas_eliminar = ['HTE_usuario', 'estudios_academicos', 'personas_a_cargo', 'vehiculos', 'contactos_emergencia']

print("ELIMINANDO TABLAS INNECESARIAS:")
for tabla in tablas_eliminar:
    try:
        cursor.execute(f"DROP TABLE IF EXISTS {tabla}")
        print(f"  ❌ Tabla '{tabla}' eliminada")
    except Exception as e:
        print(f"  ⚠️  Error eliminando tabla '{tabla}': {e}")

# 2. Crear una nueva tabla USUARIO con solo los campos necesarios
print("\nCREANDO NUEVA ESTRUCTURA DE LA TABLA USUARIO:")

# Primero, crear una tabla temporal con la estructura correcta
create_temp_table = """
CREATE TABLE USUARIO_TEMP (
    ID_USUARIO NUMBER PRIMARY KEY,
    DOCUMENTO NUMBER,
    NOMBRE VARCHAR2(100),
    FECHA_NACIMIENTO DATE,
    CEDULA_EXPEDICION VARCHAR2(100),
    PAIS_NACIMIENTO VARCHAR2(100),
    CIUDAD_NACIMIENTO VARCHAR2(100),
    CARGO VARCHAR2(100),
    AREA VARCHAR2(100),
    ESTADO_CIVIL VARCHAR2(50),
    TIPO_SANGRE VARCHAR2(3),
    NUMERO_FIJO NUMBER(25),
    NUMERO_CELULAR NUMBER(25),
    NUMERO_CORP NUMBER,
    CORREO VARCHAR2(50),
    VERSION NUMBER,
    FECHA_ACTUALIZACION timestamp
)
"""

try:
    cursor.execute("DROP TABLE IF EXISTS USUARIO_TEMP")
    cursor.execute(create_temp_table)
    print("  ✅ Tabla temporal USUARIO_TEMP creada")
    
    # Copiar solo los datos necesarios
    insert_query = """
    INSERT INTO USUARIO_TEMP (
        ID_USUARIO, DOCUMENTO, NOMBRE, FECHA_NACIMIENTO, CEDULA_EXPEDICION,
        PAIS_NACIMIENTO, CIUDAD_NACIMIENTO, CARGO, AREA, ESTADO_CIVIL,
        TIPO_SANGRE, NUMERO_FIJO, NUMERO_CELULAR, NUMERO_CORP, CORREO,
        VERSION, FECHA_ACTUALIZACION
    )
    SELECT 
        ID_USUARIO, DOCUMENTO, NOMBRE, FECHA_NACIMIENTO, CEDULA_EXPEDICION,
        PAIS_NACIMIENTO, CIUDAD_NACIMIENTO, CARGO, AREA, ESTADO_CIVIL,
        TIPO_SANGRE, NUMERO_FIJO, NUMERO_CELULAR, NUMERO_CORP, CORREO,
        VERSION, FECHA_ACTUALIZACION
    FROM USUARIO
    """
    
    cursor.execute(insert_query)
    print("  ✅ Datos copiados a la tabla temporal")
    
    # Eliminar la tabla original y renombrar la temporal
    cursor.execute("DROP TABLE USUARIO")
    cursor.execute("ALTER TABLE USUARIO_TEMP RENAME TO USUARIO")
    print("  ✅ Tabla USUARIO actualizada con estructura limpia")
    
except Exception as e:
    print(f"  ❌ Error actualizando tabla USUARIO: {e}")

# 3. Confirmar cambios
conn.commit()

# 4. Verificar el resultado
print("\n=== VERIFICACIÓN FINAL ===")
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("TABLAS RESTANTES:")
for table in tables:
    print(f"  ✅ {table[0]}")

print("\nESTRUCTURA FINAL DE LA TABLA USUARIO:")
cursor.execute('PRAGMA table_info(USUARIO)')
columns = cursor.fetchall()

for col in columns:
    print(f"  ✅ {col[1]} ({col[2]})")

# Verificar datos
cursor.execute("SELECT COUNT(*) FROM USUARIO")
count = cursor.fetchone()[0]
print(f"\nREGISTROS EN USUARIO: {count}")

conn.close()
print("\n✅ LIMPIEZA COMPLETADA EXITOSAMENTE") 