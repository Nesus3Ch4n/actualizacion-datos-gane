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
import com.example.actualizacion_datos.config.AuditoriaInterceptor;

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
    
    @Autowired
    private UsuarioBaseService usuarioBaseService;
    
    @Autowired
    private EstudioAcademicoBaseService estudioAcademicoBaseService;
    
    @Autowired
    private VehiculoBaseService vehiculoBaseService;
    
    @Autowired
    private ViviendaBaseService viviendaBaseService;
    
    @Autowired
    private PersonaACargoBaseService personaACargoBaseService;
    
    @Autowired
    private ContactoEmergenciaBaseService contactoEmergenciaBaseService;
    
    @Autowired
    private RelacionConfBaseService relacionConfBaseService;
    
    @Autowired
    private AuditoriaInterceptor auditoriaInterceptor;
    
    // ========== GUARDAR INFORMACIÓN PERSONAL ==========
    public Usuario guardarInformacionPersonal(Usuario usuario) {
        logger.info("💾 Guardando información personal para usuario: {}", usuario.getDocumento());
        try {
            // Buscar usuario existente
            Optional<Usuario> usuarioExistenteOpt = usuarioRepository.findByDocumento(usuario.getDocumento());
            Usuario usuarioGuardado;
            
            if (usuarioExistenteOpt.isPresent()) {
                // Actualizar usuario existente
                Usuario usuarioExistente = usuarioExistenteOpt.get();
                logger.info("🔄 Actualizando usuario existente con ID: {}", usuarioExistente.getIdUsuario());
                
                // Crear copia del estado anterior para auditoría manual si es necesario
                Usuario usuarioAnterior = new Usuario();
                usuarioAnterior.setIdUsuario(usuarioExistente.getIdUsuario());
                usuarioAnterior.setDocumento(usuarioExistente.getDocumento());
                usuarioAnterior.setNombre(usuarioExistente.getNombre());
                usuarioAnterior.setCorreo(usuarioExistente.getCorreo());
                usuarioAnterior.setFechaNacimiento(usuarioExistente.getFechaNacimiento());
                usuarioAnterior.setCedulaExpedicion(usuarioExistente.getCedulaExpedicion());
                usuarioAnterior.setPaisNacimiento(usuarioExistente.getPaisNacimiento());
                usuarioAnterior.setCiudadNacimiento(usuarioExistente.getCiudadNacimiento());
                usuarioAnterior.setCargo(usuarioExistente.getCargo());
                usuarioAnterior.setArea(usuarioExistente.getArea());
                usuarioAnterior.setEstadoCivil(usuarioExistente.getEstadoCivil());
                usuarioAnterior.setTipoSangre(usuarioExistente.getTipoSangre());
                usuarioAnterior.setNumeroFijo(usuarioExistente.getNumeroFijo());
                usuarioAnterior.setNumeroCelular(usuarioExistente.getNumeroCelular());
                usuarioAnterior.setNumeroCorp(usuarioExistente.getNumeroCorp());
                
                // Actualizar campos solo si han cambiado
                boolean hasChanges = false;
                
                if (usuario.getNombre() != null && !usuario.getNombre().equals(usuarioExistente.getNombre())) {
                    logger.info("🔄 Cambio detectado en nombre: '{}' -> '{}'", usuarioExistente.getNombre(), usuario.getNombre());
                    usuarioExistente.setNombre(usuario.getNombre());
                    hasChanges = true;
                }
                
                if (usuario.getCorreo() != null && !usuario.getCorreo().equals(usuarioExistente.getCorreo())) {
                    logger.info("🔄 Cambio detectado en correo: '{}' -> '{}'", usuarioExistente.getCorreo(), usuario.getCorreo());
                    usuarioExistente.setCorreo(usuario.getCorreo());
                    hasChanges = true;
                }
                
                if (usuario.getFechaNacimiento() != null && !usuario.getFechaNacimiento().equals(usuarioExistente.getFechaNacimiento())) {
                    logger.info("🔄 Cambio detectado en fecha nacimiento: '{}' -> '{}'", usuarioExistente.getFechaNacimiento(), usuario.getFechaNacimiento());
                    usuarioExistente.setFechaNacimiento(usuario.getFechaNacimiento());
                    hasChanges = true;
                }
                
                if (usuario.getCedulaExpedicion() != null && !usuario.getCedulaExpedicion().equals(usuarioExistente.getCedulaExpedicion())) {
                    logger.info("🔄 Cambio detectado en cédula expedición: '{}' -> '{}'", usuarioExistente.getCedulaExpedicion(), usuario.getCedulaExpedicion());
                    usuarioExistente.setCedulaExpedicion(usuario.getCedulaExpedicion());
                    hasChanges = true;
                }
                
                if (usuario.getPaisNacimiento() != null && !usuario.getPaisNacimiento().equals(usuarioExistente.getPaisNacimiento())) {
                    logger.info("🔄 Cambio detectado en país nacimiento: '{}' -> '{}'", usuarioExistente.getPaisNacimiento(), usuario.getPaisNacimiento());
                    usuarioExistente.setPaisNacimiento(usuario.getPaisNacimiento());
                    hasChanges = true;
                }
                
                if (usuario.getCiudadNacimiento() != null && !usuario.getCiudadNacimiento().equals(usuarioExistente.getCiudadNacimiento())) {
                    logger.info("🔄 Cambio detectado en ciudad nacimiento: '{}' -> '{}'", usuarioExistente.getCiudadNacimiento(), usuario.getCiudadNacimiento());
                    usuarioExistente.setCiudadNacimiento(usuario.getCiudadNacimiento());
                    hasChanges = true;
                }
                
                if (usuario.getCargo() != null && !usuario.getCargo().equals(usuarioExistente.getCargo())) {
                    logger.info("🔄 Cambio detectado en cargo: '{}' -> '{}'", usuarioExistente.getCargo(), usuario.getCargo());
                    usuarioExistente.setCargo(usuario.getCargo());
                    hasChanges = true;
                }
                
                if (usuario.getArea() != null && !usuario.getArea().equals(usuarioExistente.getArea())) {
                    logger.info("🔄 Cambio detectado en área: '{}' -> '{}'", usuarioExistente.getArea(), usuario.getArea());
                    usuarioExistente.setArea(usuario.getArea());
                    hasChanges = true;
                }
                
                if (usuario.getEstadoCivil() != null && !usuario.getEstadoCivil().equals(usuarioExistente.getEstadoCivil())) {
                    logger.info("🔄 Cambio detectado en estado civil: '{}' -> '{}'", usuarioExistente.getEstadoCivil(), usuario.getEstadoCivil());
                    usuarioExistente.setEstadoCivil(usuario.getEstadoCivil());
                    hasChanges = true;
                }
                
                if (usuario.getTipoSangre() != null && !usuario.getTipoSangre().equals(usuarioExistente.getTipoSangre())) {
                    logger.info("🔄 Cambio detectado en tipo sangre: '{}' -> '{}'", usuarioExistente.getTipoSangre(), usuario.getTipoSangre());
                    usuarioExistente.setTipoSangre(usuario.getTipoSangre());
                    hasChanges = true;
                }
                
                if (usuario.getNumeroFijo() != null && !usuario.getNumeroFijo().equals(usuarioExistente.getNumeroFijo())) {
                    logger.info("🔄 Cambio detectado en número fijo: '{}' -> '{}'", usuarioExistente.getNumeroFijo(), usuario.getNumeroFijo());
                    usuarioExistente.setNumeroFijo(usuario.getNumeroFijo());
                    hasChanges = true;
                }
                
                if (usuario.getNumeroCelular() != null && !usuario.getNumeroCelular().equals(usuarioExistente.getNumeroCelular())) {
                    logger.info("🔄 Cambio detectado en número celular: '{}' -> '{}'", usuarioExistente.getNumeroCelular(), usuario.getNumeroCelular());
                    usuarioExistente.setNumeroCelular(usuario.getNumeroCelular());
                    hasChanges = true;
                }
                
                if (usuario.getNumeroCorp() != null && !usuario.getNumeroCorp().equals(usuarioExistente.getNumeroCorp())) {
                    logger.info("🔄 Cambio detectado en número corporativo: '{}' -> '{}'", usuarioExistente.getNumeroCorp(), usuario.getNumeroCorp());
                    usuarioExistente.setNumeroCorp(usuario.getNumeroCorp());
                    hasChanges = true;
                }
                
                if (hasChanges) {
                    logger.info("✅ Se detectaron cambios, actualizando usuario...");
                    usuarioExistente.setVersion(usuarioExistente.getVersion() + 1);
                    
                    // Registrar auditoría manual antes de actualizar
                    try {
                        String usuarioModificador = auditoriaInterceptor.obtenerUsuarioActual();
                        Long idUsuarioModificador = auditoriaInterceptor.obtenerIdUsuarioActual();
                        logger.info("🔍 Registrando auditoría manual para usuario: {} con modificador: {}", 
                                  usuarioExistente.getIdUsuario(), usuarioModificador);
                        auditoriaInterceptor.registrarActualizacion("USUARIO", usuarioAnterior, usuarioExistente, 
                                                                 idUsuarioModificador, usuarioModificador);
                        logger.info("✅ Auditoría manual registrada exitosamente para usuario: {}", usuarioExistente.getIdUsuario());
                    } catch (Exception e) {
                        logger.warn("⚠️ Error registrando auditoría manual: {}", e.getMessage());
                        e.printStackTrace();
                    }
                    
                    usuarioGuardado = usuarioBaseService.update(usuarioExistente.getIdUsuario(), usuarioExistente);
                } else {
                    logger.info("ℹ️ No se detectaron cambios en los datos del usuario");
                    usuarioGuardado = usuarioExistente;
                }
            } else {
                // Crear nuevo usuario usando el servicio base con auditoría
                logger.info("➕ Creando nuevo usuario");
                usuario.setVersion(1);
                usuarioGuardado = usuarioBaseService.save(usuario);
            }
            
            return usuarioGuardado;
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
            
            // Guardar estudio usando el servicio base con auditoría
            EstudioAcademico estudioGuardado = estudioAcademicoBaseService.save(estudio);
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
            
            // Guardar vehículo usando el servicio base con auditoría
            Vehiculo vehiculoGuardado = vehiculoBaseService.save(vehiculo);
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
            
            // Guardar vivienda usando el servicio base con auditoría
            Vivienda viviendaGuardada = viviendaBaseService.save(vivienda);
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
            
            // Guardar persona usando el servicio base con auditoría
            PersonaACargo personaGuardada = personaACargoBaseService.save(persona);
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
            
            // Guardar contacto usando el servicio base con auditoría
            ContactoEmergencia contactoGuardado = contactoEmergenciaBaseService.save(contacto);
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
                
                // Guardar estudio usando el servicio base con auditoría
                EstudioAcademico estudioGuardado = estudioAcademicoBaseService.save(estudio);
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
                
                // Guardar vehículo usando el servicio base con auditoría
                Vehiculo vehiculoGuardado = vehiculoBaseService.save(vehiculo);
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
                
                // Guardar persona usando el servicio base con auditoría
                PersonaACargo personaGuardada = personaACargoBaseService.save(persona);
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
                
                // Guardar contacto usando el servicio base con auditoría
                ContactoEmergencia contactoGuardado = contactoEmergenciaBaseService.save(contacto);
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
            
            // Usar el servicio base para eliminar con auditoría automática
            for (EstudioAcademico estudio : estudios) {
                estudioAcademicoBaseService.delete(estudio.getIdEstudios());
            }
            
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
            
            // Usar el servicio base para eliminar con auditoría automática
            for (Vehiculo vehiculo : vehiculos) {
                vehiculoBaseService.delete(vehiculo.getIdVehiculo());
            }
            
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
            
            // Usar el servicio base para eliminar con auditoría automática
            for (Vivienda vivienda : viviendas) {
                viviendaBaseService.delete(vivienda.getIdVivienda());
            }
            
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
            
            // Usar el servicio base para eliminar con auditoría automática
            for (PersonaACargo persona : personas) {
                personaACargoBaseService.delete(persona.getIdFamilia());
            }
            
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
            
            // Usar el servicio base para eliminar con auditoría automática
            for (ContactoEmergencia contacto : contactos) {
                contactoEmergenciaBaseService.delete(contacto.getIdContacto());
            }
            
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
                
                // Guardar relación usando el servicio base con auditoría
                RelacionConf relacionGuardada = relacionConfBaseService.save(relacion);
                relacionesGuardadas.add(relacionGuardada);
                logger.info("✅ Relación de conflicto guardada exitosamente con ID: {}", relacionGuardada.getIdRelacionConf());
            }
            
            return relacionesGuardadas;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar relaciones de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar relaciones de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== GUARDAR UNA SOLA RELACIÓN DE CONFLICTO ==========
    public RelacionConf guardarRelacionConflicto(RelacionConf relacion, Long idUsuario) {
        logger.info("💾 Guardando relación de conflicto para usuario ID: {}", idUsuario);
        
        try {
            // Buscar usuario por ID
            Optional<Usuario> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
            }
            
            // Asignar usuario a la relación
            relacion.setUsuario(usuario.get());
            
            // Guardar relación usando el servicio base con auditoría
            RelacionConf relacionGuardada = relacionConfBaseService.save(relacion);
            logger.info("✅ Relación de conflicto guardada exitosamente con ID: {}", relacionGuardada.getIdRelacionConf());
            
            return relacionGuardada;
            
        } catch (Exception e) {
            logger.error("❌ Error al guardar relación de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al guardar relación de conflicto: " + e.getMessage(), e);
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
            
            // Usar el servicio base para eliminar con auditoría automática
            for (RelacionConf relacion : relaciones) {
                relacionConfBaseService.delete(relacion.getIdRelacionConf());
            }
            
            logger.info("✅ Relaciones de conflicto eliminadas exitosamente para usuario ID: {}", idUsuario);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar relaciones de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar relaciones de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS DE ACTUALIZACIÓN ==========
    
    public EstudioAcademico actualizarEstudioAcademico(EstudioAcademico estudio) {
        logger.info("📚 Actualizando estudio académico con ID: {}", estudio.getIdEstudios());
        try {
            return estudioAcademicoBaseService.update(estudio.getIdEstudios(), estudio);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar estudio académico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar estudio académico: " + e.getMessage(), e);
        }
    }
    
    public Vehiculo actualizarVehiculo(Vehiculo vehiculo) {
        logger.info("🚗 Actualizando vehículo con ID: {}", vehiculo.getIdVehiculo());
        try {
            return vehiculoBaseService.update(vehiculo.getIdVehiculo(), vehiculo);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar vehículo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar vehículo: " + e.getMessage(), e);
        }
    }
    
    public Vivienda actualizarVivienda(Vivienda vivienda) {
        logger.info("🏠 Actualizando vivienda con ID: {}", vivienda.getIdVivienda());
        try {
            return viviendaBaseService.update(vivienda.getIdVivienda(), vivienda);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar vivienda: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar vivienda: " + e.getMessage(), e);
        }
    }
    
    public PersonaACargo actualizarPersonaACargo(PersonaACargo persona) {
        logger.info("👨‍👩‍👧‍👦 Actualizando persona a cargo con ID: {}", persona.getIdFamilia());
        try {
            return personaACargoBaseService.update(persona.getIdFamilia(), persona);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar persona a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar persona a cargo: " + e.getMessage(), e);
        }
    }
    
    public ContactoEmergencia actualizarContactoEmergencia(ContactoEmergencia contacto) {
        logger.info("📞 Actualizando contacto de emergencia con ID: {}", contacto.getIdContacto());
        try {
            return contactoEmergenciaBaseService.update(contacto.getIdContacto(), contacto);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar contacto de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar contacto de emergencia: " + e.getMessage(), e);
        }
    }
    
    public RelacionConf actualizarRelacionConf(RelacionConf relacion) {
        logger.info("⚖️ Actualizando relación de conflicto con ID: {}", relacion.getIdRelacionConf());
        try {
            return relacionConfBaseService.update(relacion.getIdRelacionConf(), relacion);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar relación de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar relación de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS DE ELIMINACIÓN INDIVIDUAL ==========
    
    public void eliminarEstudioAcademico(Long idEstudio) {
        logger.info("🗑️ Eliminando estudio académico con ID: {}", idEstudio);
        try {
            estudioAcademicoBaseService.delete(idEstudio);
        } catch (Exception e) {
            logger.error("❌ Error al eliminar estudio académico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar estudio académico: " + e.getMessage(), e);
        }
    }
    
    public void eliminarVehiculo(Long idVehiculo) {
        logger.info("🗑️ Eliminando vehículo con ID: {}", idVehiculo);
        try {
            vehiculoBaseService.delete(idVehiculo);
        } catch (Exception e) {
            logger.error("❌ Error al eliminar vehículo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar vehículo: " + e.getMessage(), e);
        }
    }
    
    public void eliminarPersonaACargo(Long idPersona) {
        logger.info("🗑️ Eliminando persona a cargo con ID: {}", idPersona);
        try {
            personaACargoBaseService.delete(idPersona);
        } catch (Exception e) {
            logger.error("❌ Error al eliminar persona a cargo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar persona a cargo: " + e.getMessage(), e);
        }
    }
    
    public void eliminarContactoEmergencia(Long idContacto) {
        logger.info("🗑️ Eliminando contacto de emergencia con ID: {}", idContacto);
        try {
            contactoEmergenciaBaseService.delete(idContacto);
        } catch (Exception e) {
            logger.error("❌ Error al eliminar contacto de emergencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar contacto de emergencia: " + e.getMessage(), e);
        }
    }
    
    public void eliminarRelacionConf(Long idRelacion) {
        logger.info("🗑️ Eliminando relación de conflicto con ID: {}", idRelacion);
        try {
            relacionConfBaseService.delete(idRelacion);
        } catch (Exception e) {
            logger.error("❌ Error al eliminar relación de conflicto: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar relación de conflicto: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
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
        viviendaExistente.setDireccion(viviendaNueva.getDireccion());
        viviendaExistente.setTipoVivienda(viviendaNueva.getTipoVivienda());
        viviendaExistente.setTipoAdquisicion(viviendaNueva.getTipoAdquisicion());
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