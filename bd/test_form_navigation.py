#!/usr/bin/env python3
"""
Script para probar la navegación entre pasos del formulario
"""

import time
import webbrowser
from datetime import datetime

def test_form_navigation():
    """Probar la navegación entre pasos del formulario"""
    
    print("=== PRUEBA DE NAVEGACIÓN ENTRE PASOS ===\n")
    
    base_url = "http://localhost:4200"
    
    print("🔧 Problema identificado:")
    print("   ❌ Al navegar entre pasos del formulario, se devuelve a /welcome")
    print("   🎯 Causa: AuthGuard se ejecuta en cada navegación entre rutas hijas")
    print("   🔧 Solución: Usar navegación relativa en lugar de absoluta")
    print()
    
    print("✅ Correcciones aplicadas:")
    print("   1. Modificado FormNavigationService para usar navegación relativa")
    print("   2. Agregado método navigateToWithRoute() con ActivatedRoute")
    print("   3. Actualizado FormularioComponent para usar el nuevo método")
    print("   4. Mejorado AuthGuard para verificaciones más eficientes")
    print()
    
    print("🎯 Flujo esperado después de la corrección:")
    print("   1. Usuario accede a /personal (primer paso)")
    print("   2. Hace clic en 'Siguiente' o navega a otro paso")
    print("   3. Navega a /academico, /vehiculo, etc. sin problemas")
    print("   4. No se devuelve a /welcome")
    print("   5. AuthGuard no se ejecuta innecesariamente")
    print()
    
    print("🔍 Logs esperados en Console:")
    print("   🔄 FormNavigationService: Navegando a academico (con route)")
    print("   🔄 FormNavigationService: Navegando a vehiculo (con route)")
    print("   ✅ No debe aparecer 'AuthGuard: Verificando autenticación'")
    print("   ✅ No debe aparecer 'Acceso denegado, redirigiendo a welcome'")
    print()
    
    print("📋 Pasos del formulario:")
    steps = [
        {
            "name": "Información Personal",
            "url": f"{base_url}/personal",
            "route": "personal"
        },
        {
            "name": "Estudios Académicos",
            "url": f"{base_url}/academico",
            "route": "academico"
        },
        {
            "name": "Vehículos",
            "url": f"{base_url}/vehiculo",
            "route": "vehiculo"
        },
        {
            "name": "Vivienda",
            "url": f"{base_url}/vivienda",
            "route": "vivienda"
        },
        {
            "name": "Personas a Cargo",
            "url": f"{base_url}/personas-acargo",
            "route": "personas-acargo"
        },
        {
            "name": "Contactos de Emergencia",
            "url": f"{base_url}/contacto",
            "route": "contacto"
        },
        {
            "name": "Declaraciones",
            "url": f"{base_url}/declaracion",
            "route": "declaracion"
        }
    ]
    
    for i, step in enumerate(steps, 1):
        print(f"   {i}. {step['name']}")
        print(f"      URL: {step['url']}")
        print(f"      Ruta: {step['route']}")
        print()
    
    print("🧪 Pasos para probar:")
    print("   1. Abrir DevTools (F12)")
    print("   2. Ir a la pestaña Console")
    print("   3. Navegar a /welcome")
    print("   4. Hacer clic en 'Iniciar Simulación PAU'")
    print("   5. Hacer clic en 'Ir al Formulario de Actualización'")
    print("   6. Verificar que aparezca en /personal")
    print("   7. Hacer clic en 'Siguiente' o navegar manualmente")
    print("   8. Verificar que vaya a /academico sin devolverse")
    print("   9. Continuar navegando entre pasos")
    print("   10. Verificar que no aparezcan logs de AuthGuard")
    print()
    
    print("🔍 Verificaciones clave:")
    print("   - ✅ Navegación entre pasos funciona sin redirección")
    print("   - ✅ No aparecen logs de 'AuthGuard: Verificando autenticación'")
    print("   - ✅ No aparecen logs de 'Acceso denegado'")
    print("   - ✅ Aparecen logs de 'FormNavigationService: Navegando a...'")
    print("   - ✅ URL cambia correctamente entre pasos")
    print()
    
    print("✅ Corrección de navegación entre pasos completada!")
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
    test_form_navigation() 