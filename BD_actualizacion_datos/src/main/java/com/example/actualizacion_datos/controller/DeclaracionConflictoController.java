package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.service.FormularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/declaraciones-conflicto")
@CrossOrigin(origins = "http://localhost:4200")
public class DeclaracionConflictoController {

    @Autowired
    private FormularioService formularioService;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> guardarDeclaracionesConflicto(
            @PathVariable Long idUsuario,
            @RequestBody List<Map<String, Object>> declaracionesData) {
        
        try {
            System.out.println("📥 Recibiendo declaraciones de conflicto para usuario ID: " + idUsuario);
            System.out.println("📋 Datos recibidos: " + declaracionesData);
            
            // Usar el servicio para guardar las declaraciones
            List<Map<String, Object>> declaracionesGuardadas = formularioService.guardarDeclaracionesConflictoDirecto(idUsuario, declaracionesData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Declaraciones de conflicto guardadas exitosamente");
            response.put("cantidad", declaracionesGuardadas.size());
            response.put("declaraciones", declaracionesGuardadas);
            
            System.out.println("✅ Declaraciones guardadas exitosamente: " + declaracionesGuardadas.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error al guardar declaraciones: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar declaraciones: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> obtenerDeclaracionesPorUsuario(@PathVariable Long idUsuario) {
        try {
            System.out.println("📋 Obteniendo declaraciones de conflicto para usuario ID: " + idUsuario);
            
            List<Map<String, Object>> declaraciones = formularioService.obtenerDeclaracionesConflictoDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("declaraciones", declaraciones);
            response.put("cantidad", declaraciones.size());
            
            System.out.println("✅ Declaraciones obtenidas: " + declaraciones.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error al obtener declaraciones: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al obtener declaraciones: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 