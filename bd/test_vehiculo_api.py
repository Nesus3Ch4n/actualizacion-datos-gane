import requests
import json

def test_vehiculo_api():
    """Probar el endpoint de vehículos del backend"""
    
    print("=== PRUEBA DE API DE VEHÍCULOS ===\n")
    
    # URL del endpoint
    url = "http://localhost:8080/api/formulario/vehiculo/guardar"
    
    # Datos de prueba
    vehiculos_data = [
        {
            "tipoVehiculo": "Automovil",
            "marca": "Toyota",
            "placa": "ABC123",
            "anio": 2020,
            "propietario": "Juan Pérez"
        },
        {
            "tipoVehiculo": "Motocicleta",
            "marca": "Honda",
            "placa": "XYZ789",
            "anio": 2019,
            "propietario": "María García"
        }
    ]
    
    # Parámetros
    params = {"idUsuario": 10}
    
    try:
        print("1. Enviando datos de vehículos...")
        print(f"   URL: {url}")
        print(f"   Parámetros: {params}")
        print(f"   Datos: {json.dumps(vehiculos_data, indent=2)}")
        
        # Hacer la petición POST
        response = requests.post(url, params=params, json=vehiculos_data, headers={
            'Content-Type': 'application/json'
        })
        
        print(f"\n2. Respuesta del servidor:")
        print(f"   Status Code: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            response_data = response.json()
            print(f"   Respuesta JSON: {json.dumps(response_data, indent=2)}")
            
            if response_data.get('success'):
                print("\n✅ Vehículos guardados exitosamente")
                
                # Probar obtener vehículos
                print("\n3. Probando obtener vehículos...")
                get_url = "http://localhost:8080/api/formulario/vehiculo/obtener"
                get_response = requests.get(get_url, params=params)
                
                if get_response.status_code == 200:
                    get_data = get_response.json()
                    print(f"   Vehículos obtenidos: {json.dumps(get_data, indent=2)}")
                else:
                    print(f"   ❌ Error al obtener vehículos: {get_response.status_code}")
                    print(f"   Respuesta: {get_response.text}")
            else:
                print(f"\n❌ Error en la respuesta: {response_data.get('message', 'Error desconocido')}")
        else:
            print(f"   ❌ Error HTTP: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar al servidor. Asegúrate de que esté corriendo en http://localhost:8080")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

if __name__ == "__main__":
    test_vehiculo_api() 