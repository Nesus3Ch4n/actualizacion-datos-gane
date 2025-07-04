#!/usr/bin/env node
/**
 * Script para generar tokens JWT para la aplicación de actualización de datos.
 * Este script se conecta al backend Spring Boot para generar tokens válidos.
 */

const https = require('https');
const http = require('http');

// Configuración del backend
const BACKEND_URL = "http://localhost:8080";
const AUTH_ENDPOINT = `${BACKEND_URL}/api/auth/generate-test-token`;
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/auth/health`;

/**
 * Función para hacer peticiones HTTP
 */
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: options.timeout || 10000
        };

        const req = client.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

/**
 * Verifica si el backend está funcionando
 */
async function checkBackendHealth() {
    try {
        console.log('🔄 Verificando estado del backend...');
        const response = await makeRequest(HEALTH_ENDPOINT);
        
        if (response.statusCode === 200) {
            console.log('✅ Backend está funcionando correctamente');
            return true;
        } else {
            console.log(`❌ Backend respondió con código: ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ No se puede conectar al backend. Asegúrate de que esté ejecutándose en http://localhost:8080');
        } else {
            console.log(`❌ Error al verificar el backend: ${error.message}`);
        }
        return false;
    }
}

/**
 * Genera un token JWT usando el endpoint del backend
 */
async function generateToken() {
    try {
        console.log('🔄 Generando token...');
        const response = await makeRequest(AUTH_ENDPOINT);
        
        if (response.statusCode === 200) {
            const token = response.data.token;
            if (token) {
                console.log('✅ Token generado exitosamente!');
                const timestamp = new Date(response.data.timestamp);
                console.log(`📅 Timestamp: ${timestamp.toLocaleString()}`);
                console.log(`🔑 Token: ${token}`);
                console.log('\n' + '='.repeat(80));
                console.log('TOKEN COMPLETO (copia y pega en tu aplicación):');
                console.log('='.repeat(80));
                console.log(token);
                console.log('='.repeat(80));
                return token;
            } else {
                console.log('❌ No se pudo obtener el token de la respuesta');
                console.log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
                return null;
            }
        } else {
            console.log(`❌ Error al generar token. Código: ${response.statusCode}`);
            console.log(`Respuesta: ${JSON.stringify(response.data, null, 2)}`);
            return null;
        }
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ No se puede conectar al backend. Asegúrate de que esté ejecutándose.');
        } else {
            console.log(`❌ Error inesperado: ${error.message}`);
        }
        return null;
    }
}

/**
 * Valida un token usando el endpoint de validación
 */
async function validateToken(token) {
    if (!token) {
        console.log('❌ No hay token para validar');
        return false;
    }
    
    try {
        console.log('🔄 Validando token...');
        const response = await makeRequest(`${BACKEND_URL}/api/auth/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.statusCode === 200) {
            if (response.data.valid) {
                console.log('✅ Token válido!');
                const user = response.data.user || {};
                console.log(`👤 Usuario: ${user.nombres || 'N/A'} ${user.apellidos || 'N/A'}`);
                console.log(`🆔 Cédula: ${user.identificacion || 'N/A'}`);
                return true;
            } else {
                console.log('❌ Token inválido');
                console.log(`Error: ${response.data.error || 'Error desconocido'}`);
                return false;
            }
        } else {
            console.log(`❌ Error al validar token. Código: ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error al validar token: ${error.message}`);
        return false;
    }
}

/**
 * Función principal
 */
async function main() {
    console.log('🚀 Generador de Tokens JWT - Actualización de Datos');
    console.log('='.repeat(50));
    
    // Verificar que el backend esté funcionando
    const isHealthy = await checkBackendHealth();
    if (!isHealthy) {
        console.log('\n💡 Soluciones:');
        console.log('1. Asegúrate de que el backend Spring Boot esté ejecutándose');
        console.log('2. Verifica que esté en el puerto 8080');
        console.log('3. Ejecuta: cd BD_actualizacion_datos && ./mvnw spring-boot:run');
        process.exit(1);
    }
    
    console.log();
    
    // Generar token
    const token = await generateToken();
    
    if (token) {
        console.log('\n' + '='.repeat(50));
        console.log('VALIDACIÓN DEL TOKEN');
        console.log('='.repeat(50));
        
        // Validar el token generado
        await validateToken(token);
        
        console.log('\n' + '='.repeat(50));
        console.log('INSTRUCCIONES DE USO');
        console.log('='.repeat(50));
        console.log('1. Copia el token completo de arriba');
        console.log('2. En tu aplicación Angular, usa este token en el localStorage:');
        console.log('   localStorage.setItem("token", "TU_TOKEN_AQUI");');
        console.log('3. O en el interceptor de autenticación');
        console.log('4. El token es válido por 24 horas');
        console.log('\n💡 Para generar un nuevo token, ejecuta este script nuevamente');
    }
}

// Ejecutar el script
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    });
}

module.exports = {
    generateToken,
    validateToken,
    checkBackendHealth
}; 