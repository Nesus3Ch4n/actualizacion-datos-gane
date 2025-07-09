package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.RelacionConf;
import com.example.actualizacion_datos.repository.RelacionConfRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RelacionConfService {
    
    private static final Logger logger = LoggerFactory.getLogger(RelacionConfService.class);
    
    @Autowired
    private RelacionConfRepository relacionConfRepository;
    
    // ========== OBTENER RELACIONES POR USUARIO ==========
    @Transactional(readOnly = true)
    public List<RelacionConf> obtenerRelacionesPorUsuario(Long idUsuario) {
        logger.info("🔍 Obteniendo relaciones de conflicto para usuario: {}", idUsuario);
        return relacionConfRepository.findByUsuarioIdUsuario(idUsuario);
    }
    
    // ========== OBTENER RELACIÓN POR ID ==========
    @Transactional(readOnly = true)
    public Optional<RelacionConf> obtenerRelacionPorId(Long id) {
        logger.info("🔍 Obteniendo relación de conflicto por ID: {}", id);
        return relacionConfRepository.findById(id);
    }
    
    // ========== GUARDAR RELACIÓN ==========
    public RelacionConf guardarRelacion(RelacionConf relacion) {
        logger.info("💾 Guardando relación de conflicto");
        
        try {
            RelacionConf relacionGuardada = relacionConfRepository.save(relacion);
            logger.info("✅ Relación de conflicto guardada exitosamente con ID: {}", relacionGuardada.getIdRelacionConf());
            return relacionGuardada;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar relación de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar relación de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR RELACIÓN ==========
    public RelacionConf actualizarRelacion(Long id, RelacionConf relacion) {
        logger.info("🔄 Actualizando relación de conflicto con ID: {}", id);
        
        try {
            Optional<RelacionConf> relacionExistente = relacionConfRepository.findById(id);
            if (relacionExistente.isEmpty()) {
                throw new RuntimeException("Relación de conflicto no encontrada con ID: " + id);
            }
            
            RelacionConf relacionActual = relacionExistente.get();
            
            // Actualizar campos usando los métodos correctos
            if (relacion.getNombreCompleto() != null) {
                relacionActual.setNombreCompleto(relacion.getNombreCompleto());
            }
            if (relacion.getParentesco() != null) {
                relacionActual.setParentesco(relacion.getParentesco());
            }
            if (relacion.getTipoParteAsoc() != null) {
                relacionActual.setTipoParteAsoc(relacion.getTipoParteAsoc());
            }
            
            RelacionConf relacionActualizada = relacionConfRepository.save(relacionActual);
            logger.info("✅ Relación de conflicto actualizada exitosamente con ID: {}", relacionActualizada.getIdRelacionConf());
            
            return relacionActualizada;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar relación de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar relación de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR RELACIÓN ==========
    public void eliminarRelacion(Long id) {
        logger.info("🗑️ Eliminando relación de conflicto con ID: {}", id);
        
        try {
            if (!relacionConfRepository.existsById(id)) {
                throw new RuntimeException("Relación de conflicto no encontrada con ID: " + id);
            }
            
            relacionConfRepository.deleteById(id);
            logger.info("✅ Relación de conflicto eliminada exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar relación de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar relación de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER TODAS LAS RELACIONES ==========
    @Transactional(readOnly = true)
    public List<RelacionConf> obtenerTodasLasRelaciones() {
        logger.info("🔍 Obteniendo todas las relaciones de conflicto");
        return relacionConfRepository.findAll();
    }
} 