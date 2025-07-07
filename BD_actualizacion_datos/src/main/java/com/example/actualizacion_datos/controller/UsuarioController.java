package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.dto.UsuarioCompletoDTO;
import com.example.actualizacion_datos.dto.UsuarioDetalleCompletoDTO;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.entity.ContactoEmergencia;
import com.example.actualizacion_datos.entity.EstudioAcademico;
import com.example.actualizacion_datos.entity.PersonaACargo;
import com.example.actualizacion_datos.entity.RelacionConf;
import com.example.actualizacion_datos.entity.Vehiculo;
import com.example.actualizacion_datos.entity.Vivienda;
import com.example.actualizacion_datos.service.UsuarioService;
import com.example.actualizacion_datos.repository.ContactoEmergenciaRepository;
import com.example.actualizacion_datos.repository.EstudioAcademicoRepository;
import com.example.actualizacion_datos.repository.PersonaACargoRepository;
import com.example.actualizacion_datos.repository.RelacionConfRepository;
import com.example.actualizacion_datos.repository.VehiculoRepository;
import com.example.actualizacion_datos.repository.ViviendaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/USUARIO")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
@Tag(name = "Usuarios", description = "API para gestión de usuarios y formularios completos")
public class UsuarioController {
    
    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private ContactoEmergenciaRepository contactoEmergenciaRepository;
    
    @Autowired
    private EstudioAcademicoRepository estudioAcademicoRepository;
    
    @Autowired
    private PersonaACargoRepository personaACargoRepository;
    
    @Autowired
    private RelacionConfRepository relacionConfRepository;
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    @Autowired
    private ViviendaRepository viviendaRepository;
    
    // ========== CREAR USUARIO COMPLETO ==========
    @PostMapping("/crear-completo")
    @Operation(summary = "Crear usuario completo", description = "Crea un nuevo usuario con toda la información del formulario")
    public ResponseEntity<Map<String, Object>> crearUsuarioCompleto(@Valid @RequestBody UsuarioCompletoDTO usuarioDTO) {
        logger.info("🚀 Recibida petición para crear usuario completo: {}", usuarioDTO.getNombre());
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Usuario usuarioCreado = usuarioService.crearUsuarioCompleto(usuarioDTO);
            
            response.put("success", true);
            response.put("message", "Usuario creado exitosamente");
            response.put("data", Map.of(
                "id", usuarioCreado.getId(),
                "nombre", usuarioCreado.getNombre(),
                "cedula", usuarioCreado.getCedula(),
                "correo", usuarioCreado.getCorreo()

            ));
            
            logger.info("✅ Usuario creado exitosamente con ID: {}", usuarioCreado.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al crear usuario: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // ========== CREAR USUARIO BÁSICO (SOLO INFORMACIÓN PERSONAL) ==========
    @PostMapping
    @Operation(summary = "Crear usuario básico", description = "Crea un nuevo usuario con solo información personal")
    public ResponseEntity<Map<String, Object>> crearUsuario(@RequestBody Map<String, Object> usuarioData) {
        logger.info("👤 Recibida petición para crear usuario básico: {}", usuarioData.get("nombre"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Usuario usuarioCreado = usuarioService.crearUsuarioBasico(usuarioData);
            
            response.put("success", true);
            response.put("message", "Usuario básico creado exitosamente");
            response.put("data", Map.of(
                "id", usuarioCreado.getId(),
                "nombre", usuarioCreado.getNombre(),
                "cedula", usuarioCreado.getCedula(),
                "correo", usuarioCreado.getCorreo(),
                "version", usuarioCreado.getVersion()
            ));
            
            logger.info("✅ Usuario básico creado exitosamente con ID: {}", usuarioCreado.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario básico: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al crear usuario: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // ========== OBTENER TODOS LOS USUARIOS ==========
    @GetMapping("/todos")
    @Operation(summary = "Obtener todos los usuarios", description = "Obtiene la lista completa de todos los usuarios registrados")
    public ResponseEntity<Map<String, Object>> obtenerTodosLosUsuarios() {
        logger.info("🔍 Obteniendo todos los usuarios");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            
            response.put("success", true);
            response.put("message", "Usuarios obtenidos exitosamente");
            response.put("total", usuarios.size());
            response.put("data", usuarios);
            
            logger.info("✅ Se obtuvieron {} usuarios exitosamente", usuarios.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuarios: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========== OBTENER USUARIO POR ID ==========
    @GetMapping("/{id}")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene un usuario específico por su ID")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioPorId(
            @Parameter(description = "ID del usuario") @PathVariable Long id) {
        logger.info("🔍 Buscando usuario por ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
            
            if (usuario.isPresent()) {
                response.put("success", true);
                response.put("message", "Usuario encontrado");
                response.put("data", usuario.get());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Usuario no encontrado");
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al buscar usuario: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al buscar usuario: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // ========== OBTENER USUARIO POR CÉDULA ==========
    @GetMapping("/cedula/{cedula}")
    @Operation(summary = "Obtener usuario por cédula", description = "Obtiene un usuario específico por su cédula")
    public ResponseEntity<Map<String, Object>> obtenerUsuarioPorCedula(
            @Parameter(description = "Cédula del usuario") @PathVariable String cedulaStr) {
        logger.info("🔍 Buscando usuario por cédula: {}", cedulaStr);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Convertir cédula String a Long
            Long cedula;
            try {
                cedula = Long.parseLong(cedulaStr);
            } catch (NumberFormatException e) {
                response.put("success", false);
                response.put("message", "La cédula debe ser un número válido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorCedula(cedula);
            
            if (usuario.isPresent()) {
                response.put("success", true);
                response.put("message", "Usuario encontrado");
                response.put("data", usuario.get());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Usuario no encontrado con cédula: " + cedulaStr);
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al buscar usuario por cédula: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al buscar usuario: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // ========== BUSCAR USUARIOS POR NOMBRE ==========
    @GetMapping("/buscar")
    @Operation(summary = "Buscar usuarios por nombre", description = "Busca usuarios que contengan el nombre especificado")
    public ResponseEntity<Map<String, Object>> buscarUsuariosPorNombre(
            @Parameter(description = "Nombre a buscar") @RequestParam String nombre) {
        logger.info("🔍 Buscando usuarios por nombre: {}", nombre);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Usuario> usuarios = usuarioService.buscarUsuariosPorNombre(nombre);
            
            response.put("success", true);
            response.put("message", "Búsqueda completada");
            response.put("data", usuarios);
            response.put("total", usuarios.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al buscar usuarios: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al buscar usuarios: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // ========== ACTUALIZAR USUARIO ==========
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar usuario", description = "Actualiza la información completa de un usuario")
    public ResponseEntity<Map<String, Object>> actualizarUsuario(
            @Parameter(description = "ID del usuario") @PathVariable Long id,
            @Valid @RequestBody UsuarioCompletoDTO usuarioDTO) {
        logger.info("🔄 Actualizando usuario con ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
            
            response.put("success", true);
            response.put("message", "Usuario actualizado exitosamente");
            response.put("data", Map.of(
                "id", usuarioActualizado.getId(),
                "nombre", usuarioActualizado.getNombre(),
                "cedula", usuarioActualizado.getCedula(),
                "correo", usuarioActualizado.getCorreo(),
                "version", usuarioActualizado.getVersion(),
                "fechaActualizacion", usuarioActualizado.getFechaActualizacion()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar usuario: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al actualizar usuario: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // ========== ELIMINAR USUARIO ==========
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar usuario", description = "Elimina lógicamente un usuario (lo marca como inactivo)")
    public ResponseEntity<Map<String, Object>> eliminarUsuario(
            @Parameter(description = "ID del usuario") @PathVariable Long id) {
        logger.info("🗑️ Eliminando usuario con ID: {}", id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            usuarioService.eliminarUsuario(id);
            
            response.put("success", true);
            response.put("message", "Usuario eliminado exitosamente");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar usuario: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al eliminar usuario: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // ========== ESTADÍSTICAS ==========
    @GetMapping("/estadisticas")
    @Operation(summary = "Obtener estadísticas", description = "Obtiene estadísticas generales de usuarios")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        logger.info("📊 Obteniendo estadísticas de usuarios");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            long totalUsuarios = usuarioService.contarUsuarios();
            
            Map<String, Object> estadisticas = new HashMap<>();
            estadisticas.put("totalUsuarios", totalUsuarios);
            
            response.put("success", true);
            response.put("message", "Estadísticas obtenidas exitosamente");
            response.put("data", estadisticas);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener estadísticas: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // ========== ENDPOINT DE SALUD ==========
    @GetMapping("/health")
    @Operation(summary = "Verificar salud del servicio", description = "Endpoint para verificar que el servicio está funcionando")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Servicio de usuarios funcionando correctamente");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    // ========== ENDPOINT DE TEST TEMPORAL ==========
    @PostMapping("/test-conversion")
    @Operation(summary = "Test de conversión de tipos", description = "Endpoint temporal para verificar conversión de tipos")
    public ResponseEntity<Map<String, Object>> testConversion(@RequestBody Map<String, Object> testData) {
        logger.info("🧪 Test de conversión de tipos: {}", testData);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Crear datos de prueba simples
            Map<String, Object> usuarioData = new HashMap<>();
            usuarioData.put("nombre", "Test Usuario");
            usuarioData.put("cedula", 12345678);
            usuarioData.put("correo", "test@test.com");
            
            // Intentar crear usuario básico
            Usuario usuarioCreado = usuarioService.crearUsuarioBasico(usuarioData);
            
            response.put("success", true);
            response.put("message", "Test de conversión exitoso");
            response.put("data", Map.of(
                "id", usuarioCreado.getId(),
                "nombre", usuarioCreado.getNombre(),
                "cedula", usuarioCreado.getCedula(),
                "correo", usuarioCreado.getCorreo()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error en test de conversión: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error en test: " + e.getMessage());
            response.put("error", e.getMessage());
            response.put("stackTrace", e.getStackTrace()[0].toString());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // ========== ENDPOINT DE VERIFICACIÓN DE COLUMNAS ==========
    @GetMapping("/verify-columns")
    @Operation(summary = "Verificar columnas de tabla", description = "Endpoint temporal para verificar estructura de tabla")
    public ResponseEntity<Map<String, Object>> verifyColumns() {
        logger.info("🔍 Verificando estructura de tabla USUARIO");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Intentar obtener cualquier usuario para verificar el mapeo
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            
            response.put("success", true);
            response.put("message", "Verificación de estructura exitosa");
            response.put("totalUsuarios", usuarios.size());
            response.put("sampleUser", usuarios.isEmpty() ? null : usuarios.get(0));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error en verificación de columnas: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error en verificación: " + e.getMessage());
            response.put("error", e.getMessage());
            response.put("fullStackTrace", java.util.Arrays.toString(e.getStackTrace()));
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // ========== ENDPOINT DE PRUEBA (SIN AUTENTICACIÓN) ==========
    @PostMapping("/test/crear-usuario")
    @Operation(summary = "Crear usuario de prueba", description = "Endpoint de prueba para crear usuarios sin autenticación")
    public ResponseEntity<Map<String, Object>> crearUsuarioPrueba(@RequestBody Map<String, Object> usuarioData) {
        logger.info("🧪 Creando usuario de prueba: {}", usuarioData.get("nombre"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Usuario usuarioCreado = usuarioService.crearUsuarioBasico(usuarioData);
            
            response.put("success", true);
            response.put("message", "Usuario de prueba creado exitosamente");
            response.put("data", Map.of(
                "id", usuarioCreado.getId(),
                "nombre", usuarioCreado.getNombre(),
                "cedula", usuarioCreado.getCedula(),
                "correo", usuarioCreado.getCorreo(),
                "version", usuarioCreado.getVersion()
            ));
            
            logger.info("✅ Usuario de prueba creado exitosamente con ID: {}", usuarioCreado.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario de prueba: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al crear usuario de prueba: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // ========== OBTENER DETALLE COMPLETO DE USUARIO ==========
    @GetMapping("/detalle-completo/{id_usuario}")
    @Operation(summary = "Obtener detalle completo de usuario", description = "Obtiene toda la información relacionada de un usuario por id_usuario")
    public ResponseEntity<Map<String, Object>> obtenerDetalleCompletoUsuario(
            @Parameter(description = "ID del usuario") @PathVariable("id_usuario") Long idUsuario) {
        logger.info("🔍 Obteniendo detalle completo de usuario por id_usuario: {}", idUsuario);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Obtener usuario por ID
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(idUsuario);
            
            if (usuarioOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado con id_usuario: " + idUsuario);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Usuario usuario = usuarioOpt.get();
            
            // Obtener todos los datos relacionados
            List<ContactoEmergencia> contactosEmergencia = contactoEmergenciaRepository.findByIdUsuario(idUsuario);
            List<EstudioAcademico> estudiosAcademicos = estudioAcademicoRepository.findByIdUsuario(idUsuario);
            List<PersonaACargo> personasACargo = personaACargoRepository.findByIdUsuario(idUsuario);
            List<RelacionConf> relacionesConflicto = relacionConfRepository.findByIdUsuario(idUsuario);
            List<Vehiculo> vehiculos = vehiculoRepository.findByIdUsuario(idUsuario);
            Optional<Vivienda> viviendaOpt = viviendaRepository.findByIdUsuario(idUsuario);
            
            // Crear el DTO con toda la información
            UsuarioDetalleCompletoDTO detalleCompleto = new UsuarioDetalleCompletoDTO();
            detalleCompleto.setUsuario(usuario);
            detalleCompleto.setContactosEmergencia(contactosEmergencia);
            detalleCompleto.setEstudiosAcademicos(estudiosAcademicos);
            detalleCompleto.setPersonasACargo(personasACargo);
            detalleCompleto.setRelacionesConflicto(relacionesConflicto);
            detalleCompleto.setVehiculos(vehiculos);
            detalleCompleto.setVivienda(viviendaOpt.orElse(null));
            
            response.put("success", true);
            response.put("message", "Detalle completo obtenido exitosamente");
            response.put("data", detalleCompleto);
            
            logger.info("✅ Detalle completo obtenido exitosamente para id_usuario: {}", idUsuario);
            logger.info("📊 Resumen: {} contactos, {} estudios, {} personas a cargo, {} conflictos, {} vehículos, vivienda: {}", 
                contactosEmergencia.size(), estudiosAcademicos.size(), personasACargo.size(), 
                relacionesConflicto.size(), vehiculos.size(), viviendaOpt.isPresent() ? "Sí" : "No");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener detalle completo: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al obtener detalle completo: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========== ENDPOINT DE PRUEBA PARA OBTENER TODOS LOS USUARIOS ==========
    @GetMapping("/test/todos")
    @Operation(summary = "Obtener todos los usuarios (prueba)", description = "Endpoint de prueba para obtener todos los usuarios sin autenticación")
    public ResponseEntity<Map<String, Object>> obtenerTodosLosUsuariosPrueba() {
        logger.info("🧪 Obteniendo todos los usuarios (prueba)");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            
            response.put("success", true);
            response.put("message", "Usuarios obtenidos exitosamente");
            response.put("total", usuarios.size());
            response.put("data", usuarios);
            
            logger.info("✅ Se obtuvieron {} usuarios exitosamente (prueba)", usuarios.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuarios (prueba): {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al obtener usuarios: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========== ENDPOINT DE PRUEBA PARA OBTENER DETALLE COMPLETO ==========
    @GetMapping("/test/detalle-completo/{id_usuario}")
    @Operation(summary = "Obtener detalle completo de usuario (prueba)", description = "Endpoint de prueba para obtener toda la información relacionada de un usuario por id_usuario sin autenticación")
    public ResponseEntity<Map<String, Object>> obtenerDetalleCompletoUsuarioPrueba(
            @Parameter(description = "ID del usuario") @PathVariable("id_usuario") Long idUsuario) {
        logger.info("🧪 Obteniendo detalle completo de usuario por id_usuario (prueba): {}", idUsuario);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Obtener usuario por ID
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(idUsuario);
            
            if (usuarioOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Usuario no encontrado con id_usuario: " + idUsuario);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Usuario usuario = usuarioOpt.get();
            
            // Obtener todos los datos relacionados
            List<ContactoEmergencia> contactosEmergencia = contactoEmergenciaRepository.findByIdUsuario(idUsuario);
            List<EstudioAcademico> estudiosAcademicos = estudioAcademicoRepository.findByIdUsuario(idUsuario);
            List<PersonaACargo> personasACargo = personaACargoRepository.findByIdUsuario(idUsuario);
            List<RelacionConf> relacionesConflicto = relacionConfRepository.findByIdUsuario(idUsuario);
            List<Vehiculo> vehiculos = vehiculoRepository.findByIdUsuario(idUsuario);
            Optional<Vivienda> viviendaOpt = viviendaRepository.findByIdUsuario(idUsuario);
            
            // Crear el DTO con toda la información
            UsuarioDetalleCompletoDTO detalleCompleto = new UsuarioDetalleCompletoDTO();
            detalleCompleto.setUsuario(usuario);
            detalleCompleto.setContactosEmergencia(contactosEmergencia);
            detalleCompleto.setEstudiosAcademicos(estudiosAcademicos);
            detalleCompleto.setPersonasACargo(personasACargo);
            detalleCompleto.setRelacionesConflicto(relacionesConflicto);
            detalleCompleto.setVehiculos(vehiculos);
            detalleCompleto.setVivienda(viviendaOpt.orElse(null));
            
            // Logs detallados de los datos
            logger.info("🔍 DATOS DETALLADOS DEL USUARIO {}:", idUsuario);
            logger.info("👤 Usuario: ID={}, Nombre={}, Cédula={}", usuario.getId(), usuario.getNombre(), usuario.getCedula());
            logger.info("📞 Contactos de emergencia: {} registros", contactosEmergencia.size());
            contactosEmergencia.forEach(contacto -> logger.info("   - Contacto: {}", contacto.toString()));
            logger.info("🎓 Estudios académicos: {} registros", estudiosAcademicos.size());
            estudiosAcademicos.forEach(estudio -> logger.info("   - Estudio: {}", estudio.toString()));
            logger.info("👨‍👩‍👧‍👦 Personas a cargo: {} registros", personasACargo.size());
            personasACargo.forEach(persona -> logger.info("   - Persona: {}", persona.toString()));
            logger.info("⚖️ Relaciones de conflicto: {} registros", relacionesConflicto.size());
            relacionesConflicto.forEach(relacion -> logger.info("   - Relación: {}", relacion.toString()));
            logger.info("🚗 Vehículos: {} registros", vehiculos.size());
            vehiculos.forEach(vehiculo -> logger.info("   - Vehículo: {}", vehiculo.toString()));
            if (viviendaOpt.isPresent()) {
                Vivienda vivienda = viviendaOpt.get();
                logger.info("🏠 Vivienda: {}", vivienda.toString());
            } else {
                logger.info("🏠 Vivienda: No registrada");
            }
            
            response.put("success", true);
            response.put("message", "Detalle completo obtenido exitosamente");
            response.put("data", detalleCompleto);
            
            logger.info("✅ Detalle completo obtenido exitosamente para id_usuario: {} (prueba)", idUsuario);
            logger.info("📊 Resumen: {} contactos, {} estudios, {} personas a cargo, {} conflictos, {} vehículos, vivienda: {}", 
                contactosEmergencia.size(), estudiosAcademicos.size(), personasACargo.size(), 
                relacionesConflicto.size(), vehiculos.size(), viviendaOpt.isPresent() ? "Sí" : "No");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener detalle completo (prueba): {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al obtener detalle completo: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ========== ENDPOINT DE PRUEBA PARA VERIFICAR USUARIO ==========
    @GetMapping("/test/cedula/{cedula}")
    @Operation(summary = "Verificar usuario de prueba", description = "Endpoint de prueba para verificar usuarios sin autenticación")
    public ResponseEntity<Map<String, Object>> verificarUsuarioPrueba(
            @Parameter(description = "Cédula del usuario") @PathVariable String cedulaStr) {
        logger.info("🧪 Verificando usuario de prueba por cédula: {}", cedulaStr);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Convertir cédula String a Long
            Long cedula;
            try {
                cedula = Long.parseLong(cedulaStr);
            } catch (NumberFormatException e) {
                response.put("success", false);
                response.put("message", "La cédula debe ser un número válido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorCedula(cedula);
            
            if (usuario.isPresent()) {
                response.put("success", true);
                response.put("message", "Usuario de prueba encontrado");
                response.put("data", usuario.get());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Usuario de prueba no encontrado con cédula: " + cedulaStr);
                
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al verificar usuario de prueba: {}", e.getMessage(), e);
            
            response.put("success", false);
            response.put("message", "Error al verificar usuario de prueba: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 