package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "control_actualizaciones")
public class ControlActualizacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_control")
    private Long idControl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    
    @Column(name = "fecha_ultima_actualizacion", nullable = false)
    private LocalDateTime fechaUltimaActualizacion;
    
    @Column(name = "fecha_proxima_actualizacion", nullable = false)
    private LocalDateTime fechaProximaActualizacion;
    
    @Column(name = "estado_actualizacion", length = 20)
    private String estadoActualizacion = "PENDIENTE";
    
    @Column(name = "version_actualizacion")
    private Integer versionActualizacion = 1;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public ControlActualizacion() {}
    
    public ControlActualizacion(Usuario usuario) {
        this.usuario = usuario;
        this.fechaUltimaActualizacion = LocalDateTime.now();
        this.fechaProximaActualizacion = LocalDateTime.now().plusYears(1);
        this.estadoActualizacion = "PENDIENTE";
        this.versionActualizacion = 1;
    }
    
    // Getters y Setters
    public Long getIdControl() {
        return idControl;
    }
    
    public void setIdControl(Long idControl) {
        this.idControl = idControl;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public LocalDateTime getFechaUltimaActualizacion() {
        return fechaUltimaActualizacion;
    }
    
    public void setFechaUltimaActualizacion(LocalDateTime fechaUltimaActualizacion) {
        this.fechaUltimaActualizacion = fechaUltimaActualizacion;
    }
    
    public LocalDateTime getFechaProximaActualizacion() {
        return fechaProximaActualizacion;
    }
    
    public void setFechaProximaActualizacion(LocalDateTime fechaProximaActualizacion) {
        this.fechaProximaActualizacion = fechaProximaActualizacion;
    }
    
    public String getEstadoActualizacion() {
        return estadoActualizacion;
    }
    
    public void setEstadoActualizacion(String estadoActualizacion) {
        this.estadoActualizacion = estadoActualizacion;
    }
    
    public Integer getVersionActualizacion() {
        return versionActualizacion;
    }
    
    public void setVersionActualizacion(Integer versionActualizacion) {
        this.versionActualizacion = versionActualizacion;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }
    
    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }
    
    // Métodos de utilidad
    public boolean necesitaActualizacion() {
        LocalDateTime ahora = LocalDateTime.now();
        return ahora.isAfter(fechaProximaActualizacion) || 
               "PENDIENTE".equals(estadoActualizacion);
    }
    
    public boolean estaVencida() {
        LocalDateTime ahora = LocalDateTime.now();
        return ahora.isAfter(fechaProximaActualizacion);
    }
    
    public long diasRestantes() {
        LocalDateTime ahora = LocalDateTime.now();
        return java.time.Duration.between(ahora, fechaProximaActualizacion).toDays();
    }
} 