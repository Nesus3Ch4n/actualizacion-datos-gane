package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.service.FormularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contactos-emergencia")
@CrossOrigin(origins = "http://localhost:4200")
public class ContactoEmergenciaController {

    @Autowired
    private FormularioService formularioService;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> guardarContactosEmergencia(
            @PathVariable Long idUsuario,
            @RequestBody List<Map<String, Object>> contactosData) {
        
        try {
            System.out.println("📥 Recibiendo contactos para usuario ID: " + idUsuario);
            System.out.println("📋 Datos recibidos: " + contactosData);
            
            // Usar el servicio para guardar los contactos
            List<Map<String, Object>> contactosGuardados = formularioService.guardarContactosEmergenciaDirecto(idUsuario, contactosData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contactos de emergencia guardados exitosamente");
            response.put("cantidad", contactosGuardados.size());
            response.put("contactos", contactosGuardados);
            
            System.out.println("✅ Contactos guardados exitosamente: " + contactosGuardados.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error al guardar contactos: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar contactos: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> obtenerContactosPorUsuario(@PathVariable Long idUsuario) {
        try {
            System.out.println("📋 Obteniendo contactos para usuario ID: " + idUsuario);
            
            List<Map<String, Object>> contactos = formularioService.obtenerContactosEmergenciaDirecto(idUsuario);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("contactos", contactos);
            response.put("cantidad", contactos.size());
            
            System.out.println("✅ Contactos obtenidos: " + contactos.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ Error al obtener contactos: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al obtener contactos: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 