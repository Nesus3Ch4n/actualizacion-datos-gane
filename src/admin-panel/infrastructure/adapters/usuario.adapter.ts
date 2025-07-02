import { Injectable } from '@angular/core';

// Domain imports
import { Usuario } from '../../domain/entities/usuario.entity';

// Application imports
import { 
  UsuarioDto, 
  UsuarioDetalleDto, 
  UsuarioResumenDto,
  CrearUsuarioDto,
  ActualizarUsuarioDto 
} from '../../application/dto/usuario.dto';

/**
 * Adaptador para convertir entre entidades de dominio Usuario y DTOs
 * Implementa el patrón Adapter para la capa de infraestructura
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioAdapter {

  /**
   * Convierte una entidad Usuario del dominio a UsuarioDto
   */
  toDto(usuario: Usuario): UsuarioDto {
    return {
      id: usuario.getId(),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.emailValue,
      cargo: usuario.cargo,
      departamento: usuario.departamentoValue,
      fechaIngreso: usuario.fechaIngreso,
      estado: usuario.estadoValue,
      ultimaActualizacion: usuario.ultimaActualizacion,
      tieneConflictoIntereses: usuario.tieneConflictoIntereses
    };
  }

  /**
   * Convierte una entidad Usuario del dominio a UsuarioDetalleDto con información completa
   */
  toDetalleDto(usuario: Usuario): UsuarioDetalleDto {
    return {
      id: usuario.getId(),
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.emailValue,
      cargo: usuario.cargo,
      departamento: usuario.departamentoValue,
      fechaIngreso: usuario.fechaIngreso,
      estado: usuario.estadoValue,
      ultimaActualizacion: usuario.ultimaActualizacion,
      tieneConflictoIntereses: usuario.tieneConflictoIntereses,
      
      // Información adicional (simulada para el prototipo)
      telefono: this.generarTelefonoSimulado(usuario.getId()),
      direccion: this.generarDireccionSimulada(usuario.getId()),
      ciudad: this.generarCiudadSimulada(usuario.departamentoValue),
      nivelEducativo: this.generarNivelEducativoSimulado(usuario.cargo),
      institucion: this.generarInstitucionSimulada(usuario.departamentoValue),
      titulo: this.generarTituloSimulado(usuario.cargo),
      personasACargo: this.generarPersonasACargoSimuladas(usuario.getId()),
      contactosEmergencia: this.generarContactosEmergenciaSimulados(usuario.getId())
    };
  }

  /**
   * Convierte una entidad Usuario del dominio a UsuarioResumenDto
   */
  toResumenDto(usuario: Usuario): UsuarioResumenDto {
    return {
      id: usuario.getId(),
      nombreCompleto: usuario.nombreCompleto.obtenerNombreCompleto(),
      email: usuario.emailValue,
      cargo: usuario.cargo,
      departamento: usuario.departamentoValue,
      estado: usuario.estadoValue,
      tieneConflictoIntereses: usuario.tieneConflictoIntereses
    };
  }

  /**
   * Convierte un array de entidades Usuario a array de DTOs
   */
  toDtoArray(usuarios: Usuario[]): UsuarioDto[] {
    return usuarios.map(usuario => this.toDto(usuario));
  }

  /**
   * Convierte un array de entidades Usuario a array de DTOs de resumen
   */
  toResumenDtoArray(usuarios: Usuario[]): UsuarioResumenDto[] {
    return usuarios.map(usuario => this.toResumenDto(usuario));
  }

  /**
   * Convierte un CrearUsuarioDto a entidad Usuario del dominio
   */
  fromCrearDto(dto: CrearUsuarioDto): Usuario {
    return new Usuario(
      0, // ID temporal, se asignará al guardar
      dto.nombre,
      dto.apellido,
      dto.email,
      dto.cargo,
      dto.departamento,
      dto.fechaIngreso,
      'activo', // Estado por defecto
      new Date(), // Fecha de última actualización
      false // Sin conflicto de intereses por defecto
    );
  }

  /**
   * Convierte un UsuarioDto a entidad Usuario del dominio
   */
  fromDto(dto: UsuarioDto): Usuario {
    return new Usuario(
      dto.id,
      dto.nombre,
      dto.apellido,
      dto.email,
      dto.cargo,
      dto.departamento,
      dto.fechaIngreso,
      dto.estado,
      dto.ultimaActualizacion,
      dto.tieneConflictoIntereses
    );
  }

  /**
   * Aplica cambios de ActualizarUsuarioDto a una entidad Usuario existente
   */
  aplicarActualizacion(usuario: Usuario, dto: ActualizarUsuarioDto): Usuario {
    // Crear una nueva instancia con los cambios aplicados
    const usuarioActualizado = new Usuario(
      usuario.getId(),
      usuario.nombre,
      usuario.apellido,
      usuario.emailValue,
      dto.cargo || usuario.cargo,
      dto.departamento || usuario.departamentoValue,
      usuario.fechaIngreso,
      dto.estado || usuario.estadoValue,
      new Date(), // Actualizar fecha de modificación
      dto.tieneConflictoIntereses !== undefined ? dto.tieneConflictoIntereses : usuario.tieneConflictoIntereses
    );

    return usuarioActualizado;
  }

  /**
   * Convierte datos planos (por ejemplo, de una API) a entidad Usuario
   */
  fromPlainObject(data: any): Usuario {
    return Usuario.fromPlainObject(data);
  }

  /**
   * Convierte una entidad Usuario a objeto plano (para APIs)
   */
  toPlainObject(usuario: Usuario): any {
    return usuario.toJSON();
  }

  /**
   * Valida si un DTO tiene la estructura correcta para crear un usuario
   */
  validarCrearDto(dto: CrearUsuarioDto): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!dto.nombre || dto.nombre.trim().length === 0) {
      errores.push('El nombre es requerido');
    }

    if (!dto.apellido || dto.apellido.trim().length === 0) {
      errores.push('El apellido es requerido');
    }

    if (!dto.email || dto.email.trim().length === 0) {
      errores.push('El email es requerido');
    }

    if (!dto.cargo || dto.cargo.trim().length === 0) {
      errores.push('El cargo es requerido');
    }

    if (!dto.departamento || dto.departamento.trim().length === 0) {
      errores.push('El departamento es requerido');
    }

    if (!dto.fechaIngreso) {
      errores.push('La fecha de ingreso es requerida');
    }

    // Validar formato de email básico
    if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      errores.push('El formato del email es inválido');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Convierte errores de dominio a formato amigable para la UI
   */
  mapearErroresDominio(error: Error): string {
    const erroresDominio = {
      'Estado de usuario inválido': 'El estado del usuario no es válido',
      'Departamento inválido': 'El departamento seleccionado no es válido',
      'Formato de email inválido': 'El formato del email no es válido',
      'El nombre debe tener al menos 2 caracteres': 'El nombre debe tener al menos 2 caracteres',
      'El apellido debe tener al menos 2 caracteres': 'El apellido debe tener al menos 2 caracteres'
    };

    return erroresDominio[error.message as keyof typeof erroresDominio] || error.message;
  }

  // Métodos privados para datos simulados
  private generarTelefonoSimulado(id: number): string {
    const prefijos = ['300', '310', '315', '320', '301'];
    const prefijo = prefijos[id % prefijos.length];
    const numero = String(1000000 + (id * 123456) % 9000000);
    return `+57 ${prefijo} ${numero.substring(0, 3)} ${numero.substring(3, 7)}`;
  }

  private generarDireccionSimulada(id: number): string {
    const calles = ['Calle', 'Carrera', 'Avenida', 'Transversal'];
    const calle = calles[id % calles.length];
    const numero1 = 10 + (id * 7) % 90;
    const numero2 = 10 + (id * 13) % 90;
    const numero3 = 10 + (id * 17) % 90;
    return `${calle} ${numero1} #${numero2}-${numero3}`;
  }

  private generarCiudadSimulada(departamento: string): string {
    const ciudadesPorDepto = {
      'Recursos Humanos': 'Bogotá',
      'Tecnología': 'Medellín',
      'Finanzas': 'Bogotá',
      'Marketing': 'Cali',
      'Ventas': 'Barranquilla',
      'Operaciones': 'Bogotá',
      'Legal': 'Bogotá',
      'Auditoría': 'Cartagena',
      'Compras': 'Bucaramanga',
      'Administración': 'Bogotá'
    };
    return ciudadesPorDepto[departamento as keyof typeof ciudadesPorDepto] || 'Bogotá';
  }

  private generarNivelEducativoSimulado(cargo: string): string {
    if (cargo.toLowerCase().includes('gerente') || cargo.toLowerCase().includes('director')) {
      return 'Maestría';
    }
    if (cargo.toLowerCase().includes('senior') || cargo.toLowerCase().includes('coordinador')) {
      return 'Profesional';
    }
    return 'Técnico';
  }

  private generarInstitucionSimulada(departamento: string): string {
    const instituciones = {
      'Tecnología': 'Universidad Nacional de Colombia',
      'Finanzas': 'Universidad de los Andes',
      'Marketing': 'Pontificia Universidad Javeriana',
      'Recursos Humanos': 'Universidad Externado de Colombia',
      'Legal': 'Universidad del Rosario'
    };
    return instituciones[departamento as keyof typeof instituciones] || 'Universidad Nacional de Colombia';
  }

  private generarTituloSimulado(cargo: string): string {
    if (cargo.toLowerCase().includes('desarrollador') || cargo.toLowerCase().includes('tecnología')) {
      return 'Ingeniería de Sistemas';
    }
    if (cargo.toLowerCase().includes('contad') || cargo.toLowerCase().includes('finanzas')) {
      return 'Contaduría Pública';
    }
    if (cargo.toLowerCase().includes('marketing') || cargo.toLowerCase().includes('ventas')) {
      return 'Administración de Empresas';
    }
    if (cargo.toLowerCase().includes('recursos humanos')) {
      return 'Psicología';
    }
    return 'Administración de Empresas';
  }

  private generarPersonasACargoSimuladas(id: number): any[] {
    if (id % 3 === 0) return []; // Algunos usuarios sin personas a cargo

    const personas = [];
    const numPersonas = (id % 3) + 1;

    for (let i = 0; i < numPersonas; i++) {
      personas.push({
        id: id * 10 + i,
        nombre: `Persona${i + 1}`,
        apellido: `Apellido${i + 1}`,
        parentesco: i === 0 ? 'Hijo' : i === 1 ? 'Cónyuge' : 'Padre',
        edad: i === 0 ? 15 + (id % 20) : i === 1 ? 30 + (id % 15) : 55 + (id % 20),
        tipoDocumento: 'CC',
        numeroDocumento: String(10000000 + (id * 1000) + i)
      });
    }

    return personas;
  }

  private generarContactosEmergenciaSimulados(id: number): any[] {
    return [
      {
        id: id * 100 + 1,
        nombre: 'María',
        apellido: 'Contacto',
        parentesco: 'Madre',
        telefono: `+57 300 ${String(1000000 + id * 7654).substring(0, 7)}`,
        email: `contacto${id}@gmail.com`
      },
      {
        id: id * 100 + 2,
        nombre: 'Juan',
        apellido: 'Emergencia',
        parentesco: 'Hermano',
        telefono: `+57 310 ${String(2000000 + id * 4321).substring(0, 7)}`
      }
    ];
  }
} 