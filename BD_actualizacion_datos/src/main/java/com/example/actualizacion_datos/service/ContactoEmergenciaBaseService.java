package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.ContactoEmergencia;
import com.example.actualizacion_datos.repository.ContactoEmergenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactoEmergenciaBaseService extends BaseService<ContactoEmergencia, Long> {
    
    @Autowired
    private ContactoEmergenciaRepository contactoEmergenciaRepository;
    
    @Override
    protected JpaRepository<ContactoEmergencia, Long> getRepository() {
        return contactoEmergenciaRepository;
    }
    
    @Override
    protected String getTableName() {
        return "CONTACTO_EMERGENCIA";
    }
} 