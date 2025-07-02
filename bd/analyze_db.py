import sqlite3

# Conectar a la base de datos
conn = sqlite3.connect('bd.db')
cursor = conn.cursor()

print("=== ANÁLISIS COMPLETO DE LA BASE DE DATOS ===\n")

# Obtener todas las tablas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("TABLAS EXISTENTES:")
for table in tables:
    table_name = table[0]
    print(f"  - {table_name}")
    
    # Contar registros
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"    Registros: {count}")

print("\n" + "="*50)
print("ESTRUCTURA DE LA TABLA USUARIO:")
cursor.execute('PRAGMA table_info(USUARIO)')
columns = cursor.fetchall()

for col in columns:
    print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'}")

print("\n" + "="*50)
print("CAMPOS QUE DEBEN ELIMINARSE DE LA TABLA USUARIO:")
campos_eliminar = ['CONTACTOS_EMERGENCIA', 'DECLARACIONES_CONFLICTO', 'ESTUDIOS_ACADEMICOS', 
                   'PERSONAS_A_CARGO', 'VEHICULOS', 'VIVIENDA']

for col in columns:
    if col[1] in campos_eliminar:
        print(f"  ❌ {col[1]} - DEBE ELIMINARSE")

print("\nCAMPOS QUE DEBEN MANTENERSE:")
for col in columns:
    if col[1] not in campos_eliminar:
        print(f"  ✅ {col[1]} - MANTENER")

conn.close() 