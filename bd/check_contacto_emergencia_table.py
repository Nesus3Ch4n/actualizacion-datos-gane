import sqlite3

def check_contacto_emergencia_table():
    """Verificar la estructura de la tabla de contactos de emergencia"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== ESTRUCTURA DE LA TABLA CONTACTO_EMERGENCIA ===\n")
    
    # Verificar si la tabla existe
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='CONTACTO_EMERGENCIA'")
    if not cursor.fetchone():
        print("❌ La tabla CONTACTO_EMERGENCIA no existe")
        return
    
    # Obtener estructura de la tabla
    cursor.execute('PRAGMA table_info(CONTACTO_EMERGENCIA)')
    columns = cursor.fetchall()
    
    print("Columnas existentes:")
    for col in columns:
        pk = "PK" if col[5] else ""
        not_null = "NOT NULL" if col[3] else "NULL"
        print(f"  {col[1]} ({col[2]}) - {not_null} - {pk}")
    
    # Contar registros
    cursor.execute("SELECT COUNT(*) FROM CONTACTO_EMERGENCIA")
    count = cursor.fetchone()[0]
    print(f"\nRegistros en la tabla: {count}")
    
    # Mostrar algunos registros de ejemplo
    if count > 0:
        cursor.execute("SELECT * FROM CONTACTO_EMERGENCIA LIMIT 3")
        rows = cursor.fetchall()
        print("\nRegistros de ejemplo:")
        for row in rows:
            print(f"  {row}")
    
    conn.close()

if __name__ == "__main__":
    check_contacto_emergencia_table() 