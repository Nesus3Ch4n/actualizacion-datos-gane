package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "ESTUDIOS")
public class EstudioAcademico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ESTUDIOS")
    private Long id;
    
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;
    
    @NotBlank(message = "El nivel educativo es requerido")
    @Column(name = "NIVEL_ACADEMICO", nullable = false)
    private String nivelEducativo;
    
    @NotBlank(message = "La institución es requerida")
    @Column(name = "INSTITUCION", nullable = false)
    private String institucion;
    
    @Column(name = "PROGRAMA")
    private String titulo;
    
    @Column(name = "SEMESTRE")
    private Integer semestre;
    
    @Column(name = "GRADUACION")
    private String graduacion;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    // Constructores
    public EstudioAcademico() {}
    
    public EstudioAcademico(Long idUsuario, String nivelEducativo, String institucion) {
        this.idUsuario = idUsuario;
        this.nivelEducativo = nivelEducativo;
        this.institucion = institucion;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNivelEducativo() { return nivelEducativo; }
    public void setNivelEducativo(String nivelEducativo) { this.nivelEducativo = nivelEducativo; }
    
    public String getInstitucion() { return institucion; }
    public void setInstitucion(String institucion) { this.institucion = institucion; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    
    public Integer getSemestre() { return semestre; }
    public void setSemestre(Integer semestre) { this.semestre = semestre; }
    
    public String getGraduacion() { return graduacion; }
    public void setGraduacion(String graduacion) { this.graduacion = graduacion; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    @Override
    public String toString() {
        return "EstudioAcademico{" +
                "id=" + id +
                ", idUsuario=" + idUsuario +
                ", nivelEducativo='" + nivelEducativo + '\'' +
                ", institucion='" + institucion + '\'' +
                ", titulo='" + titulo + '\'' +
                ", graduacion='" + graduacion + '\'' +
                '}';
    }
} 