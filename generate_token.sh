#!/bin/bash

# Script para generar tokens JWT para la aplicación de actualización de datos
# Este script se conecta al backend Spring Boot para generar tokens válidos

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración del backend
BACKEND_URL="http://localhost:8080"
AUTH_ENDPOINT="${BACKEND_URL}/api/auth/generate-test-token"
HEALTH_ENDPOINT="${BACKEND_URL}/api/auth/health"

echo -e "${BLUE}🚀 Generador de Tokens JWT - Actualización de Datos${NC}"
echo "=================================================="

# Función para verificar si curl está instalado
check_curl() {
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ curl no está instalado. Por favor instálalo primero.${NC}"
        exit 1
    fi
}

# Función para verificar el estado del backend
check_backend_health() {
    echo -e "${YELLOW}🔄 Verificando estado del backend...${NC}"
    
    if curl -s -f "${HEALTH_ENDPOINT}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend está funcionando correctamente${NC}"
        return 0
    else
        echo -e "${RED}❌ No se puede conectar al backend${NC}"
        echo -e "${YELLOW}💡 Soluciones:${NC}"
        echo "1. Asegúrate de que el backend Spring Boot esté ejecutándose"
        echo "2. Verifica que esté en el puerto 8080"
        echo "3. Ejecuta: cd BD_actualizacion_datos && ./mvnw spring-boot:run"
        return 1
    fi
}

# Función para generar token
generate_token() {
    echo -e "${YELLOW}🔄 Generando token...${NC}"
    
    # Generar token usando curl
    response=$(curl -s -w "\n%{http_code}" "${AUTH_ENDPOINT}")
    
    # Separar respuesta y código HTTP
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        # Extraer token usando jq si está disponible, sino usar grep/sed
        if command -v jq &> /dev/null; then
            token=$(echo "$response_body" | jq -r '.token')
        else
            token=$(echo "$response_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        fi
        
        if [ -n "$token" ] && [ "$token" != "null" ]; then
            echo -e "${GREEN}✅ Token generado exitosamente!${NC}"
            
            # Extraer timestamp si jq está disponible
            if command -v jq &> /dev/null; then
                timestamp=$(echo "$response_body" | jq -r '.timestamp')
                if [ "$timestamp" != "null" ]; then
                    date_str=$(date -d "@$((timestamp/1000))" 2>/dev/null || date -r $((timestamp/1000)) 2>/dev/null || echo "N/A")
                    echo -e "${BLUE}📅 Timestamp: $date_str${NC}"
                fi
            fi
            
            echo -e "${BLUE}🔑 Token: $token${NC}"
            echo ""
            echo "=================================================================================="
            echo "TOKEN COMPLETO (copia y pega en tu aplicación):"
            echo "=================================================================================="
            echo "$token"
            echo "=================================================================================="
            return 0
        else
            echo -e "${RED}❌ No se pudo obtener el token de la respuesta${NC}"
            echo "Respuesta: $response_body"
            return 1
        fi
    else
        echo -e "${RED}❌ Error al generar token. Código: $http_code${NC}"
        echo "Respuesta: $response_body"
        return 1
    fi
}

# Función para validar token
validate_token() {
    local token="$1"
    
    if [ -z "$token" ]; then
        echo -e "${RED}❌ No hay token para validar${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}🔄 Validando token...${NC}"
    
    response=$(curl -s -w "\n%{http_code}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -X POST "${BACKEND_URL}/api/auth/validate")
    
    http_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ]; then
        if command -v jq &> /dev/null; then
            valid=$(echo "$response_body" | jq -r '.valid')
            if [ "$valid" = "true" ]; then
                echo -e "${GREEN}✅ Token válido!${NC}"
                user_nombres=$(echo "$response_body" | jq -r '.user.nombres // "N/A"')
                user_apellidos=$(echo "$response_body" | jq -r '.user.apellidos // "N/A"')
                user_cedula=$(echo "$response_body" | jq -r '.user.identificacion // "N/A"')
                echo -e "${BLUE}👤 Usuario: $user_nombres $user_apellidos${NC}"
                echo -e "${BLUE}🆔 Cédula: $user_cedula${NC}"
                return 0
            else
                error_msg=$(echo "$response_body" | jq -r '.error // "Error desconocido"')
                echo -e "${RED}❌ Token inválido${NC}"
                echo -e "${RED}Error: $error_msg${NC}"
                return 1
            fi
        else
            # Fallback sin jq
            if echo "$response_body" | grep -q '"valid":true'; then
                echo -e "${GREEN}✅ Token válido!${NC}"
                return 0
            else
                echo -e "${RED}❌ Token inválido${NC}"
                return 1
            fi
        fi
    else
        echo -e "${RED}❌ Error al validar token. Código: $http_code${NC}"
        return 1
    fi
}

# Función principal
main() {
    # Verificar curl
    check_curl
    
    # Verificar que el backend esté funcionando
    if ! check_backend_health; then
        exit 1
    fi
    
    echo ""
    
    # Generar token
    if generate_token; then
        echo ""
        echo "=================================================="
        echo "VALIDACIÓN DEL TOKEN"
        echo "=================================================="
        
        # Validar el token generado
        validate_token "$token"
        
        echo ""
        echo "=================================================="
        echo "INSTRUCCIONES DE USO"
        echo "=================================================="
        echo "1. Copia el token completo de arriba"
        echo "2. En tu aplicación Angular, usa este token en el localStorage:"
        echo "   localStorage.setItem('token', 'TU_TOKEN_AQUI');"
        echo "3. O en el interceptor de autenticación"
        echo "4. El token es válido por 24 horas"
        echo ""
        echo -e "${YELLOW}💡 Para generar un nuevo token, ejecuta este script nuevamente${NC}"
    fi
}

# Ejecutar función principal
main 