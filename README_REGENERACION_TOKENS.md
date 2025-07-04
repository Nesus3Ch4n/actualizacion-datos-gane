# 🔄 Regeneración Automática de Tokens JWT

## 📋 Descripción

Se ha implementado un sistema de regeneración automática de tokens JWT en modo demo. Cuando un token expira, el backend automáticamente genera un nuevo token con la misma información del usuario, evitando que el usuario tenga que autenticarse nuevamente.

## 🎯 Características Implementadas

### Backend (Spring Boot)

#### 1. **Regeneración Automática en `/api/auth/validate`**
- Cuando se valida un token expirado, automáticamente se regenera un nuevo token
- Se extrae la información del usuario del token expirado
- Se genera un nuevo token con la misma información
- Se retorna el nuevo token en la respuesta

#### 2. **Endpoint Específico `/api/auth/regenerate-token`**
- Permite regenerar tokens manualmente
- Útil para casos donde se necesita un nuevo token sin validación previa

#### 3. **Respuesta Mejorada**
```json
{
  "valid": true,
  "user": { /* información del usuario */ },
  "tokenInfo": { /* información del token */ },
  "newToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenRegenerated": true,
  "message": "Token regenerado automáticamente en modo demo"
}
```

### Frontend (Angular)

#### 1. **AuthService Mejorado**
- Maneja automáticamente la regeneración de tokens
- Actualiza el token almacenado cuando se regenera
- Proporciona método `regenerateToken()` para regeneración manual

#### 2. **AuthInterceptor Inteligente**
- Detecta errores 401 (token expirado)
- Intenta regenerar el token automáticamente
- Reintenta la petición original con el nuevo token
- Solo cierra sesión si la regeneración falla

#### 3. **WelcomeComponent Actualizado**
- Botón "🔄 Regenerar Token" para regeneración manual
- Muestra estado de autenticación en tiempo real
- Maneja errores de regeneración

## 🚀 Cómo Funciona

### Flujo Automático

1. **Usuario hace una petición** con token expirado
2. **Backend detecta** que el token está expirado
3. **Backend extrae** información del usuario del token expirado
4. **Backend genera** nuevo token con la misma información
5. **Backend retorna** respuesta con el nuevo token
6. **Frontend actualiza** automáticamente el token almacenado
7. **Frontend reintenta** la petición original con el nuevo token

### Flujo Manual

1. **Usuario hace clic** en "🔄 Regenerar Token"
2. **Frontend llama** al endpoint `/api/auth/regenerate-token`
3. **Backend regenera** el token
4. **Frontend actualiza** el token almacenado
5. **Usuario continúa** usando la aplicación

## 🔧 Configuración

### Backend

No requiere configuración adicional. La funcionalidad está habilitada por defecto en modo demo.

### Frontend

Los cambios ya están implementados en:
- `AuthService` - Manejo de regeneración
- `AuthInterceptor` - Interceptación automática
- `WelcomeComponent` - Botón de regeneración manual

## 🧪 Pruebas

### Script de Prueba Automatizado

```bash
python test_token_regeneration.py
```

Este script prueba:
- ✅ Generación de tokens
- ✅ Validación de tokens
- ✅ Regeneración automática
- ✅ Regeneración manual
- ✅ Manejo de errores

### Pruebas Manuales

1. **Generar un token** usando los scripts existentes
2. **Esperar a que expire** (24 horas) o usar un token expirado
3. **Hacer una petición** que requiera autenticación
4. **Verificar** que se regenera automáticamente

## 📝 Endpoints Disponibles

### Generación de Tokens
- `GET /api/auth/generate-test-token` - Generar token de prueba

### Validación y Regeneración
- `POST /api/auth/validate` - Validar token (con regeneración automática)
- `POST /api/auth/regenerate-token` - Regenerar token manualmente

### Información
- `GET /api/auth/health` - Estado del servicio
- `GET /api/auth/me` - Información del usuario actual

## 🔒 Seguridad

### Modo Demo vs Producción

- **Modo Demo**: Regeneración automática habilitada
- **Modo Producción**: Regeneración automática deshabilitada (depende de PAU)

### Consideraciones

- Solo funciona con tokens que contengan información válida del usuario
- Requiere que el usuario exista en la base de datos
- Mantiene la misma información de roles y permisos

## 🐛 Solución de Problemas

### Token No Se Regenera

1. **Verificar** que el token contenga información válida
2. **Verificar** que el usuario exista en la base de datos
3. **Revisar logs** del backend para errores específicos

### Error 401 Persistente

1. **Verificar** que el backend esté funcionando
2. **Verificar** que el token sea completamente inválido (no solo expirado)
3. **Usar regeneración manual** como fallback

### Frontend No Actualiza Token

1. **Verificar** que el `AuthService` esté funcionando
2. **Verificar** que el `AuthInterceptor` esté configurado
3. **Revisar** logs del navegador para errores

## 📚 Archivos Modificados

### Backend
- `AuthController.java` - Nuevos endpoints y lógica de regeneración

### Frontend
- `auth.service.ts` - Manejo de regeneración automática
- `auth.interceptor.ts` - Interceptación inteligente de errores 401
- `welcome.component.ts` - Botón de regeneración manual
- `app.module.ts` - Configuración de módulos

## 🎉 Beneficios

1. **Experiencia de Usuario Mejorada** - No interrupciones por tokens expirados
2. **Desarrollo Más Fluido** - No necesidad de regenerar tokens manualmente
3. **Compatibilidad con PAU** - Funciona tanto en demo como en producción
4. **Fallback Manual** - Opción de regeneración manual si es necesario

## 🔮 Próximos Pasos

- [ ] Configurar tiempo de expiración configurable
- [ ] Agregar logs detallados de regeneración
- [ ] Implementar notificaciones al usuario cuando se regenera
- [ ] Agregar métricas de regeneración de tokens 