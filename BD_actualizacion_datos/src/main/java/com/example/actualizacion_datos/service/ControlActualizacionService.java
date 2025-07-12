package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.ControlActualizacion;
import com.example.actualizacion_datos.entity.HistorialActualizacion;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.repository.ControlActualizacionRepository;
import com.example.actualizacion_datos.repository.HistorialActualizacionRepository;
import com.example.actualizacion_datos.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ControlActualizacionService {
    
    private static final Logger logger = LoggerFactory.getLogger(ControlActualizacionService.class);
    
    @Autowired
    private ControlActualizacionRepository controlRepository;
    
    @Autowired
    private HistorialActualizacionRepository historialRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Verificar si un usuario necesita actualizar sus datos
     */
    public boolean necesitaActualizacion(Long idUsuario) {
        logger.info("🔍 Verificando si usuario {} necesita actualización", idUsuario);
        
        Optional<ControlActualizacion> controlOpt = controlRepository.findByUsuarioIdUsuario(idUsuario);
        
        if (controlOpt.isEmpty()) {
            logger.info("📝 Usuario {} no tiene control de actualización, necesita actualizar", idUsuario);
            return true; // Usuario nuevo, necesita actualizar
        }
        
        ControlActualizacion control = controlOpt.get();
        boolean necesita = control.necesitaActualizacion();
        
        logger.info("📊 Usuario {} - Estado: {}, Necesita actualización: {}", 
                   idUsuario, control.getEstadoActualizacion(), necesita);
        
        return necesita;
    }
    
    /**
     * Registrar una actualización completada
     */
    public void registrarActualizacion(Long idUsuario, String tipoActualizacion, 
                                     String datosActualizados, String ipAddress, 
                                     String userAgent) {
        logger.info("📝 Registrando actualización para usuario {} - Tipo: {}", idUsuario, tipoActualizacion);
        
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isEmpty()) {
            logger.error("❌ Usuario {} no encontrado", idUsuario);
            throw new RuntimeException("Usuario no encontrado: " + idUsuario);
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Obtener o crear control de actualización
        Optional<ControlActualizacion> controlOpt = controlRepository.findByUsuarioIdUsuario(idUsuario);
        ControlActualizacion control;
        
        if (controlOpt.isPresent()) {
            control = controlOpt.get();
            logger.info("🔄 Actualizando control existente para usuario {}", idUsuario);
        } else {
            control = new ControlActualizacion(usuario);
            logger.info("🆕 Creando nuevo control para usuario {}", idUsuario);
        }
        
        // Actualizar control
        LocalDateTime ahora = LocalDateTime.now();
        control.setFechaUltimaActualizacion(ahora);
        control.setFechaProximaActualizacion(ahora.plusYears(1));
        control.setEstadoActualizacion("COMPLETADA");
        control.setVersionActualizacion(control.getVersionActualizacion() + 1);
        control.setFechaModificacion(ahora);
        
        control = controlRepository.save(control);
        logger.info("✅ Control actualizado para usuario {}", idUsuario);
        
        // Registrar en historial
        HistorialActualizacion historial = new HistorialActualizacion(
            usuario, control, tipoActualizacion, datosActualizados, ipAddress, userAgent
        );
        
        historialRepository.save(historial);
        logger.info("📚 Historial registrado para usuario {}", idUsuario);
    }
    
    /**
     * Generar claims con información de actualización para el token
     */
    public Map<String, Object> generarClaimsConActualizacion(Long idUsuario) {
        logger.info("🔐 Generando claims de actualización para usuario {}", idUsuario);
        
        Optional<ControlActualizacion> controlOpt = controlRepository.findByUsuarioIdUsuario(idUsuario);
        Map<String, Object> claims = new HashMap<>();
        
        if (controlOpt.isPresent()) {
            ControlActualizacion control = controlOpt.get();
            claims.put("ultima_actualizacion", control.getFechaUltimaActualizacion().toString());
            claims.put("proxima_actualizacion", control.getFechaProximaActualizacion().toString());
            claims.put("estado_actualizacion", control.getEstadoActualizacion());
            claims.put("version_actualizacion", control.getVersionActualizacion());
            
            logger.info("📊 Claims generados para usuario {} - Estado: {}", 
                       idUsuario, control.getEstadoActualizacion());
        } else {
            // Usuario nuevo
            claims.put("ultima_actualizacion", null);
            claims.put("proxima_actualizacion", LocalDateTime.now().toString());
            claims.put("estado_actualizacion", "PENDIENTE");
            claims.put("version_actualizacion", 0);
            
            logger.info("🆕 Claims para usuario nuevo {}", idUsuario);
        }
        
        return claims;
    }
    
    /**
     * Obtener estadísticas de actualizaciones
     */
    public Map<String, Object> obtenerEstadisticas() {
        logger.info("📊 Obteniendo estadísticas de actualizaciones");
        
        LocalDateTime ahora = LocalDateTime.now();
        
        // Obtener estadísticas usando consultas individuales más confiables
        long total = controlRepository.count();
        long completadas = controlRepository.countByEstadoActualizacion().stream()
            .filter(arr -> "COMPLETADA".equals(arr[0]))
            .mapToLong(arr -> ((Number) arr[1]).longValue())
            .findFirst()
            .orElse(0L);
        long pendientes = controlRepository.countByEstadoActualizacion().stream()
            .filter(arr -> "PENDIENTE".equals(arr[0]))
            .mapToLong(arr -> ((Number) arr[1]).longValue())
            .findFirst()
            .orElse(0L);
        long vencidas = controlRepository.countVencidos(ahora);
        
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("total", total);
        estadisticas.put("completadas", completadas);
        estadisticas.put("pendientes", pendientes);
        estadisticas.put("vencidas", vencidas);
        
        // Calcular porcentajes
        if (total > 0) {
            estadisticas.put("porcentajeCompletadas", (completadas * 100.0) / total);
            estadisticas.put("porcentajePendientes", (pendientes * 100.0) / total);
            estadisticas.put("porcentajeVencidas", (vencidas * 100.0) / total);
        } else {
            estadisticas.put("porcentajeCompletadas", 0.0);
            estadisticas.put("porcentajePendientes", 0.0);
            estadisticas.put("porcentajeVencidas", 0.0);
        }
        
        // Obtener controles que necesitan actualización
        List<ControlActualizacion> necesitanActualizacion = controlRepository.findNecesitanActualizacion(ahora);
        estadisticas.put("necesitanActualizacion", necesitanActualizacion.size());
        
        // Obtener controles próximos a vencer (30 días)
        LocalDateTime fechaLimite = ahora.plusDays(30);
        List<ControlActualizacion> proximosAVencer = controlRepository.findProximosAVencer(ahora, fechaLimite);
        estadisticas.put("proximosAVencer", proximosAVencer.size());
        
        logger.info("📈 Estadísticas obtenidas - Total: {}, Completadas: {}, Pendientes: {}, Vencidas: {}", 
                   total, completadas, pendientes, vencidas);
        
        return estadisticas;
    }
    
    /**
     * Obtener controles que necesitan actualización
     */
    public List<ControlActualizacion> obtenerNecesitanActualizacion() {
        LocalDateTime ahora = LocalDateTime.now();
        return controlRepository.findNecesitanActualizacion(ahora);
    }
    
    /**
     * Obtener controles vencidos
     */
    public List<ControlActualizacion> obtenerVencidos() {
        LocalDateTime ahora = LocalDateTime.now();
        return controlRepository.findVencidos(ahora);
    }
    
    /**
     * Obtener controles próximos a vencer
     */
    public List<ControlActualizacion> obtenerProximosAVencer(int diasAdvertencia) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaLimite = ahora.plusDays(diasAdvertencia);
        return controlRepository.findProximosAVencer(ahora, fechaLimite);
    }
    
    /**
     * Obtener historial de actualizaciones de un usuario
     */
    public List<HistorialActualizacion> obtenerHistorialUsuario(Long idUsuario) {
        return historialRepository.findByUsuarioIdUsuarioOrderByFechaActualizacionDesc(idUsuario);
    }
    
    /**
     * Obtener estadísticas de historial por período
     */
    public Map<String, Object> obtenerEstadisticasHistorial(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        Object[] stats = historialRepository.getEstadisticasPorPeriodo(fechaInicio, fechaFin);
        
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("total", stats[0]);
        estadisticas.put("anuales", stats[1]);
        estadisticas.put("correcciones", stats[2]);
        estadisticas.put("administrativas", stats[3]);
        
        return estadisticas;
    }
} 