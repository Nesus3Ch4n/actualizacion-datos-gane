Write-Host "=== Test Final del Servidor Spring Boot en Puerto 8080 ===" -ForegroundColor Green
Write-Host ""

# Función para probar un endpoint
function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Probando: $Description" -ForegroundColor Cyan
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
        Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "✅ Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Green
        if ($response.Content.Length -lt 1000) {
            Write-Host "✅ Response: $($response.Content)" -ForegroundColor Green
        } else {
            Write-Host "✅ Response Length: $($response.Content.Length) characters" -ForegroundColor Green
        }
        return $true
    }
    catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    Write-Host ""
}

# Verificar si el puerto está abierto
Write-Host "=== Verificación de Puerto 8080 ===" -ForegroundColor Yellow
$port = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "✅ Puerto 8080 está abierto" -ForegroundColor Green
    Write-Host "   PID: $($port.OwningProcess)" -ForegroundColor Green
    $process = Get-Process -Id $port.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "   Proceso: $($process.ProcessName)" -ForegroundColor Green
    }
    $serverRunning = $true
} else {
    Write-Host "❌ Puerto 8080 no está abierto" -ForegroundColor Red
    Write-Host "El servidor no está ejecutándose" -ForegroundColor Yellow
    $serverRunning = $false
}
Write-Host ""

if ($serverRunning) {
    # Probar endpoints básicos
    $healthCheck = Test-Endpoint "http://localhost:8080/actuator/health" "Health Check"
    $usuarioHealth = Test-Endpoint "http://localhost:8080/api/USUARIO/health" "Usuario Health Check"
    $usuarioList = Test-Endpoint "http://localhost:8080/api/USUARIO" "Listado de Usuarios"
    
    # Probar CORS
    Write-Host "=== Probando CORS con OPTIONS ===" -ForegroundColor Yellow
    try {
        $headers = @{
            'Origin' = 'http://localhost:4200'
            'Access-Control-Request-Method' = 'POST'
            'Access-Control-Request-Headers' = 'Content-Type'
        }
        
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/USUARIO" -Method OPTIONS -Headers $headers -UseBasicParsing -TimeoutSec 15
        Write-Host "✅ CORS OPTIONS Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "✅ CORS Headers:" -ForegroundColor Green
        $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "*Access-Control*" } | ForEach-Object {
            Write-Host "   $($_.Key): $($_.Value)" -ForegroundColor Green
        }
        $corsWorking = $true
    }
    catch {
        Write-Host "❌ CORS Options Error: $($_.Exception.Message)" -ForegroundColor Red
        $corsWorking = $false
    }
    
    Write-Host ""
    Write-Host "=== RESUMEN ===" -ForegroundColor Green
    Write-Host "Puerto 8080: $(if ($serverRunning) { '✅' } else { '❌' })" -ForegroundColor $(if ($serverRunning) { 'Green' } else { 'Red' })
    Write-Host "Health Check: $(if ($healthCheck) { '✅' } else { '❌' })" -ForegroundColor $(if ($healthCheck) { 'Green' } else { 'Red' })
    Write-Host "Usuario Health: $(if ($usuarioHealth) { '✅' } else { '❌' })" -ForegroundColor $(if ($usuarioHealth) { 'Green' } else { 'Red' })
    Write-Host "Lista Usuarios: $(if ($usuarioList) { '✅' } else { '❌' })" -ForegroundColor $(if ($usuarioList) { 'Green' } else { 'Red' })
    Write-Host "CORS: $(if ($corsWorking) { '✅' } else { '❌' })" -ForegroundColor $(if ($corsWorking) { 'Green' } else { 'Red' })
    
    if ($healthCheck -and $corsWorking) {
        Write-Host ""
        Write-Host "🎉 ¡SERVIDOR FUNCIONANDO CORRECTAMENTE!" -ForegroundColor Green
        Write-Host "Tu aplicación Angular ahora debería poder conectarse sin problemas." -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Hay algunos problemas menores, pero el servidor básico funciona." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ El servidor no está corriendo. Ejecuta el script restart-server-8080.ps1" -ForegroundColor Red
} 