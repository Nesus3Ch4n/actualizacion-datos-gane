package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.PersonaACargo;
import com.example.actualizacion_datos.repository.PersonaACargoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/personas-cargo")
@CrossOrigin(origins = "http://localhost:4200")
public class PersonaACargoController {

    @Autowired
    private PersonaACargoRepository personaRepository;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> guardarPersonasACargo(
            @PathVariable Long idUsuario,
            @RequestBody List<PersonaACargo> personas) {
        
        try {
            // Asignar el idUsuario a cada persona
            personas.forEach(persona -> persona.setIdUsuario(idUsuario));
            
            // Guardar las personas
            List<PersonaACargo> personasGuardadas = personaRepository.saveAll(personas);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Personas a cargo guardadas exitosamente");
            response.put("cantidad", personasGuardadas.size());
            response.put("personas", personasGuardadas);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar personas a cargo: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<PersonaACargo>> obtenerPersonasPorUsuario(@PathVariable Long idUsuario) {
        try {
            List<PersonaACargo> personas = personaRepository.findByIdUsuario(idUsuario);
            return ResponseEntity.ok(personas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 