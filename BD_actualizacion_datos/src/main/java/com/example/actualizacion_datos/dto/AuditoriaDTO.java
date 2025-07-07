package com.example.actualizacion_datos.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class AuditoriaDTO {
    
    private Long id;
    private String tablaModificada;
    private Long idRegistroModificado;
    private String campoModificado;
    private String valorAnterior;
    private String valorNuevo;
    private String tipoPeticion;
    private String usuarioModificador;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaModificacion;
    
    private Long idUsuario;
    private String descripcion;
    private String ipAddress;
    private String userAgent;

    // Constructores
    public AuditoriaDTO() {}

    public AuditoriaDTO(String tablaModificada, Long idRegistroModificado, String campoModificado, 
                       String valorAnterior, String valorNuevo, String tipoPeticion, 
                       String usuarioModificador, Long idUsuario, String descripcion) {
        this.tablaModificada = tablaModificada;
        this.idRegistroModificado = idRegistroModificado;
        this.campoModificado = campoModificado;
        this.valorAnterior = valorAnterior;
        this.valorNuevo = valorNuevo;
        this.tipoPeticion = tipoPeticion;
        this.usuarioModificador = usuarioModificador;
        this.fechaModificacion = LocalDateTime.now();
        this.idUsuario = idUsuario;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTablaModificada() { return tablaModificada; }
    public void setTablaModificada(String tablaModificada) { this.tablaModificada = tablaModificada; }

    public Long getIdRegistroModificado() { return idRegistroModificado; }
    public void setIdRegistroModificado(Long idRegistroModificado) { this.idRegistroModificado = idRegistroModificado; }

    public String getCampoModificado() { return campoModificado; }
    public void setCampoModificado(String campoModificado) { this.campoModificado = campoModificado; }

    public String getValorAnterior() { return valorAnterior; }
    public void setValorAnterior(String valorAnterior) { this.valorAnterior = valorAnterior; }

    public String getValorNuevo() { return valorNuevo; }
    public void setValorNuevo(String valorNuevo) { this.valorNuevo = valorNuevo; }

    public String getTipoPeticion() { return tipoPeticion; }
    public void setTipoPeticion(String tipoPeticion) { this.tipoPeticion = tipoPeticion; }

    public String getUsuarioModificador() { return usuarioModificador; }
    public void setUsuarioModificador(String usuarioModificador) { this.usuarioModificador = usuarioModificador; }

    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
} 