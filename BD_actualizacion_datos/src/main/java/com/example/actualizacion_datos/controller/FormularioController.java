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
import java.util.ArrayList;

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
            
            // Obtener estudios existentes
            List<EstudioAcademico> estudiosExistentes = formularioService.obtenerEstudiosAcademicos(idUsuario);
            
            // Actualizar o crear estudios según corresponda
            List<EstudioAcademico> estudiosGuardados = new ArrayList<>();
            
            for (int i = 0; i < estudios.size(); i++) {
                EstudioAcademico estudio = estudios.get(i);
                estudio.setUsuario(usuario);
                
                if (i < estudiosExistentes.size()) {
                    // Actualizar estudio existente
                    EstudioAcademico estudioExistente = estudiosExistentes.get(i);
                    actualizarCamposEstudio(estudioExistente, estudio);
                    EstudioAcademico estudioActualizado = formularioService.actualizarEstudioAcademico(estudioExistente);
                    estudiosGuardados.add(estudioActualizado);
                } else {
                    // Crear nuevo estudio
                    EstudioAcademico estudioNuevo = formularioService.guardarEstudiosAcademicos(estudio, idUsuario);
                    estudiosGuardados.add(estudioNuevo);
                }
            }
            
            // Eliminar estudios sobrantes si hay menos en la nueva lista
            if (estudios.size() < estudiosExistentes.size()) {
                for (int i = estudios.size(); i < estudiosExistentes.size(); i++) {
                    formularioService.eliminarEstudioAcademico(estudiosExistentes.get(i).getIdEstudios());
                }
            }
            
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
            
            // Obtener vehículos existentes
            List<Vehiculo> vehiculosExistentes = formularioService.obtenerVehiculos(idUsuario);
            
            // Actualizar o crear vehículos según corresponda
            List<Vehiculo> vehiculosGuardados = new ArrayList<>();
            
            for (int i = 0; i < vehiculos.size(); i++) {
                Vehiculo vehiculo = vehiculos.get(i);
                vehiculo.setUsuario(usuario);
                
                if (i < vehiculosExistentes.size()) {
                    // Actualizar vehículo existente
                    Vehiculo vehiculoExistente = vehiculosExistentes.get(i);
                    actualizarCamposVehiculo(vehiculoExistente, vehiculo);
                    Vehiculo vehiculoActualizado = formularioService.actualizarVehiculo(vehiculoExistente);
                    vehiculosGuardados.add(vehiculoActualizado);
                } else {
                    // Crear nuevo vehículo
                    Vehiculo vehiculoNuevo = formularioService.guardarVehiculos(vehiculo, idUsuario);
                    vehiculosGuardados.add(vehiculoNuevo);
                }
            }
            
            // Eliminar vehículos sobrantes si hay menos en la nueva lista
            if (vehiculos.size() < vehiculosExistentes.size()) {
                for (int i = vehiculos.size(); i < vehiculosExistentes.size(); i++) {
                    formularioService.eliminarVehiculo(vehiculosExistentes.get(i).getIdVehiculo());
                }
            }
            
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
        logger.info("🏠 Datos recibidos - tipoAdquisicion: '{}'", vivienda.getTipoAdquisicion());
        logger.info("🏠 Datos recibidos - entidad: '{}'", vivienda.getEntidad());
        logger.info("🏠 Datos recibidos - ano: '{}'", vivienda.getAno());
        logger.info("🏠 Datos recibidos - barrio: '{}'", vivienda.getBarrio());
        logger.info("🏠 Datos recibidos - ciudad: '{}'", vivienda.getCiudad());
        logger.info("🏠 Datos recibidos - vivienda: '{}'", vivienda.getVivienda());
        logger.info("🏠 Datos recibidos - infoAdicional: '{}'", vivienda.getInfoAdicional());
        logger.info("🏠 Datos recibidos - tipoVivienda: '{}'", vivienda.getTipoVivienda());
        
        try {
            // Obtener usuario para auditoría
            Usuario usuario = formularioService.obtenerUsuarioPorId(idUsuario);
            String nombreUsuario = usuario != null ? usuario.getNombre() : "Usuario " + idUsuario;
            
            // Obtener vivienda existente
            List<Vivienda> viviendasExistentes = formularioService.obtenerViviendas(idUsuario);
            
            if (!viviendasExistentes.isEmpty()) {
                // Actualizar vivienda existente
                Vivienda viviendaExistente = viviendasExistentes.get(0);
                actualizarCamposVivienda(viviendaExistente, vivienda);
                viviendaExistente.setUsuario(usuario);
                Vivienda viviendaActualizada = formularioService.actualizarVivienda(viviendaExistente);
                
                Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Vivienda actualizada exitosamente",
                    "data", viviendaActualizada
                );
                
                logger.info("✅ Vivienda actualizada exitosamente para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(response);
            } else {
                // Crear nueva vivienda
                vivienda.setUsuario(usuario);
                Vivienda viviendaGuardada = formularioService.guardarVivienda(vivienda, idUsuario);
                
                Map<String, Object> response = Map.of(
                    "success", true,
                    "message", "Vivienda guardada exitosamente",
                    "data", viviendaGuardada
                );
                
                logger.info("✅ Vivienda guardada exitosamente para usuario ID: {}", idUsuario);
                return ResponseEntity.ok(response);
            }
            
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
            
            // Obtener personas existentes
            List<PersonaACargo> personasExistentes = formularioService.obtenerPersonasACargo(idUsuario);
            
            // Actualizar o crear personas según corresponda
            List<PersonaACargo> personasGuardadas = new ArrayList<>();
            
            for (int i = 0; i < personas.size(); i++) {
                PersonaACargo persona = personas.get(i);
                persona.setUsuario(usuario);
                
                if (i < personasExistentes.size()) {
                    // Actualizar persona existente
                    PersonaACargo personaExistente = personasExistentes.get(i);
                    actualizarCamposPersonaACargo(personaExistente, persona);
                    PersonaACargo personaActualizada = formularioService.actualizarPersonaACargo(personaExistente);
                    personasGuardadas.add(personaActualizada);
                } else {
                    // Crear nueva persona
                    PersonaACargo personaNueva = formularioService.guardarPersonasACargo(persona, idUsuario);
                    personasGuardadas.add(personaNueva);
                }
            }
            
            // Eliminar personas sobrantes si hay menos en la nueva lista
            if (personas.size() < personasExistentes.size()) {
                for (int i = personas.size(); i < personasExistentes.size(); i++) {
                    formularioService.eliminarPersonaACargo(personasExistentes.get(i).getIdFamilia());
                }
            }
            
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
            
            // Obtener contactos existentes
            List<ContactoEmergencia> contactosExistentes = formularioService.obtenerContactosEmergencia(idUsuario);
            
            // Actualizar o crear contactos según corresponda
            List<ContactoEmergencia> contactosGuardados = new ArrayList<>();
            
            for (int i = 0; i < contactos.size(); i++) {
                ContactoEmergencia contacto = contactos.get(i);
                contacto.setUsuario(usuario);
                
                if (i < contactosExistentes.size()) {
                    // Actualizar contacto existente
                    ContactoEmergencia contactoExistente = contactosExistentes.get(i);
                    actualizarCamposContactoEmergencia(contactoExistente, contacto);
                    ContactoEmergencia contactoActualizado = formularioService.actualizarContactoEmergencia(contactoExistente);
                    contactosGuardados.add(contactoActualizado);
                } else {
                    // Crear nuevo contacto
                    ContactoEmergencia contactoNuevo = formularioService.guardarContactosEmergencia(contacto, idUsuario);
                    contactosGuardados.add(contactoNuevo);
                }
            }
            
            // Eliminar contactos sobrantes si hay menos en la nueva lista
            if (contactos.size() < contactosExistentes.size()) {
                for (int i = contactos.size(); i < contactosExistentes.size(); i++) {
                    formularioService.eliminarContactoEmergencia(contactosExistentes.get(i).getIdContacto());
                }
            }
            
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
            
            // Obtener relaciones existentes
            List<RelacionConf> relacionesExistentes = formularioService.obtenerRelacionesConflicto(idUsuario);
            
            // Actualizar o crear relaciones según corresponda
            List<RelacionConf> relacionesGuardadas = new ArrayList<>();
            
            for (int i = 0; i < relaciones.size(); i++) {
                RelacionConf relacion = relaciones.get(i);
                relacion.setUsuario(usuario);
                
                if (i < relacionesExistentes.size()) {
                    // Actualizar relación existente
                    RelacionConf relacionExistente = relacionesExistentes.get(i);
                    actualizarCamposRelacionConf(relacionExistente, relacion);
                    RelacionConf relacionActualizada = formularioService.actualizarRelacionConf(relacionExistente);
                    relacionesGuardadas.add(relacionActualizada);
                } else {
                    // Crear nueva relación
                    RelacionConf relacionNueva = formularioService.guardarRelacionConflicto(relacion, idUsuario);
                    relacionesGuardadas.add(relacionNueva);
                }
            }
            
            // Eliminar relaciones sobrantes si hay menos en la nueva lista
            if (relaciones.size() < relacionesExistentes.size()) {
                for (int i = relaciones.size(); i < relacionesExistentes.size(); i++) {
                    formularioService.eliminarRelacionConf(relacionesExistentes.get(i).getIdRelacionConf());
                }
            }
            
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
            // Guardar información personal usando el servicio (la auditoría se maneja automáticamente)
            Usuario usuarioGuardado = formularioService.guardarInformacionPersonal(usuario);
            
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
    
    // ========== MÉTODOS AUXILIARES PARA ACTUALIZAR CAMPOS ==========
    
    private void actualizarCamposEstudio(EstudioAcademico estudioExistente, EstudioAcademico estudioNuevo) {
        estudioExistente.setNivelAcademico(estudioNuevo.getNivelAcademico());
        estudioExistente.setPrograma(estudioNuevo.getPrograma());
        estudioExistente.setInstitucion(estudioNuevo.getInstitucion());
        estudioExistente.setSemestre(estudioNuevo.getSemestre());
        estudioExistente.setGraduacion(estudioNuevo.getGraduacion());
    }
    
    private void actualizarCamposVehiculo(Vehiculo vehiculoExistente, Vehiculo vehiculoNuevo) {
        vehiculoExistente.setTipoVehiculo(vehiculoNuevo.getTipoVehiculo());
        vehiculoExistente.setMarca(vehiculoNuevo.getMarca());
        vehiculoExistente.setPlaca(vehiculoNuevo.getPlaca());
        vehiculoExistente.setAno(vehiculoNuevo.getAno());
        vehiculoExistente.setPropietario(vehiculoNuevo.getPropietario());
    }
    
    private void actualizarCamposVivienda(Vivienda viviendaExistente, Vivienda viviendaNueva) {
        logger.info("🏠 Actualizando campos de vivienda");
        logger.info("🏠 tipoAdquisicion anterior: '{}' -> nuevo: '{}'", viviendaExistente.getTipoAdquisicion(), viviendaNueva.getTipoAdquisicion());
        logger.info("🏠 entidad anterior: '{}' -> nuevo: '{}'", viviendaExistente.getEntidad(), viviendaNueva.getEntidad());
        logger.info("🏠 ano anterior: '{}' -> nuevo: '{}'", viviendaExistente.getAno(), viviendaNueva.getAno());
        logger.info("🏠 vivienda anterior: '{}' -> nuevo: '{}'", viviendaExistente.getVivienda(), viviendaNueva.getVivienda());
        
        viviendaExistente.setDireccion(viviendaNueva.getDireccion());
        viviendaExistente.setTipoVivienda(viviendaNueva.getTipoVivienda());
        viviendaExistente.setTipoAdquisicion(viviendaNueva.getTipoAdquisicion());
        viviendaExistente.setEntidad(viviendaNueva.getEntidad());
        viviendaExistente.setAno(viviendaNueva.getAno());
        viviendaExistente.setBarrio(viviendaNueva.getBarrio());
        viviendaExistente.setCiudad(viviendaNueva.getCiudad());
        viviendaExistente.setVivienda(viviendaNueva.getVivienda());
        viviendaExistente.setInfoAdicional(viviendaNueva.getInfoAdicional());
        
        logger.info("🏠 Campos actualizados correctamente");
    }
    
    private void actualizarCamposPersonaACargo(PersonaACargo personaExistente, PersonaACargo personaNueva) {
        personaExistente.setNombre(personaNueva.getNombre());
        personaExistente.setParentesco(personaNueva.getParentesco());
        personaExistente.setFechaNacimiento(personaNueva.getFechaNacimiento());
        personaExistente.setEdad(personaNueva.getEdad());
    }
    
    private void actualizarCamposContactoEmergencia(ContactoEmergencia contactoExistente, ContactoEmergencia contactoNuevo) {
        contactoExistente.setNombreCompleto(contactoNuevo.getNombreCompleto());
        contactoExistente.setParentesco(contactoNuevo.getParentesco());
        contactoExistente.setNumeroCelular(contactoNuevo.getNumeroCelular());
    }
    
    private void actualizarCamposRelacionConf(RelacionConf relacionExistente, RelacionConf relacionNueva) {
        relacionExistente.setNombreCompleto(relacionNueva.getNombreCompleto());
        relacionExistente.setParentesco(relacionNueva.getParentesco());
        relacionExistente.setTipoParteAsoc(relacionNueva.getTipoParteAsoc());
    }
} 