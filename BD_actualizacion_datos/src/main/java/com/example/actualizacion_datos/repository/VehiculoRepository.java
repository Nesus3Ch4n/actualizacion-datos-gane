package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    
    List<Vehiculo> findByIdUsuario(Long idUsuario);
    
    Optional<Vehiculo> findByPlaca(String placa);
    
    List<Vehiculo> findByTipoVehiculo(String tipoVehiculo);
    
    @Query("SELECT v FROM Vehiculo v WHERE v.marca LIKE %:marca%")
    List<Vehiculo> findByMarcaContaining(@Param("marca") String marca);
    
    @Query("SELECT COUNT(v) FROM Vehiculo v WHERE v.idUsuario = :idUsuario")
    long countByIdUsuario(@Param("idUsuario") Long idUsuario);
    
    boolean existsByPlaca(String placa);
} 