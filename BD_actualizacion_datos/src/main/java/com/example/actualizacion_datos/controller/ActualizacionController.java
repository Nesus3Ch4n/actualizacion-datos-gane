package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.ControlActualizacion;
import com.example.actualizacion_datos.entity.HistorialActualizacion;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.service.ControlActualizacionService;
import com.example.actualizacion_datos.repository.UsuarioRepository;
import com.example.actualizacion_datos.repository.ControlActualizacionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actualizacion")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ActualizacionController {
    
    private static final Logger logger = LoggerFactory.getLogger(ActualizacionController.class);
    
    @Autowired
    private ControlActualizacionService controlActualizacionService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ControlActualizacionRepository controlRepository;
    
    /**
     * Verificar si el usuario actual necesita actualización
     */
    @GetMapping("/verificar")
    public ResponseEntity<?> verificarNecesidadActualizacion(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Usuario no identificado"
                ));
            }
            
            boolean necesitaActualizacion = controlActualizacionService.necesitaActualizacion(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("necesitaActualizacion", necesitaActualizacion);
            
            if (necesitaActualizacion) {
                response.put("mensaje", "Se requiere actualización anual de datos");
                response.put("tipo", "ANUAL");
            } else {
                response.put("mensaje", "Datos actualizados al día");
                response.put("tipo", "ACTUALIZADO");
            }
            
            logger.info("🔍 Verificación de actualización para usuario {}: {}", userId, necesitaActualizacion);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error verificando necesidad de actualización: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error interno del servidor"
            ));
        }
    }
    
    /**
     * Registrar una actualización completada
     */
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarActualizacion(@RequestBody Map<String, String> request, 
                                                   HttpServletRequest httpRequest) {
        try {
            Long userId = (Long) httpRequest.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Usuario no identificado"
                ));
            }
            
            String tipoActualizacion = request.get("tipoActualizacion");
            String datosActualizados = request.get("datosActualizados");
            String ipAddress = request.get("ipAddress");
            String userAgent = request.get("userAgent");
            
            // Obtener IP real si no se proporciona
            if (ipAddress == null || ipAddress.isEmpty()) {
                ipAddress = getClientIP(httpRequest);
            }
            
            // Obtener User-Agent real si no se proporciona
            if (userAgent == null || userAgent.isEmpty()) {
                userAgent = httpRequest.getHeader("User-Agent");
            }
            
            controlActualizacionService.registrarActualizacion(
                userId, tipoActualizacion, datosActualizados, ipAddress, userAgent
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Actualización registrada exitosamente");
            response.put("fechaRegistro", LocalDateTime.now().toString());
            
            logger.info("✅ Actualización registrada para usuario {} - Tipo: {}", userId, tipoActualizacion);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error registrando actualización: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al registrar actualización: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obtener estadísticas de actualizaciones
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas() {
        try {
            Map<String, Object> estadisticas = controlActualizacionService.obtenerEstadisticas();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", estadisticas);
            response.put("fechaConsulta", LocalDateTime.now().toString());
            
            logger.info("📊 Estadísticas de actualizaciones obtenidas");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error obteniendo estadísticas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al obtener estadísticas: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obtener controles que necesitan actualización
     */
    @GetMapping("/pendientes")
    public ResponseEntity<?> obtenerPendientes() {
        try {
            List<ControlActualizacion> pendientes = controlActualizacionService.obtenerNecesitanActualizacion();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", pendientes);
            response.put("total", pendientes.size());
            
            logger.info("📋 Controles pendientes obtenidos: {}", pendientes.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error obteniendo controles pendientes: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al obtener controles pendientes: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obtener controles vencidos
     */
    @GetMapping("/vencidas")
    public ResponseEntity<?> obtenerVencidas() {
        try {
            List<ControlActualizacion> vencidas = controlActualizacionService.obtenerVencidos();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vencidas);
            response.put("total", vencidas.size());
            
            logger.info("⏰ Controles vencidos obtenidos: {}", vencidas.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error obteniendo controles vencidos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al obtener controles vencidos: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obtener historial de actualizaciones de un usuario
     */
    @GetMapping("/historial/{idUsuario}")
    public ResponseEntity<?> obtenerHistorialUsuario(@PathVariable Long idUsuario) {
        try {
            List<HistorialActualizacion> historial = controlActualizacionService.obtenerHistorialUsuario(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", historial);
            response.put("total", historial.size());
            
            logger.info("📚 Historial obtenido para usuario {}: {} registros", idUsuario, historial.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error obteniendo historial para usuario {}: {}", idUsuario, e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al obtener historial: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obtener estadísticas de historial por período
     */
    @GetMapping("/historial/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasHistorial(
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin) {
        try {
            LocalDateTime inicio = fechaInicio != null ? LocalDateTime.parse(fechaInicio) : LocalDateTime.now().minusMonths(1);
            LocalDateTime fin = fechaFin != null ? LocalDateTime.parse(fechaFin) : LocalDateTime.now();
            
            Map<String, Object> estadisticas = controlActualizacionService.obtenerEstadisticasHistorial(inicio, fin);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", estadisticas);
            response.put("fechaInicio", inicio.toString());
            response.put("fechaFin", fin.toString());
            
            logger.info("📊 Estadísticas de historial obtenidas para período {} - {}", inicio, fin);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error obteniendo estadísticas de historial: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al obtener estadísticas de historial: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Forzar inicialización de datos de control (solo para desarrollo)
     */
    @PostMapping("/inicializar-datos")
    public ResponseEntity<?> inicializarDatos() {
        try {
            // Crear controles para usuarios existentes
            List<Usuario> usuarios = usuarioRepository.findAll();
            int controlesCreados = 0;
            
            for (Usuario usuario : usuarios) {
                if (!controlRepository.findByUsuarioIdUsuario(usuario.getIdUsuario()).isPresent()) {
                    ControlActualizacion control = new ControlActualizacion(usuario);
                    
                    // Simular diferentes estados
                    if (usuario.getIdUsuario() % 3 == 0) {
                        control.setFechaUltimaActualizacion(LocalDateTime.now().minusMonths(6));
                        control.setFechaProximaActualizacion(LocalDateTime.now().plusMonths(6));
                        control.setEstadoActualizacion("COMPLETADA");
                    } else if (usuario.getIdUsuario() % 3 == 1) {
                        control.setFechaUltimaActualizacion(LocalDateTime.now().minusYears(1).minusMonths(1));
                        control.setFechaProximaActualizacion(LocalDateTime.now().minusMonths(1));
                        control.setEstadoActualizacion("PENDIENTE");
                    } else {
                        control.setFechaUltimaActualizacion(LocalDateTime.now().minusYears(2));
                        control.setFechaProximaActualizacion(LocalDateTime.now().minusMonths(2));
                        control.setEstadoActualizacion("PENDIENTE");
                    }
                    
                    controlRepository.save(control);
                    controlesCreados++;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Datos inicializados correctamente");
            response.put("usuariosProcesados", usuarios.size());
            response.put("controlesCreados", controlesCreados);
            response.put("totalControles", controlRepository.count());
            
            logger.info("✅ Datos inicializados - Usuarios: {}, Controles creados: {}", usuarios.size(), controlesCreados);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error inicializando datos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Error al inicializar datos: " + e.getMessage()
            ));
        }
    }
    
    /**
     * Obtener IP del cliente
     */
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty() && !"unknown".equalsIgnoreCase(xRealIP)) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
} 