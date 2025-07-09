package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.config.AuditoriaInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public abstract class BaseService<T, ID> {
    
    @Autowired
    protected AuditoriaInterceptor auditoriaInterceptor;
    
    protected abstract JpaRepository<T, ID> getRepository();
    protected abstract String getTableName();
    
    /**
     * Guardar una nueva entidad con auditoría automática
     */
    public T save(T entity) {
        T savedEntity = getRepository().save(entity);
        
        // Registrar auditoría de creación
        try {
            Long idUsuario = auditoriaInterceptor.obtenerIdUsuarioActual();
            String usuarioModificador = auditoriaInterceptor.obtenerUsuarioActual();
            auditoriaInterceptor.registrarCreacion(getTableName(), savedEntity, idUsuario, usuarioModificador);
        } catch (Exception e) {
            // Log del error pero no interrumpir la operación principal
            System.err.println("Error en auditoría de creación: " + e.getMessage());
        }
        
        return savedEntity;
    }
    
    /**
     * Actualizar una entidad existente con auditoría automática
     */
    public T update(ID id, T entity) {
        // Obtener la entidad anterior para comparar cambios
        Optional<T> existingEntityOpt = getRepository().findById(id);
        if (existingEntityOpt.isPresent()) {
            T existingEntity = existingEntityOpt.get();
            
            // Guardar la entidad actualizada
            T updatedEntity = getRepository().save(entity);
            
            // Registrar auditoría de actualización
            try {
                Long idUsuario = auditoriaInterceptor.obtenerIdUsuarioActual();
                String usuarioModificador = auditoriaInterceptor.obtenerUsuarioActual();
                auditoriaInterceptor.registrarActualizacion(getTableName(), existingEntity, updatedEntity, idUsuario, usuarioModificador);
            } catch (Exception e) {
                System.err.println("Error en auditoría de actualización: " + e.getMessage());
            }
            
            return updatedEntity;
        }
        
        return getRepository().save(entity);
    }
    
    /**
     * Eliminar una entidad con auditoría automática
     */
    public void delete(ID id) {
        Optional<T> entityOpt = getRepository().findById(id);
        if (entityOpt.isPresent()) {
            T entity = entityOpt.get();
            
            // Registrar auditoría de eliminación antes de eliminar
            try {
                Long idUsuario = auditoriaInterceptor.obtenerIdUsuarioActual();
                String usuarioModificador = auditoriaInterceptor.obtenerUsuarioActual();
                auditoriaInterceptor.registrarEliminacion(getTableName(), entity, idUsuario, usuarioModificador);
            } catch (Exception e) {
                System.err.println("Error en auditoría de eliminación: " + e.getMessage());
            }
            
            getRepository().deleteById(id);
        }
    }
    
    /**
     * Buscar por ID
     */
    public Optional<T> findById(ID id) {
        return getRepository().findById(id);
    }
    
    /**
     * Obtener todos los registros
     */
    public List<T> findAll() {
        return getRepository().findAll();
    }
    
    /**
     * Verificar si existe por ID
     */
    public boolean existsById(ID id) {
        return getRepository().existsById(id);
    }
    
    /**
     * Contar todos los registros
     */
    public long count() {
        return getRepository().count();
    }
} 