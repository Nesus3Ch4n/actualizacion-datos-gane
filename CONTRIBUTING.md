# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Portal de Actualización de Datos! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [🎯 Cómo Contribuir](#-cómo-contribuir)
- [🐛 Reportar Bugs](#-reportar-bugs)
- [✨ Solicitar Características](#-solicitar-características)
- [💻 Desarrollo Local](#-desarrollo-local)
- [📝 Estándares de Código](#-estándares-de-código)
- [🧪 Pruebas](#-pruebas)
- [📚 Documentación](#-documentación)
- [🚀 Proceso de Pull Request](#-proceso-de-pull-request)

## 🎯 Cómo Contribuir

### Tipos de Contribuciones

Aceptamos los siguientes tipos de contribuciones:

- 🐛 **Reportes de bugs** - Ayúdanos a encontrar y arreglar problemas
- ✨ **Nuevas características** - Sugiere y desarrolla nuevas funcionalidades
- 📚 **Documentación** - Mejora la documentación existente
- 🧪 **Pruebas** - Agrega o mejora las pruebas
- 🔧 **Mejoras técnicas** - Refactoring, optimizaciones, etc.

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Busca en issues existentes** - Es posible que el bug ya haya sido reportado
2. **Verifica la versión** - Asegúrate de estar usando la versión más reciente
3. **Reproduce el bug** - Confirma que puedes reproducir el problema consistentemente

### Cómo Reportar

1. **Usa la plantilla de bug** - Ve a Issues → New Issue → Bug Report
2. **Proporciona detalles** - Incluye pasos para reproducir, comportamiento esperado, etc.
3. **Adjunta logs** - Si es aplicable, incluye logs del backend o console del navegador
4. **Incluye capturas** - Las capturas de pantalla ayudan mucho

## ✨ Solicitar Características

### Antes de Solicitar

1. **Busca en issues existentes** - La característica podría ya estar planeada
2. **Considera el impacto** - Piensa en cómo beneficiaría a otros usuarios
3. **Investiga alternativas** - Verifica si hay soluciones existentes

### Cómo Solicitar

1. **Usa la plantilla de feature** - Ve a Issues → New Issue → Feature Request
2. **Describe claramente** - Explica qué quieres y por qué es útil
3. **Proporciona contexto** - Incluye casos de uso específicos
4. **Considera la implementación** - Si puedes, sugiere cómo implementarlo

## 💻 Desarrollo Local

### Configuración del Entorno

#### Prerrequisitos
- Java 17+
- Node.js 18+
- Maven 3.6+
- Git

#### Configuración Inicial

```bash
# 1. Fork y clona el repositorio
git clone https://github.com/tu-usuario/actdatos-en-angular.git
cd actdatos-en-angular

# 2. Configura el upstream
git remote add upstream https://github.com/original/actdatos-en-angular.git

# 3. Crea una rama para tu feature
git checkout -b feature/tu-nueva-caracteristica
```

#### Backend (Spring Boot)

```bash
# Navegar al directorio del backend
cd "BD_actualizacion_datos"

# Instalar dependencias
./mvnw clean install

# Ejecutar en modo desarrollo
./mvnw spring-boot:run
```

#### Frontend (Angular)

```bash
# Navegar al directorio del frontend
cd src

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve
```

### Estructura del Proyecto

```
actdatos en angular/
├── BD_actualizacion_datos/          # Backend Spring Boot
│   ├── src/main/java/
│   │   └── com/example/actualizacion_datos/
│   │       ├── controller/          # Controladores REST
│   │       ├── service/             # Lógica de negocio
│   │       ├── entity/              # Entidades JPA
│   │       ├── repository/          # Repositorios
│   │       └── config/              # Configuración
│   └── src/main/resources/
│       └── application.properties   # Configuración
├── src/                             # Frontend Angular
│   ├── app/
│   │   ├── modules/                 # Módulos de funcionalidad
│   │   ├── services/                # Servicios
│   │   ├── components/              # Componentes
│   │   └── shared/                  # Recursos compartidos
│   └── assets/                      # Recursos estáticos
└── scripts/                         # Scripts de utilidad
```

## 📝 Estándares de Código

### Backend (Java/Spring Boot)

#### Convenciones de Nomenclatura
- **Clases**: PascalCase (ej. `UsuarioService`)
- **Métodos**: camelCase (ej. `obtenerUsuario`)
- **Variables**: camelCase (ej. `usuarioActual`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `MAX_RETRY_ATTEMPTS`)

#### Estructura de Paquetes
```
com.example.actualizacion_datos/
├── controller/      # Controladores REST
├── service/         # Lógica de negocio
├── entity/          # Entidades JPA
├── repository/      # Repositorios
├── dto/            # Objetos de transferencia
├── config/         # Configuración
└── util/           # Utilidades
```

#### Documentación
- **JavaDoc** para todas las clases públicas
- **Comentarios** para lógica compleja
- **README** para cada módulo importante

### Frontend (TypeScript/Angular)

#### Convenciones de Nomenclatura
- **Componentes**: PascalCase (ej. `UsuarioComponent`)
- **Servicios**: PascalCase + Service (ej. `UsuarioService`)
- **Interfaces**: PascalCase (ej. `IUsuario`)
- **Variables**: camelCase (ej. `usuarioActual`)

#### Estructura de Archivos
```
src/app/
├── modules/         # Módulos de funcionalidad
├── services/        # Servicios
├── components/      # Componentes
├── shared/          # Recursos compartidos
└── guards/          # Guards de navegación
```

#### Estándares de Código
- **ESLint** para linting
- **Prettier** para formateo
- **TypeScript strict mode** habilitado
- **Angular Style Guide** seguido

### Base de Datos

#### Convenciones
- **Tablas**: snake_case (ej. `informacion_personal`)
- **Columnas**: snake_case (ej. `fecha_nacimiento`)
- **Índices**: idx_tabla_columna (ej. `idx_usuario_email`)

## 🧪 Pruebas

### Backend (JUnit)

```bash
# Ejecutar todas las pruebas
./mvnw test

# Ejecutar pruebas específicas
./mvnw test -Dtest=UsuarioServiceTest

# Generar reporte de cobertura
./mvnw jacoco:report
```

### Frontend (Jasmine/Karma)

```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas con coverage
npm run test:coverage

# Ejecutar pruebas e2e
npm run e2e
```

### Scripts de Prueba

```bash
# Probar regeneración de tokens
python test_token_regeneration.py

# Verificar usuario en base de datos
python check_user.py

# Crear usuario de prueba
python create_user_simple.py
```

## 📚 Documentación

### Tipos de Documentación

1. **README.md** - Documentación principal del proyecto
2. **CHANGELOG.md** - Historial de cambios
3. **CONTRIBUTING.md** - Guía de contribución
4. **JavaDoc** - Documentación de código Java
5. **TypeDoc** - Documentación de código TypeScript
6. **API Documentation** - Documentación de endpoints

### Estándares de Documentación

- **Claridad** - Escribe de manera clara y concisa
- **Ejemplos** - Incluye ejemplos de uso
- **Actualización** - Mantén la documentación actualizada
- **Formato** - Usa Markdown correctamente

## 🚀 Proceso de Pull Request

### Antes de Crear un PR

1. **Asegúrate de que tu código funciona**
   - Ejecuta todas las pruebas
   - Verifica que no hay errores de linting
   - Prueba manualmente la funcionalidad

2. **Actualiza la documentación**
   - Actualiza README si es necesario
   - Agrega JavaDoc/TypeDoc si es necesario
   - Actualiza CHANGELOG.md

3. **Verifica el formato**
   - Asegúrate de que el código sigue los estándares
   - Verifica que no hay archivos temporales

### Creando el Pull Request

1. **Título descriptivo**
   ```
   [FEATURE] Agregar validación de email en formulario de registro
   [BUGFIX] Corregir error 401 en regeneración de tokens
   [DOCS] Actualizar documentación de API
   ```

2. **Descripción detallada**
   - Explica qué hace el cambio
   - Incluye contexto y motivación
   - Menciona issues relacionados
   - Incluye capturas de pantalla si es necesario

3. **Checklist**
   - [ ] He leído y seguido la guía de contribución
   - [ ] Mi código sigue los estándares del proyecto
   - [ ] He agregado pruebas para mi código
   - [ ] He actualizado la documentación
   - [ ] Mi cambio no rompe funcionalidad existente

### Revisión del Código

#### Criterios de Aceptación

- ✅ **Funcionalidad** - El código hace lo que se espera
- ✅ **Calidad** - El código es limpio y mantenible
- ✅ **Pruebas** - Hay pruebas adecuadas
- ✅ **Documentación** - La documentación está actualizada
- ✅ **Seguridad** - No hay vulnerabilidades de seguridad

#### Proceso de Revisión

1. **Revisión automática** - GitHub Actions ejecuta pruebas
2. **Revisión manual** - Mantenedores revisan el código
3. **Comentarios** - Se pueden solicitar cambios
4. **Aprobación** - Una vez aprobado, se puede mergear

## 🎉 Reconocimiento

### Contribuidores

Todas las contribuciones son valiosas y serán reconocidas:

- **Contribuidores** aparecen en el README
- **Autores** se mencionan en los commits
- **Mantenedores** pueden ser promovidos

### Código de Conducta

- **Respeto** - Trata a todos con respeto
- **Inclusión** - Fomenta un ambiente inclusivo
- **Colaboración** - Trabaja en equipo
- **Profesionalismo** - Mantén un tono profesional

## 📞 Contacto

Si tienes preguntas sobre contribuir:

- 📧 **Email**: contribuciones@empresa.com
- 💬 **Slack**: #portal-actualizacion-datos
- 🐛 **Issues**: Usa GitHub Issues para bugs y features
- 📖 **Documentación**: Revisa la documentación existente

---

**¡Gracias por contribuir al Portal de Actualización de Datos!** 🎉 