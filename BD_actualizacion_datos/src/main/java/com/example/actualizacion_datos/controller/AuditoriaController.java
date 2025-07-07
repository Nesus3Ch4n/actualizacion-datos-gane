package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.dto.AuditoriaDTO;
import com.example.actualizacion_datos.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*")
public class AuditoriaController {
    
    @Autowired
    private AuditoriaService auditoriaService;
    
    /**
     * Obtener todas las auditorías
     */
    @GetMapping
    public ResponseEntity<List<AuditoriaDTO>> obtenerTodasAuditorias() {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerTodasAuditorias();
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías por ID de usuario
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasPorUsuario(@PathVariable Long idUsuario) {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasPorUsuario(idUsuario);
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías por tabla
     */
    @GetMapping("/tabla/{tablaModificada}")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasPorTabla(@PathVariable String tablaModificada) {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasPorTabla(tablaModificada);
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías por tipo de petición
     */
    @GetMapping("/tipo/{tipoPeticion}")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasPorTipoPeticion(@PathVariable String tipoPeticion) {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasPorTipoPeticion(tipoPeticion);
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías por rango de fechas
     */
    @GetMapping("/fechas")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasPorRangoFechas(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime fechaFin) {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasPorRangoFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías con filtros múltiples
     */
    @GetMapping("/filtros")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasConFiltros(
            @RequestParam(required = false) Long idUsuario,
            @RequestParam(required = false) String tablaModificada,
            @RequestParam(required = false) String tipoPeticion,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime fechaFin) {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasConFiltros(
                idUsuario, tablaModificada, tipoPeticion, fechaInicio, fechaFin);
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías por tabla y ID de registro
     */
    @GetMapping("/tabla/{tablaModificada}/registro/{idRegistroModificado}")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasPorTablaYRegistro(
            @PathVariable String tablaModificada,
            @PathVariable Long idRegistroModificado) {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasPorTablaYRegistro(tablaModificada, idRegistroModificado);
        return ResponseEntity.ok(auditorias);
    }
    
    /**
     * Obtener auditorías recientes (últimas 50)
     */
    @GetMapping("/recientes")
    public ResponseEntity<List<AuditoriaDTO>> obtenerAuditoriasRecientes() {
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerTodasAuditorias();
        // Limitar a las últimas 50 auditorías
        if (auditorias.size() > 50) {
            auditorias = auditorias.subList(0, 50);
        }
        return ResponseEntity.ok(auditorias);
    }
} 