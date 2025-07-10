package com.example.actualizacion_datos.service;

import com.example.actualizacion_datos.entity.Usuario;
import com.example.actualizacion_datos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioBaseService extends BaseService<Usuario, Long> {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    protected JpaRepository<Usuario, Long> getRepository() {
        return usuarioRepository;
    }
    
    @Override
    protected String getTableName() {
        return "USUARIO";
    }
} 