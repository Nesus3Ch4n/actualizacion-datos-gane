package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.PersonaACargo;
import com.example.actualizacion_datos.repository.PersonaACargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonaACargoBaseService extends BaseService<PersonaACargo, Long> {
    
    @Autowired
    private PersonaACargoRepository personaACargoRepository;
    
    @Override
    protected JpaRepository<PersonaACargo, Long> getRepository() {
        return personaACargoRepository;
    }
    
    @Override
    protected String getTableName() {
        return "PERSONA_A_CARGO";
    }
} 