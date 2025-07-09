package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CONTACTO")
public class ContactoEmergencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONTACTO")
    private Long idContacto;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;
    
    @Column(name = "NOMBRE_COMPLETO", length = 100)
    private String nombreCompleto;
    
    @Column(name = "PARENTESCO", length = 50)
    private String parentesco;
    
    @Column(name = "NUMERO_CELULAR", length = 20)
    private String numeroCelular;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public ContactoEmergencia() {}
    
    public ContactoEmergencia(Usuario usuario, String nombreCompleto, String parentesco, String numeroCelular) {
        this.usuario = usuario;
        this.nombreCompleto = nombreCompleto;
        this.parentesco = parentesco;
        this.numeroCelular = numeroCelular;
    }
    
    // Getters y Setters
    public Long getIdContacto() { return idContacto; }
    public void setIdContacto(Long idContacto) { this.idContacto = idContacto; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    
    public String getParentesco() { return parentesco; }
    public void setParentesco(String parentesco) { this.parentesco = parentesco; }
    
    public String getNumeroCelular() { return numeroCelular; }
    public void setNumeroCelular(String numeroCelular) { this.numeroCelular = numeroCelular; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    @Override
    public String toString() {
        return "ContactoEmergencia{" +
                "idContacto=" + idContacto +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", parentesco='" + parentesco + '\'' +
                ", numeroCelular='" + numeroCelular + '\'' +
                '}';
    }
} 