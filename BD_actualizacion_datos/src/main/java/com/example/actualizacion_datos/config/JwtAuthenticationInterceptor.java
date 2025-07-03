package com.example.actualizacion_datos.config;

import com.example.actualizacion_datos.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
public class JwtAuthenticationInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        // Permitir peticiones OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // Obtener el token del header Authorization
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Token de autorización requerido\"}");
            return false;
        }

        // Extraer el token
        String token = jwtService.cleanToken(authHeader);
        
        try {
            // Validar el token
            if (!jwtService.isTokenValid(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Token inválido o expirado\"}");
                return false;
            }

            // Extraer información del usuario del token
            Map<String, String> userInfo = jwtService.extractUserInfo(token);
            String cedula = userInfo.get("identificacion"); // Usar identificacion en lugar de cedula
            
            if (cedula == null || cedula.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"No se pudo extraer la cédula del token\"}");
                return false;
            }

            // Buscar el usuario en la base de datos
            try {
                Long cedulaLong = Long.parseLong(cedula);
                var usuario = usuarioService.obtenerUsuarioPorCedula(cedulaLong);
                if (usuario == null || usuario.isEmpty()) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Usuario no encontrado en la base de datos\"}");
                    return false;
                }
                
                // Agregar información del usuario al request para uso posterior
                request.setAttribute("userId", usuario.get().getId());
                request.setAttribute("userCedula", cedula);
                request.setAttribute("userInfo", userInfo);
                
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Cédula inválida en el token\"}");
                return false;
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Error al buscar usuario en la base de datos\"}");
                return false;
            }

            return true;
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Error al procesar el token\"}");
            return false;
        }
    }
} 