package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.service.DatabaseSetupService;
import com.example.actualizacion_datos.util.DatabaseMigrationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/database")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DatabaseController {
    
    private static final Logger logger = LoggerFactory.getLogger(DatabaseController.class);
    
    @Autowired
    private DatabaseMigrationUtil databaseMigrationUtil;
    
    @Autowired
    private DatabaseSetupService databaseSetupService;
    
    /**
     * Ejecutar migración de la base de datos
     */
    @PostMapping("/migrate")
    public ResponseEntity<?> executeMigration() {
        logger.info("🚀 Ejecutando migración de base de datos...");
        
        try {
            databaseMigrationUtil.executeMigration();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Migración completada exitosamente");
            
            logger.info("✅ Migración completada");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error en migración: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error en migración: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Recrear todas las tablas de la base de datos
     */
    @PostMapping("/recreate-tables")
    public ResponseEntity<?> recreateTables() {
        logger.info("🔧 Recreando todas las tablas de la base de datos...");
        
        try {
            databaseSetupService.recreateAllTables();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Todas las tablas recreadas exitosamente");
            
            logger.info("✅ Tablas recreadas exitosamente");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error recreando tablas: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error recreando tablas: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Mostrar resumen de la base de datos
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getDatabaseSummary() {
        logger.info("📊 Obteniendo resumen de base de datos...");
        
        try {
            databaseMigrationUtil.showDatabaseSummary();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Resumen mostrado en logs del servidor");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error obteniendo resumen: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error obteniendo resumen: " + e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Verificar estado de la base de datos
     */
    @GetMapping("/health")
    public ResponseEntity<?> checkDatabaseHealth() {
        logger.info("🏥 Verificando salud de la base de datos...");
        
        try {
            // Ejecutar una consulta simple para verificar conexión
            databaseMigrationUtil.showDatabaseSummary();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Base de datos funcionando correctamente");
            response.put("status", "healthy");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("❌ Error verificando salud de BD: {}", e.getMessage(), e);
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error en base de datos: " + e.getMessage());
            errorResponse.put("status", "unhealthy");
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
} 