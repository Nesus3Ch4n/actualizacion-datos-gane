package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.EstudioAcademico;
import com.example.actualizacion_datos.repository.EstudioAcademicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EstudioAcademicoBaseService extends BaseService<EstudioAcademico, Long> {
    
    @Autowired
    private EstudioAcademicoRepository estudioAcademicoRepository;
    
    @Override
    protected JpaRepository<EstudioAcademico, Long> getRepository() {
        return estudioAcademicoRepository;
    }
    
    @Override
    protected String getTableName() {
        return "ESTUDIO_ACADEMICO";
    }
} 