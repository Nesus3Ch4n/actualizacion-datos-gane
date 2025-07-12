package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_actualizaciones")
public class HistorialActualizacion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Long idHistorial;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_control", nullable = false)
    private ControlActualizacion controlActualizacion;
    
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "tipo_actualizacion", length = 50)
    private String tipoActualizacion;
    
    @Column(name = "datos_actualizados", columnDefinition = "TEXT")
    private String datosActualizados;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    // Constructores
    public HistorialActualizacion() {}
    
    public HistorialActualizacion(Usuario usuario, ControlActualizacion controlActualizacion, 
                                 String tipoActualizacion, String datosActualizados, 
                                 String ipAddress, String userAgent) {
        this.usuario = usuario;
        this.controlActualizacion = controlActualizacion;
        this.fechaActualizacion = LocalDateTime.now();
        this.tipoActualizacion = tipoActualizacion;
        this.datosActualizados = datosActualizados;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }
    
    // Getters y Setters
    public Long getIdHistorial() {
        return idHistorial;
    }
    
    public void setIdHistorial(Long idHistorial) {
        this.idHistorial = idHistorial;
    }
    
    public Usuario getUsuario() {
        return usuario;
    }
    
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
    public ControlActualizacion getControlActualizacion() {
        return controlActualizacion;
    }
    
    public void setControlActualizacion(ControlActualizacion controlActualizacion) {
        this.controlActualizacion = controlActualizacion;
    }
    
    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }
    
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }
    
    public String getTipoActualizacion() {
        return tipoActualizacion;
    }
    
    public void setTipoActualizacion(String tipoActualizacion) {
        this.tipoActualizacion = tipoActualizacion;
    }
    
    public String getDatosActualizados() {
        return datosActualizados;
    }
    
    public void setDatosActualizados(String datosActualizados) {
        this.datosActualizados = datosActualizados;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
} 