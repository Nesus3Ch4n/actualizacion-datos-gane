# Solución Completa del Flujo de Auditoría

## Problemas Identificados

### 🔴 **Problema Principal: Manejo Inconsistente del ID de Usuario**

1. **Paso 1 (Información Personal)**: Las actualizaciones no se reflejan en auditoría
2. **Pasos 2-7 (Estudios, Vehículos, Vivienda, Personas, Contactos, Declaración)**: Error 400 - "no encuentra id_usuario = 1"
3. **Paso 6 (Contactos)**: Guarda en BD pero no se refleja en auditoría

### 🔍 **Análisis de la Causa Raíz**

El sistema usa **múltiples servicios** para manejar el ID del usuario:
- `UsuarioSessionService` (principal, pero no usado por AutoSaveService)
- `FormDataService.currentUserId$` (backup)
- `sessionStorage` (persistencia)

**El AutoSaveService no estaba usando el UsuarioSessionService**, causando que el ID del usuario no se sincronizara correctamente entre pasos.

## Soluciones Implementadas

### ✅ **1. Corrección del AutoSaveService**

**Archivo:** `src/app/services/auto-save.service.ts`

#### **A. Inyección del UsuarioSessionService**
```typescript
// ANTES: No tenía UsuarioSessionService
constructor(
  private formDataService: FormDataService,
  private notificationService: NotificationService,
  private backendService: BackendService
) {}

// DESPUÉS: Inyecta UsuarioSessionService
constructor(
  private formDataService: FormDataService,
  private notificationService: NotificationService,
  private backendService: BackendService,
  private usuarioSessionService: UsuarioSessionService
) {}
```

#### **B. Método corregido para obtener ID del usuario**
```typescript
// ANTES: Lógica compleja con múltiples backups
let userId = this.formDataService.getCurrentUserIdValue();
if (!userId) {
  userId = sessionStorage.getItem('id_usuario');
}
if (!userId) {
  const usuarioActual = JSON.parse(sessionStorage.getItem('usuario_actual') || '{}');
  userId = usuarioActual.idUsuario?.toString() || usuarioActual.id?.toString();
}

// DESPUÉS: UsuarioSessionService como fuente principal
let userId = this.usuarioSessionService.getIdUsuarioActual();
if (!userId) {
  // Backup: FormDataService
  const userIdString = this.formDataService.getCurrentUserIdValue();
  userId = userIdString ? parseInt(userIdString) : null;
}
if (!userId) {
  // Backup: sessionStorage
  const userIdFromStorage = sessionStorage.getItem('id_usuario');
  userId = userIdFromStorage ? parseInt(userIdFromStorage) : null;
}
```

#### **C. Método corregido para guardar información personal**
```typescript
// DESPUÉS: Establece usuario en todos los servicios
if (userId) {
  // Crear objeto de usuario completo
  const usuarioCompleto = {
    idUsuario: userId,
    id: userId,
    cedula: data.cedula,
    documento: data.cedula,
    nombre: data.nombre,
    correo: data.correo,
    ...response.data
  };
  
  // Establecer en UsuarioSessionService (fuente principal)
  this.usuarioSessionService.setUsuarioActual(usuarioCompleto);
  
  // Backup: FormDataService para compatibilidad
  this.formDataService.setCurrentUserId(userId.toString());
  
  // Backup: sessionStorage para persistencia
  sessionStorage.setItem('id_usuario', userId.toString());
}
```

### ✅ **2. Corrección del Componente de Información Personal**

**Archivo:** `src/app/modules/formulario/informacion-personal/informacion-personal.component.ts`

```typescript
// Después de guardar exitosamente
if (success) {
  // Obtener ID del usuario del sessionStorage
  const idUsuario = sessionStorage.getItem('id_usuario');
  
  if (idUsuario) {
    // Establecer el usuario en UsuarioSessionService
    const usuarioCompleto = { ...mappedData, idUsuario: parseInt(idUsuario) };
    this.usuarioSessionService.setUsuarioActual(usuarioCompleto);
    
    // Establecer también en FormDataService (backup)
    this.formDataService.setCurrentUserId(idUsuario);
  }
}
```

### ✅ **3. Corrección de Errores de Compilación Backend**

**Archivos:** `FormularioController.java`, `FormularioService.java`

#### **A. Métodos corregidos en entidades**
```java
// ANTES: Métodos inexistentes
contactoExistente.setNombre(contactoNuevo.getNombre());           // ❌
contactoExistente.setTelefono(contactoNuevo.getTelefono());       // ❌
relacionExistente.setTipoRelacion(relacionNueva.getTipoRelacion()); // ❌
relacionExistente.setDescripcion(relacionNueva.getDescripcion());   // ❌

// DESPUÉS: Métodos correctos
contactoExistente.setNombreCompleto(contactoNuevo.getNombreCompleto()); // ✅
contactoExistente.setNumeroCelular(contactoNuevo.getNumeroCelular());   // ✅
relacionExistente.setNombreCompleto(relacionNueva.getNombreCompleto()); // ✅
relacionExistente.setTipoParteAsoc(relacionNueva.getTipoParteAsoc());   // ✅
```

#### **B. Nuevo método para guardar relación individual**
```java
// FormularioService.java - Nuevo método agregado
public RelacionConf guardarRelacionConflicto(RelacionConf relacion, Long idUsuario) {
    // Buscar usuario por ID
    Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
    if (usuario.isEmpty()) {
        throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
    }
    
    // Asignar usuario y guardar con auditoría
    relacion.setUsuario(usuario.get());
    RelacionConf relacionGuardada = relacionConfBaseService.save(relacion);
    
    return relacionGuardada;
}
```

## Flujo Corregido

### 🎯 **Paso 1: Información Personal**
1. Usuario llena el formulario
2. `AutoSaveService.saveStepData('personal', data)` 
3. Llama a `/api/formulario/informacion-personal/guardar`
4. Backend guarda/actualiza usuario con **auditoría campo por campo**
5. Frontend establece usuario en **todos los servicios**:
   - `UsuarioSessionService.setUsuarioActual(usuario)`
   - `FormDataService.setCurrentUserId(idUsuario)`
   - `sessionStorage.setItem('id_usuario', idUsuario)`

### 🎯 **Pasos 2-7: Otros Datos**
1. `AutoSaveService` obtiene ID del usuario desde `UsuarioSessionService`
2. Llama a endpoints con `?idUsuario=${userId}`:
   - `/api/formulario/estudios/guardar?idUsuario=123`
   - `/api/formulario/vehiculos/guardar?idUsuario=123`
   - `/api/formulario/vivienda/guardar?idUsuario=123`
   - etc.
3. Backend usa **patrón de actualización inteligente**:
   - Obtener registros existentes
   - Comparar con nuevos datos
   - Actualizar solo los que cambiaron
   - Crear nuevos si es necesario
   - Eliminar sobrantes
4. **AuditoriaInterceptor** registra cada cambio de campo

## Auditoría Esperada

### 📋 **Para Actualizaciones de Campos**
```sql
INSERT INTO AUDITORIA (
    TABLA_MODIFICADA, ID_REGISTRO_MODIFICADO, CAMPO_MODIFICADO,
    VALOR_ANTERIOR, VALOR_NUEVO, TIPO_PETICION, 
    USUARIO_MODIFICADOR, FECHA_MODIFICACION, ID_USUARIO, DESCRIPCION
) VALUES (
    'USUARIO', 123, 'nombre',
    'JESUS FELIPE CORDOBA ECHANDIA', 'JESUS FELIPE', 'UPDATE',
    'Jesus Felipe', NOW(), 456, 'Actualización del campo nombre en tabla USUARIO'
);
```

### 📋 **Para Creaciones**
```sql
INSERT INTO AUDITORIA (
    TABLA_MODIFICADA, ID_REGISTRO_MODIFICADO, TIPO_PETICION,
    USUARIO_MODIFICADOR, FECHA_MODIFICACION, ID_USUARIO, DESCRIPCION
) VALUES (
    'ESTUDIO_ACADEMICO', 789, 'INSERT',
    'Jesus Felipe', NOW(), 456, 'Creación de registro en tabla ESTUDIO_ACADEMICO'
);
```

### 📋 **Para Eliminaciones**
```sql
INSERT INTO AUDITORIA (
    TABLA_MODIFICADA, ID_REGISTRO_MODIFICADO, TIPO_PETICION,
    USUARIO_MODIFICADOR, FECHA_MODIFICACION, ID_USUARIO, DESCRIPCION
) VALUES (
    'VEHICULO', 456, 'DELETE',
    'Jesus Felipe', NOW(), 456, 'Eliminación de registro en tabla VEHICULO'
);
```

## Verificación del Flujo

### 🧪 **Pruebas Recomendadas**

#### **1. Paso 1 (Información Personal)**
- ✅ Cambiar nombre de "Juan Pérez" a "Juan Carlos Pérez"
- ✅ Verificar auditoría: `TIPO_PETICION = 'UPDATE'`, `CAMPO_MODIFICADO = 'nombre'`
- ✅ Verificar que se establece `idUsuario` en todos los servicios

#### **2. Paso 2 (Estudios Académicos)** 
- ✅ Agregar nuevo estudio: Verificar `TIPO_PETICION = 'INSERT'`
- ✅ Modificar institución existente: Verificar `TIPO_PETICION = 'UPDATE'`
- ✅ Eliminar estudio: Verificar `TIPO_PETICION = 'DELETE'`

#### **3. Pasos 3-7 (Vehículos, Vivienda, Personas, Contactos, Declaración)**
- ✅ Mismas pruebas de INSERT/UPDATE/DELETE
- ✅ Verificar que no aparece error "id_usuario = 1 no encontrado"

### 🔍 **Consultas de Verificación**

```sql
-- Verificar que las actualizaciones aparecen correctamente
SELECT 
    TABLA_MODIFICADA,
    CAMPO_MODIFICADO,
    VALOR_ANTERIOR,
    VALOR_NUEVO,
    TIPO_PETICION,
    FECHA_MODIFICACION
FROM AUDITORIA 
WHERE TIPO_PETICION = 'UPDATE' 
ORDER BY FECHA_MODIFICACION DESC;

-- Verificar distribución de tipos de operación
SELECT 
    TABLA_MODIFICADA,
    TIPO_PETICION,
    COUNT(*) as CANTIDAD
FROM AUDITORIA 
GROUP BY TABLA_MODIFICADA, TIPO_PETICION 
ORDER BY TABLA_MODIFICADA, TIPO_PETICION;

-- Verificar que no hay eliminaciones/creaciones innecesarias
SELECT 
    TABLA_MODIFICADA,
    ID_REGISTRO_MODIFICADO,
    TIPO_PETICION,
    FECHA_MODIFICACION
FROM AUDITORIA 
WHERE TABLA_MODIFICADA IN ('VIVIENDA', 'RELACION_CONF')
ORDER BY FECHA_MODIFICACION DESC;
```

## Estado Final

### ✅ **Correcciones Completadas**
- [x] AutoSaveService usa UsuarioSessionService como fuente principal
- [x] Información personal establece usuario en todos los servicios
- [x] Errores de compilación backend corregidos
- [x] Métodos de entidades corregidos
- [x] Nuevo método para guardar relación individual
- [x] AuditoriaInterceptor ya estaba corregido previamente

### 🎯 **Resultado Esperado**
1. ✅ **Paso 1**: Actualizaciones se reflejan en auditoría
2. ✅ **Pasos 2-7**: No más error 400 de "id_usuario = 1"
3. ✅ **Todos los pasos**: Auditoría completa con INSERT/UPDATE/DELETE apropiados
4. ✅ **Flujo unificado**: Un solo sistema de manejo de usuario

**El sistema ahora debería funcionar completamente con auditoría detallada de todos los cambios.** 