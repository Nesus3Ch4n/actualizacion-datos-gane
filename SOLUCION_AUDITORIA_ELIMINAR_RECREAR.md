# Solución al Problema de Auditoría - Eliminar y Recrear

## Problema Identificado

Algunos pasos del formulario (especialmente **vivienda** y **declaración**) están aplicando el patrón "eliminar y recrear" en lugar de actualizar registros existentes, lo que causa que en la auditoría solo aparezcan eliminaciones y creaciones, pero no actualizaciones de campos individuales.

## Análisis del Problema

### 🔍 **Flujo Actual**
1. **Pasos 1-6**: Funcionan correctamente con actualizaciones (información personal, académico, vehículos, personas a cargo, contactos)
2. **Pasos 4 y 7**: Vivienda y declaración siguen usando "eliminar y recrear"

### 🔍 **Causas Identificadas**

#### 1. **DeclaracionConflictoService** (Paso 7)
- Llamaba directamente al endpoint `/formulario/relaciones-conflicto/guardar?idUsuario=${idUsuario}`
- Este endpoint usa el patrón "eliminar y recrear" del controlador

#### 2. **AutoSaveService** (Todos los pasos)
- Los endpoints que llama (`/formulario/estudios/guardar`, `/formulario/vivienda/guardar`, etc.) usan los controladores corregidos
- Pero algunos servicios directos pueden estar interfiriendo

#### 3. **Servicios Directos vs Auto-Save**
- Hay servicios directos (`ViviendaService`, `DeclaracionConflictoService`) que pueden estar siendo llamados
- Discrepancia entre servicios individuales y el auto-save unificado

## Soluciones Aplicadas

### ✅ **1. Corrección del DeclaracionConflictoService**

**Archivo:** `src/app/services/declaracion-conflicto.service.ts`

**ANTES:**
```typescript
// Llamaba directamente al endpoint que usa "eliminar y recrear"
const response = await firstValueFrom(
  this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
    `${this.backendService.getApiUrl()}/formulario/relaciones-conflicto/guardar?idUsuario=${idUsuario}`, 
    declaracionesData,
    this.backendService.getHttpOptions()
  )
);
```

**DESPUÉS:**
```typescript
// Usa AutoSaveService con detección de cambios inteligente
const declaracionesData = {
  tieneConflicto: declaraciones.length > 0,
  personas: declaraciones.map(declaracion => ({
    nombre: declaracion.nombre,
    parentesco: declaracion.parentesco,
    tipoParteInteresada: declaracion.tipoParteInteresada
  }))
};

const success = await this.autoSaveService.saveStepData('declaracion', declaracionesData, true);
```

### ✅ **2. Controladores Backend Corregidos**

**Archivo:** `BD_actualizacion_datos/src/main/java/com/example/actualizacion_datos/controller/FormularioController.java`

**ANTES:**
```java
// Primero eliminar registros existentes
formularioService.eliminarViviendas(idUsuario);
// Guardar nuevos registros
Vivienda viviendaGuardada = formularioService.guardarVivienda(vivienda, idUsuario);
```

**DESPUÉS:**
```java
// Obtener vivienda existente
List<Vivienda> viviendasExistentes = formularioService.obtenerViviendas(idUsuario);

if (!viviendasExistentes.isEmpty()) {
    // Actualizar vivienda existente
    Vivienda viviendaExistente = viviendasExistentes.get(0);
    actualizarCamposVivienda(viviendaExistente, vivienda);
    viviendaExistente.setUsuario(usuario);
    Vivienda viviendaActualizada = formularioService.actualizarVivienda(viviendaExistente);
} else {
    // Crear nueva vivienda
    vivienda.setUsuario(usuario);
    Vivienda viviendaGuardada = formularioService.guardarVivienda(vivienda, idUsuario);
}
```

### ✅ **3. AuditoriaInterceptor Corregido**

**Archivo:** `BD_actualizacion_datos/src/main/java/com/example/actualizacion_datos/config/AuditoriaInterceptor.java`

- ✅ Método `obtenerIdEntidad()` corregido para buscar diferentes nombres de campos ID
- ✅ Método `detectarCambios()` mejorado para ignorar campos de auditoría correctamente
- ✅ Registra cambios campo por campo con valores anteriores y nuevos

## Verificación de la Solución

### 🎯 **Flujo Esperado Ahora**

#### **Paso 1-6**: ✅ **Funcionando Correctamente**
- Información Personal: Actualización con auditoría de campos
- Estudios Académicos: Actualización con auditoría de campos  
- Vehículos: Actualización con auditoría de campos
- Personas a Cargo: Actualización con auditoría de campos
- Contactos: Actualización con auditoría de campos

#### **Paso 4 (Vivienda)**: ✅ **Corregido**
- Usa AutoSaveService → Endpoint corregido → Actualización inteligente
- Registra auditoría de cambios de campos individuales

#### **Paso 7 (Declaración)**: ✅ **Corregido**
- DeclaracionConflictoService ahora usa AutoSaveService
- Endpoint corregido → Actualización inteligente
- Registra auditoría de cambios de campos individuales

### 🎯 **Auditoría Esperada**

Cuando cambies un campo como el nombre de "JESUS FELIPE CORDOBA ECHANDIA" a "JESUS FELIPE":

```sql
INSERT INTO AUDITORIA (
    TABLA_MODIFICADA, ID_REGISTRO_MODIFICADO, CAMPO_MODIFICADO,
    VALOR_ANTERIOR, VALOR_NUEVO, TIPO_PETICION, USUARIO_MODIFICADOR,
    FECHA_MODIFICACION, ID_USUARIO, DESCRIPCION
) VALUES (
    'USUARIO', 123, 'nombre',
    'JESUS FELIPE CORDOBA ECHANDIA', 'JESUS FELIPE', 'UPDATE',
    'Usuario Actual', NOW(), 456, 'Actualización del campo nombre en tabla USUARIO'
);
```

## Pruebas Recomendadas

### 🧪 **Casos de Prueba**

1. **Información Personal (Paso 1)**:
   - Cambiar nombre, correo, teléfono
   - Verificar auditoría con valores anteriores y nuevos

2. **Estudios Académicos (Paso 2)**:
   - Modificar institución, programa, semestre
   - Verificar auditoría de cada campo modificado

3. **Vehículos (Paso 3)**:
   - Cambiar marca, placa, año
   - Verificar auditoría de campos individuales

4. **Vivienda (Paso 4)** - **CASO CRÍTICO**:
   - Modificar dirección, tipo de vivienda, tipo de adquisición
   - ✅ **DEBE** mostrar UPDATE en auditoría, no DELETE/INSERT

5. **Personas a Cargo (Paso 5)**:
   - Cambiar nombre, parentesco, fecha de nacimiento
   - Verificar auditoría de campos modificados

6. **Contactos (Paso 6)**:
   - Modificar nombre, teléfono, parentesco
   - Verificar auditoría de cambios

7. **Declaración (Paso 7)** - **CASO CRÍTICO**:
   - Agregar/modificar personas con conflicto
   - ✅ **DEBE** mostrar UPDATE en auditoría, no DELETE/INSERT

### 🧪 **Verificación en Base de Datos**

```sql
-- Verificar auditoría de actualizaciones
SELECT 
    TABLA_MODIFICADA,
    CAMPO_MODIFICADO,
    VALOR_ANTERIOR,
    VALOR_NUEVO,
    TIPO_PETICION,
    FECHA_MODIFICACION,
    DESCRIPCION
FROM AUDITORIA 
WHERE TIPO_PETICION = 'UPDATE'
ORDER BY FECHA_MODIFICACION DESC;

-- Verificar que no haya eliminaciones/creaciones innecesarias
SELECT 
    TABLA_MODIFICADA,
    TIPO_PETICION,
    COUNT(*) as CANTIDAD,
    MAX(FECHA_MODIFICACION) as ULTIMA_FECHA
FROM AUDITORIA 
GROUP BY TABLA_MODIFICADA, TIPO_PETICION
ORDER BY TABLA_MODIFICADA, TIPO_PETICION;
```

## Estado Actual

### ✅ **Correcciones Implementadas**
- [x] AuditoriaInterceptor corregido para detectar cambios correctamente
- [x] Controladores de formulario usan actualización en lugar de eliminar/recrear
- [x] DeclaracionConflictoService corregido para usar AutoSaveService
- [x] Métodos de actualización y auxiliares agregados al FormularioService

### 🎯 **Resultado Esperado**
Todos los pasos del formulario ahora deben:
1. ✅ Actualizar registros existentes en lugar de eliminar/recrear
2. ✅ Registrar auditoría con cambios campo por campo
3. ✅ Mostrar valores anteriores y nuevos en AUDITORIA
4. ✅ Usar TIPO_PETICION = 'UPDATE' para cambios de campos

**Probar el flujo completo para confirmar que la auditoría ahora funciona correctamente con actualizaciones inteligentes.** 