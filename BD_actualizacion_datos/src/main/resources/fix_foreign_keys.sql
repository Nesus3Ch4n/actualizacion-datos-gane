-- Script para agregar claves foráneas a la base de datos SQLite
-- Ejecutar después de que las tablas estén creadas

-- Habilitar claves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- Agregar clave foránea a la tabla CONTACTO
ALTER TABLE CONTACTO ADD CONSTRAINT fk_contacto_usuario 
FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE;

-- Agregar clave foránea a la tabla ESTUDIOS
ALTER TABLE ESTUDIOS ADD CONSTRAINT fk_estudios_usuario 
FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE;

-- Agregar clave foránea a la tabla FAMILIA
ALTER TABLE FAMILIA ADD CONSTRAINT fk_familia_usuario 
FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE;

-- Agregar clave foránea a la tabla RELACION_CONF
ALTER TABLE RELACION_CONF ADD CONSTRAINT fk_relacion_conf_usuario 
FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE;

-- Agregar clave foránea a la tabla VEHICULO
ALTER TABLE VEHICULO ADD CONSTRAINT fk_vehiculo_usuario 
FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE;

-- Agregar clave foránea a la tabla VIVIENDA
ALTER TABLE VIVIENDA ADD CONSTRAINT fk_vivienda_usuario 
FOREIGN KEY (ID_USUARIO) REFERENCES USUARIO(ID_USUARIO) ON DELETE CASCADE;

-- Verificar que las claves foráneas estén activas
PRAGMA foreign_key_check;

-- Mostrar información de las claves foráneas
PRAGMA foreign_key_list; 