package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "USUARIO")
public class InformacionPersonal {
    
    @Id
    @Column(name = "ID_USUARIO")
    private Long id;
    
    @NotBlank(message = "El nombre es requerido")
    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;
    
    @NotNull(message = "La cédula es requerida")
    @Column(name = "DOCUMENTO", nullable = false, unique = true)
    private Long cedula;
    
    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es requerido")
    @Column(name = "CORREO", nullable = false, unique = true, length = 50)
    private String correo;
    
    @Column(name = "NUMERO_FIJO")
    private Long numeroFijo;
    
    @Column(name = "NUMERO_CELULAR")
    private Long numeroCelular;
    
    @Column(name = "NUMERO_CORP")
    private Long numeroCorp;
    
    @Column(name = "CEDULA_EXPEDICION", length = 100)
    private String cedulaExpedicion;
    
    @Column(name = "PAIS_NACIMIENTO", length = 100)
    private String paisNacimiento;
    
    @Column(name = "CIUDAD_NACIMIENTO", length = 100)
    private String ciudadNacimiento;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "FECHA_NACIMIENTO")
    private LocalDate fechaNacimiento;
    
    @Column(name = "ESTADO_CIVIL", length = 50)
    private String estadoCivil;
    
    @Column(name = "TIPO_SANGRE", length = 3)
    private String tipoSangre;
    
    @Column(name = "CARGO", length = 100)
    private String cargo;
    
    @Column(name = "AREA", length = 100)
    private String area;
    
    @Column(name = "VERSION")
    private Long version;
    
    // Constructores
    public InformacionPersonal() {}
    
    public InformacionPersonal(String nombre, Long cedula, String correo) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.correo = correo;
    }
    
    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public Long getCedula() { return cedula; }
    public void setCedula(Long cedula) { this.cedula = cedula; }
    
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    
    public Long getNumeroFijo() { return numeroFijo; }
    public void setNumeroFijo(Long numeroFijo) { this.numeroFijo = numeroFijo; }
    
    public Long getNumeroCelular() { return numeroCelular; }
    public void setNumeroCelular(Long numeroCelular) { this.numeroCelular = numeroCelular; }
    
    public Long getNumeroCorp() { return numeroCorp; }
    public void setNumeroCorp(Long numeroCorp) { this.numeroCorp = numeroCorp; }
    
    public String getCedulaExpedicion() { return cedulaExpedicion; }
    public void setCedulaExpedicion(String cedulaExpedicion) { this.cedulaExpedicion = cedulaExpedicion; }
    
    public String getPaisNacimiento() { return paisNacimiento; }
    public void setPaisNacimiento(String paisNacimiento) { this.paisNacimiento = paisNacimiento; }
    
    public String getCiudadNacimiento() { return ciudadNacimiento; }
    public void setCiudadNacimiento(String ciudadNacimiento) { this.ciudadNacimiento = ciudadNacimiento; }
    
    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    
    public String getEstadoCivil() { return estadoCivil; }
    public void setEstadoCivil(String estadoCivil) { this.estadoCivil = estadoCivil; }
    
    public String getTipoSangre() { return tipoSangre; }
    public void setTipoSangre(String tipoSangre) { this.tipoSangre = tipoSangre; }
    
    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
    
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    
    @Override
    public String toString() {
        return "InformacionPersonal{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", cedula=" + cedula +
                ", correo='" + correo + '\'' +
                ", version=" + version +
                '}';
    }
} 