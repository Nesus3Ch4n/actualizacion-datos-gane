package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.Vivienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ViviendaRepository extends JpaRepository<Vivienda, Long> {
    
    /**
     * Buscar viviendas por usuario
     */
    List<Vivienda> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar viviendas por tipo
     */
    List<Vivienda> findByTipoVivienda(String tipoVivienda);
    
    /**
     * Buscar viviendas por ciudad
     */
    List<Vivienda> findByCiudad(String ciudad);
    
    /**
     * Buscar viviendas por barrio
     */
    List<Vivienda> findByBarrio(String barrio);
    
    /**
     * Buscar viviendas por tipo de adquisición
     */
    List<Vivienda> findByTipoAdquisicion(String tipoAdquisicion);
    
    /**
     * Buscar viviendas por año
     */
    List<Vivienda> findByAno(Integer ano);
    
    /**
     * Eliminar todas las viviendas de un usuario
     */
    void deleteByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Consulta personalizada para buscar viviendas con filtros
     */
    @Query("SELECT v FROM Vivienda v WHERE " +
           "(:idUsuario IS NULL OR v.usuario.idUsuario = :idUsuario) AND " +
           "(:tipoVivienda IS NULL OR v.tipoVivienda = :tipoVivienda) AND " +
           "(:ciudad IS NULL OR v.ciudad = :ciudad) AND " +
           "(:barrio IS NULL OR v.barrio = :barrio)")
    List<Vivienda> findViviendasWithFilters(
            @Param("idUsuario") Long idUsuario,
            @Param("tipoVivienda") String tipoVivienda,
            @Param("ciudad") String ciudad,
            @Param("barrio") String barrio
    );
} 