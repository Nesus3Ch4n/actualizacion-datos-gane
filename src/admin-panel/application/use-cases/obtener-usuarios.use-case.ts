import { Injectable } from '@angular/core';

// Domain imports
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';

// Application imports
import { UsuarioDto, UsuarioDetalleDto } from '../dto/usuario.dto';
import { ReporteDto } from '../dto/reporte.dto';
import { FiltroUsuariosDto, ResultadoFiltroDto } from '../dto/filtro-usuarios.dto';

// Infrastructure imports (interfaces)
import { UsuarioAdapter } from '../../infrastructure/adapters/usuario.adapter';

@Injectable({
  providedIn: 'root'
})
export class ObtenerUsuariosUseCase {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private usuarioAdapter: UsuarioAdapter
  ) {}

  /**
   * Obtiene todos los usuarios del sistema
   */
  async execute(): Promise<UsuarioDto[]> {
    try {
      const usuarios = await this.usuarioRepository.obtenerTodos();
      return usuarios.map(usuario => this.usuarioAdapter.toDto(usuario));
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw new Error('No se pudieron obtener los usuarios del sistema');
    }
  }

  /**
   * Obtiene usuarios con filtros aplicados
   */
  async ejecutarConFiltros(filtros: FiltroUsuariosDto): Promise<ResultadoFiltroDto<UsuarioDto>> {
    try {
      const resultado = await this.usuarioRepository.obtenerConFiltros(filtros);
      
      return {
        elementos: resultado.elementos.map(usuario => this.usuarioAdapter.toDto(usuario)),
        totalElementos: resultado.totalElementos,
        paginaActual: resultado.paginaActual,
        totalPaginas: resultado.totalPaginas,
        elementosPorPagina: resultado.elementosPorPagina,
        hayPaginaAnterior: resultado.hayPaginaAnterior,
        hayPaginaSiguiente: resultado.hayPaginaSiguiente,
        filtrosAplicados: resultado.filtrosAplicados
      };
    } catch (error) {
      console.error('Error obteniendo usuarios con filtros:', error);
      throw new Error('No se pudieron obtener los usuarios con los filtros especificados');
    }
  }

  /**
   * Obtiene el detalle completo de un usuario específico
   */
  async obtenerDetalleUsuario(id: number): Promise<UsuarioDetalleDto> {
    try {
      const usuario = await this.usuarioRepository.obtenerPorId(id);
      if (!usuario) {
        throw new Error(`Usuario con ID ${id} no encontrado`);
      }

      return this.usuarioAdapter.toDetalleDto(usuario);
    } catch (error) {
      console.error(`Error obteniendo detalle del usuario ${id}:`, error);
      throw new Error('No se pudo obtener el detalle del usuario');
    }
  }

  /**
   * Obtiene la configuración de reportes disponibles
   */
  async obtenerConfiguracionReportes(): Promise<ReporteDto[]> {
    try {
      // Simulación de configuración de reportes
      // En una implementación real, esto vendría del repositorio o configuración
      return [
        {
          id: 1,
          tipo: 'integrantes',
          nombre: 'Reporte de Integrantes',
          descripcion: 'Listado completo de todos los empleados con información básica',
          icono: 'group',
          color: 'primary',
          columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Fecha Ingreso', 'Estado'],
          estimacionTiempo: '1-2 minutos'
        },
        {
          id: 2,
          tipo: 'conflicto-intereses',
          nombre: 'Reporte Conflicto de Intereses',
          descripcion: 'Empleados con declaraciones de conflicto de intereses',
          icono: 'warning',
          color: 'warn',
          columnas: ['ID', 'Nombre', 'Apellido', 'Email', 'Cargo', 'Departamento', 'Conflicto de Intereses'],
          estimacionTiempo: '30 segundos'
        },
        {
          id: 3,
          tipo: 'estudios',
          nombre: 'Reporte de Estudios',
          descripcion: 'Información académica y formación de los empleados',
          icono: 'school',
          color: 'accent',
          columnas: ['ID', 'Nombre', 'Apellido', 'Nivel Educativo', 'Institución', 'Título'],
          estimacionTiempo: '2-3 minutos'
        },
        {
          id: 4,
          tipo: 'contacto',
          nombre: 'Reporte Personas de Contacto',
          descripcion: 'Información de contacto y personas de emergencia',
          icono: 'contact_phone',
          color: 'primary',
          columnas: ['ID', 'Nombre', 'Apellido', 'Teléfono', 'Email', 'Contacto Emergencia'],
          estimacionTiempo: '1-2 minutos'
        },
        {
          id: 5,
          tipo: 'personas-cargo',
          nombre: 'Reporte Personas a Cargo',
          descripcion: 'Empleados con personas dependientes a su cargo',
          icono: 'family_restroom',
          color: 'accent',
          columnas: ['ID', 'Nombre', 'Apellido', 'Personas a Cargo', 'Parentesco'],
          estimacionTiempo: '1 minuto'
        }
      ];
    } catch (error) {
      console.error('Error obteniendo configuración de reportes:', error);
      throw new Error('No se pudo obtener la configuración de reportes');
    }
  }

  /**
   * Obtiene la lista de departamentos disponibles
   */
  async obtenerDepartamentos(): Promise<string[]> {
    try {
      return await this.usuarioRepository.obtenerDepartamentosUnicos();
    } catch (error) {
      console.error('Error obteniendo departamentos:', error);
      // Fallback con departamentos predeterminados
      return [
        'Recursos Humanos',
        'Tecnología',
        'Finanzas',
        'Marketing',
        'Ventas',
        'Operaciones',
        'Legal',
        'Auditoría',
        'Compras',
        'Administración'
      ];
    }
  }

  /**
   * Obtiene la lista de estados disponibles
   */
  async obtenerEstados(): Promise<string[]> {
    try {
      return await this.usuarioRepository.obtenerEstadosUnicos();
    } catch (error) {
      console.error('Error obteniendo estados:', error);
      // Fallback con estados predeterminados
      return ['activo', 'inactivo', 'suspendido', 'en-revision'];
    }
  }

  /**
   * Obtiene usuarios por departamento específico
   */
  async obtenerPorDepartamento(departamento: string): Promise<UsuarioDto[]> {
    try {
      const usuarios = await this.usuarioRepository.obtenerPorDepartamento(departamento);
      return usuarios.map(usuario => this.usuarioAdapter.toDto(usuario));
    } catch (error) {
      console.error(`Error obteniendo usuarios del departamento ${departamento}:`, error);
      throw new Error(`No se pudieron obtener los usuarios del departamento ${departamento}`);
    }
  }

  /**
   * Obtiene usuarios por estado específico
   */
  async obtenerPorEstado(estado: string): Promise<UsuarioDto[]> {
    try {
      const usuarios = await this.usuarioRepository.obtenerPorEstado(estado);
      return usuarios.map(usuario => this.usuarioAdapter.toDto(usuario));
    } catch (error) {
      console.error(`Error obteniendo usuarios con estado ${estado}:`, error);
      throw new Error(`No se pudieron obtener los usuarios con estado ${estado}`);
    }
  }

  /**
   * Busca usuarios por texto libre
   */
  async buscarUsuarios(texto: string): Promise<UsuarioDto[]> {
    try {
      if (!texto || texto.trim().length === 0) {
        return await this.execute();
      }

      const usuarios = await this.usuarioRepository.buscarPorTexto(texto.trim());
      return usuarios.map(usuario => this.usuarioAdapter.toDto(usuario));
    } catch (error) {
      console.error(`Error buscando usuarios con texto "${texto}":`, error);
      throw new Error('No se pudo realizar la búsqueda de usuarios');
    }
  }

  /**
   * Obtiene usuarios con conflicto de intereses
   */
  async obtenerConConflictoIntereses(): Promise<UsuarioDto[]> {
    try {
      const usuarios = await this.usuarioRepository.obtenerConConflictoIntereses();
      return usuarios.map(usuario => this.usuarioAdapter.toDto(usuario));
    } catch (error) {
      console.error('Error obteniendo usuarios con conflicto de intereses:', error);
      throw new Error('No se pudieron obtener los usuarios con conflicto de intereses');
    }
  }

  /**
   * Obtiene estadísticas básicas de usuarios
   */
  async obtenerEstadisticasBasicas(): Promise<any> {
    try {
      const usuarios = await this.usuarioRepository.obtenerTodos();
      
      const stats = {
        total: usuarios.length,
        activos: usuarios.filter(u => u.estaActivo()).length,
        inactivos: usuarios.filter(u => u.estadoValue === 'inactivo').length,
        suspendidos: usuarios.filter(u => u.estadoValue === 'suspendido').length,
        conConflicto: usuarios.filter(u => u.tieneConflictoIntereses).length,
        porDepartamento: this.agruparPorDepartamento(usuarios),
        actualizacionesRecientes: usuarios.filter(u => u.requiereActualizacionDatos()).length
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw new Error('No se pudieron obtener las estadísticas de usuarios');
    }
  }

  /**
   * Valida si un usuario existe por email
   */
  async existeUsuarioConEmail(email: string): Promise<boolean> {
    try {
      const usuario = await this.usuarioRepository.obtenerPorEmail(email);
      return usuario !== null;
    } catch (error) {
      console.error(`Error validando existencia de email ${email}:`, error);
      return false;
    }
  }

  // Métodos privados de utilidad
  private agruparPorDepartamento(usuarios: Usuario[]): any {
    const grupos = usuarios.reduce((acc, usuario) => {
      const depto = usuario.departamentoValue;
      if (!acc[depto]) {
        acc[depto] = 0;
      }
      acc[depto]++;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(grupos).map(depto => ({
      departamento: depto,
      cantidad: grupos[depto],
      porcentaje: Math.round((grupos[depto] / usuarios.length) * 100)
    }));
  }
} 