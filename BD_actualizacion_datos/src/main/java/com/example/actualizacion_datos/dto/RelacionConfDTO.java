package com.example.actualizacion_datos.dto;

public class RelacionConfDTO {
    
    private Long id;
    private Long idUsuario;
    private String nombreCompleto;
    private String parentesco;
    private String tipoParteAsoc;
    private String tieneCl;
    private String actualizado;
    private Integer version;
    private String fechaCreacion;

    // Constructores
    public RelacionConfDTO() {}

    public RelacionConfDTO(Long idUsuario, String nombreCompleto, String parentesco, String tipoParteAsoc) {
        this.idUsuario = idUsuario;
        this.nombreCompleto = nombreCompleto;
        this.parentesco = parentesco;
        this.tipoParteAsoc = tipoParteAsoc;
        this.version = 1;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }

    public String getTipoParteAsoc() { return tipoParteAsoc; }
    public void setTipoParteAsoc(String tipoParteAsoc) { this.tipoParteAsoc = tipoParteAsoc; }

    public String getTieneCl() { return tieneCl; }
    public void setTieneCl(String tieneCl) { this.tieneCl = tieneCl; }

    public String getActualizado() { return actualizado; }
    public void setActualizado(String actualizado) { this.actualizado = actualizado; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public String getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(String fechaCreacion) { this.fechaCreacion = fechaCreacion; }
} 