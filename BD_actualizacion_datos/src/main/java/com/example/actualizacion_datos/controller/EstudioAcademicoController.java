package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.EstudioAcademico;
import com.example.actualizacion_datos.repository.EstudioAcademicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estudios")
@CrossOrigin(origins = "http://localhost:4200")
public class EstudioAcademicoController {

    @Autowired
    private EstudioAcademicoRepository estudioRepository;

    @PostMapping("/usuario/{idUsuario}")
    public ResponseEntity<Map<String, Object>> guardarEstudios(
            @PathVariable Long idUsuario,
            @RequestBody List<EstudioAcademico> estudios) {
        
        try {
            // Asignar el idUsuario a cada estudio
            estudios.forEach(estudio -> estudio.setIdUsuario(idUsuario));
            
            // Guardar los estudios
            List<EstudioAcademico> estudiosGuardados = estudioRepository.saveAll(estudios);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estudios académicos guardados exitosamente");
            response.put("cantidad", estudiosGuardados.size());
            response.put("estudios", estudiosGuardados);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error al guardar estudios: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<EstudioAcademico>> obtenerEstudiosPorUsuario(@PathVariable Long idUsuario) {
        try {
            List<EstudioAcademico> estudios = estudioRepository.findByIdUsuarioAndActivoTrue(idUsuario);
            return ResponseEntity.ok(estudios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 