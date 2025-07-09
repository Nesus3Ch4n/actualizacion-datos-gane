package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "RELACION_CONF")
public class RelacionConf {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_RELACION_CONF")
    private Long idRelacionConf;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;
    
    @Column(name = "NOMBRE_COMPLETO", length = 100)
    private String nombreCompleto;
    
    @Column(name = "PARENTESCO", length = 50)
    private String parentesco;
    
    @Column(name = "TIPO_PARTE_ASOC", length = 100)
    private String tipoParteAsoc;
    
    @Column(name = "TIENE_CL")
    private Integer tieneCl = 0;
    
    @Column(name = "ACTUALIZADO")
    private Integer actualizado = 0;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @Column(name = "FECHA_CREACION", length = 50)
    private String fechaCreacion;
    
    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public RelacionConf() {}
    
    public RelacionConf(Usuario usuario, String nombreCompleto, String parentesco) {
        this.usuario = usuario;
        this.nombreCompleto = nombreCompleto;
        this.parentesco = parentesco;
    }
    
    // Getters y Setters
    public Long getIdRelacionConf() { return idRelacionConf; }
    public void setIdRelacionConf(Long idRelacionConf) { this.idRelacionConf = idRelacionConf; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
    
    public String getTipoParteAsoc() { return tipoParteAsoc; }
    public void setTipoParteAsoc(String tipoParteAsoc) { this.tipoParteAsoc = tipoParteAsoc; }
    
    public Integer getTieneCl() { return tieneCl; }
    public void setTieneCl(Integer tieneCl) { this.tieneCl = tieneCl; }
    
    public Integer getActualizado() { return actualizado; }
    public void setActualizado(Integer actualizado) { this.actualizado = actualizado; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public String getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(String fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    @Override
    public String toString() {
        return "RelacionConf{" +
                "idRelacionConf=" + idRelacionConf +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", parentesco='" + parentesco + '\'' +
                ", tipoParteAsoc='" + tipoParteAsoc + '\'' +
                '}';
    }
} 