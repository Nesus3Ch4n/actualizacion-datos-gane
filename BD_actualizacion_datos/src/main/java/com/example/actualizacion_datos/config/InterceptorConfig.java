package com.example.actualizacion_datos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

    private final JwtAuthenticationInterceptor jwtAuthenticationInterceptor;

    public InterceptorConfig(JwtAuthenticationInterceptor jwtAuthenticationInterceptor) {
        this.jwtAuthenticationInterceptor = jwtAuthenticationInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtAuthenticationInterceptor)
                .addPathPatterns("/api/**") // Aplicar a todas las rutas de la API
                .excludePathPatterns(
                    "/api/auth/**",           // Excluir endpoints de autenticación
                    "/api/public/**",         // Excluir endpoints públicos
                    "/api/USUARIO/test/**",   // Excluir endpoints de prueba
                    "/api/USUARIO/health",    // Excluir endpoint de salud
                    "/api/USUARIO/verify-columns", // Excluir endpoint de verificación
                    "/api/USUARIO/crear-completo", // Excluir creación de usuarios
                    "/api/USUARIO/crear",     // Excluir creación simple de usuarios
                    "/api/consulta/bd/usuarios", // Excluir consulta de usuarios
                    "/api/consulta/bd/**",    // Excluir todas las consultas de BD
                    "/actuator/**",           // Excluir endpoints de monitoreo
                    "/swagger-ui/**",         // Excluir documentación Swagger
                    "/v3/api-docs/**",        // Excluir documentación OpenAPI
                    "/error"                  // Excluir páginas de error
                );
    }
} 