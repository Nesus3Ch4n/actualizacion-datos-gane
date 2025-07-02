package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.EstudioAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudioAcademicoRepository extends JpaRepository<EstudioAcademico, Long> {
    
    List<EstudioAcademico> findByIdUsuario(Long idUsuario);
    
    @Query("SELECT ea FROM EstudioAcademico ea WHERE ea.idUsuario = :idUsuario")
    List<EstudioAcademico> findByIdUsuarioAndActivoTrue(@Param("idUsuario") Long idUsuario);
    
    List<EstudioAcademico> findByNivelEducativo(String nivelEducativo);
    
    List<EstudioAcademico> findByInstitucion(String institucion);
    
    @Query("SELECT ea FROM EstudioAcademico ea WHERE ea.graduacion = 'Sí'")
    List<EstudioAcademico> findByGraduadoTrue();
    
    @Query("SELECT ea FROM EstudioAcademico ea WHERE ea.graduacion = 'En curso'")
    List<EstudioAcademico> findByEnCursoTrue();
    
    @Query("SELECT ea FROM EstudioAcademico ea WHERE ea.idUsuario = :idUsuario AND ea.graduacion = 'Sí'")
    List<EstudioAcademico> findEstudiosGraduadosByIdUsuario(@Param("idUsuario") Long idUsuario);
    
    @Query("SELECT ea FROM EstudioAcademico ea WHERE ea.institucion LIKE %:institucion%")
    List<EstudioAcademico> findByInstitucionContaining(@Param("institucion") String institucion);
    
    @Query("SELECT COUNT(ea) FROM EstudioAcademico ea WHERE ea.idUsuario = :idUsuario")
    long countByIdUsuarioAndActivoTrue(@Param("idUsuario") Long idUsuario);
} 