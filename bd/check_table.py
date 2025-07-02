import sqlite3

# Conectar a la base de datos
conn = sqlite3.connect('bd.db')
cursor = conn.cursor()

# Obtener información de la tabla USUARIO
cursor.execute('PRAGMA table_info(USUARIO)')
columns = cursor.fetchall()

print("=== Estructura de la tabla USUARIO ===")
print("Columnas existentes:")
for col in columns:
    print(f"  {col[1]} ({col[2]}) - {'NOT NULL' if col[3] else 'NULL'} - {'PK' if col[5] else ''}")

print("\n=== Contenido de ejemplo ===")
cursor.execute('SELECT * FROM USUARIO LIMIT 1')
sample = cursor.fetchone()
if sample:
    print("Primera fila de datos:")
    for i, value in enumerate(sample):
        print(f"  {columns[i][1]}: {value}")
else:
    print("No hay datos en la tabla")

print(f"\n=== Total de registros: {cursor.execute('SELECT COUNT(*) FROM USUARIO').fetchone()[0]} ===")

conn.close() 