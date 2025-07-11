package com.example.actualizacion_datos.controller;

import com.example.actualizacion_datos.entity.*;
import com.example.actualizacion_datos.service.FormularioService;
import com.example.actualizacion_datos.service.UsuarioService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class ReporteController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReporteController.class);
    
    @Autowired
    private FormularioService formularioService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    // ========== REPORTE DE INTEGRANTES ==========
    @GetMapping("/integrantes")
    public ResponseEntity<byte[]> generarReporteIntegrantes() {
        logger.info("📊 Generando reporte de integrantes");
        
        try {
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Integrantes");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Usuario", "Nombre", "Documento", "Email", "Estado Civil", "Tipo Sangre", "Fecha Nacimiento", "Cédula Expedición", "País Nacimiento", "Ciudad Nacimiento", "Cargo", "Área", "Número Fijo", "Número Celular", "Número Corp", "Versión", "Fecha Creación", "Fecha Modificación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (Usuario usuario : usuarios) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(usuario.getIdUsuario());
                row.createCell(1).setCellValue(usuario.getNombre());
                row.createCell(2).setCellValue(usuario.getDocumento());
                row.createCell(3).setCellValue(usuario.getCorreo());
                row.createCell(4).setCellValue(usuario.getEstadoCivil());
                row.createCell(5).setCellValue(usuario.getTipoSangre());
                row.createCell(6).setCellValue(formatearFecha(usuario.getFechaNacimiento()));
                row.createCell(7).setCellValue(usuario.getCedulaExpedicion());
                row.createCell(8).setCellValue(usuario.getPaisNacimiento());
                row.createCell(9).setCellValue(usuario.getCiudadNacimiento());
                row.createCell(10).setCellValue(usuario.getCargo());
                row.createCell(11).setCellValue(usuario.getArea());
                row.createCell(12).setCellValue(usuario.getNumeroFijo());
                row.createCell(13).setCellValue(usuario.getNumeroCelular());
                row.createCell(14).setCellValue(usuario.getNumeroCorp());
                row.createCell(15).setCellValue(usuario.getVersion());
                row.createCell(16).setCellValue(formatearFechaHora(usuario.getFechaCreacion()));
                row.createCell(17).setCellValue(formatearFechaHora(usuario.getFechaModificacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 9; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Integrantes_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de integrantes generado exitosamente con {} registros", usuarios.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de integrantes: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== REPORTE CONFLICTO DE INTERESES ==========
    @GetMapping("/conflicto-intereses")
    public ResponseEntity<byte[]> generarReporteConflictoIntereses() {
        logger.info("📊 Generando reporte de conflicto de intereses");
        
        try {
            List<RelacionConf> relaciones = formularioService.obtenerTodasLasRelacionesConflicto();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Conflicto de Intereses");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Relación", "ID Usuario", "Nombre Completo", "Parentesco", "Tipo Parte Asoc", "Tiene CL", "Actualizado", "Versión", "Fecha Creación", "Fecha Modificación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (RelacionConf relacion : relaciones) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(relacion.getIdRelacionConf());
                row.createCell(1).setCellValue(relacion.getUsuario() != null ? relacion.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(relacion.getNombreCompleto());
                row.createCell(3).setCellValue(relacion.getParentesco());
                row.createCell(4).setCellValue(relacion.getTipoParteAsoc());
                row.createCell(5).setCellValue(relacion.getTieneCl());
                row.createCell(6).setCellValue(relacion.getActualizado());
                row.createCell(7).setCellValue(relacion.getVersion());
                row.createCell(8).setCellValue(relacion.getFechaCreacion() != null ? relacion.getFechaCreacion() : "");
                row.createCell(9).setCellValue(formatearFechaHora(relacion.getFechaModificacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 8; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Conflicto_Intereses_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de conflicto de intereses generado exitosamente con {} registros", relaciones.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de conflicto de intereses: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== REPORTE DE ESTUDIOS ==========
    @GetMapping("/estudios")
    public ResponseEntity<byte[]> generarReporteEstudios() {
        logger.info("📊 Generando reporte de estudios");
        
        try {
            List<EstudioAcademico> estudios = formularioService.obtenerTodosLosEstudios();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Estudios Académicos");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Estudio", "ID Usuario", "Nivel Académico", "Programa", "Institución", "Semestre", "Graduación", "Versión", "Fecha Creación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (EstudioAcademico estudio : estudios) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(estudio.getIdEstudios());
                row.createCell(1).setCellValue(estudio.getUsuario() != null ? estudio.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(estudio.getNivelAcademico());
                row.createCell(3).setCellValue(estudio.getPrograma());
                row.createCell(4).setCellValue(estudio.getInstitucion());
                row.createCell(5).setCellValue(estudio.getSemestre() != null ? estudio.getSemestre() : 0);
                row.createCell(6).setCellValue(estudio.getGraduacion());
                row.createCell(7).setCellValue(estudio.getVersion() != null ? estudio.getVersion() : 1);
                row.createCell(8).setCellValue(formatearFechaHora(estudio.getFechaCreacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 9; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Estudios_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de estudios generado exitosamente con {} registros", estudios.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de estudios: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== REPORTE PERSONAS DE CONTACTO ==========
    @GetMapping("/contacto")
    public ResponseEntity<byte[]> generarReporteContacto() {
        logger.info("📊 Generando reporte de personas de contacto");
        
        try {
            List<ContactoEmergencia> contactos = formularioService.obtenerTodosLosContactos();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Personas de Contacto");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Contacto", "ID Usuario", "Nombre Completo", "Parentesco", "Número Celular", "Versión", "Fecha Creación", "Fecha Modificación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (ContactoEmergencia contacto : contactos) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(contacto.getIdContacto());
                row.createCell(1).setCellValue(contacto.getUsuario() != null ? contacto.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(contacto.getNombreCompleto());
                row.createCell(3).setCellValue(contacto.getParentesco());
                row.createCell(4).setCellValue(contacto.getNumeroCelular());
                row.createCell(5).setCellValue(contacto.getVersion() != null ? contacto.getVersion() : 1);
                row.createCell(6).setCellValue(formatearFechaHora(contacto.getFechaCreacion()));
                row.createCell(7).setCellValue(formatearFechaHora(contacto.getFechaModificacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 8; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Personas_Contacto_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de personas de contacto generado exitosamente con {} registros", contactos.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de personas de contacto: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== REPORTE PERSONAS A CARGO ==========
    @GetMapping("/personas-cargo")
    public ResponseEntity<byte[]> generarReportePersonasCargo() {
        logger.info("📊 Generando reporte de personas a cargo");
        
        try {
            List<PersonaACargo> personas = formularioService.obtenerTodasLasPersonasACargo();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Personas a Cargo");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Familia", "ID Usuario", "Nombre", "Parentesco", "Fecha Nacimiento", "Edad", "Versión", "Fecha Creación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (PersonaACargo persona : personas) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(persona.getIdFamilia());
                row.createCell(1).setCellValue(persona.getUsuario() != null ? persona.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(persona.getNombre());
                row.createCell(3).setCellValue(persona.getParentesco());
                row.createCell(4).setCellValue(persona.getFechaNacimiento());
                row.createCell(5).setCellValue(persona.getEdad() != null ? persona.getEdad() : 0);
                row.createCell(6).setCellValue(persona.getVersion() != null ? persona.getVersion() : 1);
                row.createCell(7).setCellValue(formatearFechaHora(persona.getFechaCreacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 8; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Personas_Cargo_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de personas a cargo generado exitosamente con {} registros", personas.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de personas a cargo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== REPORTE DE VEHÍCULOS ==========
    @GetMapping("/vehiculos")
    public ResponseEntity<byte[]> generarReporteVehiculos() {
        logger.info("📊 Generando reporte de vehículos");
        
        try {
            List<Vehiculo> vehiculos = formularioService.obtenerTodosLosVehiculos();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Vehículos");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Vehículo", "ID Usuario", "Tipo Vehículo", "Marca", "Placa", "Año", "Propietario", "Versión", "Fecha Creación", "Fecha Modificación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (Vehiculo vehiculo : vehiculos) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(vehiculo.getIdVehiculo());
                row.createCell(1).setCellValue(vehiculo.getUsuario() != null ? vehiculo.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(vehiculo.getTipoVehiculo());
                row.createCell(3).setCellValue(vehiculo.getMarca());
                row.createCell(4).setCellValue(vehiculo.getPlaca());
                row.createCell(5).setCellValue(vehiculo.getAno() != null ? vehiculo.getAno() : 0);
                row.createCell(6).setCellValue(vehiculo.getPropietario());
                row.createCell(7).setCellValue(vehiculo.getVersion() != null ? vehiculo.getVersion() : 1);
                row.createCell(8).setCellValue(formatearFechaHora(vehiculo.getFechaCreacion()));
                row.createCell(9).setCellValue(formatearFechaHora(vehiculo.getFechaModificacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 10; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Vehiculos_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de vehículos generado exitosamente con {} registros", vehiculos.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de vehículos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== REPORTE DE VIVIENDAS ==========
    @GetMapping("/viviendas")
    public ResponseEntity<byte[]> generarReporteViviendas() {
        logger.info("📊 Generando reporte de viviendas");
        
        try {
            List<Vivienda> viviendas = formularioService.obtenerTodasLasViviendas();
            
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Viviendas");
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Crear encabezados
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Vivienda", "ID Usuario", "Tipo Vivienda", "Dirección", "Ciudad", "Barrio", "Tipo Adquisición", "Año", "Versión", "Fecha Creación", "Fecha Modificación"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (Vivienda vivienda : viviendas) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(vivienda.getIdVivienda());
                row.createCell(1).setCellValue(vivienda.getUsuario() != null ? vivienda.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(vivienda.getTipoVivienda());
                row.createCell(3).setCellValue(vivienda.getDireccion());
                row.createCell(4).setCellValue(vivienda.getCiudad());
                row.createCell(5).setCellValue(vivienda.getBarrio());
                row.createCell(6).setCellValue(vivienda.getTipoAdquisicion());
                row.createCell(7).setCellValue(vivienda.getAno() != null ? vivienda.getAno() : 0);
                row.createCell(8).setCellValue(vivienda.getVersion() != null ? vivienda.getVersion() : 1);
                row.createCell(9).setCellValue(formatearFechaHora(vivienda.getFechaCreacion()));
                row.createCell(10).setCellValue(formatearFechaHora(vivienda.getFechaModificacion()));
                
                // Aplicar estilo a todas las celdas
                for (int i = 0; i < 11; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
            }
            
            // Autoajustar columnas
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Viviendas_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte de viviendas generado exitosamente con {} registros", viviendas.size());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte de viviendas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== EXPORTAR TODO (REPORTE COMPLETO) ==========
    @GetMapping("/exportar-todo")
    public ResponseEntity<byte[]> exportarTodo() {
        logger.info("📊 Generando reporte completo con todas las tablas");
        
        try {
            Workbook workbook = new XSSFWorkbook();
            
            // Obtener todos los datos
            List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
            List<RelacionConf> relaciones = formularioService.obtenerTodasLasRelacionesConflicto();
            List<EstudioAcademico> estudios = formularioService.obtenerTodosLosEstudios();
            List<ContactoEmergencia> contactos = formularioService.obtenerTodosLosContactos();
            List<PersonaACargo> personas = formularioService.obtenerTodasLasPersonasACargo();
            List<Vehiculo> vehiculos = formularioService.obtenerTodosLosVehiculos();
            List<Vivienda> viviendas = formularioService.obtenerTodasLasViviendas();
            
            // Crear estilos
            CellStyle headerStyle = crearEstiloEncabezado(workbook);
            CellStyle dataStyle = crearEstiloDatos(workbook);
            
            // Hoja 1: Usuarios
            crearHojaUsuarios(workbook, usuarios, headerStyle, dataStyle);
            
            // Hoja 2: Relaciones de Conflicto
            crearHojaRelacionesConflicto(workbook, relaciones, headerStyle, dataStyle);
            
            // Hoja 3: Estudios Académicos
            crearHojaEstudios(workbook, estudios, headerStyle, dataStyle);
            
            // Hoja 4: Contactos de Emergencia
            crearHojaContactos(workbook, contactos, headerStyle, dataStyle);
            
            // Hoja 5: Personas a Cargo
            crearHojaPersonasCargo(workbook, personas, headerStyle, dataStyle);
            
            // Hoja 6: Vehículos
            crearHojaVehiculos(workbook, vehiculos, headerStyle, dataStyle);
            
            // Hoja 7: Viviendas
            crearHojaViviendas(workbook, viviendas, headerStyle, dataStyle);
            
            byte[] excelBytes = convertirWorkbookABytes(workbook);
            workbook.close();
            
            String nombreArchivo = "Reporte_Completo_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            
            logger.info("✅ Reporte completo generado exitosamente con {} hojas", workbook.getNumberOfSheets());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelBytes);
                    
        } catch (Exception e) {
            logger.error("❌ Error al generar reporte completo: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // ========== MÉTODOS AUXILIARES ==========
    
    private CellStyle crearEstiloEncabezado(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }
    
    private CellStyle crearEstiloDatos(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        return style;
    }
    
    private byte[] convertirWorkbookABytes(Workbook workbook) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        return outputStream.toByteArray();
    }
    
    /**
     * Formatear fecha a String legible
     */
    private String formatearFecha(LocalDate fecha) {
        if (fecha == null) return "";
        return fecha.format(java.time.format.DateTimeFormatter.ofPattern("yyyy/MM/dd"));
    }
    
    /**
     * Formatear fecha y hora a String legible
     */
    private String formatearFechaHora(LocalDateTime fechaHora) {
        if (fechaHora == null) return "";
        return fechaHora.format(java.time.format.DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
    }
    
    private void crearHojaUsuarios(Workbook workbook, List<Usuario> usuarios, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Usuarios");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Usuario", "Nombre", "Documento", "Email", "Estado Civil", "Tipo Sangre", "Fecha Nacimiento", "Cédula Expedición", "País Nacimiento", "Ciudad Nacimiento", "Cargo", "Área", "Número Fijo", "Número Celular", "Número Corp", "Versión", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (Usuario usuario : usuarios) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(usuario.getIdUsuario());
                row.createCell(1).setCellValue(usuario.getNombre());
                row.createCell(2).setCellValue(usuario.getDocumento());
                row.createCell(3).setCellValue(usuario.getCorreo());
                row.createCell(4).setCellValue(usuario.getEstadoCivil());
                row.createCell(5).setCellValue(usuario.getTipoSangre());
                row.createCell(6).setCellValue(formatearFecha(usuario.getFechaNacimiento()));
                row.createCell(7).setCellValue(usuario.getCedulaExpedicion());
                row.createCell(8).setCellValue(usuario.getPaisNacimiento());
                row.createCell(9).setCellValue(usuario.getCiudadNacimiento());
                row.createCell(10).setCellValue(usuario.getCargo());
                row.createCell(11).setCellValue(usuario.getArea());
                row.createCell(12).setCellValue(usuario.getNumeroFijo());
                row.createCell(13).setCellValue(usuario.getNumeroCelular());
                row.createCell(14).setCellValue(usuario.getNumeroCorp());
                row.createCell(15).setCellValue(usuario.getVersion());
                row.createCell(16).setCellValue(formatearFechaHora(usuario.getFechaCreacion()));
                row.createCell(17).setCellValue(formatearFechaHora(usuario.getFechaModificacion()));
            for (int i = 0; i < 8; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void crearHojaRelacionesConflicto(Workbook workbook, List<RelacionConf> relaciones, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Relaciones Conflicto");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Relación", "ID Usuario", "Nombre Completo", "Parentesco", "Tipo Parte Asoc", "Tiene CL", "Actualizado", "Versión", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (RelacionConf relacion : relaciones) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(relacion.getIdRelacionConf());
                row.createCell(1).setCellValue(relacion.getUsuario() != null ? relacion.getUsuario().getIdUsuario().toString() : "");
                row.createCell(2).setCellValue(relacion.getNombreCompleto());
                row.createCell(3).setCellValue(relacion.getParentesco());
                row.createCell(4).setCellValue(relacion.getTipoParteAsoc());
                row.createCell(5).setCellValue(relacion.getTieneCl());
                row.createCell(6).setCellValue(relacion.getActualizado());
                row.createCell(7).setCellValue(relacion.getVersion());
                row.createCell(8).setCellValue(relacion.getFechaCreacion() != null ? relacion.getFechaCreacion() : "");
                row.createCell(9).setCellValue(formatearFechaHora(relacion.getFechaModificacion()));
            for (int i = 0; i < 7; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void crearHojaEstudios(Workbook workbook, List<EstudioAcademico> estudios, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Estudios Académicos");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Estudio", "ID Usuario", "Nivel Académico", "Programa", "Institución", "Semestre", "Graduación", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (EstudioAcademico estudio : estudios) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(estudio.getIdEstudios());
            row.createCell(1).setCellValue(estudio.getUsuario() != null ? estudio.getUsuario().getIdUsuario() : null);
            row.createCell(2).setCellValue(estudio.getNivelAcademico());
            row.createCell(3).setCellValue(estudio.getPrograma());
            row.createCell(4).setCellValue(estudio.getInstitucion());
            row.createCell(5).setCellValue(estudio.getSemestre() != null ? estudio.getSemestre() : 0);
            row.createCell(6).setCellValue(estudio.getGraduacion());
            row.createCell(7).setCellValue(formatearFechaHora(estudio.getFechaCreacion()));
            row.createCell(8).setCellValue(formatearFechaHora(estudio.getFechaModificacion()));
            for (int i = 0; i < 9; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void crearHojaContactos(Workbook workbook, List<ContactoEmergencia> contactos, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Contactos Emergencia");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Contacto", "ID Usuario", "Nombre Completo", "Parentesco", "Número Celular", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (ContactoEmergencia contacto : contactos) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(contacto.getIdContacto());
            row.createCell(1).setCellValue(contacto.getUsuario() != null ? contacto.getUsuario().getIdUsuario() : null);
            row.createCell(2).setCellValue(contacto.getNombreCompleto());
            row.createCell(3).setCellValue(contacto.getParentesco());
            row.createCell(4).setCellValue(contacto.getNumeroCelular());
            row.createCell(5).setCellValue(formatearFechaHora(contacto.getFechaCreacion()));
            row.createCell(6).setCellValue(formatearFechaHora(contacto.getFechaModificacion()));
            for (int i = 0; i < 7; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void crearHojaPersonasCargo(Workbook workbook, List<PersonaACargo> personas, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Personas a Cargo");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Familia", "ID Usuario", "Nombre", "Parentesco", "Fecha Nacimiento", "Edad", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (PersonaACargo persona : personas) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(persona.getIdFamilia());
            row.createCell(1).setCellValue(persona.getUsuario() != null ? persona.getUsuario().getIdUsuario() : null);
            row.createCell(2).setCellValue(persona.getNombre());
            row.createCell(3).setCellValue(persona.getParentesco());
            row.createCell(4).setCellValue(persona.getFechaNacimiento());
            row.createCell(5).setCellValue(persona.getEdad() != null ? persona.getEdad() : 0);
            row.createCell(6).setCellValue(formatearFechaHora(persona.getFechaCreacion()));
            row.createCell(7).setCellValue(formatearFechaHora(persona.getFechaModificacion()));
            for (int i = 0; i < 8; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void crearHojaVehiculos(Workbook workbook, List<Vehiculo> vehiculos, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Vehículos");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Vehículo", "ID Usuario", "Tipo Vehículo", "Marca", "Placa", "Año", "Propietario", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (Vehiculo vehiculo : vehiculos) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(vehiculo.getIdVehiculo());
            row.createCell(1).setCellValue(vehiculo.getUsuario() != null ? vehiculo.getUsuario().getIdUsuario() : null);
            row.createCell(2).setCellValue(vehiculo.getTipoVehiculo());
            row.createCell(3).setCellValue(vehiculo.getMarca());
            row.createCell(4).setCellValue(vehiculo.getPlaca());
            row.createCell(5).setCellValue(vehiculo.getAno() != null ? vehiculo.getAno() : 0);
            row.createCell(6).setCellValue(vehiculo.getPropietario());
            row.createCell(7).setCellValue(formatearFechaHora(vehiculo.getFechaCreacion()));
            row.createCell(8).setCellValue(formatearFechaHora(vehiculo.getFechaModificacion()));
            for (int i = 0; i < 9; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    private void crearHojaViviendas(Workbook workbook, List<Vivienda> viviendas, CellStyle headerStyle, CellStyle dataStyle) {
        Sheet sheet = workbook.createSheet("Viviendas");
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID Vivienda", "ID Usuario", "Tipo Vivienda", "Dirección", "Ciudad", "Barrio", "Tipo Adquisición", "Año", "Fecha Creación", "Fecha Modificación"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
        int rowNum = 1;
        for (Vivienda vivienda : viviendas) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(vivienda.getIdVivienda());
            row.createCell(1).setCellValue(vivienda.getUsuario() != null ? vivienda.getUsuario().getIdUsuario() : null);
            row.createCell(2).setCellValue(vivienda.getTipoVivienda());
            row.createCell(3).setCellValue(vivienda.getDireccion());
            row.createCell(4).setCellValue(vivienda.getCiudad());
            row.createCell(5).setCellValue(vivienda.getBarrio());
            row.createCell(6).setCellValue(vivienda.getTipoAdquisicion());
            row.createCell(7).setCellValue(vivienda.getAno() != null ? vivienda.getAno() : 0);
            row.createCell(8).setCellValue(formatearFechaHora(vivienda.getFechaCreacion()));
            row.createCell(9).setCellValue(formatearFechaHora(vivienda.getFechaModificacion()));
            for (int i = 0; i < 10; i++) {
                row.getCell(i).setCellStyle(dataStyle);
            }
        }
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }
    }
} 