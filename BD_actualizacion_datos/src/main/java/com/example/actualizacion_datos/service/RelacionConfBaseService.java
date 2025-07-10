package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.RelacionConf;
import com.example.actualizacion_datos.repository.RelacionConfRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class RelacionConfBaseService extends BaseService<RelacionConf, Long> {
    
    @Autowired
    private RelacionConfRepository relacionConfRepository;
    
    @Override
    protected JpaRepository<RelacionConf, Long> getRepository() {
        return relacionConfRepository;
    }
    
    @Override
    protected String getTableName() {
        return "RELACION_CONF";
    }
} 