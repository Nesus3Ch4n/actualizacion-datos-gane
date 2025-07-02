package com.example.actualizacion_datos.dto;

import java.time.LocalDate;

public class PersonaACargoDTO {
    private Long id;
    private Long idUsuario;
    private String nombre;
    private String parentesco;
    private LocalDate fechaNacimiento;
    private Integer edad;
    private Integer version;

    public PersonaACargoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
} 