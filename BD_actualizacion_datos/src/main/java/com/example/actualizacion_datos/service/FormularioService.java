package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FormularioService {
    
    private static final Logger logger = LoggerFactory.getLogger(FormularioService.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private EstudioAcademicoRepository estudioAcademicoRepository;
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    @Autowired
    private ViviendaRepository viviendaRepository;
    
    @Autowired
    private PersonaACargoRepository personaACargoRepository;
    
    @Autowired
    private ContactoEmergenciaRepository contactoEmergenciaRepository;
    
    @Autowired
    private RelacionConfRepository relacionConfRepository;
    
    // ========== GUARDAR INFORMACIÓN PERSONAL ==========
    public Usuario guardarInformacionPersonal(Usuario usuario) {
        logger.info("💾 Guardando información personal para usuario: {}", usuario.getDocumento());
        
        try {
            // Buscar usuario existente
            Optional<Usuario> usuarioExistente = usuarioRepository.findByDocumento(usuario.getDocumento());
            
            if (usuarioExistente.isPresent()) {
                // Actualizar usuario existente
                Usuario usuarioActual = usuarioExistente.get();
                actualizarCamposUsuario(usuarioActual, usuario);
                usuarioActual.setVersion(usuarioActual.getVersion() + 1);
                return usuarioRepository.save(usuarioActual);
            } else {
                // Crear nuevo usuario
                usuario.setVersion(1);
                return usuarioRepository.save(usuario);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar información personal: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar información personal: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR ESTUDIOS ACADÉMICOS ==========
    public EstudioAcademico guardarEstudiosAcademicos(EstudioAcademico estudio, Long idUsuario) {
        logger.info("💾 Guardando estudios académicos para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            // Asignar usuario al estudio
            estudio.setUsuario(usuario.get());
            
            // Guardar estudio
            EstudioAcademico estudioGuardado = estudioAcademicoRepository.save(estudio);
            logger.info("✅ Estudio académico guardado exitosamente con ID: {}", estudioGuardado.getIdEstudios());
            
            return estudioGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar estudios académicos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar estudios académicos: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR VEHÍCULOS ==========
    public Vehiculo guardarVehiculos(Vehiculo vehiculo, Long idUsuario) {
        logger.info("💾 Guardando vehículo para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            // Asignar usuario al vehículo
            vehiculo.setUsuario(usuario.get());
            
            // Guardar vehículo
            Vehiculo vehiculoGuardado = vehiculoRepository.save(vehiculo);
            logger.info("✅ Vehículo guardado exitosamente con ID: {}", vehiculoGuardado.getIdVehiculo());
            
            return vehiculoGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vehículo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar vehículo: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR VIVIENDA ==========
    public Vivienda guardarVivienda(Vivienda vivienda, Long idUsuario) {
        logger.info("💾 Guardando vivienda para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            // Asignar usuario a la vivienda
            vivienda.setUsuario(usuario.get());
            
            // Guardar vivienda
            Vivienda viviendaGuardada = viviendaRepository.save(vivienda);
            logger.info("✅ Vivienda guardada exitosamente con ID: {}", viviendaGuardada.getIdVivienda());
            
            return viviendaGuardada;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vivienda: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar vivienda: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR PERSONAS A CARGO ==========
    public PersonaACargo guardarPersonasACargo(PersonaACargo persona, Long idUsuario) {
        logger.info("💾 Guardando persona a cargo para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            // Asignar usuario a la persona
            persona.setUsuario(usuario.get());
            
            // Guardar persona
            PersonaACargo personaGuardada = personaACargoRepository.save(persona);
            logger.info("✅ Persona a cargo guardada exitosamente con ID: {}", personaGuardada.getIdFamilia());
            
            return personaGuardada;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar persona a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar persona a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR CONTACTOS DE EMERGENCIA ==========
    public ContactoEmergencia guardarContactosEmergencia(ContactoEmergencia contacto, Long idUsuario) {
        logger.info("💾 Guardando contacto de emergencia para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            // Asignar usuario al contacto
            contacto.setUsuario(usuario.get());
            
            // Guardar contacto
            ContactoEmergencia contactoGuardado = contactoEmergenciaRepository.save(contacto);
            logger.info("✅ Contacto de emergencia guardado exitosamente con ID: {}", contactoGuardado.getIdContacto());
            
            return contactoGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar contacto de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar contacto de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER DATOS COMPLETOS DEL USUARIO ==========
    public Usuario obtenerDatosCompletosUsuario(Long idUsuario) {
        logger.info("📋 Obteniendo datos completos para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            return usuario.get();
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener datos completos del usuario: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener datos completos del usuario: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER USUARIO POR ID ==========
    public Usuario obtenerUsuarioPorId(Long idUsuario) {
        logger.info("👤 Obteniendo usuario por ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            return usuario.orElse(null);
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuario por ID: {}", e.getMessage(), e);
            return null;
        }
    }
    
    // ========== OBTENER DATOS COMPLETOS DEL USUARIO POR CÉDULA ==========
    public Usuario obtenerDatosCompletosUsuarioPorCedula(Long cedula) {
        logger.info("🔍 Obteniendo datos completos para usuario por cédula: {}", cedula);
        try {
            Optional<Usuario> usuario = usuarioRepository.findByDocumento(cedula);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con cédula: " + cedula);
            }
            
            logger.info("✅ Datos completos obtenidos para cédula: {}", cedula);
            return usuario.get();
        } catch (Exception e) {
            logger.error("❌ Error al obtener datos completos del usuario por cédula: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener datos completos del usuario por cédula: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER ESTUDIOS ACADÉMICOS ==========
    public List<EstudioAcademico> obtenerEstudiosAcademicos(Long idUsuario) {
        logger.info("🔍 Obteniendo estudios académicos para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            return estudioAcademicoRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener estudios académicos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener estudios académicos: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER VEHÍCULOS ==========
    public List<Vehiculo> obtenerVehiculos(Long idUsuario) {
        logger.info("🔍 Obteniendo vehículos para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            return vehiculoRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener vehículos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener vehículos: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER VIVIENDAS ==========
    public List<Vivienda> obtenerViviendas(Long idUsuario) {
        logger.info("🔍 Obteniendo viviendas para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            return viviendaRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener viviendas: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener viviendas: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER PERSONAS A CARGO ==========
    public List<PersonaACargo> obtenerPersonasACargo(Long idUsuario) {
        logger.info("🔍 Obteniendo personas a cargo para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            return personaACargoRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener personas a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener personas a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER CONTACTOS DE EMERGENCIA ==========
    public List<ContactoEmergencia> obtenerContactosEmergencia(Long idUsuario) {
        logger.info("🔍 Obteniendo contactos de emergencia para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            return contactoEmergenciaRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener contactos de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener contactos de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS PARA GUARDAR LISTAS ==========
    
    // ========== GUARDAR LISTA DE ESTUDIOS ACADÉMICOS ==========
    public List<EstudioAcademico> guardarEstudiosAcademicos(List<EstudioAcademico> estudios, Long idUsuario) {
        logger.info("💾 Guardando {} estudios académicos para usuario ID: {}", estudios.size(), idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<EstudioAcademico> estudiosGuardados = new ArrayList<>();
            
            for (EstudioAcademico estudio : estudios) {
                // Asignar usuario al estudio
                estudio.setUsuario(usuario.get());
                
                // Guardar estudio
                EstudioAcademico estudioGuardado = estudioAcademicoRepository.save(estudio);
                estudiosGuardados.add(estudioGuardado);
                logger.info("✅ Estudio académico guardado exitosamente con ID: {}", estudioGuardado.getIdEstudios());
            }
            
            return estudiosGuardados;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar estudios académicos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar estudios académicos: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR LISTA DE VEHÍCULOS ==========
    public List<Vehiculo> guardarVehiculos(List<Vehiculo> vehiculos, Long idUsuario) {
        logger.info("💾 Guardando {} vehículos para usuario ID: {}", vehiculos.size(), idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<Vehiculo> vehiculosGuardados = new ArrayList<>();
            
            for (Vehiculo vehiculo : vehiculos) {
                // Asignar usuario al vehículo
                vehiculo.setUsuario(usuario.get());
                
                // Guardar vehículo
                Vehiculo vehiculoGuardado = vehiculoRepository.save(vehiculo);
                vehiculosGuardados.add(vehiculoGuardado);
                logger.info("✅ Vehículo guardado exitosamente con ID: {}", vehiculoGuardado.getIdVehiculo());
            }
            
            return vehiculosGuardados;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar vehículos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar vehículos: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR LISTA DE PERSONAS A CARGO ==========
    public List<PersonaACargo> guardarPersonasACargo(List<PersonaACargo> personas, Long idUsuario) {
        logger.info("💾 Guardando {} personas a cargo para usuario ID: {}", personas.size(), idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<PersonaACargo> personasGuardadas = new ArrayList<>();
            
            for (PersonaACargo persona : personas) {
                // Asignar usuario a la persona
                persona.setUsuario(usuario.get());
                
                // Guardar persona
                PersonaACargo personaGuardada = personaACargoRepository.save(persona);
                personasGuardadas.add(personaGuardada);
                logger.info("✅ Persona a cargo guardada exitosamente con ID: {}", personaGuardada.getIdFamilia());
            }
            
            return personasGuardadas;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar personas a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar personas a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR LISTA DE CONTACTOS DE EMERGENCIA ==========
    public List<ContactoEmergencia> guardarContactosEmergencia(List<ContactoEmergencia> contactos, Long idUsuario) {
        logger.info("💾 Guardando {} contactos de emergencia para usuario ID: {}", contactos.size(), idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<ContactoEmergencia> contactosGuardados = new ArrayList<>();
            
            for (ContactoEmergencia contacto : contactos) {
                // Asignar usuario al contacto
                contacto.setUsuario(usuario.get());
                
                // Guardar contacto
                ContactoEmergencia contactoGuardado = contactoEmergenciaRepository.save(contacto);
                contactosGuardados.add(contactoGuardado);
                logger.info("✅ Contacto de emergencia guardado exitosamente con ID: {}", contactoGuardado.getIdContacto());
            }
            
            return contactosGuardados;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar contactos de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar contactos de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS PARA ELIMINAR ==========
    
    // ========== ELIMINAR ESTUDIOS ACADÉMICOS ==========
    public void eliminarEstudiosAcademicos(Long idUsuario) {
        logger.info("🗑️ Eliminando estudios académicos para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<EstudioAcademico> estudios = estudioAcademicoRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            estudioAcademicoRepository.deleteAll(estudios);
            logger.info("✅ Estudios académicos eliminados exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar estudios académicos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar estudios académicos: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR VEHÍCULOS ==========
    public void eliminarVehiculos(Long idUsuario) {
        logger.info("🗑️ Eliminando vehículos para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<Vehiculo> vehiculos = vehiculoRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            vehiculoRepository.deleteAll(vehiculos);
            logger.info("✅ Vehículos eliminados exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar vehículos: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar vehículos: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR VIVIENDAS ==========
    public void eliminarViviendas(Long idUsuario) {
        logger.info("🗑️ Eliminando viviendas para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<Vivienda> viviendas = viviendaRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            viviendaRepository.deleteAll(viviendas);
            logger.info("✅ Viviendas eliminadas exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar viviendas: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar viviendas: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR PERSONAS A CARGO ==========
    public void eliminarPersonasACargo(Long idUsuario) {
        logger.info("🗑️ Eliminando personas a cargo para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<PersonaACargo> personas = personaACargoRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            personaACargoRepository.deleteAll(personas);
            logger.info("✅ Personas a cargo eliminadas exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar personas a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar personas a cargo: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR CONTACTOS DE EMERGENCIA ==========
    public void eliminarContactosEmergencia(Long idUsuario) {
        logger.info("🗑️ Eliminando contactos de emergencia para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<ContactoEmergencia> contactos = contactoEmergenciaRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            contactoEmergenciaRepository.deleteAll(contactos);
            logger.info("✅ Contactos de emergencia eliminados exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar contactos de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar contactos de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== OBTENER RELACIONES DE CONFLICTO ==========
    public List<RelacionConf> obtenerRelacionesConflicto(Long idUsuario) {
        logger.info("🔍 Obteniendo relaciones de conflicto para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<RelacionConf> relaciones = relacionConfRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            logger.info("✅ Relaciones de conflicto obtenidas exitosamente para usuario ID: {}", idUsuario);
            
            return relaciones;
            
        } catch (Exception e) {
            logger.error("❌ Error al obtener relaciones de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al obtener relaciones de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR RELACIONES DE CONFLICTO ==========
    public List<RelacionConf> guardarRelacionesConflicto(List<RelacionConf> relaciones, Long idUsuario) {
        logger.info("💾 Guardando {} relaciones de conflicto para usuario ID: {}", relaciones.size(), idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<RelacionConf> relacionesGuardadas = new ArrayList<>();
            
            for (RelacionConf relacion : relaciones) {
                // Asignar usuario a la relación
                relacion.setUsuario(usuario.get());
                
                // Guardar relación
                RelacionConf relacionGuardada = relacionConfRepository.save(relacion);
                relacionesGuardadas.add(relacionGuardada);
                logger.info("✅ Relación de conflicto guardada exitosamente con ID: {}", relacionGuardada.getIdRelacionConf());
            }
            
            return relacionesGuardadas;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar relaciones de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar relaciones de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR RELACIONES DE CONFLICTO ==========
    public void eliminarRelacionesConflicto(Long idUsuario) {
        logger.info("🗑️ Eliminando relaciones de conflicto para usuario ID: {}", idUsuario);
        
        try {
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            List<RelacionConf> relaciones = relacionConfRepository.findByUsuarioIdUsuario(usuario.get().getIdUsuario());
            relacionConfRepository.deleteAll(relaciones);
            logger.info("✅ Relaciones de conflicto eliminadas exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar relaciones de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar relaciones de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    private void actualizarCamposUsuario(Usuario usuarioActual, Usuario usuarioNuevo) {
        if (usuarioNuevo.getNombre() != null) {
            usuarioActual.setNombre(usuarioNuevo.getNombre());
        }
        if (usuarioNuevo.getCorreo() != null) {
            usuarioActual.setCorreo(usuarioNuevo.getCorreo());
        }
        if (usuarioNuevo.getFechaNacimiento() != null) {
            usuarioActual.setFechaNacimiento(usuarioNuevo.getFechaNacimiento());
        }
        if (usuarioNuevo.getCedulaExpedicion() != null) {
            usuarioActual.setCedulaExpedicion(usuarioNuevo.getCedulaExpedicion());
        }
        if (usuarioNuevo.getPaisNacimiento() != null) {
            usuarioActual.setPaisNacimiento(usuarioNuevo.getPaisNacimiento());
        }
        if (usuarioNuevo.getCiudadNacimiento() != null) {
            usuarioActual.setCiudadNacimiento(usuarioNuevo.getCiudadNacimiento());
        }
        if (usuarioNuevo.getCargo() != null) {
            usuarioActual.setCargo(usuarioNuevo.getCargo());
        }
        if (usuarioNuevo.getArea() != null) {
            usuarioActual.setArea(usuarioNuevo.getArea());
        }
        if (usuarioNuevo.getEstadoCivil() != null) {
            usuarioActual.setEstadoCivil(usuarioNuevo.getEstadoCivil());
        }
        if (usuarioNuevo.getTipoSangre() != null) {
            usuarioActual.setTipoSangre(usuarioNuevo.getTipoSangre());
        }
        if (usuarioNuevo.getNumeroFijo() != null) {
            usuarioActual.setNumeroFijo(usuarioNuevo.getNumeroFijo());
        }
        if (usuarioNuevo.getNumeroCelular() != null) {
            usuarioActual.setNumeroCelular(usuarioNuevo.getNumeroCelular());
        }
        if (usuarioNuevo.getNumeroCorp() != null) {
            usuarioActual.setNumeroCorp(usuarioNuevo.getNumeroCorp());
        }
    }
} 