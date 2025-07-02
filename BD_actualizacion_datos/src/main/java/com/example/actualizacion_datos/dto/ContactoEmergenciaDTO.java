package com.example.actualizacion_datos.dto;

public class ContactoEmergenciaDTO {
    
    private Long id;
    private Long idUsuario;
    private String nombreCompleto;
    private String parentesco;
    private String numeroCelular;
    private Integer version;

    // Constructores
    public ContactoEmergenciaDTO() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }

    public String getNumeroCelular() { return numeroCelular; }
    public void setNumeroCelular(String numeroCelular) { this.numeroCelular = numeroCelular; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
} 