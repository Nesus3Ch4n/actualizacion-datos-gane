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
        logger.info("🏗️ Creando usuario completo para: {}", usuarioDTO.getNombre());
        
        try {
            // Validar que la cédula sea válida
            Long cedula = convertirALong(usuarioDTO.getCedula());
            if (cedula == null) {
                throw new IllegalArgumentException("La cédula debe ser un número válido");
            }
            
            // Verificar si ya existe un usuario con esta cédula
            Optional<Usuario> usuarioExistente = usuarioRepository.findByCedula(cedula);
            if (usuarioExistente.isPresent()) {
                throw new RuntimeException("Ya existe un usuario con cédula: " + cedula);
            }
            
            // Crear nueva entidad Usuario
            Usuario usuario = new Usuario();
            
            // Mapear información personal
            mapearInformacionPersonal(usuarioDTO, usuario, cedula);
            
            // Guardar usuario
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            logger.info("✅ Usuario creado exitosamente con ID: {}", usuarioGuardado.getId());
            
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
            Optional<Usuario> usuarioExistente = usuarioRepository.findByCedula(cedula);
            if (usuarioExistente.isPresent()) {
                logger.info("📝 Usuario existente encontrado, actualizando...");
                return actualizarUsuarioDesdeMap(usuarioExistente.get(), usuarioData);
            }
            
            // Crear nuevo usuario
            Usuario usuario = new Usuario(nombre, cedula, correo);
            
            // Mapear campos adicionales si están presentes
            mapearCamposAdicionales(usuarioData, usuario);
            
            Usuario usuarioGuardado = usuarioRepository.save(usuario);
            logger.info("✅ Usuario básico creado exitosamente con ID: {}", usuarioGuardado.getId());
            
            return usuarioGuardado;
            
        } catch (Exception e) {
            logger.error("❌ Error al crear usuario básico: {}", e.getMessage(), e);
            throw new RuntimeException("Error al crear usuario básico: " + e.getMessage(), e);
        }
    }
    
    // ========== ACTUALIZAR USUARIO DESDE MAP ==========
    private Usuario actualizarUsuarioDesdeMap(Usuario usuario, Map<String, Object> usuarioData) {
        logger.info("🔄 Actualizando usuario existente ID: {}", usuario.getId());
        
        // Actualizar campos si están presentes
        mapearCamposAdicionales(usuarioData, usuario);
        
        // Incrementar versión
        usuario.setVersion(usuario.getVersion() + 1);
        
        return usuarioRepository.save(usuario);
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
        usuario.setCedula(cedula);
        usuario.setCorreo(dto.getCorreo());
        
        // Mapear campos disponibles en DTO que corresponden a campos de la entidad
        if (dto.getNumeroFijo() != null) {
            usuario.setNumeroFijo(dto.getNumeroFijo());
        }
        if (dto.getNumeroCelular() != null) {
            usuario.setNumeroCelular(dto.getNumeroCelular());
        }
        if (dto.getNumeroCorp() != null) {
            usuario.setNumeroCorp(dto.getNumeroCorp());
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
        return usuarioRepository.findByCedula(cedula);
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
    
    // ========== MÉTODOS DE ACTUALIZACIÓN ==========
    
    public Usuario actualizarUsuario(Long id, UsuarioCompletoDTO usuarioDTO) {
        logger.info("🔄 Actualizando usuario con ID: {}", id);
        
        Optional<Usuario> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        
        try {
            Usuario usuario = usuarioExistente.get();
            
            // Actualizar información personal
            mapearInformacionPersonal(usuarioDTO, usuario, usuario.getCedula());
            
            // Incrementar versión
            usuario.setVersion(usuario.getVersion() + 1);
            
            Usuario usuarioActualizado = usuarioRepository.save(usuario);
            logger.info("✅ Usuario actualizado exitosamente");
            
            return usuarioActualizado;
            
        } catch (Exception e) {
            logger.error("❌ Error al actualizar usuario: {}", e.getMessage(), e);
            throw new RuntimeException("Error al actualizar usuario: " + e.getMessage(), e);
        }
    }
    
    // ========== MÉTODOS DE ELIMINACIÓN ==========
    
    public void eliminarUsuario(Long id) {
        logger.info("🗑️ Eliminando usuario con ID: {}", id);
        
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        
        usuarioRepository.delete(usuario.get());
        logger.info("✅ Usuario eliminado exitosamente");
    }
    
    // ========== MÉTODOS DE ESTADÍSTICAS ==========
    
    @Transactional(readOnly = true)
    public long contarUsuarios() {
        return usuarioRepository.count();
    }
} 