# 🏗️ **ARQUITECTURA SCREAMING - ACTUALIZACIÓN DE DATOS EMPLEADO**

## 📋 **¿QUÉ ES ARQUITECTURA SCREAMING?**

La **Arquitectura Screaming** es un enfoque de diseño donde la estructura del proyecto **GRITA** su propósito de negocio, no la tecnología utilizada.

**Antes (Arquitectura Técnica):**
```
src/app/modules/formulario/  ← Grita "Angular"
```

**Ahora (Arquitectura Screaming):**
```
src/actualizacion-datos-empleado/  ← Grita "ACTUALIZACIÓN DE DATOS"
```

## 🎯 **ESTRUCTURA DEL PROYECTO**

```
src/actualizacion-datos-empleado/
├── 📁 domain/                          # CORAZÓN DEL NEGOCIO
│   ├── entities/                       # Entidades del dominio
│   │   ├── empleado.entity.ts          # Agregado raíz
│   │   ├── informacion-personal.entity.ts
│   │   ├── informacion-contacto.entity.ts
│   │   ├── informacion-vivienda.entity.ts
│   │   ├── informacion-vehiculo.entity.ts
│   │   ├── informacion-academica.entity.ts
│   │   ├── estudio-academico.entity.ts
│   │   ├── contacto-emergencia.entity.ts
│   │   └── persona-acargo.entity.ts
│   ├── value-objects/                  # Objetos de valor
│   │   ├── numero-documento.vo.ts
│   │   ├── email.vo.ts
│   │   ├── telefono.vo.ts
│   │   ├── direccion.vo.ts
│   │   ├── estado-civil.vo.ts
│   │   ├── tipo-sangre.vo.ts
│   │   ├── parentesco.vo.ts
│   │   ├── tipo-vivienda.vo.ts
│   │   ├── tipo-adquisicion.vo.ts
│   │   ├── tipo-vehiculo.vo.ts
│   │   └── nivel-educativo.vo.ts
│   ├── repositories/                   # Contratos del dominio
│   │   └── empleado.repository.ts
│   └── services/                       # Servicios del dominio
│       └── actualizacion-datos.domain-service.ts
├── 📁 application/                     # CASOS DE USO
│   ├── use-cases/                      # Casos de uso específicos
│   │   ├── actualizar-informacion-personal.use-case.ts
│   │   └── obtener-empleado.use-case.ts
│   ├── dto/                           # Objetos de transferencia
│   │   ├── empleado.dto.ts
│   │   └── actualizar-informacion-personal.dto.ts
│   └── services/                      # Servicios de aplicación
│       └── actualizacion-datos.service.ts
├── 📁 infrastructure/                  # IMPLEMENTACIONES TÉCNICAS
│   ├── repositories/                   # Implementaciones de repositorios
│   │   └── empleado.repository.impl.ts
│   └── adapters/                      # Adaptadores
│       └── empleado-form.adapter.ts
├── 📁 presentation/                    # INTERFAZ DE USUARIO
│   ├── components/
│   │   └── informacion-personal-screaming.component.ts
│   └── pages/
└── actualizacion-datos-empleado.module.ts  # Módulo principal
```

## 🔄 **FLUJO DE LA ARQUITECTURA**

### 1. **DOMINIO (Domain Layer)**
- **Entidades**: Reglas de negocio y lógica del dominio
- **Value Objects**: Objetos inmutables con validaciones
- **Repositorios**: Contratos para persistencia
- **Servicios de Dominio**: Lógica compleja del negocio

### 2. **APLICACIÓN (Application Layer)**
- **Casos de Uso**: Orquestación de operaciones
- **DTOs**: Transferencia de datos entre capas
- **Servicios de Aplicación**: Coordinación de casos de uso

### 3. **INFRAESTRUCTURA (Infrastructure Layer)**
- **Repositorios**: Implementaciones concretas
- **Adaptadores**: Conversión entre capas

### 4. **PRESENTACIÓN (Presentation Layer)**
- **Componentes**: UI específica del dominio
- **Páginas**: Páginas completas del flujo

## 🎯 **PRINCIPIOS IMPLEMENTADOS**

### ✅ **Domain Driven Design (DDD)**
- **Agregados**: `Empleado` como agregado raíz
- **Entidades**: Con identidad única
- **Value Objects**: Inmutables con validaciones
- **Servicios de Dominio**: Lógica compleja

### ✅ **SOLID**
- **S**: Cada clase tiene una responsabilidad única
- **O**: Abierto para extensión, cerrado para modificación
- **L**: Sustitución de Liskov con interfaces
- **I**: Segregación de interfaces específicas
- **D**: Inversión de dependencias con repositorios

### ✅ **Clean Architecture**
- **Independencia de Frameworks**: Dominio puro
- **Independencia de UI**: Lógica separada
- **Independencia de Base de Datos**: Repositorios abstractos
- **Testeable**: Cada capa es testeable independientemente

## 🚀 **CÓMO USAR LA NUEVA ARQUITECTURA**

### **1. Importar el Módulo**
```typescript
// En tu app.module.ts
import { ActualizacionDatosEmpleadoModule } from './actualizacion-datos-empleado/actualizacion-datos-empleado.module';

@NgModule({
  imports: [
    ActualizacionDatosEmpleadoModule,
    // otros módulos...
  ]
})
```

### **2. Usar el Servicio de Aplicación**
```typescript
// En tu componente
constructor(
  private actualizacionDatosService: ActualizacionDatosService
) {}

async actualizarDatos() {
  const dto: ActualizarInformacionPersonalDto = {
    numeroDocumento: '1234567890',
    nombreCompleto: 'Juan Pérez',
    // ... otros campos
  };
  
  const resultado = await this.actualizacionDatosService
    .actualizarInformacionPersonal(dto);
    
  if (resultado.exito) {
    console.log('¡Datos actualizados!');
  }
}
```

### **3. Crear Nuevas Entidades**
```typescript
// Ejemplo: Nueva entidad
export class Beneficiario {
  constructor(
    private readonly numeroDocumento: NumeroDocumento,
    private readonly nombre: string,
    private readonly porcentaje: number
  ) {
    this.validarDatos();
  }
  
  private validarDatos(): void {
    if (this.porcentaje < 0 || this.porcentaje > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }
  }
}
```

## 🔍 **VENTAJAS DE ESTA ARQUITECTURA**

### ✅ **Para el Negocio**
- **Claridad**: El código habla el lenguaje del negocio
- **Mantenibilidad**: Fácil de entender y modificar
- **Escalabilidad**: Fácil agregar nuevas funcionalidades

### ✅ **Para Desarrolladores**
- **Testeable**: Cada capa se puede testear independientemente
- **Reutilizable**: Lógica de negocio reutilizable
- **Independiente**: No depende de frameworks específicos

### ✅ **Para el Sistema**
- **Robustez**: Validaciones en múltiples capas
- **Consistencia**: Reglas de negocio centralizadas
- **Flexibilidad**: Fácil cambiar implementaciones

## 🎯 **COMPARACIÓN: ANTES vs DESPUÉS**

### **ANTES (Arquitectura Técnica)**
```
❌ src/app/modules/formulario/informacion-personal/
❌ FormBuilder, FormGroup, Validators mezclados
❌ Lógica de negocio en componentes
❌ Sin validaciones del dominio
❌ Difícil de testear
❌ Acoplado a Angular
```

### **DESPUÉS (Arquitectura Screaming)**
```
✅ src/actualizacion-datos-empleado/domain/entities/
✅ Entidades con reglas de negocio claras
✅ Value Objects con validaciones
✅ Casos de uso específicos
✅ Completamente testeable
✅ Independiente de Angular
```

## 🚀 **PRÓXIMOS PASOS**

1. **Migrar Componentes Restantes**: Adaptar vehículo, vivienda, contacto, etc.
2. **Implementar Persistencia Real**: Conectar con API backend
3. **Agregar Tests**: Unit tests para cada capa
4. **Implementar Eventos**: Domain events para comunicación
5. **Agregar Logging**: Logging estructurado por dominio

## 💡 **EJEMPLO DE USO COMPLETO**

```typescript
// 1. Crear value objects
const numeroDocumento = new NumeroDocumento('1234567890');
const email = new Email('juan@empresa.com');
const telefono = new Telefono('3001234567');

// 2. Crear entidad
const informacionPersonal = new InformacionPersonal(
  numeroDocumento,
  'Juan Pérez González',
  new Date('1990-01-15'),
  'Bogotá',
  'Colombia',
  'Bogotá',
  'Desarrollador Senior',
  'Tecnología',
  new EstadoCivil('SOLTERO'),
  new TipoSangre('O+')
);

// 3. Crear empleado
const empleado = new Empleado(
  numeroDocumento,
  informacionPersonal
);

// 4. Usar caso de uso
const useCase = new ActualizarInformacionPersonalUseCase(repositorio);
const resultado = await useCase.execute(dto);
```

---

## 🎉 **¡FELICIDADES!**

Has implementado exitosamente una **Arquitectura Screaming** que:
- **GRITA** "Actualización de Datos de Empleado"
- Implementa **DDD**, **Clean Architecture** y **SOLID**
- Es **testeable**, **mantenible** y **escalable**
- Separa claramente **dominio**, **aplicación** e **infraestructura**

**¡Tu código ahora habla el lenguaje del negocio! 🚀** 