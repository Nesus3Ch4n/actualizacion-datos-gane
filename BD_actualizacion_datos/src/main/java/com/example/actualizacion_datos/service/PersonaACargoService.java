package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.PersonaACargo;
import com.example.actualizacion_datos.repository.PersonaACargoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PersonaACargoService {
    
    private static final Logger logger = LoggerFactory.getLogger(PersonaACargoService.class);
    
    @Autowired
    private PersonaACargoRepository personaACargoRepository;
    
    // ========== OBTENER PERSONAS POR USUARIO ==========
    @Transactional(readOnly = true)
    public List<PersonaACargo> obtenerPersonasPorUsuario(Long idUsuario) {
        logger.info("🔍 Obteniendo personas a cargo para usuario: {}", idUsuario);
        return personaACargoRepository.findByUsuarioIdUsuario(idUsuario);
    }
    
    // ========== OBTENER PERSONA POR ID ==========
    @Transactional(readOnly = true)
    public Optional<PersonaACargo> obtenerPersonaPorId(Long id) {
        logger.info("🔍 Obteniendo persona a cargo por ID: {}", id);
        return personaACargoRepository.findById(id);
    }
    
    // ========== GUARDAR PERSONA ==========
    public PersonaACargo guardarPersona(PersonaACargo persona) {
        logger.info("💾 Guardando persona a cargo");
        
        try {
            PersonaACargo personaGuardada = personaACargoRepository.save(persona);
            logger.info("✅ Persona a cargo guardada exitosamente con ID: {}", personaGuardada.getIdFamilia());
            return personaGuardada;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar persona a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar persona a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR PERSONA ==========
    public PersonaACargo actualizarPersona(Long id, PersonaACargo persona) {
        logger.info("🔄 Actualizando persona a cargo con ID: {}", id);
        
        try {
            Optional<PersonaACargo> personaExistente = personaACargoRepository.findById(id);
            if (personaExistente.isEmpty()) {
                throw new RuntimeException("Persona a cargo no encontrada con ID: " + id);
            }
            
            PersonaACargo personaActual = personaExistente.get();
            
            // Actualizar campos usando los métodos correctos
            if (persona.getNombre() != null) {
                personaActual.setNombre(persona.getNombre());
            }
            if (persona.getParentesco() != null) {
                personaActual.setParentesco(persona.getParentesco());
            }
            if (persona.getFechaNacimiento() != null) {
                personaActual.setFechaNacimiento(persona.getFechaNacimiento());
            }
            if (persona.getEdad() != null) {
                personaActual.setEdad(persona.getEdad());
            }
            
            PersonaACargo personaActualizada = personaACargoRepository.save(personaActual);
            logger.info("✅ Persona a cargo actualizada exitosamente con ID: {}", personaActualizada.getIdFamilia());
            
            return personaActualizada;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar persona a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar persona a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR PERSONA ==========
    public void eliminarPersona(Long id) {
        logger.info("🗑️ Eliminando persona a cargo con ID: {}", id);
        
        try {
            if (!personaACargoRepository.existsById(id)) {
                throw new RuntimeException("Persona a cargo no encontrada con ID: " + id);
            }
            
            personaACargoRepository.deleteById(id);
            logger.info("✅ Persona a cargo eliminada exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar persona a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar persona a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER TODAS LAS PERSONAS ==========
    @Transactional(readOnly = true)
    public List<PersonaACargo> obtenerTodasLasPersonas() {
        logger.info("🔍 Obteniendo todas las personas a cargo");
        return personaACargoRepository.findAll();
    }
} 