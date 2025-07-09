package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.RelacionConf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelacionConfRepository extends JpaRepository<RelacionConf, Long> {
    
    /**
     * Buscar relaciones de confianza por usuario
     */
    List<RelacionConf> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar relaciones de confianza por parentesco
     */
    List<RelacionConf> findByParentesco(String parentesco);
    
    /**
     * Buscar relaciones de confianza por nombre completo
     */
    List<RelacionConf> findByNombreCompleto(String nombreCompleto);
    
    /**
     * Buscar relaciones de confianza por tipo de parte asociada
     */
    List<RelacionConf> findByTipoParteAsoc(String tipoParteAsoc);
    
    /**
     * Eliminar todas las relaciones de confianza de un usuario
     */
    void deleteByUsuarioIdUsuario(Long idUsuario);
} 