package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "FAMILIA")
public class PersonaACargo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_FAMILIA")
    private Long id;

    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;

    @Column(name = "NOMBRE", nullable = false)
    private String nombre;

    @Column(name = "PARENTESCO", nullable = false)
    private String parentesco;

    @Column(name = "FECHA_NACIMIENTO")
    private LocalDate fechaNacimiento;

    @Column(name = "EDAD")
    private Integer edad;

    @Column(name = "VERSION")
    private Integer version;

    // Constructores
    public PersonaACargo() {}

    public PersonaACargo(Long idUsuario, String nombre, String parentesco) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.parentesco = parentesco;
    }

    // Getters y Setters
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