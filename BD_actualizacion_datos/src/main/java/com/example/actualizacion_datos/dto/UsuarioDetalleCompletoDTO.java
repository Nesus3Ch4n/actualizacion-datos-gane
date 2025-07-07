package com.example.actualizacion_datos.dto;

import com.example.actualizacion_datos.entity.ContactoEmergencia;
import com.example.actualizacion_datos.entity.EstudioAcademico;
import com.example.actualizacion_datos.entity.PersonaACargo;
import com.example.actualizacion_datos.entity.RelacionConf;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.entity.Vehiculo;
import com.example.actualizacion_datos.entity.Vivienda;

import java.util.List;

public class UsuarioDetalleCompletoDTO {
    private Usuario usuario;
    private List<ContactoEmergencia> contactosEmergencia;
    private List<EstudioAcademico> estudiosAcademicos;
    private List<PersonaACargo> personasACargo;
    private List<RelacionConf> relacionesConflicto;
    private List<Vehiculo> vehiculos;
    private Vivienda vivienda;

    // Constructor vacío
    public UsuarioDetalleCompletoDTO() {}

    // Constructor con todos los campos
    public UsuarioDetalleCompletoDTO(Usuario usuario, List<ContactoEmergencia> contactosEmergencia,
                                   List<EstudioAcademico> estudiosAcademicos, List<PersonaACargo> personasACargo,
                                   List<RelacionConf> relacionesConflicto, List<Vehiculo> vehiculos, Vivienda vivienda) {
        this.usuario = usuario;
        this.contactosEmergencia = contactosEmergencia;
        this.estudiosAcademicos = estudiosAcademicos;
        this.personasACargo = personasACargo;
        this.relacionesConflicto = relacionesConflicto;
        this.vehiculos = vehiculos;
        this.vivienda = vivienda;
    }

    // Getters y Setters
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public List<ContactoEmergencia> getContactosEmergencia() {
        return contactosEmergencia;
    }

    public void setContactosEmergencia(List<ContactoEmergencia> contactosEmergencia) {
        this.contactosEmergencia = contactosEmergencia;
    }

    public List<EstudioAcademico> getEstudiosAcademicos() {
        return estudiosAcademicos;
    }

    public void setEstudiosAcademicos(List<EstudioAcademico> estudiosAcademicos) {
        this.estudiosAcademicos = estudiosAcademicos;
    }

    public List<PersonaACargo> getPersonasACargo() {
        return personasACargo;
    }

    public void setPersonasACargo(List<PersonaACargo> personasACargo) {
        this.personasACargo = personasACargo;
    }

    public List<RelacionConf> getRelacionesConflicto() {
        return relacionesConflicto;
    }

    public void setRelacionesConflicto(List<RelacionConf> relacionesConflicto) {
        this.relacionesConflicto = relacionesConflicto;
    }

    public List<Vehiculo> getVehiculos() {
        return vehiculos;
    }

    public void setVehiculos(List<Vehiculo> vehiculos) {
        this.vehiculos = vehiculos;
    }

    public Vivienda getVivienda() {
        return vivienda;
    }

    public void setVivienda(Vivienda vivienda) {
        this.vivienda = vivienda;
    }
} 