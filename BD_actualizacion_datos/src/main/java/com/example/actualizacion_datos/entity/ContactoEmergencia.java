package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "CONTACTO")
public class ContactoEmergencia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONTACTO")
    private Long id;
    
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;
    
    @Column(name = "NOMBRE_COMPLETO")
    private String nombreCompleto;
    
    @Column(name = "PARENTESCO")
    private String parentesco;
    
    @Column(name = "NUMERO_CELULAR")
    private String numeroCelular;
    
    @Column(name = "VERSION")
    private Integer version;
    
    // Constructores
    public ContactoEmergencia() {}
    
    public ContactoEmergencia(Long idUsuario, String nombreCompleto, String parentesco, String numeroCelular) {
        this.idUsuario = idUsuario;
        this.nombreCompleto = nombreCompleto;
        this.parentesco = parentesco;
        this.numeroCelular = numeroCelular;
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
    
    public String getNumeroCelular() { return numeroCelular; }
    public void setNumeroCelular(String numeroCelular) { this.numeroCelular = numeroCelular; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    @Override
    public String toString() {
        return "ContactoEmergencia{" +
                "id=" + id +
                ", idUsuario=" + idUsuario +
                ", nombreCompleto='" + nombreCompleto + '\'' +
                ", parentesco='" + parentesco + '\'' +
                ", numeroCelular='" + numeroCelular + '\'' +
                ", version=" + version +
                '}';
    }
} 