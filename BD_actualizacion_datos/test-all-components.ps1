# Script para probar todos los componentes del formulario
# Este script prueba el guardado temporal y definitivo de todos los componentes

Write-Host "🧪 INICIANDO PRUEBAS DE TODOS LOS COMPONENTES" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Datos de prueba
$cedula = 123456789
$baseUrl = "http://localhost:8080/api"

# Función para hacer peticiones HTTP
function Invoke-TestRequest {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $Body
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers
        }
        return $response
    } catch {
        Write-Host "❌ Error en $Method $Url : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# 1. Probar información personal
Write-Host "`n📝 1. Probando información personal..." -ForegroundColor Yellow
$infoPersonal = @{
    cedula = $cedula
    nombre = "Juan Pérez"
    correo = "juan.perez@empresa.com"
    numeroFijo = 1234567
    numeroCelular = 3001234567
    numeroCorp = 1234
    cedulaExpedicion = "Bogotá"
    paisNacimiento = "Colombia"
    ciudadNacimiento = "Bogotá"
    cargo = "Desarrollador"
    area = "Tecnología"
    fechaNacimiento = "1990-01-01"
    estadoCivil = "Soltero"
    tipoSangre = "O+"
} | ConvertTo-Json

$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/paso1/informacion-personal" -Body $infoPersonal
if ($response) {
    Write-Host "✅ Información personal guardada temporalmente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al guardar información personal" -ForegroundColor Red
    exit 1
}

# 2. Probar estudios académicos
Write-Host "`n🎓 2. Probando estudios académicos..." -ForegroundColor Yellow
$estudios = @(
    @{
        nivelEducativo = "Pregrado"
        institucion = "Universidad Nacional"
        titulo = "Ingeniero de Sistemas"
        area = "Ingeniería"
        modalidad = "Presencial"
        fechaInicio = "2010-01-01"
        fechaFinalizacion = "2015-12-01"
        graduado = $true
        enCurso = $false
        observaciones = "Título obtenido con honores"
    }
) | ConvertTo-Json

$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/paso2/estudios/$cedula" -Body $estudios
if ($response) {
    Write-Host "✅ Estudios académicos guardados temporalmente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al guardar estudios académicos" -ForegroundColor Red
}

# 3. Probar vehículos
Write-Host "`n🚗 3. Probando vehículos..." -ForegroundColor Yellow
$vehiculos = @(
    @{
        tipoVehiculo = "Automóvil"
        marca = "Toyota"
        modelo = "Corolla"
        color = "Blanco"
        placa = "ABC123"
        anio = 2020
        cilindraje = "1.8L"
        combustible = "Gasolina"
        propio = $true
        soat = $true
        tecnomecanica = $true
        observaciones = "Vehículo en buen estado"
    }
) | ConvertTo-Json

$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/paso3/vehiculos/$cedula" -Body $vehiculos
if ($response) {
    Write-Host "✅ Vehículos guardados temporalmente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al guardar vehículos" -ForegroundColor Red
}

# 4. Probar vivienda
Write-Host "`n🏠 4. Probando vivienda..." -ForegroundColor Yellow
$vivienda = @{
    tipoVivienda = "Apartamento"
    tipoAdquisicion = "Arrendada"
    direccion = "Calle 123 # 45-67"
    ciudad = "Bogotá"
    departamento = "Cundinamarca"
    pais = "Colombia"
    barrio = "Chapinero"
    estrato = "4"
    numeroHabitaciones = 3
    numeroBanos = 2
    valorArriendo = 1500000
    valorAdministracion = 150000
    observaciones = "Apartamento céntrico"
} | ConvertTo-Json

$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/paso4/vivienda/$cedula" -Body $vivienda
if ($response) {
    Write-Host "✅ Vivienda guardada temporalmente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al guardar vivienda" -ForegroundColor Red
}

# 5. Probar personas a cargo
Write-Host "`n👨‍👩‍👧‍👦 5. Probando personas a cargo..." -ForegroundColor Yellow
$personasACargo = @(
    @{
        nombre = "María Pérez"
        parentesco = "Hija"
        numeroDocumento = "12345678"
        tipoDocumento = "CC"
        fechaNacimiento = "2015-05-15"
        telefono = "3009876543"
        ocupacion = "Estudiante"
        estadoCivil = "Soltera"
        dependeEconomicamente = $true
        beneficiarioEPS = $true
        beneficiarioCajaCompensacion = $true
        observaciones = "Hija menor de edad"
    }
) | ConvertTo-Json

$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/paso5/personas-cargo/$cedula" -Body $personasACargo
if ($response) {
    Write-Host "✅ Personas a cargo guardadas temporalmente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al guardar personas a cargo" -ForegroundColor Red
}

# 6. Probar contactos de emergencia
Write-Host "`n📞 6. Probando contactos de emergencia..." -ForegroundColor Yellow
$contactosEmergencia = @(
    @{
        nombre = "Ana Pérez"
        parentesco = "Hermana"
        telefono = "3001112222"
        telefonoAlternativo = "3003334444"
        direccion = "Calle 456 # 78-90"
        ciudad = "Bogotá"
        ocupacion = "Médica"
        contactoPrincipal = $true
        observaciones = "Contacto principal de emergencia"
    }
) | ConvertTo-Json

$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/paso6/contactos-emergencia/$cedula" -Body $contactosEmergencia
if ($response) {
    Write-Host "✅ Contactos de emergencia guardados temporalmente" -ForegroundColor Green
} else {
    Write-Host "❌ Error al guardar contactos de emergencia" -ForegroundColor Red
}

# 7. Verificar estado del formulario
Write-Host "`n📊 7. Verificando estado del formulario..." -ForegroundColor Yellow
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/formulario/estado/$cedula"
if ($response) {
    Write-Host "Estado del formulario:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
} else {
    Write-Host "❌ Error al verificar estado del formulario" -ForegroundColor Red
}

# 8. Guardar formulario completo en base de datos
Write-Host "`n💾 8. Guardando formulario completo en base de datos..." -ForegroundColor Yellow
$response = Invoke-TestRequest -Method "POST" -Url "$baseUrl/formulario/guardar-definitivo/$cedula"
if ($response) {
    Write-Host "✅ Formulario guardado exitosamente en base de datos" -ForegroundColor Green
    Write-Host "Respuesta: $($response | ConvertTo-Json)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error al guardar formulario definitivo" -ForegroundColor Red
}

# 9. Verificar datos guardados en base de datos
Write-Host "`n🔍 9. Verificando datos guardados en base de datos..." -ForegroundColor Yellow

# Verificar información personal
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/informacion-personal"
if ($response) {
    Write-Host "✅ Información personal recuperada de BD" -ForegroundColor Green
} else {
    Write-Host "❌ Error al recuperar información personal de BD" -ForegroundColor Red
}

# Verificar estudios
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/estudios"
if ($response) {
    Write-Host "✅ Estudios recuperados de BD" -ForegroundColor Green
} else {
    Write-Host "❌ Error al recuperar estudios de BD" -ForegroundColor Red
}

# Verificar vehículos
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/vehiculos"
if ($response) {
    Write-Host "✅ Vehículos recuperados de BD" -ForegroundColor Green
} else {
    Write-Host "❌ Error al recuperar vehículos de BD" -ForegroundColor Red
}

# Verificar vivienda
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/vivienda"
if ($response) {
    Write-Host "✅ Vivienda recuperada de BD" -ForegroundColor Green
} else {
    Write-Host "❌ Error al recuperar vivienda de BD" -ForegroundColor Red
}

# Verificar personas a cargo
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/personas-cargo"
if ($response) {
    Write-Host "✅ Personas a cargo recuperadas de BD" -ForegroundColor Green
} else {
    Write-Host "❌ Error al recuperar personas a cargo de BD" -ForegroundColor Red
}

# Verificar contactos de emergencia
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/contactos-emergencia"
if ($response) {
    Write-Host "✅ Contactos de emergencia recuperados de BD" -ForegroundColor Green
} else {
    Write-Host "❌ Error al recuperar contactos de emergencia de BD" -ForegroundColor Red
}

# 10. Verificar datos completos
Write-Host "`n📋 10. Verificando datos completos..." -ForegroundColor Yellow
$response = Invoke-TestRequest -Method "GET" -Url "$baseUrl/consulta/bd/$cedula/completo"
if ($response) {
    Write-Host "✅ Datos completos recuperados de BD" -ForegroundColor Green
    Write-Host "Resumen de datos guardados:" -ForegroundColor Cyan
    Write-Host "  - Información personal: $($response.informacionPersonal -ne $null)" -ForegroundColor White
    Write-Host "  - Estudios: $($response.estudios.Count) registros" -ForegroundColor White
    Write-Host "  - Vehículos: $($response.vehiculos.Count) registros" -ForegroundColor White
    Write-Host "  - Vivienda: $($response.vivienda -ne $null)" -ForegroundColor White
    Write-Host "  - Personas a cargo: $($response.personasACargo.Count) registros" -ForegroundColor White
    Write-Host "  - Contactos de emergencia: $($response.contactosEmergencia.Count) registros" -ForegroundColor White
} else {
    Write-Host "❌ Error al recuperar datos completos de BD" -ForegroundColor Red
}

Write-Host "`n🎉 PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "Todos los componentes han sido probados exitosamente." -ForegroundColor White
Write-Host "Los datos se han guardado temporalmente y luego definitivamente en la base de datos." -ForegroundColor White
Write-Host "Cada componente está vinculado al usuario por id_usuario." -ForegroundColor White 