# 🔑 Generador de Tokens JWT

Este directorio contiene scripts para generar tokens JWT válidos para la aplicación de actualización de datos.

## 📋 Requisitos Previos

### Para el Backend
1. **Spring Boot debe estar ejecutándose** en `http://localhost:8080`
2. Ejecuta el backend con:
   ```bash
   cd BD_actualizacion_datos
   ./mvnw spring-boot:run
   ```

### Para los Scripts

#### Script Python (`generate_token.py`)
- Python 3.6+
- Módulo `requests`:
  ```bash
  pip install requests
  ```

#### Script Node.js (`generate_token.js`)
- Node.js 14+
- No requiere dependencias adicionales (usa módulos nativos)

#### Script Bash (`generate_token.sh`)
- curl (generalmente preinstalado en Linux/macOS)
- jq (opcional, para mejor formato de salida):
  ```bash
  # Ubuntu/Debian
  sudo apt install jq
  
  # macOS
  brew install jq
  
  # Windows (con chocolatey)
  choco install jq
  ```

## 🚀 Uso de los Scripts

### Opción 1: Script Python (Recomendado)
```bash
python generate_token.py
```

### Opción 2: Script Node.js
```bash
node generate_token.js
```

### Opción 3: Script Bash
```bash
# Hacer ejecutable (solo la primera vez)
chmod +x generate_token.sh

# Ejecutar
./generate_token.sh
```

## 📝 Qué hace cada script

1. **Verifica el estado del backend** - Confirma que Spring Boot esté funcionando
2. **Genera un token JWT** - Usa el endpoint `/api/auth/generate-test-token`
3. **Valida el token** - Verifica que el token sea válido y funcional
4. **Muestra instrucciones** - Te dice cómo usar el token en tu aplicación

## 🔧 Configuración del Token

El token generado incluye la siguiente información:
- **Cédula**: 1006101211
- **Nombres**: JESUS FELIPE
- **Apellidos**: CORDOBA ECHANDIA
- **Roles**: 5
- **Pantallas**: 16,67,42,12,13,14,15
- **Expiración**: 24 horas

## 💻 Cómo usar el token en Angular

### Opción 1: localStorage
```javascript
// En la consola del navegador o en tu código
localStorage.setItem('token', 'TU_TOKEN_GENERADO_AQUI');
```

### Opción 2: Interceptor de Autenticación
```typescript
// En tu auth.interceptor.ts
const token = 'TU_TOKEN_GENERADO_AQUI';
req = req.clone({
  setHeaders: {
    Authorization: `Bearer ${token}`
  }
});
```

### Opción 3: Servicio de Autenticación
```typescript
// En tu auth.service.ts
setToken(token: string) {
  localStorage.setItem('token', token);
}
```

## 🔍 Verificación del Token

Los scripts también validan el token generado para asegurar que:
- La firma sea válida
- No haya expirado
- Contenga la información correcta del usuario
- Sea reconocido por el backend

## 🛠️ Solución de Problemas

### Error: "No se puede conectar al backend"
1. Verifica que Spring Boot esté ejecutándose
2. Confirma que esté en el puerto 8080
3. Revisa los logs del backend para errores

### Error: "Token inválido"
1. El token puede haber expirado (24 horas)
2. Regenera un nuevo token
3. Verifica que el backend esté usando la misma clave secreta

### Error: "curl no está instalado" (solo para script bash)
```bash
# Ubuntu/Debian
sudo apt install curl

# macOS
brew install curl

# Windows
# Descarga desde: https://curl.se/windows/
```

## 📞 Endpoints del Backend

- **Generar token**: `GET /api/auth/generate-test-token`
- **Validar token**: `POST /api/auth/validate`
- **Estado del servicio**: `GET /api/auth/health`

## 🔒 Seguridad

⚠️ **Importante**: Estos scripts son solo para desarrollo y pruebas. En producción:
- No uses tokens de prueba
- Implementa un sistema de autenticación real
- Usa claves secretas seguras
- Configura expiración apropiada de tokens

## 📚 Archivos Incluidos

- `generate_token.py` - Script en Python
- `generate_token.js` - Script en Node.js  
- `generate_token.sh` - Script en Bash
- `README_GENERADOR_TOKENS.md` - Este archivo de documentación

## 🎯 Ejemplo de Salida

```
🚀 Generador de Tokens JWT - Actualización de Datos
==================================================
✅ Backend está funcionando correctamente

🔄 Generando token...
✅ Token generado exitosamente!
📅 Timestamp: 2024-01-15 10:30:45
🔑 Token: eyJhbGciOiJIUzUxMiJ9...

==================================================================================
TOKEN COMPLETO (copia y pega en tu aplicación):
==================================================================================
eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDUDEwMDYxMDEyMTEiLCJpZHRpcG9kb2N1bWVudG8iOiIxIiwiaWRlbnRpZmljYWNpb24iOiIxMDA2MTAxMjExIiwibm9tYnJlcyI6IkpFU1VTIEZFTElQRSIsImFwZWxsaWRvcyI6IkNPUkRPQkEgRUNIQU5ESUEiLCJpZHJvbGVzIjoiNSIsImlkcGFudGFsbGFzIjoiMTYsNjcsNDIsMTIsMTMsMTQsMTUiLCJleHBlcmllbmNlIjoieVJEeEh1cmlqNWRMSEJhSVRMclFmLzRZRmZyYk45OVl6c1Q5MnhPWXNRZmhNYlJNNjdMbm9mSC9jTGRobXJoTFZLU0VFZmVmTEJSL1lOekg3SE9mdE9FRUwwNDB6YURMN3BtK3RPRXV2SUk9IiwiaWF0IjoxNzA1MzI0NDQ1LCJleHAiOjE3MDU0MTA4NDV9.signature
==================================================================================

==================================================
VALIDACIÓN DEL TOKEN
==================================================
🔄 Validando token...
✅ Token válido!
👤 Usuario: JESUS FELIPE CORDOBA ECHANDIA
🆔 Cédula: 1006101211

==================================================
INSTRUCCIONES DE USO
==================================================
1. Copia el token completo de arriba
2. En tu aplicación Angular, usa este token en el localStorage:
   localStorage.setItem('token', 'TU_TOKEN_AQUI');
3. O en el interceptor de autenticación
4. El token es válido por 24 horas

💡 Para generar un nuevo token, ejecuta este script nuevamente
``` 