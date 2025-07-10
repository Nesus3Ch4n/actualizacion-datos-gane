package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaRepository extends JpaRepository<Auditoria, Long> {
    
    // Obtener todas las auditorías ordenadas por fecha descendente
    List<Auditoria> findAllByOrderByFechaModificacionDesc();
    
    // Buscar auditoría por ID de usuario
    List<Auditoria> findByIdUsuarioOrderByFechaModificacionDesc(Long idUsuario);
    
    // Buscar auditoría por tabla modificada
    List<Auditoria> findByTablaModificadaOrderByFechaModificacionDesc(String tablaModificada);
    
    // Buscar auditoría por tipo de petición
    List<Auditoria> findByTipoPeticionOrderByFechaModificacionDesc(String tipoPeticion);
    
    // Buscar auditoría por usuario modificador
    List<Auditoria> findByUsuarioModificadorOrderByFechaModificacionDesc(String usuarioModificador);
    
    // Buscar auditoría por rango de fechas
    List<Auditoria> findByFechaModificacionBetweenOrderByFechaModificacionDesc(
        LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    // Buscar auditoría por ID de usuario y rango de fechas
    List<Auditoria> findByIdUsuarioAndFechaModificacionBetweenOrderByFechaModificacionDesc(
        Long idUsuario, LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    // Buscar auditoría por tabla y ID de registro
    List<Auditoria> findByTablaModificadaAndIdRegistroModificadoOrderByFechaModificacionDesc(
        String tablaModificada, Long idRegistroModificado);
    
    // Consulta personalizada para obtener auditoría con filtros múltiples
    @Query("SELECT a FROM Auditoria a WHERE " +
           "(:idUsuario IS NULL OR a.idUsuario = :idUsuario) AND " +
           "(:tablaModificada IS NULL OR a.tablaModificada = :tablaModificada) AND " +
           "(:tipoPeticion IS NULL OR a.tipoPeticion = :tipoPeticion) AND " +
           "(:fechaInicio IS NULL OR a.fechaModificacion >= :fechaInicio) AND " +
           "(:fechaFin IS NULL OR a.fechaModificacion <= :fechaFin) " +
           "ORDER BY a.fechaModificacion DESC")
    List<Auditoria> findAuditoriaWithFilters(
        @Param("idUsuario") Long idUsuario,
        @Param("tablaModificada") String tablaModificada,
        @Param("tipoPeticion") String tipoPeticion,
        @Param("fechaInicio") LocalDateTime fechaInicio,
        @Param("fechaFin") LocalDateTime fechaFin
    );
    
    // Contar registros de auditoría por usuario
    long countByIdUsuario(Long idUsuario);
    
    // Contar registros de auditoría por tabla
    long countByTablaModificada(String tablaModificada);
} 