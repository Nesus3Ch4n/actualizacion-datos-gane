package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    /**
     * Buscar usuario por documento (cédula)
     */
    Optional<Usuario> findByDocumento(Long documento);
    
    /**
     * Buscar usuario por correo electrónico
     */
    Optional<Usuario> findByCorreo(String correo);
    
    /**
     * Verificar si existe un usuario con el documento especificado
     */
    boolean existsByDocumento(Long documento);
    
    /**
     * Verificar si existe un usuario con el correo especificado
     */
    boolean existsByCorreo(String correo);
    
    /**
     * Buscar usuarios por nombre (búsqueda parcial)
     */
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
    
    /**
     * Buscar usuarios por cargo
     */
    List<Usuario> findByCargo(String cargo);
    
    /**
     * Buscar usuarios por área
     */
    List<Usuario> findByArea(String area);
    
    /**
     * Buscar usuarios por estado civil
     */
    List<Usuario> findByEstadoCivil(String estadoCivil);
    
    /**
     * Buscar usuarios por tipo de sangre
     */
    List<Usuario> findByTipoSangre(String tipoSangre);
    
    /**
     * Buscar usuarios por ciudad de nacimiento
     */
    List<Usuario> findByCiudadNacimiento(String ciudadNacimiento);
    
    /**
     * Buscar usuarios por país de nacimiento
     */
    List<Usuario> findByPaisNacimiento(String paisNacimiento);
    
    /**
     * Buscar usuarios por cedula de expedición
     */
    List<Usuario> findByCedulaExpedicion(String cedulaExpedicion);
    
    /**
     * Consulta personalizada para buscar usuarios con filtros múltiples
     */
    @Query("SELECT u FROM Usuario u WHERE " +
           "(:documento IS NULL OR u.documento = :documento) AND " +
           "(:nombre IS NULL OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
           "(:correo IS NULL OR LOWER(u.correo) LIKE LOWER(CONCAT('%', :correo, '%'))) AND " +
           "(:cargo IS NULL OR u.cargo = :cargo) AND " +
           "(:area IS NULL OR u.area = :area) AND " +
           "(:estadoCivil IS NULL OR u.estadoCivil = :estadoCivil)")
    List<Usuario> findUsuariosWithFilters(
            @Param("documento") Long documento,
            @Param("nombre") String nombre,
            @Param("correo") String correo,
            @Param("cargo") String cargo,
            @Param("area") String area,
            @Param("estadoCivil") String estadoCivil
    );
    

} 