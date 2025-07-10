package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.Vivienda;
import com.example.actualizacion_datos.repository.ViviendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ViviendaBaseService extends BaseService<Vivienda, Long> {
    
    @Autowired
    private ViviendaRepository viviendaRepository;
    
    @Override
    protected JpaRepository<Vivienda, Long> getRepository() {
        return viviendaRepository;
    }
    
    @Override
    protected String getTableName() {
        return "VIVIENDA";
    }
} 