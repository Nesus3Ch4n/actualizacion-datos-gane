package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "USUARIO")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_USUARIO")
    private Long id;
    
    // ========== INFORMACIÓN PERSONAL ==========
    @NotBlank(message = "El nombre es requerido")
    @Column(name = "NOMBRE", nullable = false)
    private String nombre;
    
    @NotNull(message = "La cédula es requerida")
    @Column(name = "DOCUMENTO", nullable = false, unique = true)
    private Long cedula;
    
    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es requerido")
    @Column(name = "CORREO", nullable = false, unique = true)
    private String correo;
    
    @Column(name = "NUMERO_FIJO")
    private String numeroFijo;
    
    @Column(name = "NUMERO_CELULAR")
    private String numeroCelular;
    
    @Column(name = "NUMERO_CORP")
    private String numeroCorp;
    
    @Column(name = "CEDULA_EXPEDICION")
    private String cedulaExpedicion;
    
    @Column(name = "PAIS_NACIMIENTO")
    private String paisNacimiento;
    
    @Column(name = "CIUDAD_NACIMIENTO")
    private String ciudadNacimiento;
    
    @Column(name = "CARGO")
    private String cargo;
    
    @Column(name = "AREA")
    private String area;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "FECHA_NACIMIENTO")
    private LocalDate fechaNacimiento;
    
    @Column(name = "ESTADO_CIVIL")
    private String estadoCivil;
    
    @Column(name = "TIPO_SANGRE")
    private String tipoSangre;
    
    // ========== METADATOS ==========
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @UpdateTimestamp
    @Column(name = "FECHA_ACTUALIZACION")
    private LocalDateTime fechaActualizacion;
    
    // ========== CONSTRUCTORES ==========
    public Usuario() {
        this.version = 1;
    }
    
    public Usuario(String nombre, Long cedula, String correo) {
        this();
        this.nombre = nombre;
        this.cedula = cedula;
        this.correo = correo;
    }
    
    // ========== GETTERS Y SETTERS ==========
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public Long getCedula() { return cedula; }
    public void setCedula(Long cedula) { this.cedula = cedula; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public String getNumeroFijo() { return numeroFijo; }
    public void setNumeroFijo(String numeroFijo) { this.numeroFijo = numeroFijo; }
    
    public String getNumeroCelular() { return numeroCelular; }
    public void setNumeroCelular(String numeroCelular) { this.numeroCelular = numeroCelular; }
    
    public String getNumeroCorp() { return numeroCorp; }
    public void setNumeroCorp(String numeroCorp) { this.numeroCorp = numeroCorp; }
    
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
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getEstadoCivil() { return estadoCivil; }
    public void setEstadoCivil(String estadoCivil) { this.estadoCivil = estadoCivil; }
    
    public String getTipoSangre() { return tipoSangre; }
    public void setTipoSangre(String tipoSangre) { this.tipoSangre = tipoSangre; }
    
    // ========== METADATOS ==========
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", cedula=" + cedula +
                ", correo='" + correo + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                ", cargo='" + cargo + '\'' +
                ", area='" + area + '\'' +
                ", version=" + version +
                '}';
    }
} 