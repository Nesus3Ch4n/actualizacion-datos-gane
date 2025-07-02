package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.dto.UsuarioCompletoDTO;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.service.UsuarioService;
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
    @GetMapping
    @Operation(summary = "Obtener todos los usuarios", description = "Obtiene la lista de todos los usuarios activos")
    public ResponseEntity<Map<String, Object>> obtenerTodosLosUsuarios() {
        logger.info("📋 Obteniendo todos los usuarios");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            
            response.put("success", true);
            response.put("message", "Usuarios obtenidos exitosamente");
            response.put("data", usuarios);
            response.put("total", usuarios.size());
            
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
} 