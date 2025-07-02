package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "VEHICULO")
public class Vehiculo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_VEHICULO")
    private Long idVehiculo;
    
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;
    
    @NotBlank(message = "El tipo de vehículo es requerido")
    @Column(name = "TIPO_VEHICULO", nullable = false)
    private String tipoVehiculo;
    
    @NotBlank(message = "La marca es requerida")
    @Column(name = "MARCA", nullable = false)
    private String marca;
    
    @NotBlank(message = "La placa es requerida")
    @Column(name = "PLACA", nullable = false)
    private String placa;
    
    @Column(name = "ANIO", nullable = false)
    private Integer anio;
    
    @NotBlank(message = "El propietario es requerido")
    @Column(name = "PROPIETARIO", nullable = false)
    private String propietario;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    // Constructores
    public Vehiculo() {}
    
    public Vehiculo(Long idUsuario, String tipoVehiculo, String marca, String placa, Integer anio, String propietario) {
        this.idUsuario = idUsuario;
        this.tipoVehiculo = tipoVehiculo;
        this.marca = marca;
        this.placa = placa;
        this.anio = anio;
        this.propietario = propietario;
    }
    
    // Getters y Setters
    public Long getIdVehiculo() { return idVehiculo; }
    public void setIdVehiculo(Long idVehiculo) { this.idVehiculo = idVehiculo; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getTipoVehiculo() { return tipoVehiculo; }
    public void setTipoVehiculo(String tipoVehiculo) { this.tipoVehiculo = tipoVehiculo; }
    
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    
    public String getPropietario() { return propietario; }
    public void setPropietario(String propietario) { this.propietario = propietario; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    @Override
    public String toString() {
        return "Vehiculo{" +
                "idVehiculo=" + idVehiculo +
                ", idUsuario=" + idUsuario +
                ", tipoVehiculo='" + tipoVehiculo + '\'' +
                ", marca='" + marca + '\'' +
                ", placa='" + placa + '\'' +
                ", anio=" + anio +
                ", propietario='" + propietario + '\'' +
                ", version=" + version +
                '}';
    }
} 