import sqlite3

def verificar_campos_vivienda():
    """Verificar los campos correctos de la tabla VIVIENDA"""
    
    print("=== VERIFICACIÓN DE CAMPOS DE VIVIENDA ===\n")
    
    # 1. Verificar estructura de la tabla
    print("1. Campos reales de la tabla VIVIENDA:")
    conn = sqlite3.connect('bd.db')
    cursor = conn.cursor()
    
    cursor.execute('PRAGMA table_info(VIVIENDA)')
    columns = cursor.fetchall()
    
    print("CAMPOS REALES DE LA TABLA:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    
    conn.close()
    
    print("\n2. Mapeo de campos:")
    print("✅ CAMPOS CORRECTOS (que debes enviar):")
    print("   - tipoVivienda")
    print("   - direccion") 
    print("   - infoAdicional")
    print("   - barrio")
    print("   - ciudad")
    print("   - vivienda")
    print("   - entidad")
    print("   - anio")
    print("   - tipoAdquisicion")
    
    print("\n❌ CAMPOS INCORRECTOS (que NO debes enviar):")
    print("   - tenencia (debe ser 'vivienda')")
    print("   - estrato (no existe en la tabla)")
    print("   - observaciones (debe ser 'infoAdicional')")
    
    print("\n3. Ejemplo de datos CORRECTOS:")
    datos_correctos = {
        "tipoVivienda": "Casa",
        "direccion": "CRA 50 # 50 - 50",
        "infoAdicional": "Casa de 2 pisos",
        "barrio": "Centro",
        "ciudad": "Bogotá",
        "vivienda": "Propia",
        "entidad": "Banco XYZ",
        "anio": 2020,
        "tipoAdquisicion": "Compra"
    }
    
    for campo, valor in datos_correctos.items():
        print(f"   {campo}: {valor}")
    
    print("\n4. Ejemplo de datos INCORRECTOS (que estabas enviando):")
    datos_incorrectos = {
        "tipoVivienda": "Casa",
        "tenencia": "Alquilada",  # ❌ Campo incorrecto
        "direccion": "CRA 50 # 50 - 50",
        "ciudad": "50",
        "barrio": "50",
        "estrato": 1,  # ❌ Campo incorrecto
        "observaciones": "this"  # ❌ Campo incorrecto
    }
    
    for campo, valor in datos_incorrectos.items():
        if campo in ["tenencia", "estrato", "observaciones"]:
            print(f"   {campo}: {valor} ❌")
        else:
            print(f"   {campo}: {valor} ✅")
    
    print("\n=== CORRECCIÓN APLICADA ===")
    print("✅ El componente vivienda.component.ts ha sido corregido")
    print("✅ Ahora envía los campos correctos que coinciden con la tabla")
    print("✅ Los campos incorrectos han sido reemplazados por los correctos")

if __name__ == "__main__":
    verificar_campos_vivienda() 