package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.service.FormularioService;
import com.example.actualizacion_datos.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/consulta")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ConsultaController {
    
    private static final Logger logger = LoggerFactory.getLogger(ConsultaController.class);
    
    @Autowired
    private FormularioService formularioService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    // ========== CONSULTAR INFORMACIÓN PERSONAL ==========
    @GetMapping("/informacion-personal/{cedula}")
    public ResponseEntity<?> consultarInformacionPersonal(@PathVariable Long cedula) {
        logger.info("🔍 Consultando información personal para cédula: {}", cedula);
        
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorCedula(cedula);
            
            if (usuario.isPresent()) {
                logger.info("✅ Información personal encontrada para cédula: {}", cedula);
                return ResponseEntity.ok(usuario.get());
            } else {
                logger.warn("⚠️ No se encontró información personal para cédula: {}", cedula);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar información personal: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar información personal: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR ESTUDIOS ACADÉMICOS ==========
    @GetMapping("/estudios-academicos/{cedula}")
    public ResponseEntity<?> consultarEstudiosAcademicos(@PathVariable Long cedula) {
        logger.info("🔍 Consultando estudios académicos para cédula: {}", cedula);
        
        try {
            List<EstudioAcademico> estudios = formularioService.obtenerEstudiosAcademicos(cedula);
            
            if (!estudios.isEmpty()) {
                logger.info("✅ Estudios académicos encontrados para cédula: {}", cedula);
                return ResponseEntity.ok(estudios);
            } else {
                logger.warn("⚠️ No se encontraron estudios académicos para cédula: {}", cedula);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar estudios académicos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar estudios académicos: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR VEHÍCULOS ==========
    @GetMapping("/vehiculos/{cedula}")
    public ResponseEntity<?> consultarVehiculos(@PathVariable Long cedula) {
        logger.info("🔍 Consultando vehículos para cédula: {}", cedula);
        
        try {
            List<Vehiculo> vehiculos = formularioService.obtenerVehiculos(cedula);
            
            if (!vehiculos.isEmpty()) {
                logger.info("✅ Vehículos encontrados para cédula: {}", cedula);
                return ResponseEntity.ok(vehiculos);
            } else {
                logger.warn("⚠️ No se encontraron vehículos para cédula: {}", cedula);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar vehículos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar vehículos: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR VIVIENDAS ==========
    @GetMapping("/viviendas/{cedula}")
    public ResponseEntity<?> consultarViviendas(@PathVariable Long cedula) {
        logger.info("🔍 Consultando viviendas para cédula: {}", cedula);
        
        try {
            List<Vivienda> viviendas = formularioService.obtenerViviendas(cedula);
            
            if (!viviendas.isEmpty()) {
                logger.info("✅ Viviendas encontradas para cédula: {}", cedula);
                return ResponseEntity.ok(viviendas);
            } else {
                logger.warn("⚠️ No se encontraron viviendas para cédula: {}", cedula);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar viviendas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar viviendas: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR VIVIENDAS POR ID USUARIO ==========
    @GetMapping("/viviendas-id/{idUsuario}")
    public ResponseEntity<?> consultarViviendasPorId(@PathVariable Long idUsuario) {
        logger.info("🔍 Consultando viviendas para usuario ID: {}", idUsuario);
        
        try {
            List<Vivienda> viviendas = formularioService.obtenerViviendas(idUsuario);
            
            if (!viviendas.isEmpty()) {
                logger.info("✅ Viviendas encontradas para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(viviendas);
            } else {
                logger.warn("⚠️ No se encontraron viviendas para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar viviendas por ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar viviendas por ID: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR PERSONAS A CARGO ==========
    @GetMapping("/personas-acargo/{cedula}")
    public ResponseEntity<?> consultarPersonasACargo(@PathVariable Long cedula) {
        logger.info("🔍 Consultando personas a cargo para cédula: {}", cedula);
        
        try {
            List<PersonaACargo> personas = formularioService.obtenerPersonasACargo(cedula);
            
            if (!personas.isEmpty()) {
                logger.info("✅ Personas a cargo encontradas para cédula: {}", cedula);
                return ResponseEntity.ok(personas);
            } else {
                logger.warn("⚠️ No se encontraron personas a cargo para cédula: {}", cedula);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar personas a cargo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar personas a cargo: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR PERSONAS A CARGO POR ID USUARIO ==========
    @GetMapping("/personas-acargo-id/{idUsuario}")
    public ResponseEntity<?> consultarPersonasACargoPorId(@PathVariable Long idUsuario) {
        logger.info("🔍 Consultando personas a cargo para usuario ID: {}", idUsuario);
        
        try {
            List<PersonaACargo> personas = formularioService.obtenerPersonasACargo(idUsuario);
            
            if (!personas.isEmpty()) {
                logger.info("✅ Personas a cargo encontradas para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(personas);
            } else {
                logger.warn("⚠️ No se encontraron personas a cargo para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar personas a cargo por ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar personas a cargo por ID: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR CONTACTOS DE EMERGENCIA ==========
    @GetMapping("/contactos-emergencia/{cedula}")
    public ResponseEntity<?> consultarContactosEmergencia(@PathVariable Long cedula) {
        logger.info("🔍 Consultando contactos de emergencia para cédula: {}", cedula);
        
        try {
            List<ContactoEmergencia> contactos = formularioService.obtenerContactosEmergencia(cedula);
            
            if (!contactos.isEmpty()) {
                logger.info("✅ Contactos de emergencia encontrados para cédula: {}", cedula);
                return ResponseEntity.ok(contactos);
            } else {
                logger.warn("⚠️ No se encontraron contactos de emergencia para cédula: {}", cedula);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar contactos de emergencia: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar contactos de emergencia: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR CONTACTOS DE EMERGENCIA POR ID USUARIO ==========
    @GetMapping("/contactos-emergencia-id/{idUsuario}")
    public ResponseEntity<?> consultarContactosEmergenciaPorId(@PathVariable Long idUsuario) {
        logger.info("🔍 Consultando contactos de emergencia para usuario ID: {}", idUsuario);
        
        try {
            List<ContactoEmergencia> contactos = formularioService.obtenerContactosEmergencia(idUsuario);
            
            if (!contactos.isEmpty()) {
                logger.info("✅ Contactos de emergencia encontrados para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(contactos);
            } else {
                logger.warn("⚠️ No se encontraron contactos de emergencia para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar contactos de emergencia por ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar contactos de emergencia por ID: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR DECLARACIONES DE CONFLICTO POR ID USUARIO ==========
    @GetMapping("/relaciones-conflicto-id/{idUsuario}")
    public ResponseEntity<?> consultarRelacionesConflictoPorId(@PathVariable Long idUsuario) {
        logger.info("🔍 Consultando declaraciones de conflicto para usuario ID: {}", idUsuario);
        
        try {
            List<RelacionConf> relaciones = formularioService.obtenerRelacionesConflicto(idUsuario);
            
            if (!relaciones.isEmpty()) {
                logger.info("✅ Declaraciones de conflicto encontradas para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(relaciones);
            } else {
                logger.warn("⚠️ No se encontraron declaraciones de conflicto para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(List.of());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar declaraciones de conflicto por ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al consultar declaraciones de conflicto por ID: " + e.getMessage());
        }
    }
    
    // ========== VERIFICAR SI USUARIO EXISTE ==========
    @GetMapping("/verificar-usuario/{cedula}")
    public ResponseEntity<?> verificarUsuario(@PathVariable Long cedula) {
        logger.info("🔍 Verificando si existe usuario con cédula: {}", cedula);
        
        try {
            Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorCedula(cedula);
            
            if (usuario.isPresent()) {
                logger.info("✅ Usuario encontrado para cédula: {}", cedula);
                return ResponseEntity.ok(Map.of(
                    "existe", true,
                    "cedula", cedula,
                    "nombre", usuario.get().getNombre(),
                    "correo", usuario.get().getCorreo()
                ));
            } else {
                logger.warn("⚠️ Usuario no encontrado para cédula: {}", cedula);
                return ResponseEntity.ok(Map.of(
                    "existe", false,
                    "cedula", cedula,
                    "mensaje", "Usuario no encontrado"
                ));
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al verificar usuario: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("Error al verificar usuario: " + e.getMessage());
        }
    }
    
    // ========== CONSULTAR DATOS COMPLETOS ==========
    @GetMapping("/datos-completos/{cedula}")
    public ResponseEntity<Map<String, Object>> consultarDatosCompletos(@PathVariable String cedula) {
        logger.info("🔍 Consultando datos completos para cédula: {}", cedula);
        
        try {
            // Convertir la cédula a Long de forma segura
            Long cedulaLong;
            try {
                cedulaLong = Long.parseLong(cedula);
            } catch (NumberFormatException e) {
                logger.error("❌ Error al convertir cédula '{}' a Long: {}", cedula, e.getMessage());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Cédula inválida: " + cedula);
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Obtener usuario básico sin relaciones problemáticas
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
            
            if (usuarioOpt.isEmpty()) {
                logger.warn("⚠️ Usuario no encontrado para cédula: {}", cedula);
                return ResponseEntity.notFound().build();
            }
            
            Usuario usuario = usuarioOpt.get();
            logger.info("✅ Usuario encontrado para cédula: {} con ID: {}", cedula, usuario.getIdUsuario());
            
            // Crear respuesta con datos completos incluyendo relaciones
            Map<String, Object> datosCompletos = new HashMap<>();
            datosCompletos.put("idUsuario", usuario.getIdUsuario());
            datosCompletos.put("documento", usuario.getDocumento());
            datosCompletos.put("nombre", usuario.getNombre());
            datosCompletos.put("fechaNacimiento", usuario.getFechaNacimiento());
            datosCompletos.put("cedulaExpedicion", usuario.getCedulaExpedicion());
            datosCompletos.put("paisNacimiento", usuario.getPaisNacimiento());
            datosCompletos.put("ciudadNacimiento", usuario.getCiudadNacimiento());
            datosCompletos.put("cargo", usuario.getCargo());
            datosCompletos.put("area", usuario.getArea());
            datosCompletos.put("estadoCivil", usuario.getEstadoCivil());
            datosCompletos.put("tipoSangre", usuario.getTipoSangre());
            datosCompletos.put("numeroFijo", usuario.getNumeroFijo());
            datosCompletos.put("numeroCelular", usuario.getNumeroCelular());
            datosCompletos.put("numeroCorp", usuario.getNumeroCorp());
            datosCompletos.put("correo", usuario.getCorreo());
            datosCompletos.put("version", usuario.getVersion());
            datosCompletos.put("fechaCreacion", usuario.getFechaCreacion());
            datosCompletos.put("fechaModificacion", usuario.getFechaModificacion());
            
            // Obtener estudios académicos
            try {
                List<EstudioAcademico> estudios = formularioService.obtenerEstudiosAcademicos(usuario.getIdUsuario());
                datosCompletos.put("estudios", estudios);
                logger.info("✅ Estudios académicos obtenidos: {}", estudios.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener estudios académicos: {}", e.getMessage());
                datosCompletos.put("estudios", new ArrayList<>());
            }
            
            // Obtener vehículos
            try {
                List<Vehiculo> vehiculos = formularioService.obtenerVehiculos(usuario.getIdUsuario());
                datosCompletos.put("vehiculos", vehiculos);
                logger.info("✅ Vehículos obtenidos: {}", vehiculos.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener vehículos: {}", e.getMessage());
                datosCompletos.put("vehiculos", new ArrayList<>());
            }
            
            // Obtener viviendas
            try {
                List<Vivienda> viviendas = formularioService.obtenerViviendas(usuario.getIdUsuario());
                datosCompletos.put("viviendas", viviendas);
                logger.info("✅ Viviendas obtenidas: {}", viviendas.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener viviendas: {}", e.getMessage());
                datosCompletos.put("viviendas", new ArrayList<>());
            }
            
            // Obtener personas a cargo
            try {
                List<PersonaACargo> personasACargo = formularioService.obtenerPersonasACargo(usuario.getIdUsuario());
                datosCompletos.put("personasACargo", personasACargo);
                logger.info("✅ Personas a cargo obtenidas: {}", personasACargo.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener personas a cargo: {}", e.getMessage());
                datosCompletos.put("personasACargo", new ArrayList<>());
            }
            
            // Obtener contactos de emergencia
            try {
                List<ContactoEmergencia> contactosEmergencia = formularioService.obtenerContactosEmergencia(usuario.getIdUsuario());
                datosCompletos.put("contactosEmergencia", contactosEmergencia);
                logger.info("✅ Contactos de emergencia obtenidos: {}", contactosEmergencia.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener contactos de emergencia: {}", e.getMessage());
                datosCompletos.put("contactosEmergencia", new ArrayList<>());
            }
            
            return ResponseEntity.ok(datosCompletos);
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar datos completos: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error interno del servidor: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== VERIFICAR ESTADO DE LA BASE DE DATOS ==========
    @GetMapping("/verificar-db")
    public ResponseEntity<Map<String, Object>> verificarBaseDeDatos() {
        logger.info("🔍 Verificando estado de la base de datos");
        
        try {
            // Contar usuarios en la base de datos
            long totalUsuarios = usuarioService.contarUsuarios();
            
            // Obtener algunos usuarios de ejemplo
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            List<Map<String, Object>> usuariosInfo = usuarios.stream()
                .limit(5)
                .map(u -> {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", u.getIdUsuario());
                    userInfo.put("documento", u.getDocumento());
                    userInfo.put("nombre", u.getNombre());
                    return userInfo;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("totalUsuarios", totalUsuarios);
            respuesta.put("usuariosEjemplo", usuariosInfo);
            respuesta.put("mensaje", "Base de datos funcionando correctamente");
            
            logger.info("✅ Estado de la base de datos: {} usuarios encontrados", totalUsuarios);
            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            logger.error("❌ Error al verificar base de datos: {}", e.getMessage(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al verificar base de datos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    // ========== CONSULTAR DATOS COMPLETOS POR ID ==========
    @GetMapping("/datos-completos-id/{idUsuario}")
    public ResponseEntity<Map<String, Object>> consultarDatosCompletosPorId(@PathVariable Long idUsuario) {
        logger.info("🔍 Consultando datos completos para usuario ID: {}", idUsuario);
        
        try {
            // Obtener usuario básico sin relaciones problemáticas
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(idUsuario);
            
            if (usuarioOpt.isEmpty()) {
                logger.warn("⚠️ Usuario no encontrado para ID: {}", idUsuario);
                return ResponseEntity.notFound().build();
            }
            
            Usuario usuario = usuarioOpt.get();
            logger.info("✅ Usuario encontrado para ID: {} con cédula: {}", idUsuario, usuario.getDocumento());
            
            // Crear respuesta con datos completos incluyendo relaciones
            Map<String, Object> datosCompletos = new HashMap<>();
            datosCompletos.put("idUsuario", usuario.getIdUsuario());
            datosCompletos.put("documento", usuario.getDocumento());
            datosCompletos.put("nombre", usuario.getNombre());
            datosCompletos.put("fechaNacimiento", usuario.getFechaNacimiento());
            datosCompletos.put("cedulaExpedicion", usuario.getCedulaExpedicion());
            datosCompletos.put("paisNacimiento", usuario.getPaisNacimiento());
            datosCompletos.put("ciudadNacimiento", usuario.getCiudadNacimiento());
            datosCompletos.put("cargo", usuario.getCargo());
            datosCompletos.put("area", usuario.getArea());
            datosCompletos.put("estadoCivil", usuario.getEstadoCivil());
            datosCompletos.put("tipoSangre", usuario.getTipoSangre());
            datosCompletos.put("numeroFijo", usuario.getNumeroFijo());
            datosCompletos.put("numeroCelular", usuario.getNumeroCelular());
            datosCompletos.put("numeroCorp", usuario.getNumeroCorp());
            datosCompletos.put("correo", usuario.getCorreo());
            datosCompletos.put("version", usuario.getVersion());
            datosCompletos.put("fechaCreacion", usuario.getFechaCreacion());
            datosCompletos.put("fechaModificacion", usuario.getFechaModificacion());
            
            // Obtener estudios académicos
            try {
                List<EstudioAcademico> estudios = formularioService.obtenerEstudiosAcademicos(usuario.getIdUsuario());
                datosCompletos.put("estudios", estudios);
                logger.info("✅ Estudios académicos obtenidos: {}", estudios.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener estudios académicos: {}", e.getMessage());
                datosCompletos.put("estudios", new ArrayList<>());
            }
            
            // Obtener vehículos
            try {
                List<Vehiculo> vehiculos = formularioService.obtenerVehiculos(usuario.getIdUsuario());
                datosCompletos.put("vehiculos", vehiculos);
                logger.info("✅ Vehículos obtenidos: {}", vehiculos.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener vehículos: {}", e.getMessage());
                datosCompletos.put("vehiculos", new ArrayList<>());
            }
            
            // Obtener viviendas
            try {
                List<Vivienda> viviendas = formularioService.obtenerViviendas(usuario.getIdUsuario());
                datosCompletos.put("viviendas", viviendas);
                logger.info("✅ Viviendas obtenidas: {}", viviendas.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener viviendas: {}", e.getMessage());
                datosCompletos.put("viviendas", new ArrayList<>());
            }
            
            // Obtener personas a cargo
            try {
                List<PersonaACargo> personasACargo = formularioService.obtenerPersonasACargo(usuario.getIdUsuario());
                datosCompletos.put("personasACargo", personasACargo);
                logger.info("✅ Personas a cargo obtenidas: {}", personasACargo.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener personas a cargo: {}", e.getMessage());
                datosCompletos.put("personasACargo", new ArrayList<>());
            }
            
            // Obtener contactos de emergencia
            try {
                List<ContactoEmergencia> contactosEmergencia = formularioService.obtenerContactosEmergencia(usuario.getIdUsuario());
                datosCompletos.put("contactosEmergencia", contactosEmergencia);
                logger.info("✅ Contactos de emergencia obtenidos: {}", contactosEmergencia.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener contactos de emergencia: {}", e.getMessage());
                datosCompletos.put("contactosEmergencia", new ArrayList<>());
            }
            
            // Obtener relaciones de conflicto
            try {
                List<RelacionConf> relacionesConflicto = formularioService.obtenerRelacionesConflicto(usuario.getIdUsuario());
                datosCompletos.put("declaracionesConflicto", relacionesConflicto);
                logger.info("✅ Relaciones de conflicto obtenidas: {}", relacionesConflicto.size());
            } catch (Exception e) {
                logger.warn("⚠️ Error al obtener relaciones de conflicto: {}", e.getMessage());
                datosCompletos.put("declaracionesConflicto", new ArrayList<>());
            }
            
            return ResponseEntity.ok(datosCompletos);
            
        } catch (Exception e) {
            logger.error("❌ Error al consultar datos completos por ID: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
} 