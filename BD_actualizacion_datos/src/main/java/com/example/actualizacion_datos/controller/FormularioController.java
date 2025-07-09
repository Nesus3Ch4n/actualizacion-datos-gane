package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.service.FormularioService;
import com.example.actualizacion_datos.service.AuditoriaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/formulario")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FormularioController {
    
    private static final Logger logger = LoggerFactory.getLogger(FormularioController.class);
    
    @Autowired
    private FormularioService formularioService;
    
    @Autowired
    private AuditoriaService auditoriaService;
    
    // ========== GUARDAR ESTUDIOS ACADÉMICOS ==========
    @PostMapping("/estudios/guardar")
    public ResponseEntity<?> guardarEstudios(@RequestParam Long idUsuario, @RequestBody List<EstudioAcademico> estudios) {
        logger.info("📚 Guardando {} estudios académicos para usuario ID: {}", estudios.size(), idUsuario);
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Primero eliminar estudios existentes
            formularioService.eliminarEstudiosAcademicos(idUsuario);
            
            // Guardar nuevos estudios
            List<EstudioAcademico> estudiosGuardados = formularioService.guardarEstudiosAcademicos(estudios, idUsuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "ESTUDIO_ACADEMICO",
                idUsuario,
                null,
                null,
                null,
                "INSERT",
                nombreUsuario,
                idUsuario,
                "Guardado de " + estudios.size() + " estudios académicos"
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Estudios académicos guardados exitosamente",
                "data", estudiosGuardados
            );
            
            logger.info("✅ Estudios académicos guardados exitosamente para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar estudios académicos: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar estudios académicos: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== GUARDAR VEHÍCULOS ==========
    @PostMapping("/vehiculos/guardar")
    public ResponseEntity<?> guardarVehiculos(@RequestParam Long idUsuario, @RequestBody List<Vehiculo> vehiculos) {
        logger.info("🚗 Guardando {} vehículos para usuario ID: {}", vehiculos.size(), idUsuario);
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Primero eliminar vehículos existentes
            formularioService.eliminarVehiculos(idUsuario);
            
            // Guardar nuevos vehículos
            List<Vehiculo> vehiculosGuardados = formularioService.guardarVehiculos(vehiculos, idUsuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "VEHICULO",
                idUsuario,
                null,
                null,
                null,
                "INSERT",
                nombreUsuario,
                idUsuario,
                "Guardado de " + vehiculos.size() + " vehículos"
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Vehículos guardados exitosamente",
                "data", vehiculosGuardados
            );
            
            logger.info("✅ Vehículos guardados exitosamente para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vehículos: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar vehículos: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== GUARDAR VIVIENDA ==========
    @PostMapping("/vivienda/guardar")
    public ResponseEntity<?> guardarVivienda(@RequestParam Long idUsuario, @RequestBody Vivienda vivienda) {
        logger.info("🏠 Guardando vivienda para usuario ID: {}", idUsuario);
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Primero eliminar viviendas existentes
            formularioService.eliminarViviendas(idUsuario);
            
            // Guardar nueva vivienda
            Vivienda viviendaGuardada = formularioService.guardarVivienda(vivienda, idUsuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "VIVIENDA",
                idUsuario,
                null,
                null,
                null,
                "INSERT",
                nombreUsuario,
                idUsuario,
                "Guardado de información de vivienda"
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Vivienda guardada exitosamente",
                "data", viviendaGuardada
            );
            
            logger.info("✅ Vivienda guardada exitosamente para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vivienda: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar vivienda: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== GUARDAR PERSONAS A CARGO ==========
    @PostMapping("/personas-acargo/guardar")
    public ResponseEntity<?> guardarPersonasACargo(@RequestParam Long idUsuario, @RequestBody List<PersonaACargo> personas) {
        logger.info("👨‍👩‍👧‍👦 Guardando {} personas a cargo para usuario ID: {}", personas.size(), idUsuario);
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Primero eliminar personas existentes
            formularioService.eliminarPersonasACargo(idUsuario);
            
            // Guardar nuevas personas
            List<PersonaACargo> personasGuardadas = formularioService.guardarPersonasACargo(personas, idUsuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "PERSONA_A_CARGO",
                idUsuario,
                null,
                null,
                null,
                "INSERT",
                nombreUsuario,
                idUsuario,
                "Guardado de " + personas.size() + " personas a cargo"
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Personas a cargo guardadas exitosamente",
                "data", personasGuardadas
            );
            
            logger.info("✅ Personas a cargo guardadas exitosamente para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar personas a cargo: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar personas a cargo: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== GUARDAR CONTACTOS DE EMERGENCIA ==========
    @PostMapping("/contactos/guardar")
    public ResponseEntity<?> guardarContactos(@RequestParam Long idUsuario, @RequestBody List<ContactoEmergencia> contactos) {
        logger.info("📞 Guardando {} contactos de emergencia para usuario ID: {}", contactos.size(), idUsuario);
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Primero eliminar contactos existentes
            formularioService.eliminarContactosEmergencia(idUsuario);
            
            // Guardar nuevos contactos
            List<ContactoEmergencia> contactosGuardados = formularioService.guardarContactosEmergencia(contactos, idUsuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "CONTACTO_EMERGENCIA",
                idUsuario,
                null,
                null,
                null,
                "INSERT",
                nombreUsuario,
                idUsuario,
                "Guardado de " + contactos.size() + " contactos de emergencia"
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Contactos de emergencia guardados exitosamente",
                "data", contactosGuardados
            );
            
            logger.info("✅ Contactos de emergencia guardados exitosamente para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar contactos de emergencia: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar contactos de emergencia: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    // ========== GUARDAR DECLARACIONES DE CONFLICTO ==========
    @PostMapping("/relaciones-conflicto/guardar")
    public ResponseEntity<?> guardarRelacionesConflicto(@RequestParam Long idUsuario, @RequestBody List<RelacionConf> relaciones) {
        logger.info("⚖️ Guardando {} declaraciones de conflicto para usuario ID: {}", relaciones.size(), idUsuario);
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Primero eliminar relaciones existentes
            formularioService.eliminarRelacionesConflicto(idUsuario);
            
            // Guardar nuevas relaciones
            List<RelacionConf> relacionesGuardadas = formularioService.guardarRelacionesConflicto(relaciones, idUsuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "RELACION_CONF",
                idUsuario,
                null,
                null,
                null,
                "INSERT",
                nombreUsuario,
                idUsuario,
                "Guardado de " + relaciones.size() + " declaraciones de conflicto"
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Declaraciones de conflicto guardadas exitosamente",
                "data", relacionesGuardadas
            );
            
            logger.info("✅ Declaraciones de conflicto guardadas exitosamente para usuario ID: {}", idUsuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar declaraciones de conflicto: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar declaraciones de conflicto: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ========== GUARDAR INFORMACIÓN PERSONAL ==========
    @PostMapping("/informacion-personal/guardar")
    public ResponseEntity<?> guardarInformacionPersonal(@RequestBody Usuario usuario) {
        logger.info("👤 Guardando información personal para usuario: {}", usuario.getDocumento());
        
        try {
            // Verificar si el usuario ya existe para determinar si es INSERT o UPDATE
            Usuario usuarioExistente = formularioService.obtenerUsuarioPorId(usuario.getIdUsuario());
            String tipoPeticion = usuarioExistente != null ? "UPDATE" : "INSERT";
            String descripcion = tipoPeticion.equals("INSERT") ? 
                "Creación de información personal" : 
                "Actualización de información personal";
            
            // Guardar información personal usando el servicio
            Usuario usuarioGuardado = formularioService.guardarInformacionPersonal(usuario);
            
            // Registrar auditoría
            auditoriaService.registrarAuditoria(
                "USUARIO", 
                usuarioGuardado.getIdUsuario(), 
                null, // campo modificado (se puede mejorar para detectar cambios específicos)
                null, // valor anterior
                null, // valor nuevo
                tipoPeticion,
                usuarioGuardado.getNombre(),
                usuarioGuardado.getIdUsuario(),
                descripcion
            );
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Información personal guardada exitosamente",
                "data", usuarioGuardado
            );
            
            logger.info("✅ Información personal guardada exitosamente para usuario: {}", usuarioGuardado.getDocumento());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar información personal: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "Error al guardar información personal: " + e.getMessage()
            );
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 