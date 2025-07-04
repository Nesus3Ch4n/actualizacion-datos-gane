package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.config.JwtService;
import com.example.actualizacion_datos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Validar token y obtener información del usuario
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // Limpiar el token
            String token = jwtService.cleanToken(authHeader);
            
            // Intentar extraer información del usuario del token (aunque esté expirado)
            Map<String, String> userInfo = null;
            String cedula = null;
            boolean tokenExpired = false;
            
            try {
                userInfo = jwtService.extractUserInfo(token);
                cedula = userInfo.get("identificacion");
            } catch (Exception e) {
                // Si no se puede extraer información, el token es completamente inválido
                return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "error", "Token completamente inválido"
                ));
            }
            
            // Validar si el token está expirado
            if (!jwtService.isTokenValid(token)) {
                tokenExpired = true;
                
                // En modo demo, regenerar automáticamente el token si está expirado
                if (cedula != null && !cedula.isEmpty()) {
                    try {
                        // Generar nuevo token con la misma información del usuario
                        Map<String, Object> claims = new HashMap<>();
                        claims.put("sub", "CP" + cedula);
                        claims.put("idtipodocumento", userInfo.get("tipoDocumento"));
                        claims.put("identificacion", cedula);
                        claims.put("nombres", userInfo.get("nombres"));
                        claims.put("apellidos", userInfo.get("apellidos"));
                        claims.put("idroles", userInfo.get("roles"));
                        claims.put("idpantallas", userInfo.get("pantallas"));
                        claims.put("experience", userInfo.get("experience"));
                        
                        String newToken = jwtService.generateToken(claims);
                        
                        // Buscar usuario en la base de datos
                        Long cedulaLong = Long.parseLong(cedula);
                        var usuario = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
                        
                        if (usuario == null || usuario.isEmpty()) {
                            return ResponseEntity.status(401).body(Map.of(
                                "valid", false,
                                "error", "Usuario no encontrado en la base de datos"
                            ));
                        }
                        
                        // Preparar respuesta con nuevo token
                        Map<String, Object> response = new HashMap<>();
                        response.put("valid", true);
                        response.put("user", usuario.get());
                        response.put("tokenInfo", userInfo);
                        response.put("newToken", newToken);
                        response.put("tokenRegenerated", true);
                        response.put("message", "Token regenerado automáticamente en modo demo");
                        
                        return ResponseEntity.ok(response);
                        
                    } catch (Exception e) {
                        return ResponseEntity.status(500).body(Map.of(
                            "valid", false,
                            "error", "Error regenerando token: " + e.getMessage()
                        ));
                    }
                } else {
                    return ResponseEntity.status(401).body(Map.of(
                        "valid", false,
                        "error", "Token expirado y no se pudo extraer información para regenerar"
                    ));
                }
            }

            // Si el token es válido, proceder normalmente
            if (cedula == null || cedula.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "error", "No se pudo extraer la cédula del token"
                ));
            }

            // Buscar usuario en la base de datos
            try {
                Long cedulaLong = Long.parseLong(cedula);
                var usuario = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
                if (usuario == null || usuario.isEmpty()) {
                    return ResponseEntity.status(401).body(Map.of(
                        "valid", false,
                        "error", "Usuario no encontrado en la base de datos"
                    ));
                }
                
                // Preparar respuesta exitosa
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("user", usuario.get());
                response.put("tokenInfo", userInfo);
                
                return ResponseEntity.ok(response);
                
            } catch (NumberFormatException e) {
                return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "error", "Cédula inválida en el token"
                ));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of(
                    "valid", false,
                    "error", "Error interno del servidor: " + e.getMessage()
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "valid", false,
                "error", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    /**
     * Obtener información del usuario actual basado en el token
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtService.cleanToken(authHeader);
            Map<String, String> userInfo = jwtService.extractUserInfo(token);
            String cedula = userInfo.get("identificacion");
            
            try {
                Long cedulaLong = Long.parseLong(cedula);
                var usuario = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
                if (usuario == null || usuario.isEmpty()) {
                    return ResponseEntity.status(404).body(Map.of(
                        "error", "Usuario no encontrado"
                    ));
                }
                
                return ResponseEntity.ok(usuario.get());
                
            } catch (NumberFormatException e) {
                return ResponseEntity.status(400).body(Map.of(
                    "error", "Cédula inválida en el token"
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Error al obtener información del usuario: " + e.getMessage()
            ));
        }
    }

    /**
     * Endpoint público para verificar el estado del servicio
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "service", "Auth Service",
            "timestamp", System.currentTimeMillis()
        ));
    }

    /**
     * Endpoint de prueba para verificar tokens (sin autenticación)
     */
    @PostMapping("/test-validate")
    public ResponseEntity<?> testValidateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Token requerido"
                ));
            }

            // Limpiar el token
            token = jwtService.cleanToken(token);
            
            // Verificar si el token es válido
            boolean isValid = jwtService.isTokenValid(token);
            
            if (!isValid) {
                return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "error", "Token inválido o expirado"
                ));
            }

            // Extraer información del usuario
            Map<String, String> userInfo = jwtService.extractUserInfo(token);
            String cedula = userInfo.get("identificacion");
            
            if (cedula == null || cedula.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "error", "No se pudo extraer la cédula del token"
                ));
            }

            // Buscar usuario en la base de datos
            try {
                Long cedulaLong = Long.parseLong(cedula);
                var usuario = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
                if (usuario == null || usuario.isEmpty()) {
                    return ResponseEntity.ok(Map.of(
                        "valid", false,
                        "error", "Usuario no encontrado en la base de datos",
                        "cedula", cedula
                    ));
                }
                
                // Preparar respuesta exitosa
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("user", usuario.get());
                response.put("tokenInfo", userInfo);
                
                return ResponseEntity.ok(response);
                
            } catch (NumberFormatException e) {
                return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "error", "Cédula inválida en el token: " + cedula
                ));
            } catch (Exception e) {
                return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "error", "Error interno del servidor: " + e.getMessage()
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "valid", false,
                "error", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    /**
     * Endpoint de prueba simple para verificar solo la firma del JWT
     */
    @PostMapping("/test-jwt-only")
    public ResponseEntity<?> testJwtOnly(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Token requerido"
                ));
            }

            // Limpiar el token
            token = jwtService.cleanToken(token);
            
            // Solo verificar la firma del JWT sin validar expiración
            try {
                Map<String, String> userInfo = jwtService.extractUserInfo(token);
                return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "message", "JWT válido (solo verificación de firma)",
                    "tokenInfo", userInfo
                ));
            } catch (Exception e) {
                return ResponseEntity.ok(Map.of(
                    "valid", false,
                    "error", "JWT inválido: " + e.getMessage()
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "valid", false,
                "error", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    /**
     * Endpoint temporal para verificar el secreto (SOLO PARA DESARROLLO)
     */
    @GetMapping("/debug-secret")
    public ResponseEntity<?> debugSecret() {
        try {
            // Solo mostrar los primeros 10 caracteres del secreto por seguridad
            String secret = jwtService.getSecretKey();
            String maskedSecret = secret.length() > 10 ? 
                secret.substring(0, 10) + "..." + secret.substring(secret.length() - 10) : 
                secret;
            
            return ResponseEntity.ok(Map.of(
                "secretLength", secret.length(),
                "maskedSecret", maskedSecret,
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "error", "No se pudo obtener el secreto: " + e.getMessage()
            ));
        }
    }

    /**
     * Generar token válido para pruebas (SOLO PARA DESARROLLO)
     */
    @GetMapping("/generate-test-token")
    public ResponseEntity<?> generateTestToken() {
        try {
            Map<String, Object> claims = new HashMap<>();
            claims.put("sub", "CP1006101211");
            claims.put("idtipodocumento", "1");
            claims.put("identificacion", "1006101211");
            claims.put("nombres", "JESUS FELIPE");
            claims.put("apellidos", "CORDOBA ECHANDIA");
            claims.put("idroles", "5");
            claims.put("idpantallas", "16,67,42,12,13,14,15");
            claims.put("experience", "yRDxHurij5dLHBaITLrQf/4YFfrbN99YzsT92xOYsQFhMbRM67LnofH/cLdhmrhLVKSEEfefLBR/YNzH7HOftOEEL040zaDL7pm+tOEuvII=");
            
            String token = jwtService.generateToken(claims);
            
            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Token generado exitosamente",
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "error", "Error generando token: " + e.getMessage()
            ));
        }
    }

    /**
     * Regenerar token automáticamente cuando está expirado (MODO DEMO)
     */
    @PostMapping("/regenerate-token")
    public ResponseEntity<?> regenerateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = jwtService.cleanToken(authHeader);
            
            // Intentar extraer información del token expirado
            Map<String, String> userInfo;
            try {
                userInfo = jwtService.extractUserInfo(token);
            } catch (Exception e) {
                return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "error", "No se pudo extraer información del token expirado"
                ));
            }
            
            String cedula = userInfo.get("identificacion");
            if (cedula == null || cedula.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "error", "No se pudo extraer la cédula del token"
                ));
            }
            
            // Generar nuevo token con la misma información
            Map<String, Object> claims = new HashMap<>();
            claims.put("sub", "CP" + cedula);
            claims.put("idtipodocumento", userInfo.get("tipoDocumento"));
            claims.put("identificacion", cedula);
            claims.put("nombres", userInfo.get("nombres"));
            claims.put("apellidos", userInfo.get("apellidos"));
            claims.put("idroles", userInfo.get("roles"));
            claims.put("idpantallas", userInfo.get("pantallas"));
            claims.put("experience", userInfo.get("experience"));
            
            String newToken = jwtService.generateToken(claims);
            
            // Buscar usuario en la base de datos
            try {
                Long cedulaLong = Long.parseLong(cedula);
                var usuario = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
                
                if (usuario == null || usuario.isEmpty()) {
                    return ResponseEntity.status(401).body(Map.of(
                        "valid", false,
                        "error", "Usuario no encontrado en la base de datos"
                    ));
                }
                
                // Preparar respuesta con nuevo token
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                response.put("user", usuario.get());
                response.put("tokenInfo", userInfo);
                response.put("newToken", newToken);
                response.put("tokenRegenerated", true);
                response.put("message", "Token regenerado exitosamente en modo demo");
                response.put("timestamp", System.currentTimeMillis());
                
                return ResponseEntity.ok(response);
                
            } catch (NumberFormatException e) {
                return ResponseEntity.status(400).body(Map.of(
                    "valid", false,
                    "error", "Cédula inválida en el token"
                ));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(Map.of(
                    "valid", false,
                    "error", "Error interno del servidor: " + e.getMessage()
                ));
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "valid", false,
                "error", "Error interno del servidor: " + e.getMessage()
            ));
        }
    }

    /**
     * Crear usuario de prueba para modo demo (SOLO PARA DESARROLLO)
     */
    @PostMapping("/create-test-user")
    public ResponseEntity<?> createTestUser() {
        try {
            // Datos del usuario de prueba
            Map<String, Object> userData = new HashMap<>();
            userData.put("nombre", "JESUS FELIPE CORDOBA ECHANDIA");
            userData.put("cedula", 1006101211L);
            userData.put("correo", "jesus.cordoba@test.com");
            userData.put("numeroFijo", 1234567L);
            userData.put("numeroCelular", 3001234567L);
            userData.put("numeroCorp", 123456L);
            userData.put("cedulaExpedicion", "BOGOTA");
            userData.put("paisNacimiento", "COLOMBIA");
            userData.put("ciudadNacimiento", "BOGOTA");
            userData.put("cargo", "DESARROLLADOR");
            userData.put("area", "TECNOLOGIA");
            userData.put("estadoCivil", "SOLTERO");
            userData.put("tipoSangre", "O+");
            
            // Crear el usuario
            var usuario = usuarioService.crearUsuarioBasico(userData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Usuario de prueba creado exitosamente",
                "user", usuario,
                "timestamp", System.currentTimeMillis()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Error creando usuario de prueba: " + e.getMessage()
            ));
        }
    }
} 