-- Script para crear tablas de control de actualizaciones anuales
-- Ejecutar en la base de datos SQLite

-- Tabla de control de actualizaciones
CREATE TABLE IF NOT EXISTS control_actualizaciones (
    id_control INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    fecha_ultima_actualizacion DATETIME NOT NULL,
    fecha_proxima_actualizacion DATETIME NOT NULL,
    estado_actualizacion VARCHAR(20) DEFAULT 'PENDIENTE',
    version_actualizacion INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla de historial de actualizaciones
CREATE TABLE IF NOT EXISTS historial_actualizaciones (
    id_historial INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_control INTEGER NOT NULL,
    fecha_actualizacion DATETIME NOT NULL,
    tipo_actualizacion VARCHAR(50),
    datos_actualizados TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_control) REFERENCES control_actualizaciones(id_control)
);

-- Tabla de configuración de actualizaciones
CREATE TABLE IF NOT EXISTS configuracion_actualizaciones (
    id_config INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_config VARCHAR(100) NOT NULL,
    valor_config TEXT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT OR IGNORE INTO configuracion_actualizaciones (nombre_config, valor_config, descripcion) VALUES
('PERIODO_ACTUALIZACION_DIAS', '365', 'Período en días para actualización anual'),
('DIAS_ADVERTENCIA', '30', 'Días de advertencia antes de vencimiento'),
('ACTUALIZACION_OBLIGATORIA', 'true', 'Si la actualización es obligatoria');

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_control_usuario ON control_actualizaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_control_estado ON control_actualizaciones(estado_actualizacion);
CREATE INDEX IF NOT EXISTS idx_control_fecha_proxima ON control_actualizaciones(fecha_proxima_actualizacion);
CREATE INDEX IF NOT EXISTS idx_historial_usuario ON historial_actualizaciones(id_usuario);
CREATE INDEX IF NOT EXISTS idx_historial_fecha ON historial_actualizaciones(fecha_actualizacion); 