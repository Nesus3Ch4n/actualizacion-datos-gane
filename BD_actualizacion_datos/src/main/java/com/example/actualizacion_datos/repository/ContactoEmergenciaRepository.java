package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.ContactoEmergencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactoEmergenciaRepository extends JpaRepository<ContactoEmergencia, Long> {

    List<ContactoEmergencia> findByIdUsuario(Long idUsuario);
} 