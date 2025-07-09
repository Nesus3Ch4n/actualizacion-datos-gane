package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "USUARIO")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_USUARIO")
    private Long idUsuario;
    
    @Column(name = "DOCUMENTO", nullable = false, unique = true)
    private Long documento;
    
    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "FECHA_NACIMIENTO", nullable = false)
    private LocalDate fechaNacimiento;
    
    @Column(name = "CEDULA_EXPEDICION", length = 50)
    private String cedulaExpedicion;
    
    @Column(name = "PAIS_NACIMIENTO", length = 50)
    private String paisNacimiento;
    
    @Column(name = "CIUDAD_NACIMIENTO", length = 50)
    private String ciudadNacimiento;
    
    @Column(name = "CARGO", length = 100)
    private String cargo;
    
    @Column(name = "AREA", length = 100)
    private String area;
    
    @Column(name = "ESTADO_CIVIL", length = 20)
    private String estadoCivil;
    
    @Column(name = "TIPO_SANGRE", length = 10)
    private String tipoSangre;
    
    @Column(name = "NUMERO_FIJO")
    private Long numeroFijo;
    
    @Column(name = "NUMERO_CELULAR")
    private Long numeroCelular;
    
    @Column(name = "NUMERO_CORP")
    private Long numeroCorp;
    
    @Column(name = "CORREO", length = 100)
    private String correo;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public Usuario() {}
    
    public Usuario(Long documento, String nombre, LocalDate fechaNacimiento) {
        this.documento = documento;
        this.nombre = nombre;
        this.fechaNacimiento = fechaNacimiento;
    }
    
    // Getters y Setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public Long getDocumento() { return documento; }
    public void setDocumento(Long documento) { this.documento = documento; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getCedulaExpedicion() { return cedulaExpedicion; }
    public void setCedulaExpedicion(String cedulaExpedicion) { this.cedulaExpedicion = cedulaExpedicion; }
    
    public String getPaisNacimiento() { return paisNacimiento; }
    public void setPaisNacimiento(String paisNacimiento) { this.paisNacimiento = paisNacimiento; }
    
    public String getCiudadNacimiento() { return ciudadNacimiento; }
    public void setCiudadNacimiento(String ciudadNacimiento) { this.ciudadNacimiento = ciudadNacimiento; }
    
    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public String getEstadoCivil() { return estadoCivil; }
    public void setEstadoCivil(String estadoCivil) { this.estadoCivil = estadoCivil; }
    
    public String getTipoSangre() { return tipoSangre; }
    public void setTipoSangre(String tipoSangre) { this.tipoSangre = tipoSangre; }
    
    public Long getNumeroFijo() { return numeroFijo; }
    public void setNumeroFijo(Long numeroFijo) { this.numeroFijo = numeroFijo; }
    
    public Long getNumeroCelular() { return numeroCelular; }
    public void setNumeroCelular(Long numeroCelular) { this.numeroCelular = numeroCelular; }
    
    public Long getNumeroCorp() { return numeroCorp; }
    public void setNumeroCorp(Long numeroCorp) { this.numeroCorp = numeroCorp; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    @Override
    public String toString() {
        return "Usuario{" +
                "idUsuario=" + idUsuario +
                ", documento=" + documento +
                ", nombre='" + nombre + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                ", correo='" + correo + '\'' +
                '}';
    }
} 