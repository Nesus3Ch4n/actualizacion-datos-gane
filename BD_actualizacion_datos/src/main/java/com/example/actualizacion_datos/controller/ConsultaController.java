package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.service.FormularioService;
import com.example.actualizacion_datos.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consulta")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Consulta", description = "API para consultar datos ya guardados en la base de datos")
public class ConsultaController {

    @Autowired
    private FormularioService formularioService;
    
    @Autowired
    private UsuarioService usuarioService;

    // ========== ENDPOINTS DE CONSULTA DE BASE DE DATOS ==========

    @GetMapping("/bd/usuarios")
    @Operation(summary = "Obtener todos los usuarios",
               description = "Recupera la lista de todos los usuarios registrados en la base de datos")
    public ResponseEntity<Map<String, Object>> obtenerTodosLosUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "usuarios", usuarios,
                "total", usuarios.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", "Error al obtener usuarios: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/bd/{cedula}/informacion-personal")
    @Operation(summary = "Obtener información personal desde base de datos",
               description = "Recupera los datos personales guardados definitivamente en la tabla USUARIO")
    public ResponseEntity<InformacionPersonal> obtenerInformacionPersonalBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        InformacionPersonal info = formularioService.obtenerInformacionPersonalBD(cedula);
        return info != null ? ResponseEntity.ok(info) : ResponseEntity.notFound().build();
    }

    @GetMapping("/bd/{cedula}/estudios")
    @Operation(summary = "Obtener estudios académicos desde base de datos",
               description = "Recupera la lista de estudios académicos activos del empleado")
    public ResponseEntity<List<EstudioAcademico>> obtenerEstudiosBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<EstudioAcademico> estudios = formularioService.obtenerEstudiosBD(cedula);
        return ResponseEntity.ok(estudios);
    }

    @GetMapping("/bd/{cedula}/vehiculos")
    @Operation(summary = "Obtener vehículos desde base de datos",
               description = "Recupera la lista de vehículos activos del empleado")
    public ResponseEntity<List<Vehiculo>> obtenerVehiculosBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<Vehiculo> vehiculos = formularioService.obtenerVehiculosBD(cedula);
        return ResponseEntity.ok(vehiculos);
    }

    @GetMapping("/bd/{cedula}/vivienda")
    @Operation(summary = "Obtener información de vivienda desde base de datos",
               description = "Recupera los datos de vivienda activos del empleado")
    public ResponseEntity<Vivienda> obtenerViviendaBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        Vivienda vivienda = formularioService.obtenerViviendaBD(cedula);
        return vivienda != null ? ResponseEntity.ok(vivienda) : ResponseEntity.notFound().build();
    }

    @GetMapping("/bd/{cedula}/personas-cargo")
    @Operation(summary = "Obtener personas a cargo desde base de datos",
               description = "Recupera la lista de personas a cargo activas del empleado")
    public ResponseEntity<List<PersonaACargo>> obtenerPersonasACargoBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<PersonaACargo> personas = formularioService.obtenerPersonasACargoBD(cedula);
        return ResponseEntity.ok(personas);
    }

    @GetMapping("/bd/{cedula}/contactos-emergencia")
    @Operation(summary = "Obtener contactos de emergencia desde base de datos",
               description = "Recupera la lista de contactos de emergencia activos del empleado")
    public ResponseEntity<List<ContactoEmergencia>> obtenerContactosEmergenciaBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<ContactoEmergencia> contactos = formularioService.obtenerContactosEmergenciaBD(cedula);
        return ResponseEntity.ok(contactos);
    }

    @GetMapping("/bd/{cedula}/completo")
    @Operation(summary = "Obtener datos completos del empleado desde base de datos",
               description = "Recupera todos los datos guardados del empleado en un solo objeto")
    public ResponseEntity<Map<String, Object>> obtenerDatosCompletosBD(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        
        Map<String, Object> datosCompletos = new HashMap<>();
        datosCompletos.put("cedula", cedula);
        
        // Obtener información personal (tabla USUARIO)
        InformacionPersonal info = formularioService.obtenerInformacionPersonalBD(cedula);
        datosCompletos.put("informacionPersonal", info);
        
        // Obtener estudios académicos
        List<EstudioAcademico> estudios = formularioService.obtenerEstudiosBD(cedula);
        datosCompletos.put("estudios", estudios);
        
        // Obtener vehículos
        List<Vehiculo> vehiculos = formularioService.obtenerVehiculosBD(cedula);
        datosCompletos.put("vehiculos", vehiculos);
        
        // Obtener vivienda
        Vivienda vivienda = formularioService.obtenerViviendaBD(cedula);
        datosCompletos.put("vivienda", vivienda);
        
        // Obtener personas a cargo
        List<PersonaACargo> personas = formularioService.obtenerPersonasACargoBD(cedula);
        datosCompletos.put("personasACargo", personas);
        
        // Obtener contactos de emergencia
        List<ContactoEmergencia> contactos = formularioService.obtenerContactosEmergenciaBD(cedula);
        datosCompletos.put("contactosEmergencia", contactos);
        
        // Verificar si hay al menos información personal
        if (info == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(datosCompletos);
    }

    // ========== ENDPOINT DE VERIFICACIÓN ==========

    @GetMapping("/existe/{cedula}")
    @Operation(summary = "Verificar si existe información del empleado",
               description = "Verifica si existe información del empleado en la tabla USUARIO")
    public ResponseEntity<Map<String, Object>> verificarExistencia(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        
        InformacionPersonal info = formularioService.obtenerInformacionPersonalBD(cedula);
        
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("cedula", cedula);
        respuesta.put("existe", info != null);
        
        if (info != null) {
            respuesta.put("nombre", info.getNombre());
            respuesta.put("correo", info.getCorreo());
            respuesta.put("version", info.getVersion());
        }
        
        return ResponseEntity.ok(respuesta);
    }
} 