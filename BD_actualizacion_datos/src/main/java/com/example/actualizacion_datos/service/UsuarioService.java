package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.dto.UsuarioCompletoDTO;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.repository.UsuarioRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {
    
    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    // ========== CREAR USUARIO COMPLETO ==========
    public Usuario crearUsuarioCompleto(UsuarioCompletoDTO usuarioDTO) {
        logger.info("🏗️ Creando usuario completo");
        
        try {
            Long cedula = convertirALong(usuarioDTO.getCedula());
            if (cedula == null) {
                throw new IllegalArgumentException("La cédula debe ser un número válido");
            }
            
            // Verificar si ya existe un usuario con esta cédula
            Optional<Usuario> usuarioExistente = usuarioRepository.findByDocumento(cedula);
            if (usuarioExistente.isPresent()) {
                logger.info("📝 Usuario existente encontrado con cédula {}, actualizando en lugar de crear...", cedula);
                
                // Actualizar usuario existente en lugar de crear uno nuevo
                Usuario usuarioActual = usuarioExistente.get();
                
                // Actualizar campos del usuario existente
                if (usuarioDTO.getNombre() != null) {
                    usuarioActual.setNombre(usuarioDTO.getNombre());
                }
                if (usuarioDTO.getCorreo() != null) {
                    usuarioActual.setCorreo(usuarioDTO.getCorreo());
                }
                if (usuarioDTO.getFechaNacimiento() != null) {
                    usuarioActual.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
                }
                
                // Mapear campos adicionales
                mapearInformacionPersonal(usuarioDTO, usuarioActual, cedula);
                
                // Incrementar versión
                usuarioActual.setVersion(usuarioActual.getVersion() + 1);
                
                Usuario usuarioActualizado = usuarioRepository.save(usuarioActual);
                logger.info("✅ Usuario actualizado exitosamente con ID: {} y cédula: {}", 
                    usuarioActualizado.getIdUsuario(), usuarioActualizado.getDocumento());
                
                return usuarioActualizado;
            }
            
            // Crear nueva entidad Usuario
            Usuario usuario = new Usuario();
            
            // Mapear información personal
            mapearInformacionPersonal(usuarioDTO, usuario, cedula);
            
            // Guardar usuario
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            logger.info("✅ Usuario creado exitosamente con ID: {} y cédula: {}", 
                usuarioGuardado.getIdUsuario(), usuarioGuardado.getDocumento());
            
            return usuarioGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario completo: {}", e.getMessage(), e);
            throw new RuntimeException("Error al crear usuario: " + e.getMessage(), e);
        }
    }
    
    // ========== CREAR USUARIO BÁSICO DESDE MAP ==========
    public Usuario crearUsuarioBasico(Map<String, Object> usuarioData) {
        logger.info("🏗️ Creando usuario básico");
        
        try {
            // Convertir datos básicos
            String nombre = convertirAString(usuarioData.get("nombre"));
            Long cedula = convertirALong(usuarioData.get("cedula"));
            String correo = convertirAString(usuarioData.get("correo"));
            
            if (nombre == null || cedula == null || correo == null) {
                throw new IllegalArgumentException("Nombre, cédula y correo son requeridos");
            }
            
            // Verificar si ya existe
            Optional<Usuario> usuarioExistente = usuarioRepository.findByDocumento(cedula);
            if (usuarioExistente.isPresent()) {
                logger.info("📝 Usuario existente encontrado con cédula {}, actualizando...", cedula);
                return actualizarUsuarioDesdeMap(usuarioExistente.get(), usuarioData);
            }
            
            // Crear nuevo usuario
            Usuario usuario = new Usuario(cedula, nombre, LocalDate.now()); // Usar constructor correcto
            usuario.setCorreo(correo);
            
            // Mapear campos adicionales si están presentes
            mapearCamposAdicionales(usuarioData, usuario);
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            logger.info("✅ Usuario básico creado exitosamente con ID: {} y cédula: {}", 
                usuarioGuardado.getIdUsuario(), usuarioGuardado.getDocumento());
            
            return usuarioGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario básico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al crear usuario básico: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR USUARIO DESDE MAP ==========
    private Usuario actualizarUsuarioDesdeMap(Usuario usuario, Map<String, Object> usuarioData) {
        logger.info("🔄 Actualizando usuario existente ID: {} con cédula: {}", 
            usuario.getIdUsuario(), usuario.getDocumento());
        
        // Actualizar campos básicos si están presentes
        if (usuarioData.get("nombre") != null) {
            usuario.setNombre(convertirAString(usuarioData.get("nombre")));
        }
        if (usuarioData.get("correo") != null) {
            usuario.setCorreo(convertirAString(usuarioData.get("correo")));
        }
        
        // Actualizar campos adicionales si están presentes
        mapearCamposAdicionales(usuarioData, usuario);
        
        // Incrementar versión
        usuario.setVersion(usuario.getVersion() + 1);
        
        Usuario usuarioActualizado = usuarioRepository.save(usuario);
        logger.info("✅ Usuario actualizado exitosamente con ID: {} y cédula: {}", 
            usuarioActualizado.getIdUsuario(), usuarioActualizado.getDocumento());
        
        return usuarioActualizado;
    }
    
    // ========== MAPEAR CAMPOS ADICIONALES ==========
    private void mapearCamposAdicionales(Map<String, Object> datos, Usuario usuario) {
        if (datos.get("numeroFijo") != null) {
            usuario.setNumeroFijo(convertirALong(datos.get("numeroFijo")));
        }
        if (datos.get("numeroCelular") != null) {
            usuario.setNumeroCelular(convertirALong(datos.get("numeroCelular")));
        }
        if (datos.get("numeroCorp") != null) {
            usuario.setNumeroCorp(convertirALong(datos.get("numeroCorp")));
        }
        if (datos.get("cedulaExpedicion") != null) {
            usuario.setCedulaExpedicion(convertirAString(datos.get("cedulaExpedicion")));
        }
        if (datos.get("paisNacimiento") != null) {
            usuario.setPaisNacimiento(convertirAString(datos.get("paisNacimiento")));
        }
        if (datos.get("ciudadNacimiento") != null) {
            usuario.setCiudadNacimiento(convertirAString(datos.get("ciudadNacimiento")));
        }
        if (datos.get("cargo") != null) {
            usuario.setCargo(convertirAString(datos.get("cargo")));
        }
        if (datos.get("area") != null) {
            usuario.setArea(convertirAString(datos.get("area")));
        }
        if (datos.get("estadoCivil") != null) {
            usuario.setEstadoCivil(convertirAString(datos.get("estadoCivil")));
        }
        if (datos.get("tipoSangre") != null) {
            usuario.setTipoSangre(convertirAString(datos.get("tipoSangre")));
        }
    }
    
    // ========== MÉTODOS DE CONVERSIÓN ==========
    private Long convertirALong(Object valor) {
        if (valor == null) return null;
        if (valor instanceof Number) {
            return ((Number) valor).longValue();
        }
        if (valor instanceof String) {
            try {
                return Long.parseLong((String) valor);
            } catch (NumberFormatException e) {
                logger.warn("No se pudo convertir '{}' a Long", valor);
                return null;
            }
        }
        return null;
    }
    
    private String convertirAString(Object valor) {
        return valor != null ? valor.toString() : null;
    }
    
    // ========== MAPEAR INFORMACIÓN PERSONAL ==========
    private void mapearInformacionPersonal(UsuarioCompletoDTO dto, Usuario usuario, Long cedula) {
        usuario.setNombre(dto.getNombre());
        usuario.setDocumento(cedula);
        usuario.setCorreo(dto.getCorreo());
        
        // Mapear campos disponibles en DTO que corresponden a campos de la entidad
        if (dto.getNumeroFijo() != null) {
            usuario.setNumeroFijo(convertirALong(dto.getNumeroFijo()));
        }
        if (dto.getNumeroCelular() != null) {
            usuario.setNumeroCelular(convertirALong(dto.getNumeroCelular()));
        }
        if (dto.getNumeroCorp() != null) {
            usuario.setNumeroCorp(convertirALong(dto.getNumeroCorp()));
        }
        if (dto.getCedulaExpedicion() != null) {
            usuario.setCedulaExpedicion(dto.getCedulaExpedicion());
        }
        if (dto.getPaisNacimiento() != null) {
            usuario.setPaisNacimiento(dto.getPaisNacimiento());
        }
        if (dto.getCiudadNacimiento() != null) {
            usuario.setCiudadNacimiento(dto.getCiudadNacimiento());
        }
        if (dto.getCargo() != null) {
            usuario.setCargo(dto.getCargo());
        }
        if (dto.getArea() != null) {
            usuario.setArea(dto.getArea());
        }
        if (dto.getFechaNacimiento() != null) {
            usuario.setFechaNacimiento(dto.getFechaNacimiento());
        }
        if (dto.getEstadoCivil() != null) {
            usuario.setEstadoCivil(dto.getEstadoCivil());
        }
        if (dto.getTipoSangre() != null) {
            usuario.setTipoSangre(dto.getTipoSangre());
        }
        
        usuario.setVersion(dto.getVersion() != null ? dto.getVersion() : 1);
    }
    
    // ========== MÉTODOS DE CONSULTA ==========
    
    /**
     * Obtener todos los usuarios
     */
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        logger.info("🔍 Buscando usuario por ID: {}", id);
        return usuarioRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorCedula(Long cedula) {
        logger.info("🔍 Buscando usuario por cédula: {}", cedula);
        try {
            Optional<Usuario> usuario = usuarioRepository.findByDocumento(cedula);
            if (usuario.isPresent()) {
                logger.info("✅ Usuario encontrado para cédula: {} con ID: {}", cedula, usuario.get().getIdUsuario());
            } else {
                logger.warn("⚠️ Usuario no encontrado para cédula: {}", cedula);
            }
            return usuario;
        } catch (Exception e) {
            logger.error("❌ Error al buscar usuario por cédula {}: {}", cedula, e.getMessage(), e);
            throw new RuntimeException("Error al buscar usuario por cédula: " + e.getMessage(), e);
        }
    }
    
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorCorreo(String correo) {
        logger.info("🔍 Buscando usuario por correo: {}", correo);
        return usuarioRepository.findByCorreo(correo);
    }
    
    @Transactional(readOnly = true)
    public List<Usuario> buscarUsuariosPorNombre(String nombre) {
        logger.info("🔍 Buscando usuarios por nombre: {}", nombre);
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    // ========== ACTUALIZAR USUARIO ==========
    public Usuario actualizarUsuario(Long id, UsuarioCompletoDTO usuarioDTO) {
        logger.info("🔄 Actualizando usuario con ID: {}", id);
        
        try {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
            if (usuarioOpt.isEmpty()) {
                throw new RuntimeException("Usuario no encontrado con ID: " + id);
            }
            
            Usuario usuario = usuarioOpt.get();
            
            // Actualizar campos
            if (usuarioDTO.getNombre() != null) {
                usuario.setNombre(usuarioDTO.getNombre());
            }
            if (usuarioDTO.getCorreo() != null) {
                usuario.setCorreo(usuarioDTO.getCorreo());
            }
            if (usuarioDTO.getFechaNacimiento() != null) {
                usuario.setFechaNacimiento(usuarioDTO.getFechaNacimiento());
            }
            
            // Incrementar versión
            usuario.setVersion(usuario.getVersion() + 1);
            
            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            logger.info("✅ Usuario actualizado exitosamente con ID: {}", usuarioActualizado.getIdUsuario());
            
            return usuarioActualizado;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar usuario: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar usuario: " + e.getMessage(), e);
        }
    }
    
    // ========== ELIMINAR USUARIO ==========
    public void eliminarUsuario(Long id) {
        eliminarUsuario(id, null, null);
    }
    
    public void eliminarUsuario(Long id, String adminCedula, String adminNombre) {
        logger.info("🗑️ Eliminando usuario con ID: {} por administrador: {} ({})", id, adminNombre, adminCedula);
        
        try {
            if (!usuarioRepository.existsById(id)) {
                throw new RuntimeException("Usuario no encontrado con ID: " + id);
            }
            
            usuarioRepository.deleteById(id);
            logger.info("✅ Usuario eliminado exitosamente con ID: {} por administrador: {}", id, adminNombre);
            
        } catch (Exception e) {
            logger.error("❌ Error al eliminar usuario: {}", e.getMessage(), e);
            throw new RuntimeException("Error al eliminar usuario: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS DE ESTADÍSTICAS ==========
    @Transactional(readOnly = true)
    public long contarUsuarios() {
        return usuarioRepository.count();
    }
} 