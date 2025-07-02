package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.dto.*;
import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.ArrayList;

@Service
public class FormularioService {
    
    // Almacenamiento temporal en memoria por cédula
    private final Map<Long, InformacionPersonalDTO> informacionPersonalTemp = new ConcurrentHashMap<>();
    private final Map<Long, List<EstudioAcademicoDTO>> estudiosTemp = new ConcurrentHashMap<>();
    private final Map<Long, List<VehiculoDTO>> vehiculosTemp = new ConcurrentHashMap<>();
    private final Map<Long, ViviendaDTO> viviendaTemp = new ConcurrentHashMap<>();
    private final Map<Long, List<PersonaACargoDTO>> personasACargoTemp = new ConcurrentHashMap<>();
    private final Map<Long, List<ContactoEmergenciaDTO>> contactosEmergenciaTemp = new ConcurrentHashMap<>();
    
    @Autowired
    private InformacionPersonalRepository informacionPersonalRepository;
    
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
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    // ========== MÉTODOS DE GUARDADO TEMPORAL ==========
    
    public void guardarInformacionPersonalTemporal(InformacionPersonalDTO dto) {
        informacionPersonalTemp.put(dto.getCedula(), dto);
    }
    
    public void guardarEstudiosTemporal(Long cedula, List<EstudioAcademicoDTO> estudios) {
        estudiosTemp.put(cedula, estudios);
    }
    
    public void guardarVehiculosTemporal(Long cedula, List<VehiculoDTO> vehiculos) {
        vehiculosTemp.put(cedula, vehiculos);
    }
    
    public void guardarViviendaTemporal(Long cedula, ViviendaDTO vivienda) {
        viviendaTemp.put(cedula, vivienda);
    }
    
    public void guardarPersonasACargoTemporal(Long cedula, List<PersonaACargoDTO> personas) {
        personasACargoTemp.put(cedula, personas);
    }
    
    public void guardarContactosEmergenciaTemporal(Long cedula, List<ContactoEmergenciaDTO> contactos) {
        contactosEmergenciaTemp.put(cedula, contactos);
    }
    
    // ========== MÉTODOS DE CONSULTA TEMPORAL ==========
    
    public InformacionPersonalDTO obtenerInformacionPersonalTemporal(Long cedula) {
        return informacionPersonalTemp.get(cedula);
    }
    
    public List<EstudioAcademicoDTO> obtenerEstudiosTemporal(Long cedula) {
        return estudiosTemp.getOrDefault(cedula, new ArrayList<>());
    }
    
    public List<VehiculoDTO> obtenerVehiculosTemporal(Long cedula) {
        return vehiculosTemp.getOrDefault(cedula, new ArrayList<>());
    }
    
    public ViviendaDTO obtenerViviendaTemporal(Long cedula) {
        return viviendaTemp.get(cedula);
    }
    
    public List<PersonaACargoDTO> obtenerPersonasACargoTemporal(Long cedula) {
        return personasACargoTemp.getOrDefault(cedula, new ArrayList<>());
    }
    
    public List<ContactoEmergenciaDTO> obtenerContactosEmergenciaTemporal(Long cedula) {
        return contactosEmergenciaTemp.getOrDefault(cedula, new ArrayList<>());
    }
    
    // ========== MÉTODOS DE UTILIDAD ==========
    
    public void limpiarDatosTemporales(Long cedula) {
        informacionPersonalTemp.remove(cedula);
        estudiosTemp.remove(cedula);
        vehiculosTemp.remove(cedula);
        viviendaTemp.remove(cedula);
        personasACargoTemp.remove(cedula);
        contactosEmergenciaTemp.remove(cedula);
    }
    
    public boolean tieneInformacionPersonalTemporal(Long cedula) {
        return informacionPersonalTemp.containsKey(cedula);
    }
    
    public boolean formularioCompletoTemporal(Long cedula) {
        return informacionPersonalTemp.containsKey(cedula) &&
               estudiosTemp.containsKey(cedula) &&
               vehiculosTemp.containsKey(cedula) &&
               viviendaTemp.containsKey(cedula) &&
               personasACargoTemp.containsKey(cedula) &&
               contactosEmergenciaTemp.containsKey(cedula);
    }
    
    // ========== MÉTODO DE GUARDADO DEFINITIVO ==========
    
    @Transactional
    public void guardarFormularioCompleto(Long cedula) {
        // Obtener el usuario por cédula
        Usuario usuario = usuarioRepository.findByCedula(cedula)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con cédula: " + cedula));
        
        Long idUsuario = usuario.getId();
        
        // Guardar estudios académicos
        if (estudiosTemp.containsKey(cedula)) {
            List<EstudioAcademicoDTO> estudiosDTO = estudiosTemp.get(cedula);
            for (EstudioAcademicoDTO estudioDTO : estudiosDTO) {
                EstudioAcademico estudio = modelMapper.map(estudioDTO, EstudioAcademico.class);
                estudio.setIdUsuario(idUsuario);
                estudioAcademicoRepository.save(estudio);
            }
        }
        
        // Guardar vehículos
        if (vehiculosTemp.containsKey(cedula)) {
            List<VehiculoDTO> vehiculosDTO = vehiculosTemp.get(cedula);
            for (VehiculoDTO vehiculoDTO : vehiculosDTO) {
                Vehiculo vehiculo = modelMapper.map(vehiculoDTO, Vehiculo.class);
                vehiculo.setIdUsuario(idUsuario);
                vehiculoRepository.save(vehiculo);
            }
        }
        
        // Guardar vivienda
        if (viviendaTemp.containsKey(cedula)) {
            ViviendaDTO viviendaDTO = viviendaTemp.get(cedula);
            Vivienda vivienda = modelMapper.map(viviendaDTO, Vivienda.class);
            vivienda.setIdUsuario(idUsuario);
            viviendaRepository.save(vivienda);
        }
        
        // Guardar personas a cargo
        if (personasACargoTemp.containsKey(cedula)) {
            List<PersonaACargoDTO> personasDTO = personasACargoTemp.get(cedula);
            for (PersonaACargoDTO personaDTO : personasDTO) {
                PersonaACargo persona = modelMapper.map(personaDTO, PersonaACargo.class);
                persona.setIdUsuario(idUsuario);
                personaACargoRepository.save(persona);
            }
        }
        
        // Guardar contactos de emergencia
        if (contactosEmergenciaTemp.containsKey(cedula)) {
            List<ContactoEmergenciaDTO> contactosDTO = contactosEmergenciaTemp.get(cedula);
            for (ContactoEmergenciaDTO contactoDTO : contactosDTO) {
                ContactoEmergencia contacto = modelMapper.map(contactoDTO, ContactoEmergencia.class);
                contacto.setIdUsuario(idUsuario);
                contactoEmergenciaRepository.save(contacto);
            }
        }
        
        // Limpiar datos temporales
        limpiarDatosTemporales(cedula);
    }
    
    // ========== MÉTODOS DE CONSULTA DE BASE DE DATOS POR IDUSUARIO ==========
    
    public InformacionPersonal obtenerInformacionPersonalBD(Long cedula) {
        return informacionPersonalRepository.findByCedula(cedula).orElse(null);
    }
    
    public List<EstudioAcademico> obtenerEstudiosBDPorIdUsuario(Long idUsuario) {
        return estudioAcademicoRepository.findByIdUsuario(idUsuario);
    }
    
    public List<Vehiculo> obtenerVehiculosBDPorIdUsuario(Long idUsuario) {
        return vehiculoRepository.findByIdUsuario(idUsuario);
    }
    
    public Vivienda obtenerViviendaBDPorIdUsuario(Long idUsuario) {
        return viviendaRepository.findByIdUsuario(idUsuario).orElse(null);
    }
    
    public List<PersonaACargo> obtenerPersonasACargoBDPorIdUsuario(Long idUsuario) {
        return personaACargoRepository.findByIdUsuario(idUsuario);
    }
    
    public List<ContactoEmergencia> obtenerContactosEmergenciaBDPorIdUsuario(Long idUsuario) {
        return contactoEmergenciaRepository.findByIdUsuario(idUsuario);
    }
    
    // ========== MÉTODOS DE CONSULTA POR CÉDULA ==========
    
    public List<EstudioAcademico> obtenerEstudiosBD(Long cedula) {
        Usuario usuario = usuarioRepository.findByCedula(cedula).orElse(null);
        if (usuario == null) return new ArrayList<>();
        return estudioAcademicoRepository.findByIdUsuario(usuario.getId());
    }
    
    public List<Vehiculo> obtenerVehiculosBD(Long cedula) {
        Usuario usuario = usuarioRepository.findByCedula(cedula).orElse(null);
        if (usuario == null) return new ArrayList<>();
        return vehiculoRepository.findByIdUsuario(usuario.getId());
    }
    
    public Vivienda obtenerViviendaBD(Long cedula) {
        Usuario usuario = usuarioRepository.findByCedula(cedula).orElse(null);
        if (usuario == null) return null;
        return viviendaRepository.findByIdUsuario(usuario.getId()).orElse(null);
    }
    
    public List<PersonaACargo> obtenerPersonasACargoBD(Long cedula) {
        Usuario usuario = usuarioRepository.findByCedula(cedula).orElse(null);
        if (usuario == null) return new ArrayList<>();
        return personaACargoRepository.findByIdUsuario(usuario.getId());
    }
    
    public List<ContactoEmergencia> obtenerContactosEmergenciaBD(Long cedula) {
        Usuario usuario = usuarioRepository.findByCedula(cedula).orElse(null);
        if (usuario == null) return new ArrayList<>();
        return contactoEmergenciaRepository.findByIdUsuario(usuario.getId());
    }
    
    // ========== MÉTODOS DE GUARDADO DIRECTO EN BASE DE DATOS ==========
    
    @Transactional
    public Map<String, Object> guardarInformacionPersonalDirecto(Map<String, Object> datos) {
        try {
            // Convertir y validar datos
            String nombre = (String) datos.get("nombre");
            String cedulaStr = datos.get("cedula").toString();
            String correo = (String) datos.get("correo");
            
            if (nombre == null || cedulaStr == null || correo == null) {
                throw new IllegalArgumentException("Nombre, cédula y correo son requeridos");
            }
            
            Long cedula = Long.parseLong(cedulaStr);
            
            // Verificar si ya existe un usuario con esta cédula
            Optional<Usuario> usuarioExistente = usuarioRepository.findByCedula(cedula);
            Usuario usuario;
            
            if (usuarioExistente.isPresent()) {
                // Actualizar usuario existente
                usuario = usuarioExistente.get();
                usuario.setNombre(nombre);
                usuario.setCorreo(correo);
            } else {
                // Crear nuevo usuario
                usuario = new Usuario();
                usuario.setNombre(nombre);
                usuario.setCedula(cedula);
                usuario.setCorreo(correo);
            }
            
            // Mapear campos adicionales
            if (datos.get("numeroFijo") != null) {
                usuario.setNumeroFijo(Long.parseLong(datos.get("numeroFijo").toString()));
            }
            if (datos.get("numeroCelular") != null) {
                usuario.setNumeroCelular(Long.parseLong(datos.get("numeroCelular").toString()));
            }
            if (datos.get("numeroCorp") != null) {
                usuario.setNumeroCorp(Long.parseLong(datos.get("numeroCorp").toString()));
            }
            if (datos.get("cedulaExpedicion") != null) {
                usuario.setCedulaExpedicion((String) datos.get("cedulaExpedicion"));
            }
            if (datos.get("paisNacimiento") != null) {
                usuario.setPaisNacimiento((String) datos.get("paisNacimiento"));
            }
            if (datos.get("ciudadNacimiento") != null) {
                usuario.setCiudadNacimiento((String) datos.get("ciudadNacimiento"));
            }
            if (datos.get("cargo") != null) {
                usuario.setCargo((String) datos.get("cargo"));
            }
            if (datos.get("area") != null) {
                usuario.setArea((String) datos.get("area"));
            }
            if (datos.get("estadoCivil") != null) {
                usuario.setEstadoCivil((String) datos.get("estadoCivil"));
            }
            if (datos.get("tipoSangre") != null) {
                usuario.setTipoSangre((String) datos.get("tipoSangre"));
            }
            if (datos.get("fechaNacimiento") != null) {
                String fechaStr = datos.get("fechaNacimiento").toString();
                try {
                    // Intentar formato YYYY-MM-DD
                    LocalDate fecha = LocalDate.parse(fechaStr);
                    usuario.setFechaNacimiento(fecha);
                } catch (Exception e) {
                    try {
                        // Intentar formato DD/MM/YYYY
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                        LocalDate fecha = LocalDate.parse(fechaStr, formatter);
                        usuario.setFechaNacimiento(fecha);
                    } catch (Exception e2) {
                        // Si no se puede convertir, dejar nulo
                    }
                }
            }
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            
            // Retornar datos del usuario guardado
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("id", usuarioGuardado.getId());
            resultado.put("nombre", usuarioGuardado.getNombre());
            resultado.put("cedula", usuarioGuardado.getCedula());
            resultado.put("correo", usuarioGuardado.getCorreo());
            resultado.put("version", usuarioGuardado.getVersion());
            
            return resultado;
            
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar información personal: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public List<Map<String, Object>> guardarEstudiosDirecto(Long idUsuario, List<Map<String, Object>> estudiosData) {
        try {
            // Primero eliminamos los estudios existentes (no hay soft delete en la tabla actual)
            List<EstudioAcademico> estudiosExistentes = estudioAcademicoRepository.findByIdUsuarioAndActivoTrue(idUsuario);
            for (EstudioAcademico estudio : estudiosExistentes) {
                estudioAcademicoRepository.delete(estudio);
            }

            List<Map<String, Object>> estudiosGuardados = new ArrayList<>();

            for (Map<String, Object> estudioData : estudiosData) {
                EstudioAcademico estudio = new EstudioAcademico();
                
                // Usar el campo idUsuario directamente
                estudio.setIdUsuario(idUsuario);
                
                // Mapear campos desde el Map al entity
                if (estudioData.get("institucion") != null) {
                    estudio.setInstitucion(estudioData.get("institucion").toString());
                }
                if (estudioData.get("nivelEducativo") != null) {
                    estudio.setNivelEducativo(estudioData.get("nivelEducativo").toString());
                }
                if (estudioData.get("titulo") != null) {
                    estudio.setTitulo(estudioData.get("titulo").toString());
                }
                
                // Manejar semestre si está disponible
                if (estudioData.get("semestre") != null) {
                    try {
                        estudio.setSemestre(Integer.parseInt(estudioData.get("semestre").toString()));
                    } catch (Exception e) {
                        estudio.setSemestre(null);
                    }
                }
                
                // Manejar graduación basado en graduado/enCurso
                if (estudioData.get("graduado") != null) {
                    Boolean graduado = Boolean.parseBoolean(estudioData.get("graduado").toString());
                    if (graduado) {
                        estudio.setGraduacion("Sí");
                    } else {
                        estudio.setGraduacion("No");
                    }
                } else if (estudioData.get("enCurso") != null) {
                    Boolean enCurso = Boolean.parseBoolean(estudioData.get("enCurso").toString());
                    if (enCurso) {
                        estudio.setGraduacion("En curso");
                    } else {
                        estudio.setGraduacion("No");
                    }
                } else {
                    estudio.setGraduacion("No");
                }
                
                // Establecer versión por defecto
                estudio.setVersion(1);
                
                EstudioAcademico estudioGuardado = estudioAcademicoRepository.save(estudio);
                
                // Crear mapa de respuesta
                Map<String, Object> estudioResponse = new HashMap<>();
                estudioResponse.put("id", estudioGuardado.getId());
                estudioResponse.put("institucion", estudioGuardado.getInstitucion());
                estudioResponse.put("nivelEducativo", estudioGuardado.getNivelEducativo());
                estudioResponse.put("titulo", estudioGuardado.getTitulo());
                estudioResponse.put("semestre", estudioGuardado.getSemestre());
                estudioResponse.put("graduacion", estudioGuardado.getGraduacion());
                estudioResponse.put("graduado", estudioGuardado.getGraduado());
                estudioResponse.put("enCurso", estudioGuardado.getEnCurso());
                estudioResponse.put("version", estudioGuardado.getVersion());
                
                estudiosGuardados.add(estudioResponse);
            }

            return estudiosGuardados;

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar estudios académicos: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public List<Map<String, Object>> guardarVehiculosDirecto(Long idUsuario, List<Map<String, Object>> vehiculosData) {
        try {
            // Primero eliminamos los vehículos existentes
            List<Vehiculo> vehiculosExistentes = vehiculoRepository.findByIdUsuario(idUsuario);
            vehiculoRepository.deleteAll(vehiculosExistentes);

            List<Map<String, Object>> vehiculosGuardados = new ArrayList<>();

            for (Map<String, Object> vehiculoData : vehiculosData) {
                Vehiculo vehiculo = new Vehiculo();
                
                // Usar el campo idUsuario directamente
                vehiculo.setIdUsuario(idUsuario);
                
                // Mapear solo los campos que existen en la tabla VEHICULO
                if (vehiculoData.get("tipoVehiculo") != null) {
                    vehiculo.setTipoVehiculo(vehiculoData.get("tipoVehiculo").toString());
                }
                if (vehiculoData.get("marca") != null) {
                    vehiculo.setMarca(vehiculoData.get("marca").toString());
                }
                if (vehiculoData.get("placa") != null) {
                    vehiculo.setPlaca(vehiculoData.get("placa").toString());
                }
                if (vehiculoData.get("anio") != null) {
                    vehiculo.setAnio(Integer.parseInt(vehiculoData.get("anio").toString()));
                }
                if (vehiculoData.get("propietario") != null) {
                    vehiculo.setPropietario(vehiculoData.get("propietario").toString());
                }
                
                // Establecer versión por defecto
                vehiculo.setVersion(1);
                
                Vehiculo vehiculoGuardado = vehiculoRepository.save(vehiculo);
                
                // Crear mapa de respuesta con solo los campos que realmente existen
                Map<String, Object> vehiculoResponse = new HashMap<>();
                vehiculoResponse.put("id", vehiculoGuardado.getIdVehiculo());
                vehiculoResponse.put("tipoVehiculo", vehiculoGuardado.getTipoVehiculo());
                vehiculoResponse.put("marca", vehiculoGuardado.getMarca());
                vehiculoResponse.put("placa", vehiculoGuardado.getPlaca());
                vehiculoResponse.put("anio", vehiculoGuardado.getAnio());
                vehiculoResponse.put("propietario", vehiculoGuardado.getPropietario());
                vehiculoResponse.put("version", vehiculoGuardado.getVersion());
                
                vehiculosGuardados.add(vehiculoResponse);
            }

            return vehiculosGuardados;

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar vehículos: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public Map<String, Object> guardarViviendaDirecto(Long idUsuario, Map<String, Object> viviendaData) {
        try {
            // Primero eliminamos la vivienda existente
            Optional<Vivienda> viviendaExistente = viviendaRepository.findByIdUsuario(idUsuario);
            if (viviendaExistente.isPresent()) {
                viviendaRepository.delete(viviendaExistente.get());
            }

            Vivienda vivienda = new Vivienda();
            
            // Usar el campo idUsuario directamente
            vivienda.setIdUsuario(idUsuario);
            
            // Mapear solo los campos que existen en la tabla VIVIENDA
            if (viviendaData.get("tipoVivienda") != null) {
                vivienda.setTipoVivienda(viviendaData.get("tipoVivienda").toString());
            }
            if (viviendaData.get("direccion") != null) {
                vivienda.setDireccion(viviendaData.get("direccion").toString());
            }
            if (viviendaData.get("infoAdicional") != null) {
                vivienda.setInfoAdicional(viviendaData.get("infoAdicional").toString());
            }
            if (viviendaData.get("barrio") != null) {
                vivienda.setBarrio(viviendaData.get("barrio").toString());
            }
            if (viviendaData.get("ciudad") != null) {
                vivienda.setCiudad(viviendaData.get("ciudad").toString());
            }
            if (viviendaData.get("vivienda") != null) {
                vivienda.setVivienda(viviendaData.get("vivienda").toString());
            }
            if (viviendaData.get("entidad") != null) {
                vivienda.setEntidad(viviendaData.get("entidad").toString());
            }
            if (viviendaData.get("anio") != null) {
                vivienda.setAnio(Integer.parseInt(viviendaData.get("anio").toString()));
            }
            if (viviendaData.get("tipoAdquisicion") != null) {
                vivienda.setTipoAdquisicion(viviendaData.get("tipoAdquisicion").toString());
            }
            
            Vivienda viviendaGuardada = viviendaRepository.save(vivienda);
            
            // Crear mapa de respuesta con solo los campos que realmente existen
            Map<String, Object> viviendaResponse = new HashMap<>();
            viviendaResponse.put("id", viviendaGuardada.getIdVivienda());
            viviendaResponse.put("tipoVivienda", viviendaGuardada.getTipoVivienda());
            viviendaResponse.put("direccion", viviendaGuardada.getDireccion());
            viviendaResponse.put("infoAdicional", viviendaGuardada.getInfoAdicional());
            viviendaResponse.put("barrio", viviendaGuardada.getBarrio());
            viviendaResponse.put("ciudad", viviendaGuardada.getCiudad());
            viviendaResponse.put("vivienda", viviendaGuardada.getVivienda());
            viviendaResponse.put("entidad", viviendaGuardada.getEntidad());
            viviendaResponse.put("anio", viviendaGuardada.getAnio());
            viviendaResponse.put("tipoAdquisicion", viviendaGuardada.getTipoAdquisicion());

            return viviendaResponse;

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar vivienda: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public List<Map<String, Object>> guardarPersonasCargoDirecto(Long idUsuario, List<Map<String, Object>> personasData) {
        try {
            List<Map<String, Object>> personasGuardadas = new ArrayList<>();

            for (Map<String, Object> personaData : personasData) {
                PersonaACargo persona = new PersonaACargo();
                
                // Usar el campo idUsuario directamente
                persona.setIdUsuario(idUsuario);
                
                // Mapear campos desde el Map al entity (solo los que existen en la tabla FAMILIA)
                if (personaData.get("nombre") != null) {
                    persona.setNombre(personaData.get("nombre").toString());
                }
                if (personaData.get("parentesco") != null) {
                    persona.setParentesco(personaData.get("parentesco").toString());
                }
                if (personaData.get("fechaNacimiento") != null) {
                    try {
                        String fechaStr = personaData.get("fechaNacimiento").toString();
                        LocalDate fecha = LocalDate.parse(fechaStr);
                        persona.setFechaNacimiento(fecha);
                    } catch (Exception e) {
                        persona.setFechaNacimiento(null);
                    }
                }
                if (personaData.get("edad") != null) {
                    try {
                        Integer edad = Integer.parseInt(personaData.get("edad").toString());
                        persona.setEdad(edad);
                    } catch (Exception e) {
                        persona.setEdad(null);
                    }
                }
                if (personaData.get("version") != null) {
                    try {
                        Integer version = Integer.parseInt(personaData.get("version").toString());
                        persona.setVersion(version);
                    } catch (Exception e) {
                        persona.setVersion(1); // Valor por defecto
                    }
                } else {
                    persona.setVersion(1); // Valor por defecto
                }
                
                PersonaACargo personaGuardada = personaACargoRepository.save(persona);
                
                // Crear mapa de respuesta (solo con los campos que existen)
                Map<String, Object> personaResponse = new HashMap<>();
                personaResponse.put("id", personaGuardada.getId());
                personaResponse.put("nombre", personaGuardada.getNombre());
                personaResponse.put("parentesco", personaGuardada.getParentesco());
                personaResponse.put("fechaNacimiento", personaGuardada.getFechaNacimiento());
                personaResponse.put("edad", personaGuardada.getEdad());
                personaResponse.put("version", personaGuardada.getVersion());
                personaResponse.put("idUsuario", personaGuardada.getIdUsuario());
                
                personasGuardadas.add(personaResponse);
            }

            return personasGuardadas;

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar personas a cargo: " + e.getMessage(), e);
        }
    }
    
    @Transactional
    public List<Map<String, Object>> guardarContactosEmergenciaDirecto(Long idUsuario, List<Map<String, Object>> contactosData) {
        try {
            List<Map<String, Object>> contactosGuardados = new ArrayList<>();

            for (Map<String, Object> contactoData : contactosData) {
                ContactoEmergencia contacto = new ContactoEmergencia();
                
                // Usar el campo idUsuario directamente
                contacto.setIdUsuario(idUsuario);
                
                // Mapear campos desde el Map al entity (solo los que existen en la tabla CONTACTO)
                if (contactoData.get("nombre") != null) {
                    contacto.setNombreCompleto(contactoData.get("nombre").toString());
                }
                if (contactoData.get("parentesco") != null) {
                    contacto.setParentesco(contactoData.get("parentesco").toString());
                }
                if (contactoData.get("telefono") != null) {
                    contacto.setNumeroCelular(contactoData.get("telefono").toString());
                }
                if (contactoData.get("version") != null) {
                    try {
                        Integer version = Integer.parseInt(contactoData.get("version").toString());
                        contacto.setVersion(version);
                    } catch (Exception e) {
                        contacto.setVersion(1); // Valor por defecto
                    }
                } else {
                    contacto.setVersion(1); // Valor por defecto
                }
                
                ContactoEmergencia contactoGuardado = contactoEmergenciaRepository.save(contacto);
                
                // Crear mapa de respuesta (solo con los campos que existen)
                Map<String, Object> contactoResponse = new HashMap<>();
                contactoResponse.put("id", contactoGuardado.getId());
                contactoResponse.put("nombreCompleto", contactoGuardado.getNombreCompleto());
                contactoResponse.put("parentesco", contactoGuardado.getParentesco());
                contactoResponse.put("numeroCelular", contactoGuardado.getNumeroCelular());
                contactoResponse.put("version", contactoGuardado.getVersion());
                contactoResponse.put("idUsuario", contactoGuardado.getIdUsuario());
                
                contactosGuardados.add(contactoResponse);
            }

            return contactosGuardados;

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar contactos de emergencia: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS DE CONSULTA DIRECTA DE BASE DE DATOS ==========
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerEstudiosDirecto(Long idUsuario) {
        List<EstudioAcademico> estudios = estudioAcademicoRepository.findByIdUsuarioAndActivoTrue(idUsuario);
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        for (EstudioAcademico estudio : estudios) {
            Map<String, Object> estudioMap = new HashMap<>();
            estudioMap.put("id", estudio.getId());
            estudioMap.put("nivelEducativo", estudio.getNivelEducativo());
            estudioMap.put("institucion", estudio.getInstitucion());
            estudioMap.put("titulo", estudio.getTitulo());
            estudioMap.put("semestre", estudio.getSemestre());
            estudioMap.put("graduacion", estudio.getGraduacion());
            estudioMap.put("graduado", estudio.getGraduado());
            estudioMap.put("enCurso", estudio.getEnCurso());
            estudioMap.put("version", estudio.getVersion());
            resultado.add(estudioMap);
        }
        
        return resultado;
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerVehiculosDirecto(Long idUsuario) {
        List<Vehiculo> vehiculos = vehiculoRepository.findByIdUsuario(idUsuario);
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        for (Vehiculo vehiculo : vehiculos) {
            Map<String, Object> vehiculoMap = new HashMap<>();
            vehiculoMap.put("id", vehiculo.getIdVehiculo());
            vehiculoMap.put("tipoVehiculo", vehiculo.getTipoVehiculo());
            vehiculoMap.put("marca", vehiculo.getMarca());
            vehiculoMap.put("placa", vehiculo.getPlaca());
            vehiculoMap.put("anio", vehiculo.getAnio());
            vehiculoMap.put("propietario", vehiculo.getPropietario());
            vehiculoMap.put("version", vehiculo.getVersion());
            
            resultado.add(vehiculoMap);
        }
        
        return resultado;
    }
    
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerViviendaDirecto(Long idUsuario) {
        Optional<Vivienda> viviendaOpt = viviendaRepository.findByIdUsuario(idUsuario);
        
        if (viviendaOpt.isPresent()) {
            Vivienda vivienda = viviendaOpt.get();
            Map<String, Object> viviendaMap = new HashMap<>();
            viviendaMap.put("id", vivienda.getIdVivienda());
            viviendaMap.put("tipoVivienda", vivienda.getTipoVivienda());
            viviendaMap.put("direccion", vivienda.getDireccion());
            viviendaMap.put("infoAdicional", vivienda.getInfoAdicional());
            viviendaMap.put("barrio", vivienda.getBarrio());
            viviendaMap.put("ciudad", vivienda.getCiudad());
            viviendaMap.put("vivienda", vivienda.getVivienda());
            viviendaMap.put("entidad", vivienda.getEntidad());
            viviendaMap.put("anio", vivienda.getAnio());
            viviendaMap.put("tipoAdquisicion", vivienda.getTipoAdquisicion());
            return viviendaMap;
        }
        
        return null;
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerPersonasCargoDirecto(Long idUsuario) {
        List<PersonaACargo> personas = personaACargoRepository.findByIdUsuario(idUsuario);
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        for (PersonaACargo persona : personas) {
            Map<String, Object> personaMap = new HashMap<>();
            personaMap.put("id", persona.getId());
            personaMap.put("nombre", persona.getNombre());
            personaMap.put("parentesco", persona.getParentesco());
            personaMap.put("fechaNacimiento", persona.getFechaNacimiento());
            personaMap.put("edad", persona.getEdad());
            personaMap.put("version", persona.getVersion());
            personaMap.put("idUsuario", persona.getIdUsuario());
            resultado.add(personaMap);
        }
        
        return resultado;
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerContactosEmergenciaDirecto(Long idUsuario) {
        List<ContactoEmergencia> contactos = contactoEmergenciaRepository.findByIdUsuario(idUsuario);
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        for (ContactoEmergencia contacto : contactos) {
            Map<String, Object> contactoMap = new HashMap<>();
            contactoMap.put("id", contacto.getId());
            contactoMap.put("nombreCompleto", contacto.getNombreCompleto());
            contactoMap.put("parentesco", contacto.getParentesco());
            contactoMap.put("numeroCelular", contacto.getNumeroCelular());
            contactoMap.put("version", contacto.getVersion());
            contactoMap.put("idUsuario", contacto.getIdUsuario());
            resultado.add(contactoMap);
        }
        
        return resultado;
    }
    
    // ========== MÉTODOS PARA DECLARACIONES DE CONFLICTO ==========
    
    @Transactional
    public List<Map<String, Object>> guardarDeclaracionesConflictoDirecto(Long idUsuario, List<Map<String, Object>> declaracionesData) {
        try {
            List<Map<String, Object>> declaracionesGuardadas = new ArrayList<>();

            for (Map<String, Object> declaracionData : declaracionesData) {
                RelacionConf declaracion = new RelacionConf();
                
                // Usar el campo idUsuario directamente
                declaracion.setIdUsuario(idUsuario);
                
                // Mapear campos desde el Map al entity (solo los que existen en la tabla RELACION_CONF)
                if (declaracionData.get("nombre") != null) {
                    declaracion.setNombreCompleto(declaracionData.get("nombre").toString());
                }
                if (declaracionData.get("parentesco") != null) {
                    declaracion.setParentesco(declaracionData.get("parentesco").toString());
                }
                if (declaracionData.get("tipoParteInteresada") != null) {
                    declaracion.setTipoParteAsoc(declaracionData.get("tipoParteInteresada").toString());
                }
                if (declaracionData.get("version") != null) {
                    try {
                        Integer version = Integer.parseInt(declaracionData.get("version").toString());
                        declaracion.setVersion(version);
                    } catch (Exception e) {
                        declaracion.setVersion(1); // Valor por defecto
                    }
                } else {
                    declaracion.setVersion(1); // Valor por defecto
                }
                
                // Establecer fecha de creación
                declaracion.setFechaCreacion(java.time.LocalDate.now().toString());
                
                RelacionConf declaracionGuardada = relacionConfRepository.save(declaracion);
                
                // Crear mapa de respuesta (solo con los campos que existen)
                Map<String, Object> declaracionResponse = new HashMap<>();
                declaracionResponse.put("id", declaracionGuardada.getId());
                declaracionResponse.put("nombreCompleto", declaracionGuardada.getNombreCompleto());
                declaracionResponse.put("parentesco", declaracionGuardada.getParentesco());
                declaracionResponse.put("tipoParteAsoc", declaracionGuardada.getTipoParteAsoc());
                declaracionResponse.put("version", declaracionGuardada.getVersion());
                declaracionResponse.put("fechaCreacion", declaracionGuardada.getFechaCreacion());
                declaracionResponse.put("idUsuario", declaracionGuardada.getIdUsuario());
                
                declaracionesGuardadas.add(declaracionResponse);
            }

            return declaracionesGuardadas;

        } catch (Exception e) {
            throw new RuntimeException("Error al guardar declaraciones de conflicto: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerDeclaracionesConflictoDirecto(Long idUsuario) {
        List<RelacionConf> declaraciones = relacionConfRepository.findByIdUsuario(idUsuario);
        List<Map<String, Object>> resultado = new ArrayList<>();
        
        for (RelacionConf declaracion : declaraciones) {
            Map<String, Object> declaracionMap = new HashMap<>();
            declaracionMap.put("id", declaracion.getId());
            declaracionMap.put("nombreCompleto", declaracion.getNombreCompleto());
            declaracionMap.put("parentesco", declaracion.getParentesco());
            declaracionMap.put("tipoParteAsoc", declaracion.getTipoParteAsoc());
            declaracionMap.put("tieneCl", declaracion.getTieneCl());
            declaracionMap.put("actualizado", declaracion.getActualizado());
            declaracionMap.put("version", declaracion.getVersion());
            declaracionMap.put("fechaCreacion", declaracion.getFechaCreacion());
            declaracionMap.put("idUsuario", declaracion.getIdUsuario());
            resultado.add(declaracionMap);
        }
        
        return resultado;
    }
} 