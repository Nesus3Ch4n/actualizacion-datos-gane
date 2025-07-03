# Script PowerShell para iniciar el servidor backend
Write-Host "=== INICIANDO SERVIDOR BACKEND ===" -ForegroundColor Green

# Cambiar al directorio del backend
$backendDir = "..\BD_actualizacion_datos"

if (Test-Path $backendDir) {
    Write-Host "Directorio backend encontrado: $backendDir" -ForegroundColor Green
    
    # Cambiar al directorio del backend
    Set-Location $backendDir
    
    Write-Host "Iniciando servidor Spring Boot..." -ForegroundColor Yellow
    Write-Host "Esto puede tomar unos minutos..." -ForegroundColor Yellow
    
    # Iniciar el servidor
    try {
        & .\mvnw.cmd spring-boot:run
    } catch {
        Write-Host "Error al iniciar el servidor: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Error: No se encontro el directorio del backend en: $backendDir" -ForegroundColor Red
    Write-Host "Asegurate de que la carpeta BD_actualizacion_datos existe en el directorio padre" -ForegroundColor Yellow
} 