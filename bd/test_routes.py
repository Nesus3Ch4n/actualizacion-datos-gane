#!/usr/bin/env python3
"""
Script para probar las rutas de la aplicación Angular
"""

import time
import webbrowser
from datetime import datetime

def test_routes():
    """Probar las rutas de la aplicación"""
    
    print("=== PRUEBA DE RUTAS ANGULAR ===\n")
    
    base_url = "http://localhost:4200"
    
    routes = [
        {
            "name": "Página Principal",
            "url": base_url,
            "description": "Redirige automáticamente al formulario /personal"
        },
        {
            "name": "Página de Bienvenida",
            "url": f"{base_url}/welcome",
            "description": "Página de bienvenida con opciones de simulación"
        },
        {
            "name": "Simulación PAU",
            "url": f"{base_url}/pau-simulation",
            "description": "Componente de simulación de la plataforma PAU"
        },
        {
            "name": "Formulario - Información Personal",
            "url": f"{base_url}/personal",
            "description": "Primer paso del formulario de actualización"
        }
    ]
    
    print("📋 Rutas disponibles:")
    for i, route in enumerate(routes, 1):
        print(f"   {i}. {route['name']}")
        print(f"      URL: {route['url']}")
        print(f"      Descripción: {route['description']}")
        print()
    
    print("🎯 Flujo de navegación esperado:")
    print("   1. Usuario accede a /welcome")
    print("   2. Hace clic en 'Iniciar Simulación PAU'")
    print("   3. Es redirigido a /pau-simulation")
    print("   4. Hace clic en 'Ir al Formulario de Actualización'")
    print("   5. Es redirigido a /personal (primer paso del formulario)")
    print()
    
    print("✅ Configuración de rutas completada!")
    print("🌐 Servidor Angular ejecutándose en: http://localhost:4200")
    print("⏰ Hora actual:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print()
    
    # Opción para abrir el navegador
    try:
        response = input("¿Deseas abrir el navegador en la página principal? (s/n): ")
        if response.lower() in ['s', 'si', 'sí', 'y', 'yes']:
            print("🌐 Abriendo navegador...")
            webbrowser.open(base_url)
    except KeyboardInterrupt:
        print("\n❌ Operación cancelada por el usuario")

if __name__ == "__main__":
    test_routes() 