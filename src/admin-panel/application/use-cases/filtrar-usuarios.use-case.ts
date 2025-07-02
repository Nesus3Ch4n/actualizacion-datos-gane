import { Injectable } from '@angular/core';

// Domain imports
import { Usuario } from '../../domain/entities/usuario.entity';
import { EstadoUsuario } from '../../domain/value-objects/estado-usuario.vo';
import { Departamento } from '../../domain/value-objects/departamento.vo';
import { NombreCompleto } from '../../domain/value-objects/nombre-completo.vo';
import { Email } from '../../domain/value-objects/email.vo';

// Application imports
import { UsuarioDto } from '../dto/usuario.dto';
import { FiltroUsuariosDto, FiltroAvanzadoDto, CampoBusquedaDto } from '../dto/filtro-usuarios.dto';

@Injectable({
  providedIn: 'root'
})
export class FiltrarUsuariosUseCase {
  constructor() {}

  /**
   * Aplica filtro básico a los datos de la tabla
   */
  aplicarFiltro(usuario: UsuarioDto, filtroTexto: string): boolean {
    if (!filtroTexto || filtroTexto.trim().length === 0) {
      return true;
    }

    const terminoBusqueda = filtroTexto.toLowerCase().trim();
    
    // Buscar en múltiples campos
    const camposBusqueda = [
      usuario.nombre?.toLowerCase() || '',
      usuario.apellido?.toLowerCase() || '',
      usuario.email?.toLowerCase() || '',
      usuario.cargo?.toLowerCase() || '',
      usuario.departamento?.toLowerCase() || '',
      usuario.estado?.toLowerCase() || '',
      `${usuario.nombre} ${usuario.apellido}`.toLowerCase() // Nombre completo
    ];

    return camposBusqueda.some(campo => campo.includes(terminoBusqueda));
  }

  /**
   * Crea un filtro completo combinando múltiples criterios
   */
  async crearFiltro(filtro: FiltroUsuariosDto): Promise<string> {
    const filtrosAplicados: string[] = [];

    // Filtro de texto general
    if (filtro.texto && filtro.texto.trim().length > 0) {
      filtrosAplicados.push(`texto:${filtro.texto.trim()}`);
    }

    // Filtro de estado
    if (filtro.estado && filtro.estado.trim().length > 0) {
      filtrosAplicados.push(`estado:${filtro.estado}`);
    }

    // Filtro de departamento
    if (filtro.departamento && filtro.departamento.trim().length > 0) {
      filtrosAplicados.push(`departamento:${filtro.departamento}`);
    }

    // Filtros específicos
    if (filtro.soloConConflictoIntereses) {
      filtrosAplicados.push('conflicto:true');
    }

    if (filtro.soloActivos) {
      filtrosAplicados.push('solo-activos:true');
    }

    if (filtro.soloInactivos) {
      filtrosAplicados.push('solo-inactivos:true');
    }

    if (filtro.excluirSuspendidos) {
      filtrosAplicados.push('excluir-suspendidos:true');
    }

    return filtrosAplicados.join('|');
  }

  /**
   * Aplica filtros avanzados a una lista de usuarios
   */
  async aplicarFiltrosAvanzados(usuarios: UsuarioDto[], filtros: FiltroAvanzadoDto): Promise<UsuarioDto[]> {
    try {
      let usuariosFiltrados = [...usuarios];

      // Filtro de texto general
      if (filtros.texto && filtros.texto.trim().length > 0) {
        usuariosFiltrados = this.filtrarPorTexto(usuariosFiltrados, filtros.texto);
      }

      // Filtros específicos de campos
      if (filtros.busquedaEnCampos && filtros.busquedaEnCampos.length > 0) {
        usuariosFiltrados = this.filtrarPorCamposEspecificos(usuariosFiltrados, filtros.busquedaEnCampos);
      }

      // Filtro de estados
      if (filtros.estados && filtros.estados.length > 0) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          filtros.estados!.includes(usuario.estado)
        );
      }

      // Filtro de departamentos
      if (filtros.departamentos && filtros.departamentos.length > 0) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          filtros.departamentos!.includes(usuario.departamento)
        );
      }

      // Filtro de cargos
      if (filtros.cargos && filtros.cargos.length > 0) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario => 
          filtros.cargos!.some(cargo => 
            usuario.cargo.toLowerCase().includes(cargo.toLowerCase())
          )
        );
      }

      // Filtros de fecha
      usuariosFiltrados = this.aplicarFiltrosFecha(usuariosFiltrados, filtros);

      // Filtros booleanos
      usuariosFiltrados = this.aplicarFiltrosBooleanos(usuariosFiltrados, filtros);

      // Aplicar ordenamiento
      if (filtros.ordenamiento) {
        usuariosFiltrados = this.aplicarOrdenamiento(usuariosFiltrados, filtros.ordenamiento);
      }

      return usuariosFiltrados;

    } catch (error) {
      console.error('Error aplicando filtros avanzados:', error);
      throw new Error('No se pudieron aplicar los filtros especificados');
    }
  }

  /**
   * Valida si los filtros son válidos
   */
  validarFiltros(filtros: FiltroAvanzadoDto): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar fechas
    if (filtros.fechaIngresoDesde && filtros.fechaIngresoHasta) {
      if (filtros.fechaIngresoDesde > filtros.fechaIngresoHasta) {
        errores.push('La fecha de ingreso inicial no puede ser mayor que la final');
      }
    }

    if (filtros.ultimaActualizacionDesde && filtros.ultimaActualizacionHasta) {
      if (filtros.ultimaActualizacionDesde > filtros.ultimaActualizacionHasta) {
        errores.push('La fecha de actualización inicial no puede ser mayor que la final');
      }
    }

    // Validar estados
    if (filtros.estados && filtros.estados.length > 0) {
      const estadosValidos = EstadoUsuario.obtenerEstadosValidos();
      const estadosInvalidos = filtros.estados.filter(estado => !estadosValidos.includes(estado));
      if (estadosInvalidos.length > 0) {
        errores.push(`Estados inválidos: ${estadosInvalidos.join(', ')}`);
      }
    }

    // Validar departamentos
    if (filtros.departamentos && filtros.departamentos.length > 0) {
      const departamentosValidos = Departamento.obtenerDepartamentosValidos();
      const departamentosInvalidos = filtros.departamentos.filter(depto => !departamentosValidos.includes(depto));
      if (departamentosInvalidos.length > 0) {
        errores.push(`Departamentos inválidos: ${departamentosInvalidos.join(', ')}`);
      }
    }

    // Validar búsqueda en campos
    if (filtros.busquedaEnCampos && filtros.busquedaEnCampos.length > 0) {
      const camposValidos = ['nombre', 'apellido', 'email', 'cargo', 'departamento', 'todos'];
      for (const busqueda of filtros.busquedaEnCampos) {
        if (!camposValidos.includes(busqueda.campo)) {
          errores.push(`Campo de búsqueda inválido: ${busqueda.campo}`);
        }
        if (!busqueda.valor || busqueda.valor.trim().length === 0) {
          errores.push(`El valor de búsqueda para el campo ${busqueda.campo} no puede estar vacío`);
        }
      }
    }

    // Validar paginación
    if (filtros.paginacion) {
      if (filtros.paginacion.pagina < 1) {
        errores.push('El número de página debe ser mayor a 0');
      }
      if (filtros.paginacion.elementosPorPagina < 1 || filtros.paginacion.elementosPorPagina > 1000) {
        errores.push('Los elementos por página deben estar entre 1 y 1000');
      }
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }

  /**
   * Optimiza filtros para mejorar el rendimiento
   */
  optimizarFiltros(filtros: FiltroAvanzadoDto): FiltroAvanzadoDto {
    const filtrosOptimizados = { ...filtros };

    // Limpiar texto de búsqueda
    if (filtrosOptimizados.texto) {
      filtrosOptimizados.texto = filtrosOptimizados.texto.trim();
      if (filtrosOptimizados.texto.length === 0) {
        delete filtrosOptimizados.texto;
      }
    }

    // Remover arrays vacíos
    if (filtrosOptimizados.estados && filtrosOptimizados.estados.length === 0) {
      delete filtrosOptimizados.estados;
    }

    if (filtrosOptimizados.departamentos && filtrosOptimizados.departamentos.length === 0) {
      delete filtrosOptimizados.departamentos;
    }

    if (filtrosOptimizados.cargos && filtrosOptimizados.cargos.length === 0) {
      delete filtrosOptimizados.cargos;
    }

    // Optimizar búsqueda en campos
    if (filtrosOptimizados.busquedaEnCampos) {
      filtrosOptimizados.busquedaEnCampos = filtrosOptimizados.busquedaEnCampos.filter(
        busqueda => busqueda.valor && busqueda.valor.trim().length > 0
      );
      if (filtrosOptimizados.busquedaEnCampos.length === 0) {
        delete filtrosOptimizados.busquedaEnCampos;
      }
    }

    return filtrosOptimizados;
  }

  // Métodos privados de filtrado
  private filtrarPorTexto(usuarios: UsuarioDto[], texto: string): UsuarioDto[] {
    const terminoBusqueda = texto.toLowerCase().trim();
    
    return usuarios.filter(usuario => {
      // Crear instancias de value objects para búsqueda avanzada
      try {
        const nombreCompleto = new NombreCompleto(usuario.nombre, usuario.apellido);
        const email = new Email(usuario.email);
        
        return nombreCompleto.coincideConBusqueda(terminoBusqueda) ||
               email.coincideConBusqueda(terminoBusqueda) ||
               usuario.cargo.toLowerCase().includes(terminoBusqueda) ||
               usuario.departamento.toLowerCase().includes(terminoBusqueda) ||
               usuario.estado.toLowerCase().includes(terminoBusqueda);
      } catch {
        // Fallback a búsqueda simple si hay errores con los value objects
        return this.aplicarFiltro(usuario, texto);
      }
    });
  }

  private filtrarPorCamposEspecificos(usuarios: UsuarioDto[], busquedas: CampoBusquedaDto[]): UsuarioDto[] {
    return usuarios.filter(usuario => {
      return busquedas.every(busqueda => {
        const valorCampo = this.obtenerValorCampo(usuario, busqueda.campo);
        return this.aplicarOperadorBusqueda(valorCampo, busqueda.valor, busqueda.operador);
      });
    });
  }

  private obtenerValorCampo(usuario: UsuarioDto, campo: string): string {
    switch (campo) {
      case 'nombre':
        return usuario.nombre || '';
      case 'apellido':
        return usuario.apellido || '';
      case 'email':
        return usuario.email || '';
      case 'cargo':
        return usuario.cargo || '';
      case 'departamento':
        return usuario.departamento || '';
      case 'todos':
        return `${usuario.nombre} ${usuario.apellido} ${usuario.email} ${usuario.cargo} ${usuario.departamento}`;
      default:
        return '';
    }
  }

  private aplicarOperadorBusqueda(valorCampo: string, valorBusqueda: string, operador: string): boolean {
    const campo = valorCampo.toLowerCase();
    const busqueda = valorBusqueda.toLowerCase();

    switch (operador) {
      case 'contiene':
        return campo.includes(busqueda);
      case 'empiezaCon':
        return campo.startsWith(busqueda);
      case 'terminaCon':
        return campo.endsWith(busqueda);
      case 'igual':
        return campo === busqueda;
      case 'diferente':
        return campo !== busqueda;
      default:
        return campo.includes(busqueda);
    }
  }

  private aplicarFiltrosFecha(usuarios: UsuarioDto[], filtros: FiltroAvanzadoDto): UsuarioDto[] {
    let usuariosFiltrados = usuarios;

    // Filtro por fecha de ingreso
    if (filtros.fechaIngresoDesde || filtros.fechaIngresoHasta) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => {
        const fechaIngreso = new Date(usuario.fechaIngreso);
        
        if (filtros.fechaIngresoDesde && fechaIngreso < filtros.fechaIngresoDesde) {
          return false;
        }
        
        if (filtros.fechaIngresoHasta && fechaIngreso > filtros.fechaIngresoHasta) {
          return false;
        }
        
        return true;
      });
    }

    // Filtro por fecha de última actualización
    if (filtros.ultimaActualizacionDesde || filtros.ultimaActualizacionHasta) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => {
        const fechaActualizacion = new Date(usuario.ultimaActualizacion);
        
        if (filtros.ultimaActualizacionDesde && fechaActualizacion < filtros.ultimaActualizacionDesde) {
          return false;
        }
        
        if (filtros.ultimaActualizacionHasta && fechaActualizacion > filtros.ultimaActualizacionHasta) {
          return false;
        }
        
        return true;
      });
    }

    return usuariosFiltrados;
  }

  private aplicarFiltrosBooleanos(usuarios: UsuarioDto[], filtros: FiltroAvanzadoDto): UsuarioDto[] {
    let usuariosFiltrados = usuarios;

    if (filtros.soloConConflictoIntereses) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.tieneConflictoIntereses);
    }

    if (filtros.soloActivos) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.estado === 'activo');
    }

    if (filtros.soloInactivos) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.estado === 'inactivo');
    }

    if (filtros.excluirSuspendidos) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.estado !== 'suspendido');
    }

    return usuariosFiltrados;
  }

  private aplicarOrdenamiento(usuarios: UsuarioDto[], ordenamiento: any): UsuarioDto[] {
    return usuarios.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (ordenamiento.campo) {
        case 'id':
          valorA = a.id;
          valorB = b.id;
          break;
        case 'nombre':
          valorA = a.nombre?.toLowerCase() || '';
          valorB = b.nombre?.toLowerCase() || '';
          break;
        case 'apellido':
          valorA = a.apellido?.toLowerCase() || '';
          valorB = b.apellido?.toLowerCase() || '';
          break;
        case 'email':
          valorA = a.email?.toLowerCase() || '';
          valorB = b.email?.toLowerCase() || '';
          break;
        case 'cargo':
          valorA = a.cargo?.toLowerCase() || '';
          valorB = b.cargo?.toLowerCase() || '';
          break;
        case 'departamento':
          valorA = a.departamento?.toLowerCase() || '';
          valorB = b.departamento?.toLowerCase() || '';
          break;
        case 'fechaIngreso':
          valorA = new Date(a.fechaIngreso);
          valorB = new Date(b.fechaIngreso);
          break;
        case 'ultimaActualizacion':
          valorA = new Date(a.ultimaActualizacion);
          valorB = new Date(b.ultimaActualizacion);
          break;
        case 'estado':
          valorA = a.estado?.toLowerCase() || '';
          valorB = b.estado?.toLowerCase() || '';
          break;
        default:
          valorA = a.id;
          valorB = b.id;
      }

      let resultado = 0;
      if (valorA < valorB) resultado = -1;
      else if (valorA > valorB) resultado = 1;

      return ordenamiento.direccion === 'desc' ? -resultado : resultado;
    });
  }
} 