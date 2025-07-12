package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.ControlActualizacion;
import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.repository.ControlActualizacionRepository;
import com.example.actualizacion_datos.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Order(2) // Ejecutar después del DatabaseInitializer
public class DataInitializationService implements CommandLineRunner {
    
    private static final Logger logger = LoggerFactory.getLogger(DataInitializationService.class);
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ControlActualizacionRepository controlRepository;
    
    @Override
    public void run(String... args) throws Exception {
        logger.info("🚀 Inicializando datos de control de actualizaciones...");
        
        try {
            inicializarControlesParaUsuariosExistentes();
            logger.info("✅ Datos de control inicializados correctamente");
        } catch (Exception e) {
            logger.error("❌ Error inicializando datos: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Crear controles de actualización para usuarios existentes que no los tengan
     */
    private void inicializarControlesParaUsuariosExistentes() {
        logger.info("📋 Verificando usuarios existentes...");
        
        List<Usuario> usuarios = usuarioRepository.findAll();
        logger.info("👥 Encontrados {} usuarios en el sistema", usuarios.size());
        
        int controlesCreados = 0;
        int controlesExistentes = 0;
        
        for (Usuario usuario : usuarios) {
            // Verificar si ya existe un control para este usuario
            boolean existeControl = controlRepository.findByUsuarioIdUsuario(usuario.getIdUsuario()).isPresent();
            
            if (!existeControl) {
                // Crear control de actualización para usuario existente
                ControlActualizacion control = new ControlActualizacion(usuario);
                
                // Simular que algunos usuarios ya tienen actualizaciones completadas
                if (usuario.getIdUsuario() % 3 == 0) {
                    // Usuario con actualización completada (hace 6 meses)
                    control.setFechaUltimaActualizacion(LocalDateTime.now().minusMonths(6));
                    control.setFechaProximaActualizacion(LocalDateTime.now().plusMonths(6));
                    control.setEstadoActualizacion("COMPLETADA");
                } else if (usuario.getIdUsuario() % 3 == 1) {
                    // Usuario con actualización vencida (hace 1 año y 1 mes)
                    control.setFechaUltimaActualizacion(LocalDateTime.now().minusYears(1).minusMonths(1));
                    control.setFechaProximaActualizacion(LocalDateTime.now().minusMonths(1));
                    control.setEstadoActualizacion("PENDIENTE");
                } else {
                    // Usuario pendiente de actualización
                    control.setFechaUltimaActualizacion(LocalDateTime.now().minusYears(2));
                    control.setFechaProximaActualizacion(LocalDateTime.now().minusMonths(2));
                    control.setEstadoActualizacion("PENDIENTE");
                }
                
                controlRepository.save(control);
                controlesCreados++;
                
                logger.debug("✅ Control creado para usuario {} - Estado: {}", 
                           usuario.getIdUsuario(), control.getEstadoActualizacion());
            } else {
                controlesExistentes++;
            }
        }
        
        logger.info("📊 Resumen de inicialización:");
        logger.info("   - Controles existentes: {}", controlesExistentes);
        logger.info("   - Controles creados: {}", controlesCreados);
        logger.info("   - Total de controles: {}", controlRepository.count());
    }
} 