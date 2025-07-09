package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.PersonaACargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaACargoRepository extends JpaRepository<PersonaACargo, Long> {
    
    /**
     * Buscar personas a cargo por usuario
     */
    List<PersonaACargo> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar personas a cargo por parentesco
     */
    List<PersonaACargo> findByParentesco(String parentesco);
    
    /**
     * Buscar personas a cargo por nombre
     */
    List<PersonaACargo> findByNombre(String nombre);
    
    /**
     * Eliminar todas las personas a cargo de un usuario
     */
    void deleteByUsuarioIdUsuario(Long idUsuario);
} 