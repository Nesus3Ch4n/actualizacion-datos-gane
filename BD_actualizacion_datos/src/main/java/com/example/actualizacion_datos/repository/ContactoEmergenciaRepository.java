package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.ContactoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Long> {
    
    /**
     * Buscar contactos de emergencia por usuario
     */
    List<ContactoEmergencia> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar contactos de emergencia por parentesco
     */
    List<ContactoEmergencia> findByParentesco(String parentesco);
    
    /**
     * Buscar contactos de emergencia por nombre completo
     */
    List<ContactoEmergencia> findByNombreCompleto(String nombreCompleto);
    
    /**
     * Buscar contactos de emergencia por número de celular
     */
    List<ContactoEmergencia> findByNumeroCelular(String numeroCelular);
    
    /**
     * Eliminar todos los contactos de emergencia de un usuario
     */
    void deleteByUsuarioIdUsuario(Long idUsuario);
} 