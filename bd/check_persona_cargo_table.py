import sqlite3

def check_persona_cargo_table():
    """Verificar la estructura de la tabla PERSONA_A_CARGO"""
    
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    print("=== ESTRUCTURA DE LA TABLA PERSONA_A_CARGO ===\n")
    
    # Verificar si la tabla existe
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='PERSONA_A_CARGO'")
    if not cursor.fetchone():
        print("❌ La tabla PERSONA_A_CARGO no existe")
        return
    
    # Obtener estructura de la tabla
    cursor.execute('PRAGMA table_info(PERSONA_A_CARGO)')
    columns = cursor.fetchall()
    
    print("Columnas existentes:")
    for col in columns:
        pk = "PK" if col[5] else ""
        not_null = "NOT NULL" if col[3] else "NULL"
        print(f"  {col[1]} ({col[2]}) - {not_null} - {pk}")
    
    # Contar registros
    cursor.execute("SELECT COUNT(*) FROM PERSONA_A_CARGO")
    count = cursor.fetchone()[0]
    print(f"\nTotal de registros: {count}")
    
    # Mostrar ejemplo de datos si existen
    if count > 0:
        cursor.execute("SELECT * FROM PERSONA_A_CARGO LIMIT 1")
        row = cursor.fetchone()
        print("\nPrimera fila de datos:")
        for i, col in enumerate(columns):
            print(f"  {col[1]}: {row[i]}")
    
    conn.close()

if __name__ == "__main__":
    check_persona_cargo_table() 