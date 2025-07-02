import sqlite3

# Conectar a la base de datos
conn = sqlite3.connect('bd.db')
cursor = conn.cursor()

print("=== ANÁLISIS DE LA TABLA ESTUDIOS ===\n")

# Verificar si la tabla existe
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ESTUDIOS'")
table_exists = cursor.fetchone()

if table_exists:
    print("✅ La tabla ESTUDIOS existe")
    
    # Obtener estructura de la tabla
    cursor.execute('PRAGMA table_info(ESTUDIOS)')
    columns = cursor.fetchall()
    
    print("\nESTRUCTURA ACTUAL:")
    for col in columns:
        print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")
    
    # Contar registros
    cursor.execute("SELECT COUNT(*) FROM ESTUDIOS")
    count = cursor.fetchone()[0]
    print(f"\nRegistros en la tabla: {count}")
    
    # Mostrar algunos registros de ejemplo
    if count > 0:
        cursor.execute("SELECT * FROM ESTUDIOS LIMIT 3")
        records = cursor.fetchall()
        print("\nPRIMEROS 3 REGISTROS:")
        for record in records:
            print(f"  {record}")
    
    # Verificar si ID_ESTUDIOS es autoincremental
    cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='ESTUDIOS'")
    create_sql = cursor.fetchone()[0]
    print(f"\nSQL DE CREACIÓN:")
    print(f"  {create_sql}")
    
    if "AUTOINCREMENT" in create_sql.upper():
        print("\n✅ ID_ESTUDIOS tiene AUTOINCREMENT")
    else:
        print("\n❌ ID_ESTUDIOS NO tiene AUTOINCREMENT")
        
else:
    print("❌ La tabla ESTUDIOS NO existe")

print("\n" + "="*50)
print("ESTRUCTURA ESPERADA (según entidad JPA):")
print("  ID_ESTUDIOS     INTEGER PRIMARY KEY AUTOINCREMENT")
print("  ID_USUARIO      INTEGER NOT NULL")
print("  NIVEL_ACADEMICO TEXT NOT NULL")
print("  INSTITUCION     TEXT NOT NULL")
print("  PROGRAMA        TEXT")
print("  SEMESTRE        INTEGER")
print("  GRADUACION      TEXT")
print("  VERSION         INTEGER DEFAULT 1")

conn.close() 