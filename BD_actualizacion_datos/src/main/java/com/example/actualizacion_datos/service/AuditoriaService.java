package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.dto.AuditoriaDTO;
import com.example.actualizacion_datos.entity.Auditoria;
import com.example.actualizacion_datos.repository.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditoriaService {
    
    @Autowired
    private AuditoriaRepository auditoriaRepository;
    
    /**
     * Registrar una entrada de auditoría
     */
    public Auditoria registrarAuditoria(String tablaModificada, Long idRegistroModificado, 
                                       String campoModificado, String valorAnterior, 
                                       String valorNuevo, String tipoPeticion, 
                                       String usuarioModificador, Long idUsuario, 
                                       String descripcion) {
        
        Auditoria auditoria = new Auditoria(tablaModificada, idRegistroModificado, 
                                           campoModificado, valorAnterior, valorNuevo, 
                                           tipoPeticion, usuarioModificador, idUsuario, descripcion);
        
        // Obtener información de la petición HTTP si está disponible
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                auditoria.setIpAddress(getClientIpAddress(request));
                auditoria.setUserAgent(request.getHeader("User-Agent"));
            }
        } catch (Exception e) {
            // Si no se puede obtener la información de la petición, continuar sin ella
        }
        
        return auditoriaRepository.save(auditoria);
    }
    
    /**
     * Registrar auditoría para creación de registro
     */
    public Auditoria registrarCreacion(String tablaModificada, Long idRegistroModificado, 
                                      String usuarioModificador, Long idUsuario, String descripcion) {
        return registrarAuditoria(tablaModificada, idRegistroModificado, null, null, null, 
                                 "INSERT", usuarioModificador, idUsuario, descripcion);
    }
    
    /**
     * Registrar auditoría para actualización de registro
     */
    public Auditoria registrarActualizacion(String tablaModificada, Long idRegistroModificado, 
                                           String campoModificado, String valorAnterior, 
                                           String valorNuevo, String usuarioModificador, 
                                           Long idUsuario, String descripcion) {
        return registrarAuditoria(tablaModificada, idRegistroModificado, campoModificado, 
                                 valorAnterior, valorNuevo, "UPDATE", usuarioModificador, 
                                 idUsuario, descripcion);
    }
    
    /**
     * Registrar auditoría para eliminación de registro
     */
    public Auditoria registrarEliminacion(String tablaModificada, Long idRegistroModificado, 
                                         String usuarioModificador, Long idUsuario, String descripcion) {
        return registrarAuditoria(tablaModificada, idRegistroModificado, null, null, null, 
                                 "DELETE", usuarioModificador, idUsuario, descripcion);
    }
    
    /**
     * Obtener todas las auditorías
     */
    public List<AuditoriaDTO> obtenerTodasAuditorias() {
        return auditoriaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener auditorías por ID de usuario
     */
    public List<AuditoriaDTO> obtenerAuditoriasPorUsuario(Long idUsuario) {
        return auditoriaRepository.findByIdUsuarioOrderByFechaModificacionDesc(idUsuario).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener auditorías por tabla
     */
    public List<AuditoriaDTO> obtenerAuditoriasPorTabla(String tablaModificada) {
        return auditoriaRepository.findByTablaModificadaOrderByFechaModificacionDesc(tablaModificada).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener auditorías por tipo de petición
     */
    public List<AuditoriaDTO> obtenerAuditoriasPorTipoPeticion(String tipoPeticion) {
        return auditoriaRepository.findByTipoPeticionOrderByFechaModificacionDesc(tipoPeticion).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener auditorías por rango de fechas
     */
    public List<AuditoriaDTO> obtenerAuditoriasPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return auditoriaRepository.findByFechaModificacionBetweenOrderByFechaModificacionDesc(fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener auditorías con filtros múltiples
     */
    public List<AuditoriaDTO> obtenerAuditoriasConFiltros(Long idUsuario, String tablaModificada, 
                                                         String tipoPeticion, LocalDateTime fechaInicio, 
                                                         LocalDateTime fechaFin) {
        return auditoriaRepository.findAuditoriaWithFilters(idUsuario, tablaModificada, tipoPeticion, fechaInicio, fechaFin).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener auditorías por tabla y ID de registro
     */
    public List<AuditoriaDTO> obtenerAuditoriasPorTablaYRegistro(String tablaModificada, Long idRegistroModificado) {
        return auditoriaRepository.findByTablaModificadaAndIdRegistroModificadoOrderByFechaModificacionDesc(tablaModificada, idRegistroModificado).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtener el repositorio de auditoría
     */
    public AuditoriaRepository getAuditoriaRepository() {
        return auditoriaRepository;
    }
    
    /**
     * Convertir entidad a DTO
     */
    public AuditoriaDTO convertirADTO(Auditoria auditoria) {
        AuditoriaDTO dto = new AuditoriaDTO();
        dto.setId(auditoria.getId());
        dto.setTablaModificada(auditoria.getTablaModificada());
        dto.setIdRegistroModificado(auditoria.getIdRegistroModificado());
        dto.setCampoModificado(auditoria.getCampoModificado());
        dto.setValorAnterior(auditoria.getValorAnterior());
        dto.setValorNuevo(auditoria.getValorNuevo());
        dto.setTipoPeticion(auditoria.getTipoPeticion());
        dto.setUsuarioModificador(auditoria.getUsuarioModificador());
        dto.setFechaModificacion(auditoria.getFechaModificacion());
        dto.setIdUsuario(auditoria.getIdUsuario());
        dto.setDescripcion(auditoria.getDescripcion());
        dto.setIpAddress(auditoria.getIpAddress());
        dto.setUserAgent(auditoria.getUserAgent());
        return dto;
    }
    
    /**
     * Obtener la dirección IP del cliente
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 