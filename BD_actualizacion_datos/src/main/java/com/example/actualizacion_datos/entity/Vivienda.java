package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "VIVIENDA")
public class Vivienda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_VIVIENDA")
    private Long idVivienda;
    
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;
    
    @Column(name = "TIPO_VIVIENDA")
    private String tipoVivienda;
    
    @Column(name = "DIRECCION")
    private String direccion;
    
    @Column(name = "INFO_ADICIONAL")
    private String infoAdicional;
    
    @Column(name = "BARRIO")
    private String barrio;
    
    @Column(name = "CIUDAD")
    private String ciudad;
    
    @Column(name = "VIVIENDA")
    private String vivienda;
    
    @Column(name = "ENTIDAD")
    private String entidad;
    
    @Column(name = "ANIO")
    private Integer anio;
    
    @Column(name = "TIPO_ADQUISICION")
    private String tipoAdquisicion;
    
    // Constructores
    public Vivienda() {}
    
    public Vivienda(Long idUsuario, String tipoVivienda, String direccion, String ciudad) {
        this.idUsuario = idUsuario;
        this.tipoVivienda = tipoVivienda;
        this.direccion = direccion;
        this.ciudad = ciudad;
    }
    
    // Getters y Setters
    public Long getIdVivienda() { return idVivienda; }
    public void setIdVivienda(Long idVivienda) { this.idVivienda = idVivienda; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getTipoVivienda() { return tipoVivienda; }
    public void setTipoVivienda(String tipoVivienda) { this.tipoVivienda = tipoVivienda; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getInfoAdicional() { return infoAdicional; }
    public void setInfoAdicional(String infoAdicional) { this.infoAdicional = infoAdicional; }
    
    public String getBarrio() { return barrio; }
    public void setBarrio(String barrio) { this.barrio = barrio; }
    
    public String getCiudad() { return ciudad; }
    public void setCiudad(String ciudad) { this.ciudad = ciudad; }
    
    public String getVivienda() { return vivienda; }
    public void setVivienda(String vivienda) { this.vivienda = vivienda; }
    
    public String getEntidad() { return entidad; }
    public void setEntidad(String entidad) { this.entidad = entidad; }
    
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    
    public String getTipoAdquisicion() { return tipoAdquisicion; }
    public void setTipoAdquisicion(String tipoAdquisicion) { this.tipoAdquisicion = tipoAdquisicion; }
    
    @Override
    public String toString() {
        return "Vivienda{" +
                "idVivienda=" + idVivienda +
                ", idUsuario=" + idUsuario +
                ", tipoVivienda='" + tipoVivienda + '\'' +
                ", direccion='" + direccion + '\'' +
                ", ciudad='" + ciudad + '\'' +
                ", barrio='" + barrio + '\'' +
                ", vivienda='" + vivienda + '\'' +
                ", entidad='" + entidad + '\'' +
                ", anio=" + anio +
                ", tipoAdquisicion='" + tipoAdquisicion + '\'' +
                '}';
    }
} 