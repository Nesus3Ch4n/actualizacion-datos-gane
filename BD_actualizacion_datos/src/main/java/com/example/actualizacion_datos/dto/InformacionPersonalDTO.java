package com.example.actualizacion_datos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class InformacionPersonalDTO {
    
    @NotBlank(message = "El nombre es requerido")
    private String nombre;
    
    @NotNull(message = "La cédula es requerida")
    private Long cedula;
    
    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es requerido")
    private String correo;
    
    private Long numeroFijo;
    private Long numeroCelular;
    private Long numeroCorp;
    private String cedulaExpedicion;
    private String paisNacimiento;
    private String ciudadNacimiento;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaNacimiento;
    
    private String estadoCivil;
    private String tipoSangre;
    private String cargo;
    private String area;
    private Long version;
    
    // Constructores
    public InformacionPersonalDTO() {}
    
    // Getters y Setters
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
} 