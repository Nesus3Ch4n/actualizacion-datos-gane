package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.HistorialActualizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HistorialActualizacionRepository extends JpaRepository<HistorialActualizacion, Long> {
    
    /**
     * Buscar historial por usuario
     */
    List<HistorialActualizacion> findByUsuarioIdUsuarioOrderByFechaActualizacionDesc(Long idUsuario);
    
    /**
     * Buscar historial por tipo de actualización
     */
    List<HistorialActualizacion> findByTipoActualizacionOrderByFechaActualizacionDesc(String tipoActualizacion);
    
    /**
     * Buscar historial por rango de fechas
     */
    @Query("SELECT h FROM HistorialActualizacion h WHERE h.fechaActualizacion BETWEEN :fechaInicio AND :fechaFin ORDER BY h.fechaActualizacion DESC")
    List<HistorialActualizacion> findByFechaActualizacionBetween(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                                                 @Param("fechaFin") LocalDateTime fechaFin);
    
    /**
     * Buscar historial por usuario y rango de fechas
     */
    @Query("SELECT h FROM HistorialActualizacion h WHERE h.usuario.idUsuario = :idUsuario AND h.fechaActualizacion BETWEEN :fechaInicio AND :fechaFin ORDER BY h.fechaActualizacion DESC")
    List<HistorialActualizacion> findByUsuarioAndFechaActualizacionBetween(@Param("idUsuario") Long idUsuario,
                                                                          @Param("fechaInicio") LocalDateTime fechaInicio,
                                                                          @Param("fechaFin") LocalDateTime fechaFin);
    
    /**
     * Contar actualizaciones por tipo
     */
    @Query("SELECT h.tipoActualizacion, COUNT(h) FROM HistorialActualizacion h GROUP BY h.tipoActualizacion")
    List<Object[]> countByTipoActualizacion();
    
    /**
     * Contar actualizaciones por mes/año
     */
    @Query("SELECT YEAR(h.fechaActualizacion) as año, MONTH(h.fechaActualizacion) as mes, COUNT(h) FROM HistorialActualizacion h GROUP BY YEAR(h.fechaActualizacion), MONTH(h.fechaActualizacion) ORDER BY año DESC, mes DESC")
    List<Object[]> countByMesAnio();
    
    /**
     * Obtener última actualización de un usuario
     */
    @Query("SELECT h FROM HistorialActualizacion h WHERE h.usuario.idUsuario = :idUsuario ORDER BY h.fechaActualizacion DESC LIMIT 1")
    HistorialActualizacion findLastByUsuario(@Param("idUsuario") Long idUsuario);
    
    /**
     * Obtener estadísticas de actualizaciones por período
     */
    @Query("SELECT " +
           "COUNT(h) as total, " +
           "SUM(CASE WHEN h.tipoActualizacion = 'ANUAL' THEN 1 ELSE 0 END) as anuales, " +
           "SUM(CASE WHEN h.tipoActualizacion = 'CORRECCION' THEN 1 ELSE 0 END) as correcciones, " +
           "SUM(CASE WHEN h.tipoActualizacion = 'ADMIN' THEN 1 ELSE 0 END) as administrativas " +
           "FROM HistorialActualizacion h WHERE h.fechaActualizacion BETWEEN :fechaInicio AND :fechaFin")
    Object[] getEstadisticasPorPeriodo(@Param("fechaInicio") LocalDateTime fechaInicio, 
                                       @Param("fechaFin") LocalDateTime fechaFin);
} 