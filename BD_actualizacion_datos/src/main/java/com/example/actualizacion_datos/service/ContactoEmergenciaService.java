package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.ContactoEmergencia;
import com.example.actualizacion_datos.repository.ContactoEmergenciaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactoEmergenciaService {
    
    private static final Logger logger = LoggerFactory.getLogger(ContactoEmergenciaService.class);
    
    @Autowired
    private ContactoEmergenciaRepository contactoEmergenciaRepository;
    
    // ========== OBTENER CONTACTOS POR USUARIO ==========
    @Transactional(readOnly = true)
    public List<ContactoEmergencia> obtenerContactosPorUsuario(Long idUsuario) {
        logger.info("🔍 Obteniendo contactos de emergencia para usuario: {}", idUsuario);
        return contactoEmergenciaRepository.findByUsuarioIdUsuario(idUsuario);
    }
    
    // ========== OBTENER CONTACTO POR ID ==========
    @Transactional(readOnly = true)
    public Optional<ContactoEmergencia> obtenerContactoPorId(Long id) {
        logger.info("🔍 Obteniendo contacto de emergencia por ID: {}", id);
        return contactoEmergenciaRepository.findById(id);
    }
    
    // ========== GUARDAR CONTACTO ==========
    public ContactoEmergencia guardarContacto(ContactoEmergencia contacto) {
        logger.info("💾 Guardando contacto de emergencia");
        
        try {
            ContactoEmergencia contactoGuardado = contactoEmergenciaRepository.save(contacto);
            logger.info("✅ Contacto de emergencia guardado exitosamente con ID: {}", contactoGuardado.getIdContacto());
            return contactoGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar contacto de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar contacto de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR CONTACTO ==========
    public ContactoEmergencia actualizarContacto(Long id, ContactoEmergencia contacto) {
        logger.info("🔄 Actualizando contacto de emergencia con ID: {}", id);
        
        try {
            Optional<ContactoEmergencia> contactoExistente = contactoEmergenciaRepository.findById(id);
            if (contactoExistente.isEmpty()) {
                throw new RuntimeException("Contacto de emergencia no encontrado con ID: " + id);
            }
            
            ContactoEmergencia contactoActual = contactoExistente.get();
            
            // Actualizar campos usando los métodos correctos
            if (contacto.getNombreCompleto() != null) {
                contactoActual.setNombreCompleto(contacto.getNombreCompleto());
            }
            if (contacto.getParentesco() != null) {
                contactoActual.setParentesco(contacto.getParentesco());
            }
            if (contacto.getNumeroCelular() != null) {
                contactoActual.setNumeroCelular(contacto.getNumeroCelular());
            }
            
            ContactoEmergencia contactoActualizado = contactoEmergenciaRepository.save(contactoActual);
            logger.info("✅ Contacto de emergencia actualizado exitosamente con ID: {}", contactoActualizado.getIdContacto());
            
            return contactoActualizado;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar contacto de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar contacto de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR CONTACTO ==========
    public void eliminarContacto(Long id) {
        logger.info("🗑️ Eliminando contacto de emergencia con ID: {}", id);
        
        try {
            if (!contactoEmergenciaRepository.existsById(id)) {
                throw new RuntimeException("Contacto de emergencia no encontrado con ID: " + id);
            }
            
            contactoEmergenciaRepository.deleteById(id);
            logger.info("✅ Contacto de emergencia eliminado exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar contacto de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar contacto de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER TODOS LOS CONTACTOS ==========
    @Transactional(readOnly = true)
    public List<ContactoEmergencia> obtenerTodosLosContactos() {
        logger.info("🔍 Obteniendo todos los contactos de emergencia");
        return contactoEmergenciaRepository.findAll();
    }
} 