package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "AUDITORIA")
public class Auditoria {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_AUDITORIA")
    private Long id;
    
    @Column(name = "TABLA_MODIFICADA", nullable = false)
    private String tablaModificada;
    
    @Column(name = "ID_REGISTRO_MODIFICADO")
    private Long idRegistroModificado;
    
    @Column(name = "CAMPO_MODIFICADO")
    private String campoModificado;
    
    @Column(name = "VALOR_ANTERIOR", columnDefinition = "TEXT")
    private String valorAnterior;
    
    @Column(name = "VALOR_NUEVO", columnDefinition = "TEXT")
    private String valorNuevo;
    
    @Column(name = "TIPO_PETICION", nullable = false)
    private String tipoPeticion; // INSERT, UPDATE, DELETE
    
    @Column(name = "USUARIO_MODIFICADOR")
    private String usuarioModificador;
    
    @Column(name = "FECHA_MODIFICACION", nullable = false)
    private LocalDateTime fechaModificacion;
    
    @Column(name = "ID_USUARIO")
    private Long idUsuario;
    
    @Column(name = "DESCRIPCION")
    private String descripcion;
    
    @Column(name = "IP_ADDRESS")
    private String ipAddress;
    
    @Column(name = "USER_AGENT")
    private String userAgent;
    
    // Constructores
    public Auditoria() {}
    
    public Auditoria(String tablaModificada, Long idRegistroModificado, String campoModificado, 
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
    
    @Override
    public String toString() {
        return "Auditoria{" +
                "id=" + id +
                ", tablaModificada='" + tablaModificada + '\'' +
                ", idRegistroModificado=" + idRegistroModificado +
                ", campoModificado='" + campoModificado + '\'' +
                ", valorAnterior='" + valorAnterior + '\'' +
                ", valorNuevo='" + valorNuevo + '\'' +
                ", tipoPeticion='" + tipoPeticion + '\'' +
                ", usuarioModificador='" + usuarioModificador + '\'' +
                ", fechaModificacion=" + fechaModificacion +
                ", idUsuario=" + idUsuario +
                ", descripcion='" + descripcion + '\'' +
                '}';
    }
} 