package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.Vehiculo;
import com.example.actualizacion_datos.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class VehiculoBaseService extends BaseService<Vehiculo, Long> {
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    @Override
    protected JpaRepository<Vehiculo, Long> getRepository() {
        return vehiculoRepository;
    }
    
    @Override
    protected String getTableName() {
        return "VEHICULO";
    }
} 