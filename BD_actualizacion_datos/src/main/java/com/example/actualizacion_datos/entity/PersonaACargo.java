package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

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
    private String fechaNacimiento; // Cambiado a String para manejar timestamps

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

    public String getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    // Método para obtener la fecha como LocalDate (para el frontend)
    public LocalDate getFechaNacimientoAsLocalDate() {
        if (fechaNacimiento == null || fechaNacimiento.isEmpty()) {
            return null;
        }
        
        try {
            // Si es un timestamp (número), convertirlo a LocalDate
            if (fechaNacimiento.matches("\\d+")) {
                long timestamp = Long.parseLong(fechaNacimiento);
                return Instant.ofEpochMilli(timestamp)
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            }
            // Si ya es una fecha en formato string, parsearla
            else {
                return LocalDate.parse(fechaNacimiento);
            }
        } catch (Exception e) {
            return null;
        }
    }
    
    // Método para establecer la fecha desde un LocalDate
    public void setFechaNacimientoFromLocalDate(LocalDate fecha) {
        if (fecha == null) {
            this.fechaNacimiento = null;
        } else {
            this.fechaNacimiento = fecha.toString();
        }
    }
    
    // Método para obtener la fecha formateada para el frontend
    public String getFechaNacimientoFormateada() {
        LocalDate fecha = getFechaNacimientoAsLocalDate();
        if (fecha == null) {
            return null;
        }
        return fecha.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
    }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
} 