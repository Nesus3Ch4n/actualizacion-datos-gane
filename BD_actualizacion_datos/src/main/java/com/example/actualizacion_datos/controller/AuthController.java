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
            
            // Validar el token
            if (!jwtService.isTokenValid(token)) {
                return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "error", "Token inválido o expirado"
                ));
            }

            // Extraer información del usuario
            Map<String, String> userInfo = jwtService.extractUserInfo(token);
            String cedula = userInfo.get("identificacion");
            
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
} 