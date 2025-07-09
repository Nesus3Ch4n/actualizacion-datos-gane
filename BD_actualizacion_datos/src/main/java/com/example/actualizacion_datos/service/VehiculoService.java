package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.Vehiculo;
import com.example.actualizacion_datos.repository.VehiculoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehiculoService {
    
    private static final Logger logger = LoggerFactory.getLogger(VehiculoService.class);
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    // ========== OBTENER VEHÍCULOS POR USUARIO ==========
    @Transactional(readOnly = true)
    public List<Vehiculo> obtenerVehiculosPorUsuario(Long idUsuario) {
        logger.info("🔍 Obteniendo vehículos para usuario: {}", idUsuario);
        return vehiculoRepository.findByUsuarioIdUsuario(idUsuario);
    }
    
    // ========== OBTENER VEHÍCULO POR ID ==========
    @Transactional(readOnly = true)
    public Optional<Vehiculo> obtenerVehiculoPorId(Long id) {
        logger.info("🔍 Obteniendo vehículo por ID: {}", id);
        return vehiculoRepository.findById(id);
    }
    
    // ========== GUARDAR VEHÍCULO ==========
    public Vehiculo guardarVehiculo(Vehiculo vehiculo) {
        logger.info("💾 Guardando vehículo");
        
        try {
            Vehiculo vehiculoGuardado = vehiculoRepository.save(vehiculo);
            logger.info("✅ Vehículo guardado exitosamente con ID: {}", vehiculoGuardado.getIdVehiculo());
            return vehiculoGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vehículo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar vehículo: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR VEHÍCULO ==========
    public Vehiculo actualizarVehiculo(Long id, Vehiculo vehiculo) {
        logger.info("🔄 Actualizando vehículo con ID: {}", id);
        
        try {
            Optional<Vehiculo> vehiculoExistente = vehiculoRepository.findById(id);
            if (vehiculoExistente.isEmpty()) {
                throw new RuntimeException("Vehículo no encontrado con ID: " + id);
            }
            
            Vehiculo vehiculoActual = vehiculoExistente.get();
            
            // Actualizar campos usando los métodos correctos
            if (vehiculo.getTipoVehiculo() != null) {
                vehiculoActual.setTipoVehiculo(vehiculo.getTipoVehiculo());
            }
            if (vehiculo.getMarca() != null) {
                vehiculoActual.setMarca(vehiculo.getMarca());
            }
            if (vehiculo.getPlaca() != null) {
                vehiculoActual.setPlaca(vehiculo.getPlaca());
            }
            if (vehiculo.getAno() != null) {
                vehiculoActual.setAno(vehiculo.getAno());
            }
            
            Vehiculo vehiculoActualizado = vehiculoRepository.save(vehiculoActual);
            logger.info("✅ Vehículo actualizado exitosamente con ID: {}", vehiculoActualizado.getIdVehiculo());
            
            return vehiculoActualizado;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar vehículo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar vehículo: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR VEHÍCULO ==========
    public void eliminarVehiculo(Long id) {
        logger.info("🗑️ Eliminando vehículo con ID: {}", id);
        
        try {
            if (!vehiculoRepository.existsById(id)) {
                throw new RuntimeException("Vehículo no encontrado con ID: " + id);
            }
            
            vehiculoRepository.deleteById(id);
            logger.info("✅ Vehículo eliminado exitosamente con ID: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar vehículo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar vehículo: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER TODOS LOS VEHÍCULOS ==========
    @Transactional(readOnly = true)
    public List<Vehiculo> obtenerTodosLosVehiculos() {
        logger.info("🔍 Obteniendo todos los vehículos");
        return vehiculoRepository.findAll();
    }
} 