package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.ControlActualizacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ControlActualizacionRepository extends JpaRepository<ControlActualizacion, Long> {
    
    /**
     * Buscar control de actualización por usuario
     */
    Optional<ControlActualizacion> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar controles por estado
     */
    List<ControlActualizacion> findByEstadoActualizacion(String estadoActualizacion);
    
    /**
     * Buscar controles que necesitan actualización (vencidos o pendientes)
     */
    @Query("SELECT c FROM ControlActualizacion c JOIN FETCH c.usuario WHERE c.fechaProximaActualizacion < :ahora OR c.estadoActualizacion = 'PENDIENTE'")
    List<ControlActualizacion> findNecesitanActualizacion(@Param("ahora") LocalDateTime ahora);
    
    /**
     * Buscar controles vencidos
     */
    @Query("SELECT c FROM ControlActualizacion c JOIN FETCH c.usuario WHERE c.fechaProximaActualizacion < :ahora")
    List<ControlActualizacion> findVencidos(@Param("ahora") LocalDateTime ahora);
    
    /**
     * Buscar controles próximos a vencer (dentro de X días)
     */
    @Query("SELECT c FROM ControlActualizacion c WHERE c.fechaProximaActualizacion BETWEEN :ahora AND :fechaLimite")
    List<ControlActualizacion> findProximosAVencer(@Param("ahora") LocalDateTime ahora, 
                                                   @Param("fechaLimite") LocalDateTime fechaLimite);
    
    /**
     * Contar controles por estado
     */
    @Query("SELECT c.estadoActualizacion, COUNT(c) FROM ControlActualizacion c GROUP BY c.estadoActualizacion")
    List<Object[]> countByEstadoActualizacion();
    
    /**
     * Contar controles vencidos
     */
    @Query("SELECT COUNT(c) FROM ControlActualizacion c WHERE c.fechaProximaActualizacion < :ahora")
    long countVencidos(@Param("ahora") LocalDateTime ahora);
    
    /**
     * Contar controles que necesitan actualización
     */
    @Query("SELECT COUNT(c) FROM ControlActualizacion c WHERE c.fechaProximaActualizacion < :ahora OR c.estadoActualizacion = 'PENDIENTE'")
    long countNecesitanActualizacion(@Param("ahora") LocalDateTime ahora);
    
    /**
     * Obtener estadísticas de actualizaciones
     */
    @Query("SELECT " +
           "COUNT(c), " +
           "SUM(CASE WHEN c.estadoActualizacion = 'COMPLETADA' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN c.estadoActualizacion = 'PENDIENTE' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN c.fechaProximaActualizacion < :ahora THEN 1 ELSE 0 END) " +
           "FROM ControlActualizacion c")
    Object getEstadisticas(@Param("ahora") LocalDateTime ahora);
} 