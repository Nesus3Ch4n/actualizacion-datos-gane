# Script simple para iniciar el backend Spring Boot
Write-Host "=== INICIANDO BACKEND SPRING BOOT ===" -ForegroundColor Green

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "pom.xml")) {
    Write-Host "Error: No se encontró pom.xml en el directorio actual" -ForegroundColor Red
    Write-Host "Asegúrate de ejecutar este script desde el directorio BD_actualizacion_datos" -ForegroundColor Yellow
    exit 1
}

Write-Host "Directorio correcto encontrado" -ForegroundColor Green
Write-Host "Iniciando Spring Boot..." -ForegroundColor Yellow
Write-Host "El servidor se iniciará en http://localhost:8080" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow

# Iniciar Spring Boot
try {
    if ($IsWindows -or $env:OS -eq "Windows_NT") {
        .\mvnw.cmd spring-boot:run
    } else {
        ./mvnw spring-boot:run
    }
} catch {
    Write-Host "Error al iniciar Spring Boot: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Intenta ejecutar manualmente: ./mvnw spring-boot:run" -ForegroundColor Yellow
} 