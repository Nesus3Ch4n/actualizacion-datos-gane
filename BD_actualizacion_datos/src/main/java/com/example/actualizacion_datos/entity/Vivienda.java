package com.example.actualizacion_datos.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "VIVIENDA")
public class Vivienda {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_VIVIENDA")
    private Long idVivienda;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;
    
    @Column(name = "TIPO_VIVIENDA", length = 50)
    private String tipoVivienda;
    
    @Column(name = "DIRECCION", length = 200)
    private String direccion;
    
    @Column(name = "INFO_ADICIONAL", length = 500)
    private String infoAdicional;
    
    @Column(name = "BARRIO", length = 100)
    private String barrio;
    
    @Column(name = "CIUDAD", length = 100)
    private String ciudad;
    
    @Column(name = "VIVIENDA", length = 100)
    private String vivienda;
    
    @Column(name = "ENTIDAD", length = 100)
    private String entidad;
    
    @Column(name = "ANO")
    private Integer ano;
    
    @Column(name = "TIPO_ADQUISICION", length = 50)
    private String tipoAdquisicion;
    
    @Column(name = "VERSION")
    private Integer version = 1;
    
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion = LocalDateTime.now();
    
    // Constructores
    public Vivienda() {}
    
    public Vivienda(Usuario usuario, String tipoVivienda, String direccion) {
        this.usuario = usuario;
        this.tipoVivienda = tipoVivienda;
        this.direccion = direccion;
    }
    
    // Getters y Setters
    public Long getIdVivienda() { return idVivienda; }
    public void setIdVivienda(Long idVivienda) { this.idVivienda = idVivienda; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
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
    
    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }
    
    public String getTipoAdquisicion() { return tipoAdquisicion; }
    public void setTipoAdquisicion(String tipoAdquisicion) { this.tipoAdquisicion = tipoAdquisicion; }
    
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    @Override
    public String toString() {
        return "Vivienda{" +
                "idVivienda=" + idVivienda +
                ", tipoVivienda='" + tipoVivienda + '\'' +
                ", direccion='" + direccion + '\'' +
                ", ciudad='" + ciudad + '\'' +
                '}';
    }
} 