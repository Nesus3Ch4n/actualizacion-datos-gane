# Solución: Auto-incremento del ID_USUARIO

## Problema Original

Al guardar el paso 1 (componente `informacion-personal`) en la tabla `USUARIO`, los registros se guardaban correctamente pero **NO se generaba automáticamente el `ID_USUARIO`**, lo que causaba:

1. Registros con `ID_USUARIO = NULL` en la base de datos
2. Problemas de sesión en pasos posteriores 
3. Errores "no active user" en el paso 2

## Causa Raíz

La tabla `USUARIO` en SQLite estaba configurada incorrectamente:

**Esquema Problemático:**
```sql
CREATE TABLE "USUARIO" (
    ID_USUARIO NUMBER PRIMARY KEY,  -- ❌ NUMBER no genera auto-incremento
    DOCUMENTO NUMBER,
    NOMBRE VARCHAR2(100),
    -- ... otros campos
)
```

En SQLite, `NUMBER PRIMARY KEY` **NO** activa el auto-incremento automático.

## Solución Implementada

### 1. Migración del Esquema de Base de Datos

Se migró la tabla a la estructura correcta:

**Esquema Corregido:**
```sql
CREATE TABLE USUARIO (
    ID_USUARIO INTEGER PRIMARY KEY AUTOINCREMENT,  -- ✅ Genera auto-incremento
    DOCUMENTO INTEGER NOT NULL,
    NOMBRE VARCHAR(100) NOT NULL,
    FECHA_NACIMIENTO DATE,
    CEDULA_EXPEDICION VARCHAR(100),
    PAIS_NACIMIENTO VARCHAR(100),
    CIUDAD_NACIMIENTO VARCHAR(100),
    CARGO VARCHAR(100),
    AREA VARCHAR(100),
    ESTADO_CIVIL VARCHAR(50),
    TIPO_SANGRE VARCHAR(3),
    NUMERO_FIJO INTEGER,
    NUMERO_CELULAR INTEGER,
    NUMERO_CORP INTEGER,
    CORREO VARCHAR(50) NOT NULL,
    VERSION INTEGER DEFAULT 1,
    FECHA_ACTUALIZACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### 2. Flujo de Datos Correcto

El flujo ahora funciona así:

1. **Frontend (Angular):** Usuario llena el formulario paso 1
2. **Servicio:** `InformacionPersonalService.guardarInformacionPersonal()`
3. **Backend:** Endpoint `/api/formulario/informacion-personal/guardar`
4. **Base de datos:** SQLite genera automáticamente el `ID_USUARIO`
5. **Respuesta:** Backend retorna el usuario con ID generado
6. **Sesión:** Frontend establece la sesión con el ID correcto

### 3. Verificaciones Implementadas

El frontend ahora verifica que:

```typescript
// Verificar que el ID existe
if (!usuarioGuardado || !usuarioGuardado.id) {
  throw new Error('El backend no retornó el ID del usuario correctamente');
}

console.log('✅ Usuario guardado con ID:', usuarioGuardado.id);

// Establecer sesión en ambos servicios
this.userSessionService.setCurrentUserId(usuarioGuardado.id);
this.usuarioSessionService.setUsuarioActual(usuarioGuardado);
```

## Estado Final

### Base de Datos
- ✅ Tabla `USUARIO` con auto-incremento configurado correctamente
- ✅ 1 usuario válido existente (ID: 1, Cédula: 1006101212)
- ✅ Nuevos registros generan ID automáticamente

### Backend (Spring Boot)
- ✅ Entidad `Usuario` con `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- ✅ Endpoint `/api/formulario/informacion-personal/guardar` funcional
- ✅ Respuesta incluye el ID generado en formato: `{success: true, data: {id: X, ...}}`

### Frontend (Angular)
- ✅ Componente `informacion-personal` valida que se reciba el ID
- ✅ Establece sesión en `UsuarioSessionService` y `UserSessionService`
- ✅ Muestra notificación con el ID generado
- ✅ Navegación al paso 2 con sesión establecida

## Archivos Modificados

### Backend
- `Usuario.java` - Entidad con configuración correcta de auto-incremento
- `FormularioController.java` - Endpoint que retorna ID generado
- `FormularioService.java` - Lógica de guardado

### Frontend
- `informacion-personal.component.ts` - Validación y manejo de sesión
- `informacion-personal.service.ts` - Comunicación con backend
- `personas-acargo.component.ts` - Verificación de sesión

### Base de Datos
- `bd/bd.db` - Esquema migrado con auto-incremento

## Verificación

Para verificar que todo funciona:

1. **Iniciar Backend:** `cd BD_actualizacion_datos && mvn spring-boot:run`
2. **Iniciar Frontend:** `ng serve --port 4200`
3. **Llenar paso 1:** Ingresar información personal
4. **Verificar:** Debe mostrar "Usuario ID: X" en la notificación
5. **Continuar:** El paso 2 ya no mostrará "no active user"

## Notas Técnicas

- **SQLite:** Requiere `INTEGER PRIMARY KEY AUTOINCREMENT` para auto-incremento
- **JPA:** `@GeneratedValue(strategy = GenerationType.IDENTITY)` es compatible
- **Sesión:** Se mantiene compatibilidad con ambos servicios de sesión
- **Limpieza:** Se removieron registros de prueba y duplicados

La solución es **robusta** y **no depende de scripts externos** - el auto-incremento funciona automáticamente en cada inserción. 