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
    
    // Buscar por cédula
    @Query(value = "SELECT * FROM USUARIO WHERE DOCUMENTO = :cedula", nativeQuery = true)
    Optional<Usuario> findByCedula(@Param("cedula") Long cedula);
    
    // Buscar por correo
    @Query(value = "SELECT * FROM USUARIO WHERE CORREO = :correo", nativeQuery = true)
    Optional<Usuario> findByCorreo(@Param("correo") String correo);
    
    // Verificar si existe por cédula - cambiado para evitar problemas de casting
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.cedula = :cedula")
    boolean existsByCedula(@Param("cedula") Long cedula);
    
    // Verificar si existe por correo - cambiado para evitar problemas de casting
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Usuario u WHERE u.correo = :correo")
    boolean existsByCorreo(@Param("correo") String correo);
    
    // Buscar usuarios activos
    @Query(value = "SELECT * FROM USUARIO WHERE ACTIVO = 1", nativeQuery = true)
    List<Usuario> findByActivoTrue();
    
    // Buscar usuarios con formulario completo
    @Query(value = "SELECT * FROM USUARIO WHERE FORMULARIO_COMPLETO = 1", nativeQuery = true)
    List<Usuario> findByFormularioCompletoTrue();
    
    // Buscar usuarios activos con formulario completo
    @Query(value = "SELECT * FROM USUARIO WHERE ACTIVO = 1 AND FORMULARIO_COMPLETO = 1", nativeQuery = true)
    List<Usuario> findUsuariosActivosCompletos();
    
    // Buscar por nombre (búsqueda parcial)
    @Query(value = "SELECT * FROM USUARIO WHERE LOWER(NOMBRE) LIKE LOWER('%' || :nombre || '%') AND ACTIVO = 1", nativeQuery = true)
    List<Usuario> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);
    
    // Buscar por ciudad de nacimiento
    @Query(value = "SELECT * FROM USUARIO WHERE CIUDAD_NACIMIENTO = :ciudad AND ACTIVO = 1", nativeQuery = true)
    List<Usuario> findByCiudadNacimientoAndActivoTrue(@Param("ciudad") String ciudad);
    
    // Contar usuarios activos
    @Query(value = "SELECT COUNT(*) FROM USUARIO WHERE ACTIVO = 1", nativeQuery = true)
    long countUsuariosActivos();
    
    // Contar formularios completos
    @Query(value = "SELECT COUNT(*) FROM USUARIO WHERE FORMULARIO_COMPLETO = 1 AND ACTIVO = 1", nativeQuery = true)
    long countFormulariosCompletos();
} 