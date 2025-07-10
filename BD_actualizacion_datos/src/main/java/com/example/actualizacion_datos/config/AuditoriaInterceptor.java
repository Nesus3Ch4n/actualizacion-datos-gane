package com.example.actualizacion_datos.config;

import com.example.actualizacion_datos.entity.Auditoria;
import com.example.actualizacion_datos.service.AuditoriaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuditoriaInterceptor implements HandlerInterceptor {
    
    @Autowired
    private AuditoriaService auditoriaService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Intercepta las peticiones POST (creaciones)
     */
    public void registrarCreacion(String tabla, Object entidad, Long idUsuario, String usuarioModificador) {
        try {
            String descripcion = "Creación de registro en tabla " + tabla;
            auditoriaService.registrarCreacion(tabla, obtenerIdEntidad(entidad), usuarioModificador, idUsuario, descripcion);
        } catch (Exception e) {
            // Log del error pero no interrumpir la operación principal
            System.err.println("Error registrando auditoría de creación: " + e.getMessage());
        }
    }
    
    /**
     * Intercepta las peticiones PUT (actualizaciones)
     */
    public void registrarActualizacion(String tabla, Object entidadAnterior, Object entidadNueva, 
                                      Long idUsuario, String usuarioModificador) {
        try {
            System.out.println("🔍 AuditoriaInterceptor: Registrando actualización para tabla: " + tabla);
            System.out.println("🔍 AuditoriaInterceptor: Entidad anterior: " + entidadAnterior);
            System.out.println("🔍 AuditoriaInterceptor: Entidad nueva: " + entidadNueva);
            
            Map<String, Object> cambios = detectarCambios(entidadAnterior, entidadNueva);
            System.out.println("🔍 AuditoriaInterceptor: Cambios detectados: " + cambios.size());
            
            if (cambios.isEmpty()) {
                System.out.println("⚠️ AuditoriaInterceptor: No se detectaron cambios, registrando actualización general");
                String descripcion = "Actualización general en tabla " + tabla;
                auditoriaService.registrarActualizacion(tabla, obtenerIdEntidad(entidadNueva), null, 
                                                       null, null, usuarioModificador, idUsuario, descripcion);
            } else {
                for (Map.Entry<String, Object> cambio : cambios.entrySet()) {
                    String campo = cambio.getKey();
                    Map<String, Object> valores = (Map<String, Object>) cambio.getValue();
                    
                    String valorAnterior = valores.get("anterior") != null ? valores.get("anterior").toString() : null;
                    String valorNuevo = valores.get("nuevo") != null ? valores.get("nuevo").toString() : null;
                    
                    System.out.println("🔍 AuditoriaInterceptor: Registrando cambio en campo '" + campo + 
                                     "': '" + valorAnterior + "' -> '" + valorNuevo + "'");
                    
                    String descripcion = String.format("Actualización del campo '%s' en tabla %s", campo, tabla);
                    auditoriaService.registrarActualizacion(tabla, obtenerIdEntidad(entidadNueva), campo, 
                                                           valorAnterior, valorNuevo, usuarioModificador, idUsuario, descripcion);
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error registrando auditoría de actualización: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Intercepta las peticiones DELETE (eliminaciones)
     */
    public void registrarEliminacion(String tabla, Object entidad, Long idUsuario, String usuarioModificador) {
        try {
            String descripcion = "Eliminación de registro en tabla " + tabla;
            auditoriaService.registrarEliminacion(tabla, obtenerIdEntidad(entidad), usuarioModificador, idUsuario, descripcion);
        } catch (Exception e) {
            System.err.println("Error registrando auditoría de eliminación: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene el ID de una entidad
     */
    private Long obtenerIdEntidad(Object entidad) {
        try {
            // Intentar diferentes nombres de campos ID comunes
            String[] posiblesNombresId = {"id", "idUsuario", "idEstudios", "idVehiculo", 
                                        "idVivienda", "idFamilia", "idContacto", "idRelacionConf"};
            
            for (String nombreId : posiblesNombresId) {
                try {
                    Field idField = entidad.getClass().getDeclaredField(nombreId);
                    idField.setAccessible(true);
                    Object valor = idField.get(entidad);
                    if (valor != null) {
                        return (Long) valor;
                    }
                } catch (NoSuchFieldException e) {
                    // Continuar con el siguiente nombre
                    continue;
                }
            }
        } catch (Exception e) {
            System.err.println("Error obteniendo ID de entidad: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * Detecta cambios entre dos objetos de la misma clase
     */
    private Map<String, Object> detectarCambios(Object objetoAnterior, Object objetoNuevo) {
        Map<String, Object> cambios = new HashMap<>();
        
        if (objetoAnterior == null || objetoNuevo == null) {
            System.out.println("⚠️ AuditoriaInterceptor: Objeto anterior o nuevo es null");
            return cambios;
        }
        
        try {
            System.out.println("🔍 AuditoriaInterceptor: Detectando cambios entre objetos de tipo: " + objetoAnterior.getClass().getSimpleName());
            
            Field[] campos = objetoAnterior.getClass().getDeclaredFields();
            
            for (Field campo : campos) {
                // Ignorar campos que no queremos auditar
                String nombreCampo = campo.getName();
                if (nombreCampo.equals("serialVersionUID") || 
                    nombreCampo.equals("id") || 
                    nombreCampo.equals("idUsuario") || 
                    nombreCampo.equals("idEstudios") || 
                    nombreCampo.equals("idVehiculo") || 
                    nombreCampo.equals("idVivienda") || 
                    nombreCampo.equals("idFamilia") || 
                    nombreCampo.equals("idContacto") || 
                    nombreCampo.equals("idRelacionConf") ||
                    nombreCampo.equals("usuario") || // Ignorar relaciones
                    nombreCampo.equals("fechaCreacion") || // Ignorar campos de auditoría
                    nombreCampo.equals("fechaModificacion") ||
                    nombreCampo.equals("version")) {
                    continue;
                }
                
                campo.setAccessible(true);
                Object valorAnterior = campo.get(objetoAnterior);
                Object valorNuevo = campo.get(objetoNuevo);
                
                // Comparar valores
                if ((valorAnterior == null && valorNuevo != null) || 
                    (valorAnterior != null && !valorAnterior.equals(valorNuevo))) {
                    
                    System.out.println("🔍 AuditoriaInterceptor: Cambio detectado en campo '" + nombreCampo + 
                                     "': '" + valorAnterior + "' -> '" + valorNuevo + "'");
                    
                    Map<String, Object> cambio = new HashMap<>();
                    cambio.put("anterior", valorAnterior);
                    cambio.put("nuevo", valorNuevo);
                    cambios.put(campo.getName(), cambio);
                }
            }
            
            System.out.println("🔍 AuditoriaInterceptor: Total de cambios detectados: " + cambios.size());
            
        } catch (Exception e) {
            System.err.println("❌ Error detectando cambios: " + e.getMessage());
            e.printStackTrace();
        }
        
        return cambios;
    }
    
    /**
     * Obtiene información del usuario actual desde el contexto de la petición
     */
    public String obtenerUsuarioActual() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String authHeader = request.getHeader("Authorization");
                
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    // Extraer información del token JWT
                    try {
                        // Decodificar el token JWT (sin verificar firma para obtener información)
                        String[] parts = token.split("\\.");
                        if (parts.length == 3) {
                            String payload = parts[1];
                            // Decodificar base64
                            String decodedPayload = new String(java.util.Base64.getDecoder().decode(payload));
                            // Parsear JSON para obtener el nombre del usuario
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> claims = mapper.readValue(decodedPayload, Map.class);
                            
                            String nombre = (String) claims.get("nombre");
                            if (nombre != null) {
                                return nombre;
                            }
                            
                            String apellidos = (String) claims.get("apellidos");
                            if (apellidos != null) {
                                return apellidos;
                            }
                            
                            String identificacion = (String) claims.get("identificacion");
                            if (identificacion != null) {
                                return "Usuario " + identificacion;
                            }
                        }
                    } catch (Exception e) {
                        // Si no se puede decodificar el token, continuar
                    }
                }
                
                // Si no hay token o no se puede extraer información, usar IP
                String ipAddress = getClientIpAddress(request);
                return "Usuario desde " + ipAddress;
            }
        } catch (Exception e) {
            // Si no se puede obtener, continuar sin la información
        }
        return "SISTEMA";
    }
    
    /**
     * Obtiene el ID del usuario actual
     */
    public Long obtenerIdUsuarioActual() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String authHeader = request.getHeader("Authorization");
                
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String token = authHeader.substring(7);
                    // Extraer información del token JWT
                    try {
                        // Decodificar el token JWT (sin verificar firma para obtener información)
                        String[] parts = token.split("\\.");
                        if (parts.length == 3) {
                            String payload = parts[1];
                            // Decodificar base64
                            String decodedPayload = new String(java.util.Base64.getDecoder().decode(payload));
                            // Parsear JSON para obtener el ID del usuario
                            ObjectMapper mapper = new ObjectMapper();
                            Map<String, Object> claims = mapper.readValue(decodedPayload, Map.class);
                            
                            String identificacion = (String) claims.get("identificacion");
                            if (identificacion != null) {
                                try {
                                    return Long.parseLong(identificacion);
                                } catch (NumberFormatException e) {
                                    // Si no es un número, retornar null
                                }
                            }
                        }
                    } catch (Exception e) {
                        // Si no se puede decodificar el token, continuar
                    }
                }
            }
        } catch (Exception e) {
            // Si no se puede obtener, continuar sin la información
        }
        return null;
    }
    
    /**
     * Obtiene la dirección IP del cliente
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 