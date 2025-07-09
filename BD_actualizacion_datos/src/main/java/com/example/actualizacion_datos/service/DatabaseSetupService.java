package com.example.actualizacion_datos.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class DatabaseSetupService {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseSetupService.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void setupDatabase() {
        logger.info("🔧 Configurando base de datos SQLite...");
        
        try {
            // Habilitar claves foráneas
            jdbcTemplate.execute("PRAGMA foreign_keys = ON");
            logger.info("✅ Claves foráneas habilitadas");
            
            // Verificar si las claves foráneas ya existen
            boolean foreignKeysExist = checkForeignKeysExist();
            
            if (!foreignKeysExist) {
                logger.info("🔧 Agregando claves foráneas a las tablas...");
                addForeignKeys();
                logger.info("✅ Claves foráneas agregadas exitosamente");
            } else {
                logger.info("ℹ️ Las claves foráneas ya existen");
            }
            
            // Verificar configuración final
            verifyForeignKeys();
            
        } catch (Exception e) {
            logger.error("❌ Error configurando base de datos: {}", e.getMessage(), e);
        }
    }
    
    private boolean checkForeignKeysExist() {
        try {
            // Intentar obtener la lista de claves foráneas
            jdbcTemplate.query("PRAGMA foreign_key_list", (rs, rowNum) -> {
                return rs.getString("table");
            });
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    private void addForeignKeys() {
        // Script SQL para agregar claves foráneas
        String[] foreignKeyStatements = {
            "ALTER TABLE CONTACTO ADD CONSTRAINT fk_contacto_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE",
            "ALTER TABLE ESTUDIOS ADD CONSTRAINT fk_estudios_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE",
            "ALTER TABLE FAMILIA ADD CONSTRAINT fk_familia_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE",
            "ALTER TABLE RELACION_CONF ADD CONSTRAINT fk_relacion_conf_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE",
            "ALTER TABLE VEHICULO ADD CONSTRAINT fk_vehiculo_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE",
            "ALTER TABLE VIVIENDA ADD CONSTRAINT fk_vivienda_usuario FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE"
        };
        
        for (String statement : foreignKeyStatements) {
            try {
                jdbcTemplate.execute(statement);
                logger.debug("✅ Ejecutado: {}", statement);
            } catch (Exception e) {
                logger.warn("⚠️ No se pudo ejecutar: {} - {}", statement, e.getMessage());
            }
        }
    }
    
    private void verifyForeignKeys() {
        try {
            // Verificar que las claves foráneas estén activas
            jdbcTemplate.execute("PRAGMA foreign_key_check");
            logger.info("✅ Verificación de claves foráneas completada");
            
            // Mostrar información de las claves foráneas
            jdbcTemplate.query("PRAGMA foreign_key_list", (rs, rowNum) -> {
                String table = rs.getString("table");
                String from = rs.getString("from");
                String to = rs.getString("table");
                logger.info("🔗 Clave foránea: {} -> {}.{}", table, to, from);
                return null;
            });
            
        } catch (Exception e) {
            logger.warn("⚠️ No se pudo verificar claves foráneas: {}", e.getMessage());
        }
    }
    
    /**
     * Recrear todas las tablas desde cero
     */
    public void recreateAllTables() {
        logger.info("🔧 Recreando todas las tablas de la base de datos...");
        
        try {
            // Habilitar claves foráneas
            jdbcTemplate.execute("PRAGMA foreign_keys = ON");
            
            // Leer y ejecutar el script SQL completo
            String sqlScript = loadSqlScript("create_tables.sql");
            
            // Dividir el script en statements individuales
            String[] statements = sqlScript.split(";");
            
            for (String statement : statements) {
                statement = statement.trim();
                if (!statement.isEmpty() && !statement.startsWith("--")) {
                    try {
                        jdbcTemplate.execute(statement);
                        logger.debug("✅ Ejecutado: {}", statement.substring(0, Math.min(50, statement.length())) + "...");
                    } catch (Exception e) {
                        logger.warn("⚠️ No se pudo ejecutar: {} - {}", 
                            statement.substring(0, Math.min(50, statement.length())) + "...", 
                            e.getMessage());
                    }
                }
            }
            
            logger.info("✅ Todas las tablas recreadas exitosamente");
            
            // Verificar configuración final
            verifyForeignKeys();
            
        } catch (Exception e) {
            logger.error("❌ Error recreando tablas: {}", e.getMessage(), e);
            throw new RuntimeException("Error recreando tablas: " + e.getMessage(), e);
        }
    }
    
    /**
     * Cargar script SQL desde el classpath
     */
    private String loadSqlScript(String filename) throws IOException {
        ClassPathResource resource = new ClassPathResource(filename);
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining("\n"));
        }
    }
} 