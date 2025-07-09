package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.dto.UsuarioCompletoDTO;
import com.example.actualizacion_datos.dto.UsuarioDetalleCompletoDTO;
import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.repository.*;
import com.example.actualizacion_datos.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
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
    @PostMapping("/completo")
    public ResponseEntity<?> crearUsuarioCompleto(@RequestBody UsuarioCompletoDTO usuarioDTO) {
        logger.info("🏗️ Creando usuario completo");
        
        try {
            Usuario usuarioCreado = usuarioService.crearUsuarioCompleto(usuarioDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario creado exitosamente");
            response.put("data", Map.of(
                "id", usuarioCreado.getIdUsuario(),
                "cedula", usuarioCreado.getDocumento(),
                "nombre", usuarioCreado.getNombre(),
                "correo", usuarioCreado.getCorreo()
            ));
            
            logger.info("✅ Usuario creado exitosamente con ID: {} y cédula: {}", 
                usuarioCreado.getIdUsuario(), usuarioCreado.getDocumento());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario completo: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al crear usuario: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== CREAR USUARIO BÁSICO ==========
    @PostMapping("/basico")
    public ResponseEntity<?> crearUsuarioBasico(@RequestBody Map<String, Object> usuarioData) {
        logger.info("🏗️ Creando usuario básico");
        
        try {
            Usuario usuarioCreado = usuarioService.crearUsuarioBasico(usuarioData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario básico creado exitosamente");
            response.put("data", Map.of(
                "id", usuarioCreado.getIdUsuario(),
                "cedula", usuarioCreado.getDocumento(),
                "nombre", usuarioCreado.getNombre(),
                "correo", usuarioCreado.getCorreo()
            ));
            
            logger.info("✅ Usuario básico creado exitosamente con ID: {} y cédula: {}", 
                usuarioCreado.getIdUsuario(), usuarioCreado.getDocumento());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario básico: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al crear usuario básico: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== ACTUALIZAR USUARIO ==========
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioCompletoDTO usuarioDTO) {
        logger.info("🔄 Actualizando usuario con ID: {}", id);
        
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuarioDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario actualizado exitosamente");
            response.put("data", Map.of(
                "id", usuarioActualizado.getIdUsuario(),
                "cedula", usuarioActualizado.getDocumento(),
                "nombre", usuarioActualizado.getNombre(),
                "correo", usuarioActualizado.getCorreo(),
                "fechaActualizacion", LocalDateTime.now()
            ));
            
            logger.info("✅ Usuario actualizado exitosamente con ID: {} y cédula: {}", 
                usuarioActualizado.getIdUsuario(), usuarioActualizado.getDocumento());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar usuario: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al actualizar usuario: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== OBTENER USUARIO POR ID ==========
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        logger.info("🔍 Obteniendo usuario por ID: {}", id);
        
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
            
            if (usuario.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", usuario.get());
                
                logger.info("✅ Usuario encontrado con ID: {}", id);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Usuario no encontrado con ID: " + id);
                
                logger.warn("⚠️ Usuario no encontrado con ID: {}", id);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuario por ID: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener usuario: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== OBTENER USUARIO POR CÉDULA ==========
    @GetMapping("/cedula/{cedula}")
    public ResponseEntity<?> obtenerUsuarioPorCedula(@PathVariable Long cedula) {
        logger.info("🔍 Obteniendo usuario por cédula: {}", cedula);
        
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorCedula(cedula);
            
            if (usuario.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("data", usuario.get());
                
                logger.info("✅ Usuario encontrado con cédula: {}", cedula);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Usuario no encontrado con cédula: " + cedula);
                
                logger.warn("⚠️ Usuario no encontrado con cédula: {}", cedula);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuario por cédula: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener usuario: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== OBTENER TODOS LOS USUARIOS ==========
    @GetMapping
    public ResponseEntity<?> obtenerTodosLosUsuarios() {
        logger.info("🔍 Obteniendo todos los usuarios");
        
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", usuarios);
            response.put("total", usuarios.size());
            
            logger.info("✅ Se encontraron {} usuarios", usuarios.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener todos los usuarios: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener usuarios: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== BUSCAR USUARIOS POR NOMBRE ==========
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarUsuariosPorNombre(@RequestParam String nombre) {
        logger.info("🔍 Buscando usuarios por nombre: {}", nombre);
        
        try {
            List<Usuario> usuarios = usuarioService.buscarUsuariosPorNombre(nombre);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", usuarios);
            response.put("total", usuarios.size());
            
            logger.info("✅ Se encontraron {} usuarios con nombre: {}", usuarios.size(), nombre);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al buscar usuarios por nombre: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al buscar usuarios: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== ELIMINAR USUARIO ==========
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        logger.info("🗑️ Eliminando usuario con ID: {}", id);
        
        try {
            usuarioService.eliminarUsuario(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Usuario eliminado exitosamente");
            
            logger.info("✅ Usuario eliminado exitosamente con ID: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar usuario: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al eliminar usuario: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== OBTENER ESTADÍSTICAS ==========
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas() {
        logger.info("📊 Obteniendo estadísticas de usuarios");
        
        try {
            long totalUsuarios = usuarioService.contarUsuarios();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", Map.of(
                "totalUsuarios", totalUsuarios
            ));
            
            logger.info("✅ Estadísticas obtenidas: {} usuarios totales", totalUsuarios);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener estadísticas: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener estadísticas: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== VERIFICAR SI ES ADMINISTRADOR ==========
    @GetMapping("/admin/verificar/{cedula}")
    public ResponseEntity<?> verificarAdministrador(@PathVariable Long cedula) {
        logger.info("🔍 Verificando si la cédula {} es administrador", cedula);
        
        try {
            // Verificar si la cédula es 1006101211 (administrador)
            boolean esAdmin = cedula.equals(1006101211L);
            
            // También verificar si existe en la tabla USUARIO
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorCedula(cedula);
            boolean existeUsuario = usuario.isPresent();
            
            boolean tieneAcceso = esAdmin || existeUsuario;
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", Map.of(
                "cedula", cedula,
                "esAdministrador", esAdmin,
                "existeUsuario", existeUsuario,
                "tieneAcceso", tieneAcceso,
                "mensaje", tieneAcceso ? "Acceso permitido" : "Acceso denegado"
            ));
            
            logger.info("✅ Verificación completada para cédula {}: acceso = {}", cedula, tieneAcceso);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al verificar administrador: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al verificar administrador: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== OBTENER DETALLE COMPLETO DE USUARIO ==========
    @GetMapping("/detalle/{idUsuario}")
    public ResponseEntity<?> obtenerDetalleCompleto(@PathVariable Long idUsuario) {
        logger.info("🔍 Obteniendo detalle completo para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(idUsuario);
            if (usuarioOpt.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Usuario no encontrado con ID: " + idUsuario);
                return ResponseEntity.notFound().build();
            }
            
            Usuario usuario = usuarioOpt.get();
            
            // Obtener datos relacionados
            List<ContactoEmergencia> contactos = contactoEmergenciaRepository.findByUsuarioIdUsuario(idUsuario);
            List<EstudioAcademico> estudios = estudioAcademicoRepository.findByUsuarioIdUsuario(idUsuario);
            List<PersonaACargo> personas = personaACargoRepository.findByUsuarioIdUsuario(idUsuario);
            List<RelacionConf> relaciones = relacionConfRepository.findByUsuarioIdUsuario(idUsuario);
            List<Vehiculo> vehiculos = vehiculoRepository.findByUsuarioIdUsuario(idUsuario);
            List<Vivienda> viviendas = viviendaRepository.findByUsuarioIdUsuario(idUsuario);
            
            // Crear DTO con los datos correctos
            UsuarioDetalleCompletoDTO detalleCompleto = new UsuarioDetalleCompletoDTO(
                usuario, contactos, estudios, personas, relaciones, vehiculos, 
                viviendas.isEmpty() ? null : viviendas.get(0)
            );
            
            // Crear respuesta con los nombres de campos que espera el frontend
            Map<String, Object> detalleFrontend = new HashMap<>();
            detalleFrontend.put("usuario", detalleCompleto.getUsuario());
            detalleFrontend.put("contactosEmergencia", detalleCompleto.getContactosEmergencia());
            detalleFrontend.put("estudiosAcademicos", detalleCompleto.getEstudiosAcademicos());
            detalleFrontend.put("personasACargo", detalleCompleto.getPersonasACargo());
            detalleFrontend.put("relacionesConflicto", detalleCompleto.getRelacionesConflicto());
            detalleFrontend.put("vehiculos", detalleCompleto.getVehiculos());
            detalleFrontend.put("vivienda", detalleCompleto.getVivienda());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", detalleFrontend);
            
            logger.info("✅ Detalle completo obtenido para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener detalle completo: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error al obtener detalle completo: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
} 