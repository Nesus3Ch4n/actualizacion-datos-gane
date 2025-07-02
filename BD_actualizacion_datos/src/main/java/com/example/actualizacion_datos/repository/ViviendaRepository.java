package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.Vivienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ViviendaRepository extends JpaRepository<Vivienda, Long> {
    
    List<Vivienda> findByTipoVivienda(String tipoVivienda);
    
    List<Vivienda> findByTipoAdquisicion(String tipoAdquisicion);
    
    List<Vivienda> findByCiudad(String ciudad);
    
    List<Vivienda> findByBarrio(String barrio);
    
    List<Vivienda> findByEntidad(String entidad);
    
    @Query("SELECT v FROM Vivienda v WHERE v.anio BETWEEN :min AND :max")
    List<Vivienda> findByAnioBetween(@Param("min") Integer minAnio, @Param("max") Integer maxAnio);
    
    @Query("SELECT COUNT(v) FROM Vivienda v WHERE v.tipoAdquisicion = 'PROPIA'")
    long countViviendaPropia();
    
    @Query("SELECT COUNT(v) FROM Vivienda v WHERE v.tipoAdquisicion = 'ARRENDADA'")
    long countViviendaArrendada();
    
    Optional<Vivienda> findByIdUsuario(Long idUsuario);
} 