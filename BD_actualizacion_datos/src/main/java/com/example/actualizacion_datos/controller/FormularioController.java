package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.dto.*;
import com.example.actualizacion_datos.service.FormularioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/formulario")
@Tag(name = "Formulario Controller", description = "API para el manejo del formulario de actualización de datos paso a paso")
@CrossOrigin(origins = "http://localhost:4200")
public class FormularioController {

    @Autowired
    private FormularioService formularioService;

    // ========== ENDPOINTS DE GUARDADO TEMPORAL ==========

    @PostMapping("/paso1/informacion-personal")
    @Operation(summary = "Guardar información personal temporalmente",
               description = "Guarda los datos personales del empleado en memoria temporal")
    public ResponseEntity<Map<String, String>> guardarInformacionPersonal(
            @Valid @RequestBody InformacionPersonalDTO informacionPersonal) {
        
        try {
            formularioService.guardarInformacionPersonalTemporal(informacionPersonal);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Información personal guardada temporalmente");
            response.put("cedula", String.valueOf(informacionPersonal.getCedula()));
            response.put("paso", "1");
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar información personal: " + e.getMessage());
            error.put("cedula", String.valueOf(informacionPersonal.getCedula()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/paso2/estudios/{cedula}")
    @Operation(summary = "Guardar estudios académicos temporalmente",
               description = "Guarda la lista de estudios académicos del empleado en memoria temporal")
    public ResponseEntity<Map<String, String>> guardarEstudios(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula,
            @Valid @RequestBody List<EstudioAcademicoDTO> estudios) {
        
        try {
            formularioService.guardarEstudiosTemporal(cedula, estudios);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Estudios guardados temporalmente");
            response.put("cedula", cedula.toString());
            response.put("paso", "2");
            response.put("cantidad", String.valueOf(estudios.size()));
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar estudios: " + e.getMessage());
            error.put("cedula", cedula.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/paso3/vehiculos/{cedula}")
    @Operation(summary = "Guardar vehículos temporalmente",
               description = "Guarda la lista de vehículos del empleado en memoria temporal")
    public ResponseEntity<Map<String, String>> guardarVehiculos(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula,
            @Valid @RequestBody List<VehiculoDTO> vehiculos) {
        
        try {
            formularioService.guardarVehiculosTemporal(cedula, vehiculos);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Vehículos guardados temporalmente");
            response.put("cedula", cedula.toString());
            response.put("paso", "3");
            response.put("cantidad", String.valueOf(vehiculos.size()));
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar vehículos: " + e.getMessage());
            error.put("cedula", cedula.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/paso4/vivienda/{cedula}")
    @Operation(summary = "Guardar información de vivienda temporalmente",
               description = "Guarda los datos de vivienda del empleado en memoria temporal")
    public ResponseEntity<Map<String, String>> guardarVivienda(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula,
            @Valid @RequestBody ViviendaDTO vivienda) {
        
        try {
            formularioService.guardarViviendaTemporal(cedula, vivienda);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Información de vivienda guardada temporalmente");
            response.put("cedula", cedula.toString());
            response.put("paso", "4");
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar vivienda: " + e.getMessage());
            error.put("cedula", cedula.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/paso5/personas-cargo/{cedula}")
    @Operation(summary = "Guardar personas a cargo temporalmente",
               description = "Guarda la lista de personas a cargo del empleado en memoria temporal")
    public ResponseEntity<Map<String, String>> guardarPersonasACargo(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula,
            @Valid @RequestBody List<PersonaACargoDTO> personasACargo) {
        
        try {
            formularioService.guardarPersonasACargoTemporal(cedula, personasACargo);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Personas a cargo guardadas temporalmente");
            response.put("cedula", cedula.toString());
            response.put("paso", "5");
            response.put("cantidad", String.valueOf(personasACargo.size()));
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar personas a cargo: " + e.getMessage());
            error.put("cedula", cedula.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/paso6/contactos-emergencia/{cedula}")
    @Operation(summary = "Guardar contactos de emergencia temporalmente",
               description = "Guarda la lista de contactos de emergencia del empleado en memoria temporal")
    public ResponseEntity<Map<String, String>> guardarContactosEmergencia(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula,
            @Valid @RequestBody List<ContactoEmergenciaDTO> contactosEmergencia) {
        
        try {
            formularioService.guardarContactosEmergenciaTemporal(cedula, contactosEmergencia);
            
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Contactos de emergencia guardados temporalmente");
            response.put("cedula", cedula.toString());
            response.put("paso", "6");
            response.put("cantidad", String.valueOf(contactosEmergencia.size()));
            response.put("timestamp", String.valueOf(System.currentTimeMillis()));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar contactos de emergencia: " + e.getMessage());
            error.put("cedula", cedula.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== ENDPOINTS DE CONSULTA TEMPORAL ==========

    @GetMapping("/temporal/{cedula}/informacion-personal")
    @Operation(summary = "Obtener información personal temporal",
               description = "Recupera los datos personales guardados temporalmente")
    public ResponseEntity<InformacionPersonalDTO> obtenerInformacionPersonalTemporal(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        InformacionPersonalDTO info = formularioService.obtenerInformacionPersonalTemporal(cedula);
        return info != null ? ResponseEntity.ok(info) : ResponseEntity.notFound().build();
    }

    @GetMapping("/temporal/{cedula}/estudios")
    @Operation(summary = "Obtener estudios académicos temporales",
               description = "Recupera la lista de estudios guardados temporalmente")
    public ResponseEntity<List<EstudioAcademicoDTO>> obtenerEstudiosTemporal(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<EstudioAcademicoDTO> estudios = formularioService.obtenerEstudiosTemporal(cedula);
        return ResponseEntity.ok(estudios);
    }

    @GetMapping("/temporal/{cedula}/vehiculos")
    @Operation(summary = "Obtener vehículos temporales",
               description = "Recupera la lista de vehículos guardados temporalmente")
    public ResponseEntity<List<VehiculoDTO>> obtenerVehiculosTemporal(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<VehiculoDTO> vehiculos = formularioService.obtenerVehiculosTemporal(cedula);
        return ResponseEntity.ok(vehiculos);
    }

    @GetMapping("/temporal/{cedula}/vivienda")
    @Operation(summary = "Obtener información de vivienda temporal",
               description = "Recupera los datos de vivienda guardados temporalmente")
    public ResponseEntity<ViviendaDTO> obtenerViviendaTemporal(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        ViviendaDTO vivienda = formularioService.obtenerViviendaTemporal(cedula);
        return vivienda != null ? ResponseEntity.ok(vivienda) : ResponseEntity.notFound().build();
    }

    @GetMapping("/temporal/{cedula}/personas-cargo")
    @Operation(summary = "Obtener personas a cargo temporales",
               description = "Recupera la lista de personas a cargo guardadas temporalmente")
    public ResponseEntity<List<PersonaACargoDTO>> obtenerPersonasACargoTemporal(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<PersonaACargoDTO> personas = formularioService.obtenerPersonasACargoTemporal(cedula);
        return ResponseEntity.ok(personas);
    }

    @GetMapping("/temporal/{cedula}/contactos-emergencia")
    @Operation(summary = "Obtener contactos de emergencia temporales",
               description = "Recupera la lista de contactos de emergencia guardados temporalmente")
    public ResponseEntity<List<ContactoEmergenciaDTO>> obtenerContactosEmergenciaTemporal(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        List<ContactoEmergenciaDTO> contactos = formularioService.obtenerContactosEmergenciaTemporal(cedula);
        return ResponseEntity.ok(contactos);
    }

    // ========== ENDPOINT DE GUARDADO DEFINITIVO ==========

    @PostMapping("/guardar-definitivo/{cedula}")
    @Operation(summary = "Guardar formulario completo en base de datos",
               description = "Guarda todos los datos temporales definitivamente en la base de datos SQLite y limpia la memoria temporal")
    public ResponseEntity<Map<String, Object>> guardarFormularioDefinitivo(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        
        try {
            // Verificar que exista información personal temporal
            if (!formularioService.tieneInformacionPersonalTemporal(cedula)) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "No se encontró información personal temporal para la cédula: " + cedula);
                error.put("cedula", cedula);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Guardar todo en la base de datos
            formularioService.guardarFormularioCompleto(cedula);
            
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Formulario guardado exitosamente en la base de datos");
            response.put("cedula", cedula);
            response.put("timestamp", System.currentTimeMillis());
            response.put("estado", "guardado_definitivo");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al guardar definitivamente: " + e.getMessage());
            error.put("cedula", cedula);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // ========== ENDPOINTS DE UTILIDAD ==========

    @GetMapping("/estado/{cedula}")
    @Operation(summary = "Obtener estado del formulario temporal",
               description = "Verifica qué pasos del formulario están completados temporalmente")
    public ResponseEntity<Map<String, Object>> obtenerEstadoFormulario(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        
        Map<String, Object> estado = new HashMap<>();
        estado.put("cedula", cedula);
        estado.put("informacionPersonal", formularioService.tieneInformacionPersonalTemporal(cedula));
        estado.put("estudios", !formularioService.obtenerEstudiosTemporal(cedula).isEmpty());
        estado.put("vehiculos", !formularioService.obtenerVehiculosTemporal(cedula).isEmpty());
        estado.put("vivienda", formularioService.obtenerViviendaTemporal(cedula) != null);
        estado.put("personasACargo", !formularioService.obtenerPersonasACargoTemporal(cedula).isEmpty());
        estado.put("contactosEmergencia", !formularioService.obtenerContactosEmergenciaTemporal(cedula).isEmpty());
        estado.put("formularioCompleto", formularioService.formularioCompletoTemporal(cedula));
        
        return ResponseEntity.ok(estado);
    }

    @DeleteMapping("/limpiar/{cedula}")
    @Operation(summary = "Limpiar datos temporales",
               description = "Elimina todos los datos temporales de un empleado de la memoria")
    public ResponseEntity<Map<String, String>> limpiarDatosTemporales(
            @Parameter(description = "Cédula del empleado") @PathVariable Long cedula) {
        
        formularioService.limpiarDatosTemporales(cedula);
        
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Datos temporales eliminados");
        response.put("cedula", cedula.toString());
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        
        return ResponseEntity.ok(response);
    }

    // ========== ENDPOINTS DE GUARDADO DIRECTO EN BASE DE DATOS ==========

    @PostMapping("/informacion-personal/guardar")
    @Operation(summary = "Guardar información personal directamente en BD",
               description = "Guarda la información personal directamente en la base de datos")
    public ResponseEntity<Map<String, Object>> guardarInformacionPersonalDirecto(
            @Valid @RequestBody Map<String, Object> informacionPersonal) {
        
        try {
            Map<String, Object> usuario = formularioService.guardarInformacionPersonalDirecto(informacionPersonal);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Información personal guardada exitosamente en base de datos");
            response.put("data", usuario);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar información personal: " + e.getMessage());
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/vehiculo/guardar")
    @Operation(summary = "Guardar vehículos directamente en BD",
               description = "Guarda los vehículos directamente en la base de datos")
    public ResponseEntity<Map<String, Object>> guardarVehiculosDirecto(
            @RequestParam Long idUsuario,
            @Valid @RequestBody List<Map<String, Object>> vehiculos) {
        
        try {
            List<Map<String, Object>> vehiculosGuardados = formularioService.guardarVehiculosDirecto(idUsuario, vehiculos);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vehículos guardados exitosamente");
            response.put("data", vehiculosGuardados);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al guardar vehículos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/vivienda/guardar")
    @Operation(summary = "Guardar vivienda directamente en BD",
               description = "Guarda la vivienda directamente en la base de datos")
    public ResponseEntity<Map<String, Object>> guardarViviendaDirecto(
            @RequestParam Long idUsuario,
            @Valid @RequestBody Map<String, Object> vivienda) {
        
        try {
            Map<String, Object> viviendaGuardada = formularioService.guardarViviendaDirecto(idUsuario, vivienda);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Vivienda guardada exitosamente");
            response.put("data", viviendaGuardada);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al guardar vivienda: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/academico/guardar")
    @Operation(summary = "Guardar estudios académicos directamente en BD",
               description = "Guarda los estudios académicos directamente en la base de datos")
    public ResponseEntity<Map<String, Object>> guardarEstudiosDirecto(
            @RequestParam Long idUsuario,
            @Valid @RequestBody List<Map<String, Object>> estudios) {
        
        try {
            List<Map<String, Object>> estudiosGuardados = formularioService.guardarEstudiosDirecto(idUsuario, estudios);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudios académicos guardados exitosamente");
            response.put("data", estudiosGuardados);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al guardar estudios: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/personas-acargo/guardar")
    @Operation(summary = "Guardar personas a cargo directamente en BD",
               description = "Guarda las personas a cargo directamente en la base de datos")
    public ResponseEntity<Map<String, Object>> guardarPersonasCargoDirecto(
            @RequestParam Long idUsuario,
            @Valid @RequestBody List<Map<String, Object>> personas) {
        
        try {
            List<Map<String, Object>> personasGuardadas = formularioService.guardarPersonasCargoDirecto(idUsuario, personas);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Personas a cargo guardadas exitosamente");
            response.put("data", personasGuardadas);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al guardar personas a cargo: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/contacto-emergencia/guardar")
    @Operation(summary = "Guardar contactos de emergencia directamente en BD",
               description = "Guarda los contactos de emergencia directamente en la base de datos")
    public ResponseEntity<Map<String, Object>> guardarContactosEmergenciaDirecto(
            @RequestParam Long idUsuario,
            @Valid @RequestBody List<Map<String, Object>> contactos) {
        
        try {
            List<Map<String, Object>> contactosGuardados = formularioService.guardarContactosEmergenciaDirecto(idUsuario, contactos);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contactos de emergencia guardados exitosamente");
            response.put("data", contactosGuardados);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al guardar contactos de emergencia: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    // ========== ENDPOINTS DE CONSULTA ==========

    @GetMapping("/vehiculo/obtener")
    @Operation(summary = "Obtener vehículos por ID de usuario",
               description = "Obtiene los vehículos de un usuario por ID")
    public ResponseEntity<Map<String, Object>> obtenerVehiculosDirecto(@RequestParam Long idUsuario) {
        try {
            List<Map<String, Object>> vehiculos = formularioService.obtenerVehiculosDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vehiculos);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener vehículos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/vivienda/obtener")
    @Operation(summary = "Obtener vivienda por ID de usuario",
               description = "Obtiene la vivienda de un usuario por ID")
    public ResponseEntity<Map<String, Object>> obtenerViviendaDirecto(@RequestParam Long idUsuario) {
        try {
            Map<String, Object> vivienda = formularioService.obtenerViviendaDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", vivienda);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener vivienda: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/academico/obtener")
    @Operation(summary = "Obtener estudios académicos por ID de usuario",
               description = "Obtiene los estudios académicos de un usuario por ID")
    public ResponseEntity<Map<String, Object>> obtenerEstudiosDirecto(@RequestParam Long idUsuario) {
        try {
            List<Map<String, Object>> estudios = formularioService.obtenerEstudiosDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", estudios);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener estudios: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/personas-acargo/obtener")
    @Operation(summary = "Obtener personas a cargo por ID de usuario",
               description = "Obtiene las personas a cargo de un usuario por ID")
    public ResponseEntity<Map<String, Object>> obtenerPersonasCargoDirecto(@RequestParam Long idUsuario) {
        try {
            List<Map<String, Object>> personas = formularioService.obtenerPersonasCargoDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", personas);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener personas a cargo: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/contacto-emergencia/obtener")
    @Operation(summary = "Obtener contactos de emergencia por ID de usuario",
               description = "Obtiene los contactos de emergencia de un usuario por ID")
    public ResponseEntity<Map<String, Object>> obtenerContactosEmergenciaDirecto(@RequestParam Long idUsuario) {
        try {
            List<Map<String, Object>> contactos = formularioService.obtenerContactosEmergenciaDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", contactos);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error al obtener contactos de emergencia: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
} 