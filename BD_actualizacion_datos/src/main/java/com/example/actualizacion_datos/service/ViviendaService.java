package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.Vivienda;
import com.example.actualizacion_datos.repository.ViviendaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ViviendaService {
    
    private static final Logger logger = LoggerFactory.getLogger(ViviendaService.class);
    
    @Autowired
    private ViviendaRepository viviendaRepository;
    
    // ========== OBTENER VIVIENDAS POR USUARIO ==========
    @Transactional(readOnly = true)
    public List<Vivienda> obtenerViviendasPorUsuario(Long idUsuario) {
        logger.info("🔍 Obteniendo viviendas para usuario: {}", idUsuario);
        return viviendaRepository.findByUsuarioIdUsuario(idUsuario);
    }
    
    // ========== OBTENER VIVIENDA POR ID ==========
    @Transactional(readOnly = true)
    public Optional<Vivienda> obtenerViviendaPorId(Long id) {
        logger.info("🔍 Obteniendo vivienda por ID: {}", id);
        return viviendaRepository.findById(id);
    }
    
    // ========== GUARDAR VIVIENDA ==========
    public Vivienda guardarVivienda(Vivienda vivienda) {
        logger.info("💾 Guardando vivienda");
        
        try {
            Vivienda viviendaGuardada = viviendaRepository.save(vivienda);
            logger.info("✅ Vivienda guardada exitosamente con ID: {}", viviendaGuardada.getIdVivienda());
            return viviendaGuardada;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vivienda: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar vivienda: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR VIVIENDA ==========
    public Vivienda actualizarVivienda(Long id, Vivienda vivienda) {
        logger.info("🔄 Actualizando vivienda con ID: {}", id);
        
        try {
            Optional<Vivienda> viviendaExistente = viviendaRepository.findById(id);
            if (viviendaExistente.isEmpty()) {
                throw new RuntimeException("Vivienda no encontrada con ID: " + id);
            }
            
            Vivienda viviendaActual = viviendaExistente.get();
            
            // Actualizar campos usando los métodos correctos
            if (vivienda.getTipoVivienda() != null) {
                viviendaActual.setTipoVivienda(vivienda.getTipoVivienda());
            }
            if (vivienda.getDireccion() != null) {
                viviendaActual.setDireccion(vivienda.getDireccion());
            }
            if (vivienda.getCiudad() != null) {
                viviendaActual.setCiudad(vivienda.getCiudad());
            }
            if (vivienda.getAno() != null) {
                viviendaActual.setAno(vivienda.getAno());
            }
            
            Vivienda viviendaActualizada = viviendaRepository.save(viviendaActual);
            logger.info("✅ Vivienda actualizada exitosamente con ID: {}", viviendaActualizada.getIdVivienda());
            
            return viviendaActualizada;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar vivienda: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar vivienda: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR VIVIENDA ==========
    public void eliminarVivienda(Long id) {
        logger.info("🗑️ Eliminando vivienda con ID: {}", id);
        
        try {
            if (!viviendaRepository.existsById(id)) {
                throw new RuntimeException("Vivienda no encontrada con ID: " + id);
            }
            
            viviendaRepository.deleteById(id);
            logger.info("✅ Vivienda eliminada exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar vivienda: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar vivienda: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER TODAS LAS VIVIENDAS ==========
    @Transactional(readOnly = true)
    public List<Vivienda> obtenerTodasLasViviendas() {
        logger.info("🔍 Obteniendo todas las viviendas");
        return viviendaRepository.findAll();
    }
} 