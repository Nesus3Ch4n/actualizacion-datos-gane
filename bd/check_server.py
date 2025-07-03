import requests
import time

def check_server():
    """Verificar si el servidor está ejecutándose"""
    
    print("=== VERIFICACIÓN DEL SERVIDOR ===\n")
    
    ports = [8080]
    
    for port in ports:
        print(f"Probando puerto {port}...")
        try:
            # Probar endpoint básico
            response = requests.get(f"http://localhost:{port}/actuator/health", timeout=5)
            print(f"   ✅ Servidor ejecutándose en puerto {port}")
            print(f"   Status: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return port
        except requests.exceptions.ConnectionError:
            print(f"   ❌ No hay servidor en puerto {port}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n❌ No se encontró ningún servidor ejecutándose")
    return None

if __name__ == "__main__":
    check_server() 