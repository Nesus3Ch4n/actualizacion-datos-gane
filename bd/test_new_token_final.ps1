# Script PowerShell para probar el nuevo token específico
Write-Host "=== PROBANDO NUEVO TOKEN ESPECÍFICO ===" -ForegroundColor Green

# Esperar un momento para que el servidor inicie
Write-Host "Esperando que el servidor inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar si el servidor está ejecutándose
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method Get -TimeoutSec 5
    Write-Host "Servidor ejecutandose en puerto 8080" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Cyan
    
    # Crear usuario de prueba
    Write-Host "Creando usuario de prueba..." -ForegroundColor Yellow
    $userData = @{
        nombre = "JESUS FELIPE CORDOBA ECHANDIA"
        cedula = 1006101211
        correo = "jesus.cordoba@test.com"
        telefono = "3001234567"
        direccion = "Calle Test 123"
        ciudad = "Bogota"
        departamento = "Cundinamarca"
        pais = "Colombia"
        fechaNacimiento = "1990-01-01"
        estadoCivil = "Soltero"
        genero = "Masculino"
        tipoSangre = "O+"
        eps = "EPS Test"
        arl = "ARL Test"
        fondoPension = "Fondo Test"
        cajaCompensacion = "Caja Test"
        activo = $true
        version = 1
    }
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    $createResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/USUARIO/test/crear-usuario" -Method Post -Body ($userData | ConvertTo-Json) -Headers $headers
    Write-Host "Usuario de prueba creado exitosamente" -ForegroundColor Green
    
    # Probar autenticación JWT con el nuevo token específico
    Write-Host "Probando autenticacion JWT con token especifico..." -ForegroundColor Yellow
    $token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRRmhNYlJNNjdMbm9mSC9jTGRobXRoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzUxNTQ4ODIxLCJleHAiOjE3NTE1NTIxMjF9.yJWZ2YtGkehRR5UccOtGFCOkYh1-MQS2nRS6mbRTa9t4UIlkodi-R1M22I3qmSyxd_RLiZR4ltPmvWdHkpi6cw"
    
    $authHeaders = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Validar token
    Write-Host "1. Probando validacion de token..." -ForegroundColor Cyan
    $validateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/validate" -Method Post -Headers $authHeaders
    if ($validateResponse.valid) {
        Write-Host "   Token valido" -ForegroundColor Green
        Write-Host "   Usuario: $($validateResponse.user.nombre)" -ForegroundColor Green
    } else {
        Write-Host "   Token invalido" -ForegroundColor Red
    }
    
    # Probar endpoint protegido
    Write-Host "2. Probando endpoint protegido..." -ForegroundColor Cyan
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/USUARIO" -Method Get -Headers $authHeaders
    Write-Host "   Endpoint protegido accesible" -ForegroundColor Green
    Write-Host "   Usuarios encontrados: $($usersResponse.data.Count)" -ForegroundColor Green
    
    # Probar endpoint de usuario actual
    Write-Host "3. Probando obtener usuario actual..." -ForegroundColor Cyan
    $meResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/me" -Method Get -Headers $authHeaders
    Write-Host "   Usuario actual obtenido" -ForegroundColor Green
    Write-Host "   Nombre: $($meResponse.nombre)" -ForegroundColor Green
    Write-Host "   Cedula: $($meResponse.cedula)" -ForegroundColor Green
    
    Write-Host "Pruebas completadas exitosamente!" -ForegroundColor Green
    Write-Host "El servidor esta listo para recibir tokens JWT de la plataforma PAU" -ForegroundColor Cyan
    Write-Host "URL del servidor: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Documentacion API: http://localhost:8080/swagger-ui/index.html" -ForegroundColor Cyan
    Write-Host "Frontend Angular: http://localhost:4200" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "El servidor puede no estar ejecutandose o tener problemas de conexion" -ForegroundColor Yellow
} 