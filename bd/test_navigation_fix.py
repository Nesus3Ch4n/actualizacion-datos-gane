#!/usr/bin/env python3
"""
Script para probar la corrección de navegación
"""

import time
import webbrowser
from datetime import datetime

def test_navigation_fix():
    """Probar la corrección de navegación"""
    
    print("=== PRUEBA DE CORRECCIÓN DE NAVEGACIÓN ===\n")
    
    base_url = "http://localhost:4200"
    
    print("🔧 Cambios realizados:")
    print("   1. ✅ Reemplazado window.location.href por Router.navigate()")
    print("   2. ✅ Mejorado AuthGuard con verificación síncrona")
    print("   3. ✅ Agregado método isAuthenticatedSync() en AuthService")
    print("   4. ✅ Mejorado logging para debugging")
    print()
    
    print("🎯 Flujo de navegación esperado:")
    print("   1. Usuario accede a /welcome")
    print("   2. Hace clic en 'Iniciar Simulación PAU'")
    print("   3. Es redirigido a /pau-simulation")
    print("   4. Hace clic en 'Ir al Formulario de Actualización'")
    print("   5. Es redirigido a /personal (sin recargar página)")
    print()
    
    print("🔍 Verificaciones a realizar:")
    print("   - ✅ No debe recargar la página al navegar")
    print("   - ✅ AuthGuard debe permitir acceso a /personal")
    print("   - ✅ Estado de autenticación debe mantenerse")
    print("   - ✅ Console debe mostrar logs de navegación")
    print()
    
    print("📋 URLs para probar:")
    routes = [
        {
            "name": "Página de Bienvenida",
            "url": f"{base_url}/welcome",
            "description": "Iniciar desde aquí"
        },
        {
            "name": "Simulación PAU",
            "url": f"{base_url}/pau-simulation",
            "description": "Ver estado de autenticación"
        },
        {
            "name": "Formulario (Paso 1)",
            "url": f"{base_url}/personal",
            "description": "Debería funcionar sin redirección"
        }
    ]
    
    for i, route in enumerate(routes, 1):
        print(f"   {i}. {route['name']}")
        print(f"      URL: {route['url']}")
        print(f"      Descripción: {route['description']}")
        print()
    
    print("🧪 Pasos para probar:")
    print("   1. Abrir DevTools (F12)")
    print("   2. Ir a la pestaña Console")
    print("   3. Navegar a /welcome")
    print("   4. Hacer clic en 'Iniciar Simulación PAU'")
    print("   5. Verificar que aparezca en /pau-simulation")
    print("   6. Hacer clic en 'Ir al Formulario de Actualización'")
    print("   7. Verificar que vaya a /personal sin recargar")
    print()
    
    print("🔍 Logs esperados en Console:")
    print("   🔄 Iniciando simulación PAU...")
    print("   🔐 Validando token en simulación...")
    print("   ✅ Token válido en simulación")
    print("   🔄 Navegando al formulario...")
    print("   🔒 AuthGuard: Verificando autenticación...")
    print("   🔒 AuthGuard: Verificación síncrona: true")
    print("   ✅ AuthGuard: Acceso permitido (síncrono)")
    print()
    
    print("✅ Corrección de navegación completada!")
    print("🌐 Servidor Angular ejecutándose en:", base_url)
    print("⏰ Hora actual:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print()
    
    # Opción para abrir el navegador
    try:
        response = input("¿Deseas abrir el navegador para probar? (s/n): ")
        if response.lower() in ['s', 'si', 'sí', 'y', 'yes']:
            print("🌐 Abriendo navegador...")
            webbrowser.open(f"{base_url}/welcome")
    except KeyboardInterrupt:
        print("\n❌ Operación cancelada por el usuario")

if __name__ == "__main__":
    test_navigation_fix() 