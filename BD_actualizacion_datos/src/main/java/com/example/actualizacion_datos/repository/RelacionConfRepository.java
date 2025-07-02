package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.RelacionConf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RelacionConfRepository extends JpaRepository<RelacionConf, Long> {

    List<RelacionConf> findByIdUsuario(Long idUsuario);
} 