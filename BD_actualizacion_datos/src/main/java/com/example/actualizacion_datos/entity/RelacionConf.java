package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "RELACION_CONF")
public class RelacionConf {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_RELACION_CONF")
    private Long id;
    
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;
    
    @Column(name = "NOMBRE_COMPLETO")
    private String nombreCompleto;
    
    @Column(name = "PARENTESCO")
    private String parentesco;
    
    @Column(name = "TIPO_PARTE_ASOC")
    private String tipoParteAsoc;
    
    @Column(name = "TIENE_CL")
    private String tieneCl;
    
    @Column(name = "ACTUALIZADO")
    private String actualizado;
    
    @Column(name = "VERSION")
    private Integer version;
    
    @Column(name = "FECHA_CREACION")
    private String fechaCreacion;
    
    // Constructores
    public RelacionConf() {}
    
    public RelacionConf(Long idUsuario, String nombreCompleto, String parentesco, String tipoParteAsoc) {
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
    
    @Override
    public String toString() {
        return "RelacionConf{" +
                "id=" + id +
                ", idUsuario=" + idUsuario +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", parentesco='" + parentesco + '\'' +
                ", tipoParteAsoc='" + tipoParteAsoc + '\'' +
                ", tieneCl='" + tieneCl + '\'' +
                ", actualizado='" + actualizado + '\'' +
                ", version=" + version +
                ", fechaCreacion='" + fechaCreacion + '\'' +
                '}';
    }
} 