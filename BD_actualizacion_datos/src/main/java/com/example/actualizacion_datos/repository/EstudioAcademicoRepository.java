package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.EstudioAcademico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudioAcademicoRepository extends JpaRepository<EstudioAcademico, Long> {
    
    /**
     * Buscar estudios por usuario
     */
    List<EstudioAcademico> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar estudios por nivel académico
     */
    List<EstudioAcademico> findByNivelAcademico(String nivelAcademico);
    
    /**
     * Buscar estudios por programa
     */
    List<EstudioAcademico> findByPrograma(String programa);
    
    /**
     * Buscar estudios por institución
     */
    List<EstudioAcademico> findByInstitucion(String institucion);
    
    /**
     * Buscar estudios por semestre
     */
    List<EstudioAcademico> findBySemestre(Integer semestre);
    
    /**
     * Buscar estudios por graduación
     */
    List<EstudioAcademico> findByGraduacion(String graduacion);
    
    /**
     * Eliminar todos los estudios de un usuario
     */
    void deleteByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Consulta personalizada para buscar estudios con filtros
     */
    @Query("SELECT e FROM EstudioAcademico e WHERE " +
           "(:idUsuario IS NULL OR e.usuario.idUsuario = :idUsuario) AND " +
           "(:nivelAcademico IS NULL OR e.nivelAcademico = :nivelAcademico) AND " +
           "(:programa IS NULL OR e.programa = :programa) AND " +
           "(:institucion IS NULL OR e.institucion = :institucion)")
    List<EstudioAcademico> findEstudiosWithFilters(
            @Param("idUsuario") Long idUsuario,
            @Param("nivelAcademico") String nivelAcademico,
            @Param("programa") String programa,
            @Param("institucion") String institucion
    );
} 