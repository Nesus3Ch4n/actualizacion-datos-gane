package com.example.actualizacion_datos.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret:defaultSecretKeyForDevelopmentOnly}")
    private String secretKey;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    /**
     * Extrae la cédula del token JWT
     */
    public String extractCedula(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrae la identificación del token JWT
     */
    public String extractIdentificacion(String token) {
        return extractClaim(token, claims -> claims.get("identificacion", String.class));
    }

    /**
     * Extrae los nombres del token JWT
     */
    public String extractNombres(String token) {
        return extractClaim(token, claims -> claims.get("nombres", String.class));
    }

    /**
     * Extrae los apellidos del token JWT
     */
    public String extractApellidos(String token) {
        return extractClaim(token, claims -> claims.get("apellidos", String.class));
    }

    /**
     * Extrae los roles del token JWT
     */
    public String extractRoles(String token) {
        return extractClaim(token, claims -> claims.get("idroles", String.class));
    }

    /**
     * Extrae la fecha de expiración del token JWT
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrae un claim específico del token JWT
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae todos los claims del token JWT
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Verifica si el token ha expirado
     */
    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Verifica si el token es válido
     */
    public Boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Generar token JWT
     */
    public String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
            .setClaims(claims)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSignInKey(), SignatureAlgorithm.HS512)
            .compact();
    }

    /**
     * Obtiene la clave de firma
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extrae información completa del usuario del token
     */
    public Map<String, String> extractUserInfo(String token) {
        Map<String, String> userInfo = new HashMap<>();
        
        try {
            Claims claims = extractAllClaims(token);
            
            userInfo.put("cedula", claims.getSubject());
            userInfo.put("identificacion", claims.get("identificacion", String.class));
            userInfo.put("nombres", claims.get("nombres", String.class));
            userInfo.put("apellidos", claims.get("apellidos", String.class));
            userInfo.put("roles", claims.get("idroles", String.class));
            userInfo.put("tipoDocumento", claims.get("idtipodocumento", String.class));
            userInfo.put("pantallas", claims.get("idpantallas", String.class));
            
        } catch (Exception e) {
            // Log del error para debugging
            System.err.println("Error extrayendo información del token: " + e.getMessage());
            e.printStackTrace();
            // Agregar información del error al mapa
            userInfo.put("error", e.getMessage());
        }
        
        return userInfo;
    }

    /**
     * Limpia el token removiendo el prefijo "Bearer " si existe
     */
    public String cleanToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }

    /**
     * Obtener el secreto (SOLO PARA DESARROLLO)
     */
    public String getSecretKey() {
        return this.secretKey;
    }
} 