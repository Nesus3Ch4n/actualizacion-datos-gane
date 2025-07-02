package com.example.actualizacion_datos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ViviendaDTO {
    
    private Long id;
    private Long idUsuario;
    
    @NotNull(message = "El tipo de vivienda es obligatorio")
    @Size(max = 30, message = "El tipo de vivienda no puede exceder 30 caracteres")
    private String tipoVivienda;
    
    @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
    private String direccion;
    
    @Size(max = 50, message = "La ciudad no puede exceder 50 caracteres")
    private String ciudad;
    
    @Size(max = 50, message = "El barrio no puede exceder 50 caracteres")
    private String barrio;
    
    private Integer estrato;
    private Boolean viviendaPropia = false;
    private Boolean activo = true;

    // Constructores
    public ViviendaDTO() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getTipoVivienda() { return tipoVivienda; }
    public void setTipoVivienda(String tipoVivienda) { this.tipoVivienda = tipoVivienda; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }

    public String getBarrio() { return barrio; }
    public void setBarrio(String barrio) { this.barrio = barrio; }

    public Integer getEstrato() { return estrato; }
    public void setEstrato(Integer estrato) { this.estrato = estrato; }

    public Boolean getViviendaPropia() { return viviendaPropia; }
    public void setViviendaPropia(Boolean viviendaPropia) { this.viviendaPropia = viviendaPropia; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
} 