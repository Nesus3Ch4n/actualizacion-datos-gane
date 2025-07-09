package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ESTUDIOS")
public class EstudioAcademico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ESTUDIOS")
    private Long idEstudios;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;
    
    @Column(name = "NIVEL_ACADEMICO", length = 100)
    private String nivelAcademico;
    
    @Column(name = "PROGRAMA", length = 150)
    private String programa;
    
    @Column(name = "INSTITUCION", length = 150)
    private String institucion;
    
    @Column(name = "SEMESTRE")
    private Integer semestre;
    
    @Column(name = "GRADUACION", length = 50)
    private String graduacion;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public EstudioAcademico() {}
    
    public EstudioAcademico(Usuario usuario, String nivelAcademico, String programa, String institucion) {
        this.usuario = usuario;
        this.nivelAcademico = nivelAcademico;
        this.programa = programa;
        this.institucion = institucion;
    }
    
    // Getters y Setters
    public Long getIdEstudios() { return idEstudios; }
    public void setIdEstudios(Long idEstudios) { this.idEstudios = idEstudios; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getNivelAcademico() { return nivelAcademico; }
    public void setNivelAcademico(String nivelAcademico) { this.nivelAcademico = nivelAcademico; }
    
    public String getPrograma() { return programa; }
    public void setPrograma(String programa) { this.programa = programa; }
    
    public String getInstitucion() { return institucion; }
    public void setInstitucion(String institucion) { this.institucion = institucion; }
    
    public Integer getSemestre() { return semestre; }
    public void setSemestre(Integer semestre) { this.semestre = semestre; }
    
    public String getGraduacion() { return graduacion; }
    public void setGraduacion(String graduacion) { this.graduacion = graduacion; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    @Override
    public String toString() {
        return "EstudioAcademico{" +
                "idEstudios=" + idEstudios +
                ", nivelAcademico='" + nivelAcademico + '\'' +
                ", programa='" + programa + '\'' +
                ", institucion='" + institucion + '\'' +
                '}';
    }
} 