package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.PersonaACargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonaACargoRepository extends JpaRepository<PersonaACargo, Long> {
    
    List<PersonaACargo> findByIdUsuario(Long idUsuario);
} 