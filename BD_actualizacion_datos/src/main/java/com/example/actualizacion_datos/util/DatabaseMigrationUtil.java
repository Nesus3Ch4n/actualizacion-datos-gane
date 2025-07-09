package com.example.actualizacion_datos.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class DatabaseMigrationUtil {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseMigrationUtil.class);
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    /**
     * Ejecutar migración completa de la base de datos
     */
    public void executeMigration() {
        logger.info("🚀 Iniciando migración de base de datos...");
        
        try {
            // 1. Habilitar claves foráneas
            enableForeignKeys();
            
            // 2. Verificar estructura de tablas
            verifyTableStructure();
            
            // 3. Agregar claves foráneas si no existen
            addForeignKeysIfNeeded();
            
            // 4. Verificar integridad
            verifyDataIntegrity();
            
            logger.info("✅ Migración completada exitosamente");
            
        } catch (Exception e) {
            logger.error("❌ Error durante la migración: {}", e.getMessage(), e);
            throw new RuntimeException("Error en migración de base de datos", e);
        }
    }
    
    /**
     * Habilitar claves foráneas en SQLite
     */
    private void enableForeignKeys() {
        logger.info("🔧 Habilitando claves foráneas...");
        
        jdbcTemplate.execute("PRAGMA foreign_keys = ON");
        
        // Verificar que estén habilitadas
        List<Map<String, Object>> result = jdbcTemplate.queryForList("PRAGMA foreign_keys");
        boolean enabled = "1".equals(result.get(0).get("foreign_keys").toString());
        
        if (enabled) {
            logger.info("✅ Claves foráneas habilitadas correctamente");
        } else {
            logger.warn("⚠️ Las claves foráneas no se pudieron habilitar");
        }
    }
    
    /**
     * Verificar la estructura de las tablas
     */
    private void verifyTableStructure() {
        logger.info("🔍 Verificando estructura de tablas...");
        
        String[] tables = {"USUARIO", "CONTACTO", "ESTUDIOS", "FAMILIA", "RELACION_CONF", "VEHICULO", "VIVIENDA"};
        
        for (String table : tables) {
            try {
                List<Map<String, Object>> columns = jdbcTemplate.queryForList(
                    "PRAGMA table_info(" + table + ")"
                );
                
                boolean hasIdUsuario = columns.stream()
                    .anyMatch(col -> "ID_USUARIO".equals(col.get("name")));
                
                if (hasIdUsuario) {
                    logger.info("✅ Tabla {} tiene columna ID_USUARIO", table);
                } else {
                    logger.warn("⚠️ Tabla {} NO tiene columna ID_USUARIO", table);
                }
                
            } catch (Exception e) {
                logger.error("❌ Error verificando tabla {}: {}", table, e.getMessage());
            }
        }
    }
    
    /**
     * Agregar claves foráneas si no existen
     */
    private void addForeignKeysIfNeeded() {
        logger.info("🔧 Verificando claves foráneas existentes...");
        
        try {
            List<Map<String, Object>> existingKeys = jdbcTemplate.queryForList("PRAGMA foreign_key_list");
            
            if (existingKeys.isEmpty()) {
                logger.info("🔧 No se encontraron claves foráneas, agregando...");
                addAllForeignKeys();
            } else {
                logger.info("ℹ️ Se encontraron {} claves foráneas existentes", existingKeys.size());
                for (Map<String, Object> key : existingKeys) {
                    logger.info("🔗 Clave foránea: {} -> {}", 
                        key.get("table"), key.get("to"));
                }
            }
            
        } catch (Exception e) {
            logger.warn("⚠️ Error verificando claves foráneas: {}", e.getMessage());
            logger.info("🔧 Intentando agregar claves foráneas...");
            addAllForeignKeys();
        }
    }
    
    /**
     * Agregar todas las claves foráneas
     */
    private void addAllForeignKeys() {
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
                logger.info("✅ Clave foránea agregada: {}", statement);
            } catch (Exception e) {
                logger.warn("⚠️ No se pudo agregar clave foránea: {} - {}", statement, e.getMessage());
            }
        }
    }
    
    /**
     * Verificar integridad de los datos
     */
    private void verifyDataIntegrity() {
        logger.info("🔍 Verificando integridad de datos...");
        
        try {
            // Verificar que no hay registros huérfanos
            String[] tables = {"CONTACTO", "ESTUDIOS", "FAMILIA", "RELACION_CONF", "VEHICULO", "VIVIENDA"};
            
            for (String table : tables) {
                try {
                    Integer orphanCount = jdbcTemplate.queryForObject(
                        "SELECT COUNT(*) FROM " + table + " c LEFT JOIN USUARIO u ON c.ID_USUARIO = u.ID_USUARIO WHERE u.ID_USUARIO IS NULL",
                        Integer.class
                    );
                    
                    if (orphanCount != null && orphanCount > 0) {
                        logger.warn("⚠️ Tabla {} tiene {} registros huérfanos", table, orphanCount);
                    } else {
                        logger.info("✅ Tabla {} no tiene registros huérfanos", table);
                    }
                    
                } catch (Exception e) {
                    logger.debug("ℹ️ No se pudo verificar integridad de {}: {}", table, e.getMessage());
                }
            }
            
            // Verificar claves foráneas
            jdbcTemplate.execute("PRAGMA foreign_key_check");
            logger.info("✅ Verificación de claves foráneas completada");
            
        } catch (Exception e) {
            logger.warn("⚠️ Error verificando integridad: {}", e.getMessage());
        }
    }
    
    /**
     * Mostrar resumen de la base de datos
     */
    public void showDatabaseSummary() {
        logger.info("📊 Resumen de la base de datos:");
        
        try {
            // Contar registros en cada tabla
            String[] tables = {"USUARIO", "CONTACTO", "ESTUDIOS", "FAMILIA", "RELACION_CONF", "VEHICULO", "VIVIENDA"};
            
            for (String table : tables) {
                try {
                    Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
                    logger.info("📋 Tabla {}: {} registros", table, count != null ? count : 0);
                } catch (Exception e) {
                    logger.warn("⚠️ No se pudo contar registros en {}: {}", table, e.getMessage());
                }
            }
            
            // Mostrar claves foráneas
            List<Map<String, Object>> foreignKeys = jdbcTemplate.queryForList("PRAGMA foreign_key_list");
            logger.info("🔗 Claves foráneas encontradas: {}", foreignKeys.size());
            
        } catch (Exception e) {
            logger.error("❌ Error mostrando resumen: {}", e.getMessage());
        }
    }
} 