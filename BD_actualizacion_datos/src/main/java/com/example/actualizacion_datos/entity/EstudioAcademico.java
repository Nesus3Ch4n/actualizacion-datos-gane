package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    
    // Campos adicionales que no están en la tabla actual pero pueden ser útiles
    @Transient
    private String area;
    
    @Transient
    private String modalidad;
    
    @Transient
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;
    
    @Transient
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaFinalizacion;
    
    @Transient
    private Boolean graduado = false;
    
    @Transient
    private Boolean enCurso = false;
    
    @Transient
    private String observaciones;
    
    @Transient
    private Boolean activo = true;
    
    @Transient
    @CreationTimestamp
    private LocalDateTime fechaRegistro;
    
    @Transient
    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
    
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
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public String getModalidad() { return modalidad; }
    public void setModalidad(String modalidad) { this.modalidad = modalidad; }
    
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    
    public LocalDate getFechaFinalizacion() { return fechaFinalizacion; }
    public void setFechaFinalizacion(LocalDate fechaFinalizacion) { this.fechaFinalizacion = fechaFinalizacion; }
    
    public Boolean getGraduado() { 
        if (graduacion != null) {
            return "Sí".equalsIgnoreCase(graduacion);
        }
        return graduado; 
    }
    public void setGraduado(Boolean graduado) { 
        this.graduado = graduado;
        if (graduado != null) {
            this.graduacion = graduado ? "Sí" : "No";
        }
    }
    
    public Boolean getEnCurso() { 
        if (graduacion != null) {
            return "En curso".equalsIgnoreCase(graduacion);
        }
        return enCurso; 
    }
    public void setEnCurso(Boolean enCurso) { 
        this.enCurso = enCurso;
        if (enCurso != null && enCurso) {
            this.graduacion = "En curso";
        }
    }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
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