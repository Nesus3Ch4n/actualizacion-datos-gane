package com.example.actualizacion_datos.repository;

import com.example.actualizacion_datos.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    
    /**
     * Buscar vehículos por usuario
     */
    List<Vehiculo> findByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Buscar vehículos por tipo
     */
    List<Vehiculo> findByTipoVehiculo(String tipoVehiculo);
    
    /**
     * Buscar vehículos por marca
     */
    List<Vehiculo> findByMarca(String marca);
    
    /**
     * Buscar vehículos por placa
     */
    List<Vehiculo> findByPlaca(String placa);
    
    /**
     * Buscar vehículos por propietario
     */
    List<Vehiculo> findByPropietario(String propietario);
    
    /**
     * Buscar vehículos por año
     */
    List<Vehiculo> findByAno(Integer ano);
    
    /**
     * Eliminar todos los vehículos de un usuario
     */
    void deleteByUsuarioIdUsuario(Long idUsuario);
    
    /**
     * Consulta personalizada para buscar vehículos con filtros
     */
    @Query("SELECT v FROM Vehiculo v WHERE " +
           "(:idUsuario IS NULL OR v.usuario.idUsuario = :idUsuario) AND " +
           "(:tipoVehiculo IS NULL OR v.tipoVehiculo = :tipoVehiculo) AND " +
           "(:marca IS NULL OR v.marca = :marca) AND " +
           "(:placa IS NULL OR v.placa = :placa)")
    List<Vehiculo> findVehiculosWithFilters(
            @Param("idUsuario") Long idUsuario,
            @Param("tipoVehiculo") String tipoVehiculo,
            @Param("marca") String marca,
            @Param("placa") String placa
    );
} 