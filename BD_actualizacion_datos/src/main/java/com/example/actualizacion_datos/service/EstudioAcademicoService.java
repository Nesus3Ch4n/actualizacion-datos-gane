package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.EstudioAcademico;
import com.example.actualizacion_datos.repository.EstudioAcademicoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EstudioAcademicoService {
    
    private static final Logger logger = LoggerFactory.getLogger(EstudioAcademicoService.class);
    
    @Autowired
    private EstudioAcademicoRepository estudioAcademicoRepository;
    
    // ========== OBTENER ESTUDIOS POR USUARIO ==========
    @Transactional(readOnly = true)
    public List<EstudioAcademico> obtenerEstudiosPorUsuario(Long idUsuario) {
        logger.info("🔍 Obteniendo estudios académicos para usuario: {}", idUsuario);
        return estudioAcademicoRepository.findByUsuarioIdUsuario(idUsuario);
    }
    
    // ========== OBTENER ESTUDIO POR ID ==========
    @Transactional(readOnly = true)
    public Optional<EstudioAcademico> obtenerEstudioPorId(Long id) {
        logger.info("🔍 Obteniendo estudio académico por ID: {}", id);
        return estudioAcademicoRepository.findById(id);
    }
    
    // ========== GUARDAR ESTUDIO ==========
    public EstudioAcademico guardarEstudio(EstudioAcademico estudio) {
        logger.info("💾 Guardando estudio académico");
        
        try {
            EstudioAcademico estudioGuardado = estudioAcademicoRepository.save(estudio);
            logger.info("✅ Estudio académico guardado exitosamente con ID: {}", estudioGuardado.getIdEstudios());
            return estudioGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar estudio académico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar estudio académico: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR ESTUDIO ==========
    public EstudioAcademico actualizarEstudio(Long id, EstudioAcademico estudio) {
        logger.info("🔄 Actualizando estudio académico con ID: {}", id);
        
        try {
            Optional<EstudioAcademico> estudioExistente = estudioAcademicoRepository.findById(id);
            if (estudioExistente.isEmpty()) {
                throw new RuntimeException("Estudio académico no encontrado con ID: " + id);
            }
            
            EstudioAcademico estudioActual = estudioExistente.get();
            
            // Actualizar campos usando los métodos correctos
            if (estudio.getNivelAcademico() != null) {
                estudioActual.setNivelAcademico(estudio.getNivelAcademico());
            }
            if (estudio.getPrograma() != null) {
                estudioActual.setPrograma(estudio.getPrograma());
            }
            if (estudio.getInstitucion() != null) {
                estudioActual.setInstitucion(estudio.getInstitucion());
            }
            if (estudio.getGraduacion() != null) {
                estudioActual.setGraduacion(estudio.getGraduacion());
            }
            
            EstudioAcademico estudioActualizado = estudioAcademicoRepository.save(estudioActual);
            logger.info("✅ Estudio académico actualizado exitosamente con ID: {}", estudioActualizado.getIdEstudios());
            
            return estudioActualizado;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar estudio académico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar estudio académico: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR ESTUDIO ==========
    public void eliminarEstudio(Long id) {
        logger.info("🗑️ Eliminando estudio académico con ID: {}", id);
        
        try {
            if (!estudioAcademicoRepository.existsById(id)) {
                throw new RuntimeException("Estudio académico no encontrado con ID: " + id);
            }
            
            estudioAcademicoRepository.deleteById(id);
            logger.info("✅ Estudio académico eliminado exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar estudio académico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar estudio académico: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER TODOS LOS ESTUDIOS ==========
    @Transactional(readOnly = true)
    public List<EstudioAcademico> obtenerTodosLosEstudios() {
        logger.info("🔍 Obteniendo todos los estudios académicos");
        return estudioAcademicoRepository.findAll();
    }
} 