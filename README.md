# 🎯 Portal de Actualización de Datos

Sistema integrado de actualización de datos de empleados con autenticación JWT y regeneración automática de tokens en modo demo.

## 📋 Descripción

Este proyecto es una aplicación web completa que permite a los empleados actualizar su información personal, académica, de contacto, vivienda, vehículos y declaraciones de conflicto de interés. El sistema está integrado con la Plataforma PAU (Portal de Autogestión de Usuarios) y cuenta con un sistema de autenticación JWT avanzado.

## 🏗️ Arquitectura

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.x
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: JWT con regeneración automática
- **API REST**: Documentada con Swagger
- **Seguridad**: Interceptores y validación de tokens

### Frontend (Angular)
- **Framework**: Angular 16
- **UI Framework**: Angular Material
- **Arquitectura**: Clean Architecture con módulos
- **Estado**: RxJS BehaviorSubject
- **Interceptores**: Manejo automático de tokens expirados

## 🚀 Características Principales

### 🔐 Sistema de Autenticación Avanzado
- **Tokens JWT** con expiración configurable
- **Regeneración automática** de tokens en modo demo
- **Interceptores inteligentes** que manejan errores 401
- **Validación de usuarios** contra base de datos
- **Integración con PAU** para autenticación real

### 📝 Formularios Dinámicos
- **Información Personal**: Datos básicos del empleado
- **Información Académica**: Estudios y certificaciones
- **Información de Contacto**: Teléfonos y direcciones
- **Información de Vivienda**: Propiedades y arrendamientos
- **Información de Vehículos**: Automóviles y motocicletas
- **Declaraciones de Conflicto**: Intereses y relaciones

### 🎛️ Panel de Administración
- **Gestión de usuarios** con filtros avanzados
- **Reportes en Excel** con datos completos
- **Dashboard** con estadísticas
- **Validación de formularios** pendientes

## 📦 Instalación y Configuración

### Prerrequisitos
- Java 17+
- Node.js 18+
- Maven 3.6+
- Git

### Backend
```bash
# Clonar el repositorio
git clone <repository-url>
cd "actdatos en angular/BD_actualizacion_datos"

# Instalar dependencias
./mvnw clean install

# Ejecutar en modo desarrollo
./mvnw spring-boot:run
```

### Frontend
```bash
# Navegar al directorio del frontend
cd src

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
ng serve
```

### Base de Datos
```bash
# Crear usuario de prueba (modo demo)
python create_user_simple.py

# Verificar funcionamiento
python test_token_regeneration.py
```

## 🔧 Configuración

### Variables de Entorno
```properties
# Backend (application.properties)
jwt.secret=tu_clave_secreta_aqui
jwt.expiration=86400000
server.port=8080

# Frontend (environment.ts)
API_URL=http://localhost:8080/api
```

### Scripts de Utilidad
- `generate_token.py` - Generador de tokens JWT
- `create_user_simple.py` - Creador de usuarios de prueba
- `test_token_regeneration.py` - Pruebas de regeneración automática

## 🧪 Pruebas

### Generación de Tokens
```bash
# Python
python generate_token.py

# Node.js
node generate_token.js

# Bash
./generate_token.sh
```

### Validación de Funcionalidad
```bash
# Crear usuario de prueba
python create_user_simple.py

# Probar regeneración automática
python test_token_regeneration.py

# Verificar endpoints
curl http://localhost:8080/api/auth/health
```

## 📚 Estructura del Proyecto

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

## 🔐 Autenticación y Seguridad

### Flujo de Autenticación
1. **Usuario accede** desde PAU con token JWT
2. **Sistema valida** el token contra el backend
3. **Si expira**, se regenera automáticamente (modo demo)
4. **Usuario navega** por los formularios sin interrupciones

### Regeneración Automática de Tokens
- **Modo Demo**: Regeneración automática habilitada
- **Modo Producción**: Depende de la autenticación de PAU
- **Fallback Manual**: Botón para regenerar tokens manualmente

### Endpoints de Autenticación
- `POST /api/auth/validate` - Validar token (con regeneración automática)
- `POST /api/auth/regenerate-token` - Regenerar token manualmente
- `GET /api/auth/generate-test-token` - Generar token de prueba
- `POST /api/auth/create-test-user` - Crear usuario de prueba

## 🎨 Interfaz de Usuario

### Diseño Responsivo
- **Material Design** con Angular Material
- **Temas personalizados** con SCSS
- **Componentes reutilizables** y modulares
- **Navegación intuitiva** con stepper

### Componentes Principales
- **WelcomeComponent** - Página de bienvenida y estado del sistema
- **FormularioModule** - Módulo completo de formularios
- **AdminModule** - Panel de administración
- **SharedModule** - Componentes y servicios compartidos

## 📊 Base de Datos

### Entidades Principales
- **Usuario** - Información básica del empleado
- **InformacionPersonal** - Datos personales detallados
- **EstudioAcademico** - Información académica
- **ContactoEmergencia** - Contactos de emergencia
- **Vivienda** - Información de vivienda
- **Vehiculo** - Información de vehículos
- **DeclaracionConflicto** - Declaraciones de conflicto

### Relaciones
- **Usuario** → **InformacionPersonal** (1:1)
- **Usuario** → **EstudioAcademico** (1:N)
- **Usuario** → **ContactoEmergencia** (1:N)
- **Usuario** → **Vivienda** (1:N)
- **Usuario** → **Vehiculo** (1:N)
- **Usuario** → **DeclaracionConflicto** (1:N)

## 🚀 Despliegue

### Backend (Producción)
```bash
# Compilar JAR
./mvnw clean package

# Ejecutar
java -jar target/actualizacion-datos-0.0.1-SNAPSHOT.jar
```

### Frontend (Producción)
```bash
# Compilar
ng build --prod

# Servir archivos estáticos
npm install -g serve
serve -s dist/actdatos-en-angular
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### Token Expirado
```bash
# Regenerar token manualmente
python generate_token.py

# O usar el botón en la interfaz
# "🔄 Regenerar Token"
```

#### Usuario No Encontrado
```bash
# Crear usuario de prueba
python create_user_simple.py

# Verificar en base de datos
```

#### Backend No Responde
```bash
# Verificar que esté ejecutándose
curl http://localhost:8080/api/auth/health

# Reiniciar si es necesario
./mvnw spring-boot:run
```

### Logs y Debugging
- **Backend**: Logs en consola con nivel DEBUG
- **Frontend**: Console del navegador (F12)
- **Base de Datos**: SQLite Browser para desarrollo

## 🤝 Contribución

### Guías de Desarrollo
1. **Fork** el repositorio
2. **Crear** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

### Estándares de Código
- **Backend**: Java 17, Spring Boot 3.x, Maven
- **Frontend**: TypeScript, Angular 16, ESLint
- **Base de Datos**: JPA/Hibernate, SQLite/PostgreSQL
- **Documentación**: JavaDoc, TypeDoc, README

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Jesús Felipe Córdoba Echandía** - *Desarrollo inicial* - [GitHub](https://github.com/Nesus3Ch4n)

## 🙏 Agradecimientos

- **Plataforma PAU** por la integración de autenticación
- **Angular Material** por los componentes de UI
- **Spring Boot** por el framework del backend
- **Comunidad de desarrolladores** por las librerías utilizadas

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: nesuscl5@gmail.com

---

**Versión**: 1.0.0  
**Última actualización**: Julio 2025  
**Estado**: En desarrollo activo
