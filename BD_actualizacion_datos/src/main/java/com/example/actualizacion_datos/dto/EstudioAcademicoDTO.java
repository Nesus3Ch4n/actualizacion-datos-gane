package com.example.actualizacion_datos.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class EstudioAcademicoDTO {
    
    private Long id;
    private Long idUsuario;
    
    @NotNull(message = "El nivel educativo es obligatorio")
    @Size(max = 50, message = "El nivel educativo no puede exceder 50 caracteres")
    private String nivelEducativo;
    
    @NotNull(message = "La institución es obligatoria")
    @Size(max = 100, message = "La institución no puede exceder 100 caracteres")
    private String institucion;
    
    @Size(max = 100, message = "El título no puede exceder 100 caracteres")
    private String titulo;
    
    private String area;
    private String modalidad;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaFinalizacion;
    
    private Boolean graduado = false;
    private Boolean enCurso = false;
    private Integer anioInicio;
    private Integer anioFinalizacion;
    private Boolean activo = true;
    private String observaciones;
    
    // Constructores
    public EstudioAcademicoDTO() {}
    
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
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public String getModalidad() { return modalidad; }
    public void setModalidad(String modalidad) { this.modalidad = modalidad; }
    
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    
    public LocalDate getFechaFinalizacion() { return fechaFinalizacion; }
    public void setFechaFinalizacion(LocalDate fechaFinalizacion) { this.fechaFinalizacion = fechaFinalizacion; }
    
    public Boolean getGraduado() { return graduado; }
    public void setGraduado(Boolean graduado) { this.graduado = graduado; }
    
    public Boolean getEnCurso() { return enCurso; }
    public void setEnCurso(Boolean enCurso) { this.enCurso = enCurso; }
    
    public Integer getAnioInicio() { return anioInicio; }
    public void setAnioInicio(Integer anioInicio) { this.anioInicio = anioInicio; }
    
    public Integer getAnioFinalizacion() { return anioFinalizacion; }
    public void setAnioFinalizacion(Integer anioFinalizacion) { this.anioFinalizacion = anioFinalizacion; }
    
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
} 