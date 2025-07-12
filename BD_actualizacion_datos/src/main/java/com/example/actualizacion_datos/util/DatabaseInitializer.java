package com.example.actualizacion_datos.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

@Component
public class DatabaseInitializer implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseInitializer.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("🚀 Inicializando base de datos...");
        
        try {
            // Crear tablas de control de actualizaciones
            crearTablasControlActualizaciones();
            
            logger.info("✅ Base de datos inicializada correctamente");
        } catch (Exception e) {
            logger.error("❌ Error inicializando base de datos: {}", e.getMessage(), e);
        }
    }
    
    private void crearTablasControlActualizaciones() {
        logger.info("📋 Creando tablas de control de actualizaciones...");
        
        try {
            // Leer el script SQL
            ClassPathResource resource = new ClassPathResource("create_control_actualizaciones.sql");
            String sqlScript = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
            
            // Dividir el script en comandos individuales
            String[] commands = sqlScript.split(";");
            
            for (String command : commands) {
                command = command.trim();
                if (!command.isEmpty()) {
                    try {
                        jdbcTemplate.execute(command);
                        logger.debug("✅ Comando SQL ejecutado: {}", command.substring(0, Math.min(50, command.length())) + "...");
                    } catch (Exception e) {
                        // Ignorar errores de tablas que ya existen
                        if (!e.getMessage().contains("already exists")) {
                            logger.warn("⚠️ Error ejecutando comando SQL: {}", e.getMessage());
                        }
                    }
                }
            }
            
            logger.info("✅ Tablas de control de actualizaciones creadas/verificadas");
            
        } catch (Exception e) {
            logger.error("❌ Error creando tablas de control: {}", e.getMessage(), e);
        }
    }
} 