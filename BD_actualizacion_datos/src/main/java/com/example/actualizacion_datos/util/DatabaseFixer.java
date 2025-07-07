package com.example.actualizacion_datos.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DatabaseFixer {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixDatabaseIssues() {
        System.out.println("=== Checking and fixing database issues ===");
        
        try {
            // Fix invalid dates in FAMILIA table
            String updateQuery = "UPDATE FAMILIA SET FECHA_NACIMIENTO = NULL WHERE FECHA_NACIMIENTO = '1751950800000' OR FECHA_NACIMIENTO = '' OR FECHA_NACIMIENTO IS NULL";
            int rowsAffected = jdbcTemplate.update(updateQuery);
            System.out.println("Fixed " + rowsAffected + " invalid dates in FAMILIA table");
            
        } catch (Exception e) {
            System.err.println("Error fixing database: " + e.getMessage());
        }
    }
} 