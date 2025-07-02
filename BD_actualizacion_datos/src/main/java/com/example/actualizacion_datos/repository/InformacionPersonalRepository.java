package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.InformacionPersonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface InformacionPersonalRepository extends JpaRepository<InformacionPersonal, Long> {
    
    @Query(value = "SELECT * FROM USUARIO WHERE DOCUMENTO = :cedula", nativeQuery = true)
    Optional<InformacionPersonal> findByCedula(@Param("cedula") Long cedula);
    
    @Query(value = "SELECT * FROM USUARIO WHERE CORREO = :correo", nativeQuery = true)
    Optional<InformacionPersonal> findByCorreo(@Param("correo") String correo);
    
    @Query(value = "SELECT * FROM USUARIO", nativeQuery = true)
    List<InformacionPersonal> findAllUsuarios();
    
    @Query(value = "SELECT * FROM USUARIO WHERE CIUDAD_NACIMIENTO = :ciudad", nativeQuery = true)
    List<InformacionPersonal> findByCiudadNacimiento(@Param("ciudad") String ciudad);
    
    @Query(value = "SELECT * FROM USUARIO WHERE PAIS_NACIMIENTO = :pais", nativeQuery = true)
    List<InformacionPersonal> findByPaisNacimiento(@Param("pais") String pais);
    
    @Query(value = "SELECT * FROM USUARIO WHERE NOMBRE LIKE '%' || :nombre || '%'", nativeQuery = true)
    List<InformacionPersonal> findByNombreContaining(@Param("nombre") String nombre);
    
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM USUARIO WHERE DOCUMENTO = :cedula", nativeQuery = true)
    boolean existsByCedula(@Param("cedula") Long cedula);
    
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END FROM USUARIO WHERE CORREO = :correo", nativeQuery = true)
    boolean existsByCorreo(@Param("correo") String correo);
    
    @Query(value = "SELECT COUNT(*) FROM USUARIO", nativeQuery = true)
    long countAllUsuarios();
} 