package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.Vivienda;
import com.example.actualizacion_datos.repository.ViviendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vivienda")
@CrossOrigin(origins = "http://localhost:4200")
public class ViviendaController {

    @Autowired
    private ViviendaRepository viviendaRepository;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> guardarVivienda(
            @PathVariable Long idUsuario,
            @RequestBody Vivienda vivienda) {
        
        try {
            // Asignar el idUsuario
            vivienda.setIdUsuario(idUsuario);
            
            // Guardar la vivienda
            Vivienda viviendaGuardada = viviendaRepository.save(vivienda);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Información de vivienda guardada exitosamente");
            response.put("vivienda", viviendaGuardada);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar vivienda: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<Vivienda> obtenerViviendaPorUsuario(@PathVariable Long idUsuario) {
        try {
            Optional<Vivienda> vivienda = viviendaRepository.findByIdUsuario(idUsuario);
            return vivienda.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 