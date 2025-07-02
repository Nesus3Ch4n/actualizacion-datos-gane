package com.example.actualizacion_datos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class VehiculoDTO {
    
    private Long id;
    private Long idUsuario;
    
    @NotNull(message = "La placa es obligatoria")
    @Size(max = 10, message = "La placa no puede exceder 10 caracteres")
    private String placa;
    
    @Size(max = 50, message = "La marca no puede exceder 50 caracteres")
    private String marca;
    
    @Size(max = 50, message = "El modelo no puede exceder 50 caracteres")
    private String modelo;
    
    private Integer anio;
    
    @Size(max = 30, message = "El color no puede exceder 30 caracteres")
    private String color;
    
    @Size(max = 30, message = "El tipo de vehículo no puede exceder 30 caracteres")
    private String tipoVehiculo;
    
    private Boolean activo = true;
    
    // Constructores
    public VehiculoDTO() {}
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getPlaca() { return placa; }
    public void setPlaca(String placa) { this.placa = placa; }
    
    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }
    
    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }
    
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getTipoVehiculo() { return tipoVehiculo; }
    public void setTipoVehiculo(String tipoVehiculo) { this.tipoVehiculo = tipoVehiculo; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
} 