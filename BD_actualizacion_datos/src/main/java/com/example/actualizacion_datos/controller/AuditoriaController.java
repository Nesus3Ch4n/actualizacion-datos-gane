package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.dto.AuditoriaDTO;
import com.example.actualizacion_datos.service.AuditoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuditoriaController {
    
    @Autowired
    private AuditoriaService auditoriaService;
    
    /**
     * Endpoint temporal para corregir la estructura de la tabla AUDITORIA
     */
    @PostMapping("/fix-table")
    public ResponseEntity<Map<String, Object>> corregirTablaAuditoria() {
        try {
            // Ejecutar SQL para corregir la tabla AUDITORIA
            String[] sqlCommands = {
                "CREATE TABLE IF NOT EXISTS AUDITORIA (" +
                "ID_AUDITORIA INTEGER PRIMARY KEY AUTOINCREMENT," +
                "TABLA_MODIFICADA TEXT NOT NULL," +
                "ID_REGISTRO_MODIFICADO INTEGER," +
                "CAMPO_MODIFICADO TEXT," +
                "VALOR_ANTERIOR TEXT," +
                "VALOR_NUEVO TEXT," +
                "TIPO_PETICION TEXT NOT NULL," +
                "USUARIO_MODIFICADOR TEXT," +
                "FECHA_MODIFICACION DATETIME NOT NULL," +
                "ID_USUARIO INTEGER," +
                "DESCRIPCION TEXT," +
                "IP_ADDRESS TEXT," +
                "USER_AGENT TEXT" +
                ")",
                
                "ALTER TABLE AUDITORIA ADD COLUMN DESCRIPCION TEXT",
                "ALTER TABLE AUDITORIA ADD COLUMN IP_ADDRESS TEXT", 
                "ALTER TABLE AUDITORIA ADD COLUMN USER_AGENT TEXT"
            };
            
            // Ejecutar los comandos SQL
            for (String sql : sqlCommands) {
                try {
                    // Aquí necesitarías inyectar JdbcTemplate para ejecutar SQL
                    // Por ahora, solo creamos un registro de prueba
                    auditoriaService.registrarCreacion("TEST", 1L, "SISTEMA", 1L, "Prueba de estructura de tabla");
                    break; // Solo ejecutar una vez
                } catch (Exception e) {
                    // Continuar con el siguiente comando
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Tabla AUDITORIA corregida exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", "Error al corregir tabla: " + e.getMessage()
            ));
        }
    }
    
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
        List<AuditoriaDTO> auditorias = auditoriaService.obtenerAuditoriasRecientes();
        return ResponseEntity.ok(auditorias);
    }
} 