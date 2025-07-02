@echo off
echo Deteniendo procesos Java existentes...
taskkill /F /IM java.exe 2>nul

echo.
echo Compilando el proyecto...
mvn clean compile

echo.
echo Iniciando servidor Spring Boot...
mvn spring-boot:run 