package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "FAMILIA")
public class PersonaACargo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_FAMILIA")
    private Long idFamilia;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;
    
    @Column(name = "NOMBRE", length = 100)
    private String nombre;
    
    @Column(name = "PARENTESCO", length = 50)
    private String parentesco;
    
    @Column(name = "FECHA_NACIMIENTO", length = 20)
    private String fechaNacimiento;
    
    @Column(name = "EDAD")
    private Integer edad;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public PersonaACargo() {}
    
    public PersonaACargo(Usuario usuario, String nombre, String parentesco) {
        this.usuario = usuario;
        this.nombre = nombre;
        this.parentesco = parentesco;
    }
    
    // Getters y Setters
    public Long getIdFamilia() { return idFamilia; }
    public void setIdFamilia(Long idFamilia) { this.idFamilia = idFamilia; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
    
    public String getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    @Override
    public String toString() {
        return "PersonaACargo{" +
                "idFamilia=" + idFamilia +
                ", nombre='" + nombre + '\'' +
                ", parentesco='" + parentesco + '\'' +
                ", edad=" + edad +
                '}';
    }
} 