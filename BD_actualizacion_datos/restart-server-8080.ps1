Write-Host "=== Reiniciando Servidor Spring Boot en Puerto 8080 ===" -ForegroundColor Yellow
Write-Host ""

# Función para terminar procesos en un puerto específico
function Stop-ProcessOnPort {
    param([int]$Port)
    
    Write-Host "Verificando procesos en puerto $Port..." -ForegroundColor Cyan
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        foreach ($conn in $connections) {
            $pid = $conn.OwningProcess
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            
            if ($process) {
                Write-Host "Terminando proceso: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
                try {
                    Stop-Process -Id $pid -Force
                    Write-Host "✅ Proceso terminado exitosamente" -ForegroundColor Green
                } catch {
                    Write-Host "❌ Error al terminar proceso: $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "✅ No hay procesos usando el puerto $Port" -ForegroundColor Green
    }
}

# Terminar procesos en puerto 8080
Stop-ProcessOnPort -Port 8080

# Esperar un momento
Write-Host ""
Write-Host "Esperando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Verificar que el puerto esté libre
Write-Host ""
Write-Host "Verificando que el puerto 8080 esté libre..." -ForegroundColor Cyan
$stillUsed = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($stillUsed) {
    Write-Host "❌ El puerto 8080 aún está en uso" -ForegroundColor Red
    foreach ($conn in $stillUsed) {
        $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Proceso: $($process.ProcessName) (PID: $($conn.OwningProcess))" -ForegroundColor Red
        }
    }
    Write-Host ""
    Write-Host "Intentando forzar la liberación del puerto..." -ForegroundColor Yellow
    Stop-ProcessOnPort -Port 8080
} else {
    Write-Host "✅ Puerto 8080 está libre" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Iniciando Servidor Spring Boot ===" -ForegroundColor Yellow
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location -Path $PSScriptRoot

# Ejecutar el servidor
Write-Host "Ejecutando: .\mvnw.cmd spring-boot:run" -ForegroundColor Cyan
Write-Host "Nota: El servidor se ejecutará en esta ventana. Para detenerlo, usa Ctrl+C" -ForegroundColor Yellow
Write-Host ""

try {
    & ".\mvnw.cmd" spring-boot:run
} catch {
    Write-Host "❌ Error al ejecutar el servidor: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Intentando con método alternativo..." -ForegroundColor Yellow
    
    # Método alternativo
    Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -NoNewWindow -Wait
} 