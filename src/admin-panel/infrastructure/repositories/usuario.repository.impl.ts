import { Injectable } from '@angular/core';

// Domain imports
import { Usuario } from '../../domain/entities/usuario.entity';
import { 
  UsuarioRepository, 
  EstadisticasUsuarios, 
  HistorialCambio, 
  RegistroCambio,
  ResultadoOperacionMasiva,
  CriteriosBusquedaAvanzada,
  ResultadoBusquedaAvanzada
} from '../../domain/repositories/usuario.repository';

// Application imports
import { FiltroUsuariosDto, ResultadoFiltroDto } from '../../application/dto/filtro-usuarios.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRepositoryImpl implements UsuarioRepository {
  
  // Datos simulados para el prototipo
  private usuarios: Usuario[] = [];
  private historialCambios: HistorialCambio[] = [];
  private contadorId = 6; // Para simular auto-incremento

  constructor() {
    this.inicializarDatosPrueba();
  }

  // Operaciones básicas CRUD
  async obtenerTodos(): Promise<Usuario[]> {
    return Promise.resolve([...this.usuarios]);
  }

  async obtenerPorId(id: number): Promise<Usuario | null> {
    const usuario = this.usuarios.find(u => u.getId() === id);
    return Promise.resolve(usuario || null);
  }

  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const usuario = this.usuarios.find(u => u.emailValue === email);
    return Promise.resolve(usuario || null);
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    // Simular validación de email único
    const existeEmail = await this.existeEmail(usuario.emailValue);
    if (existeEmail) {
      throw new Error(`Ya existe un usuario con el email ${usuario.emailValue}`);
    }

    // Asignar nuevo ID si es necesario
    if (!usuario.getId()) {
      (usuario as any)._id = this.contadorId++;
    }

    this.usuarios.push(usuario);
    return Promise.resolve(usuario);
  }

  async actualizar(usuario: Usuario): Promise<Usuario> {
    const index = this.usuarios.findIndex(u => u.getId() === usuario.getId());
    if (index === -1) {
      throw new Error(`Usuario con ID ${usuario.getId()} no encontrado`);
    }

    // Registrar cambios para auditoría
    const usuarioAnterior = this.usuarios[index];
    await this.registrarCambiosUsuario(usuarioAnterior, usuario);

    this.usuarios[index] = usuario;
    return Promise.resolve(usuario);
  }

  async eliminar(id: number): Promise<boolean> {
    const index = this.usuarios.findIndex(u => u.getId() === id);
    if (index === -1) {
      return Promise.resolve(false);
    }

    this.usuarios.splice(index, 1);
    return Promise.resolve(true);
  }

  // Operaciones de búsqueda y filtrado
  async obtenerConFiltros(filtros: FiltroUsuariosDto): Promise<ResultadoFiltroDto<Usuario>> {
    let usuariosFiltrados = [...this.usuarios];

    // Aplicar filtros
    if (filtros.texto) {
      const texto = filtros.texto.toLowerCase();
      usuariosFiltrados = usuariosFiltrados.filter(u => 
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.emailValue.toLowerCase().includes(texto) ||
        u.cargo.toLowerCase().includes(texto) ||
        u.departamentoValue.toLowerCase().includes(texto)
      );
    }

    if (filtros.estado) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.estadoValue === filtros.estado);
    }

    if (filtros.departamento) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.departamentoValue === filtros.departamento);
    }

    if (filtros.soloConConflictoIntereses) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.tieneConflictoIntereses);
    }

    if (filtros.soloActivos) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.estaActivo());
    }

    if (filtros.soloInactivos) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.estadoValue === 'inactivo');
    }

    if (filtros.excluirSuspendidos) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.estadoValue !== 'suspendido');
    }

    // Aplicar filtros de fecha
    if (filtros.fechaIngresoDesde) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.fechaIngreso >= filtros.fechaIngresoDesde!);
    }

    if (filtros.fechaIngresoHasta) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.fechaIngreso <= filtros.fechaIngresoHasta!);
    }

    if (filtros.ultimaActualizacionDesde) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.ultimaActualizacion >= filtros.ultimaActualizacionDesde!);
    }

    if (filtros.ultimaActualizacionHasta) {
      usuariosFiltrados = usuariosFiltrados.filter(u => u.ultimaActualizacion <= filtros.ultimaActualizacionHasta!);
    }

    // Simulación de paginación (valores por defecto)
    const elementosPorPagina = 10;
    const paginaActual = 1;
    const totalElementos = usuariosFiltrados.length;
    const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

    return {
      elementos: usuariosFiltrados,
      totalElementos,
      paginaActual,
      totalPaginas,
      elementosPorPagina,
      hayPaginaAnterior: paginaActual > 1,
      hayPaginaSiguiente: paginaActual < totalPaginas,
      filtrosAplicados: this.construirFiltrosAplicados(filtros)
    };
  }

  async buscarPorTexto(texto: string): Promise<Usuario[]> {
    const textoLower = texto.toLowerCase();
    const usuarios = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(textoLower) ||
      u.apellido.toLowerCase().includes(textoLower) ||
      u.emailValue.toLowerCase().includes(textoLower) ||
      u.cargo.toLowerCase().includes(textoLower) ||
      u.departamentoValue.toLowerCase().includes(textoLower)
    );
    return Promise.resolve(usuarios);
  }

  async obtenerPorDepartamento(departamento: string): Promise<Usuario[]> {
    const usuarios = this.usuarios.filter(u => u.departamentoValue === departamento);
    return Promise.resolve(usuarios);
  }

  async obtenerPorEstado(estado: string): Promise<Usuario[]> {
    const usuarios = this.usuarios.filter(u => u.estadoValue === estado);
    return Promise.resolve(usuarios);
  }

  async obtenerConConflictoIntereses(): Promise<Usuario[]> {
    const usuarios = this.usuarios.filter(u => u.tieneConflictoIntereses);
    return Promise.resolve(usuarios);
  }

  // Operaciones de metadatos
  async obtenerDepartamentosUnicos(): Promise<string[]> {
    const departamentos = [...new Set(this.usuarios.map(u => u.departamentoValue))];
    return Promise.resolve(departamentos.sort());
  }

  async obtenerEstadosUnicos(): Promise<string[]> {
    const estados = [...new Set(this.usuarios.map(u => u.estadoValue))];
    return Promise.resolve(estados.sort());
  }

  async obtenerCargosUnicos(): Promise<string[]> {
    const cargos = [...new Set(this.usuarios.map(u => u.cargo))];
    return Promise.resolve(cargos.sort());
  }

  // Operaciones de validación
  async existeEmail(email: string): Promise<boolean> {
    const existe = this.usuarios.some(u => u.emailValue === email);
    return Promise.resolve(existe);
  }

  async existeEmailExcluyendoId(email: string, id: number): Promise<boolean> {
    const existe = this.usuarios.some(u => u.emailValue === email && u.getId() !== id);
    return Promise.resolve(existe);
  }

  // Operaciones de estadísticas
  async contarPorEstado(estado: string): Promise<number> {
    const count = this.usuarios.filter(u => u.estadoValue === estado).length;
    return Promise.resolve(count);
  }

  async contarPorDepartamento(departamento: string): Promise<number> {
    const count = this.usuarios.filter(u => u.departamentoValue === departamento).length;
    return Promise.resolve(count);
  }

  async contarConConflictoIntereses(): Promise<number> {
    const count = this.usuarios.filter(u => u.tieneConflictoIntereses).length;
    return Promise.resolve(count);
  }

  async obtenerEstadisticasGenerales(): Promise<EstadisticasUsuarios> {
    const total = this.usuarios.length;
    const activos = this.usuarios.filter(u => u.estaActivo()).length;
    const inactivos = this.usuarios.filter(u => u.estadoValue === 'inactivo').length;
    const suspendidos = this.usuarios.filter(u => u.estadoValue === 'suspendido').length;
    const enRevision = this.usuarios.filter(u => u.estadoValue === 'en-revision').length;
    const conConflictoIntereses = this.usuarios.filter(u => u.tieneConflictoIntereses).length;

    // Distribución por departamento
    const distribuccionPorDepartamento = this.usuarios.reduce((acc, u) => {
      acc[u.departamentoValue] = (acc[u.departamentoValue] || 0) + 1;
      return acc;
    }, {} as { [departamento: string]: number });

    // Distribución por cargo
    const distribuccionPorCargo = this.usuarios.reduce((acc, u) => {
      acc[u.cargo] = (acc[u.cargo] || 0) + 1;
      return acc;
    }, {} as { [cargo: string]: number });

    // Calcular promedio de antigüedad
    const ahora = new Date();
    const antiguedades = this.usuarios.map(u => {
      const meses = (ahora.getTime() - u.fechaIngreso.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return meses;
    });
    const promedioAntiguedad = antiguedades.reduce((sum, a) => sum + a, 0) / antiguedades.length;

    // Simular estadísticas de último mes
    const unMesAtras = new Date();
    unMesAtras.setMonth(unMesAtras.getMonth() - 1);
    
    const usuariosNuevosUltimoMes = this.usuarios.filter(u => u.fechaIngreso >= unMesAtras).length;
    const actualizacionesUltimoMes = this.usuarios.filter(u => u.ultimaActualizacion >= unMesAtras).length;

    return {
      total,
      activos,
      inactivos,
      suspendidos,
      enRevision,
      conConflictoIntereses,
      distribuccionPorDepartamento,
      distribuccionPorCargo,
      promedioAntiguedad: Math.round(promedioAntiguedad),
      usuariosNuevosUltimoMes,
      actualizacionesUltimoMes
    };
  }

  // Operaciones de auditoría
  async obtenerHistorialCambios(id: number): Promise<HistorialCambio[]> {
    const historial = this.historialCambios.filter(h => h.usuarioId === id);
    return Promise.resolve(historial);
  }

  async registrarCambio(cambio: RegistroCambio): Promise<void> {
    const historialCambio: HistorialCambio = {
      id: Date.now(), // ID temporal
      usuarioId: cambio.usuarioId,
      campo: cambio.campo,
      valorAnterior: cambio.valorAnterior,
      valorNuevo: cambio.valorNuevo,
      fechaCambio: new Date(),
      usuarioQueModifica: cambio.usuarioQueModifica,
      razonCambio: cambio.razonCambio
    };

    this.historialCambios.push(historialCambio);
  }

  // Operaciones masivas
  async actualizarEstadoMasivo(ids: number[], nuevoEstado: string): Promise<ResultadoOperacionMasiva> {
    const usuariosAfectados: number[] = [];
    const errores: any[] = [];
    let exitosos = 0;
    let fallidos = 0;

    for (const id of ids) {
      try {
        const usuario = this.usuarios.find(u => u.getId() === id);
        if (usuario) {
          // Simular actualización de estado
          (usuario as any)._estado = { value: nuevoEstado };
          usuariosAfectados.push(id);
          exitosos++;
        } else {
          errores.push({
            usuarioId: id,
            mensaje: `Usuario con ID ${id} no encontrado`,
            codigo: 'USUARIO_NO_ENCONTRADO'
          });
          fallidos++;
        }
      } catch (error) {
        errores.push({
          usuarioId: id,
          mensaje: `Error actualizando usuario ${id}: ${error}`,
          codigo: 'ERROR_ACTUALIZACION'
        });
        fallidos++;
      }
    }

    return {
      exitosos,
      fallidos,
      errores,
      usuariosAfectados
    };
  }

  async eliminarMasivo(ids: number[]): Promise<ResultadoOperacionMasiva> {
    const usuariosAfectados: number[] = [];
    const errores: any[] = [];
    let exitosos = 0;
    let fallidos = 0;

    for (const id of ids) {
      try {
        const index = this.usuarios.findIndex(u => u.getId() === id);
        if (index !== -1) {
          this.usuarios.splice(index, 1);
          usuariosAfectados.push(id);
          exitosos++;
        } else {
          errores.push({
            usuarioId: id,
            mensaje: `Usuario con ID ${id} no encontrado`,
            codigo: 'USUARIO_NO_ENCONTRADO'
          });
          fallidos++;
        }
      } catch (error) {
        errores.push({
          usuarioId: id,
          mensaje: `Error eliminando usuario ${id}: ${error}`,
          codigo: 'ERROR_ELIMINACION'
        });
        fallidos++;
      }
    }

    return {
      exitosos,
      fallidos,
      errores,
      usuariosAfectados
    };
  }

  // Operaciones de búsqueda avanzada
  async busquedaAvanzada(criterios: CriteriosBusquedaAvanzada): Promise<ResultadoBusquedaAvanzada> {
    const inicioTiempo = Date.now();
    let usuarios = [...this.usuarios];

    // Aplicar filtros según criterios
    if (criterios.texto && criterios.campos) {
      usuarios = usuarios.filter(u => {
        return criterios.campos!.some(campo => {
          const valor = this.obtenerValorCampo(u, campo);
          return valor.toLowerCase().includes(criterios.texto!.toLowerCase());
        });
      });
    }

    if (criterios.departamentos && criterios.departamentos.length > 0) {
      usuarios = usuarios.filter(u => criterios.departamentos!.includes(u.departamentoValue));
    }

    if (criterios.estados && criterios.estados.length > 0) {
      usuarios = usuarios.filter(u => criterios.estados!.includes(u.estadoValue));
    }

    if (criterios.cargos && criterios.cargos.length > 0) {
      usuarios = usuarios.filter(u => 
        criterios.cargos!.some(cargo => u.cargo.toLowerCase().includes(cargo.toLowerCase()))
      );
    }

    // Aplicar filtros de fecha
    if (criterios.fechaIngresoDesde) {
      usuarios = usuarios.filter(u => u.fechaIngreso >= criterios.fechaIngresoDesde!);
    }

    if (criterios.fechaIngresoHasta) {
      usuarios = usuarios.filter(u => u.fechaIngreso <= criterios.fechaIngresoHasta!);
    }

    if (criterios.soloConConflictoIntereses) {
      usuarios = usuarios.filter(u => u.tieneConflictoIntereses);
    }

    if (criterios.soloActivos) {
      usuarios = usuarios.filter(u => u.estaActivo());
    }

    // Aplicar ordenamiento
    if (criterios.ordenarPor) {
      usuarios.sort((a, b) => {
        const valorA = this.obtenerValorCampo(a, criterios.ordenarPor!);
        const valorB = this.obtenerValorCampo(b, criterios.ordenarPor!);
        const resultado = valorA.localeCompare(valorB);
        return criterios.ordenDescendente ? -resultado : resultado;
      });
    }

    // Aplicar paginación
    const totalEncontrados = usuarios.length;
    if (criterios.offset !== undefined) {
      usuarios = usuarios.slice(criterios.offset);
    }
    if (criterios.limite !== undefined) {
      usuarios = usuarios.slice(0, criterios.limite);
    }

    const tiempoRespuesta = Date.now() - inicioTiempo;

    return {
      usuarios,
      totalEncontrados,
      tiempoRespuesta,
      filtrosAplicados: this.construirFiltrosAplicadosAvanzados(criterios)
    };
  }

  async obtenerSugerenciasAutocompletado(campo: string, texto: string): Promise<string[]> {
    const textoLower = texto.toLowerCase();
    const valores = new Set<string>();

    this.usuarios.forEach(u => {
      const valor = this.obtenerValorCampo(u, campo);
      if (valor.toLowerCase().includes(textoLower)) {
        valores.add(valor);
      }
    });

    return Promise.resolve(Array.from(valores).slice(0, 10));
  }

  // Métodos privados de utilidad
  private inicializarDatosPrueba(): void {
    // Datos de prueba que ya tienes en el componente actual
    this.usuarios = [
      new Usuario(1, 'María', 'García', 'maria.garcia@empresa.com', 'Analista Senior', 'Recursos Humanos', 
        new Date('2023-01-15'), 'activo', new Date('2024-11-20'), false),
      new Usuario(2, 'Carlos', 'Rodríguez', 'carlos.rodriguez@empresa.com', 'Desarrollador', 'Tecnología', 
        new Date('2022-05-10'), 'activo', new Date('2024-11-18'), true),
      new Usuario(3, 'Ana', 'Fernández', 'ana.fernandez@empresa.com', 'Contadora', 'Finanzas', 
        new Date('2021-09-22'), 'activo', new Date('2024-11-15'), false),
      new Usuario(4, 'Luis', 'Mendoza', 'luis.mendoza@empresa.com', 'Gerente de Ventas', 'Ventas', 
        new Date('2020-03-08'), 'inactivo', new Date('2024-10-30'), true),
      new Usuario(5, 'Patricia', 'Jiménez', 'patricia.jimenez@empresa.com', 'Coordinadora', 'Marketing', 
        new Date('2023-07-12'), 'activo', new Date('2024-11-22'), false)
    ];
  }

  private async registrarCambiosUsuario(usuarioAnterior: Usuario, usuarioNuevo: Usuario): Promise<void> {
    const cambios = this.detectarCambios(usuarioAnterior, usuarioNuevo);
    
    for (const cambio of cambios) {
      await this.registrarCambio({
        usuarioId: usuarioNuevo.getId(),
        campo: cambio.campo,
        valorAnterior: cambio.valorAnterior,
        valorNuevo: cambio.valorNuevo,
        usuarioQueModifica: 0 // ID del usuario del sistema
      });
    }
  }

  private detectarCambios(anterior: Usuario, nuevo: Usuario): any[] {
    const cambios = [];

    if (anterior.estadoValue !== nuevo.estadoValue) {
      cambios.push({
        campo: 'estado',
        valorAnterior: anterior.estadoValue,
        valorNuevo: nuevo.estadoValue
      });
    }

    if (anterior.cargo !== nuevo.cargo) {
      cambios.push({
        campo: 'cargo',
        valorAnterior: anterior.cargo,
        valorNuevo: nuevo.cargo
      });
    }

    if (anterior.departamentoValue !== nuevo.departamentoValue) {
      cambios.push({
        campo: 'departamento',
        valorAnterior: anterior.departamentoValue,
        valorNuevo: nuevo.departamentoValue
      });
    }

    if (anterior.tieneConflictoIntereses !== nuevo.tieneConflictoIntereses) {
      cambios.push({
        campo: 'conflictoIntereses',
        valorAnterior: anterior.tieneConflictoIntereses.toString(),
        valorNuevo: nuevo.tieneConflictoIntereses.toString()
      });
    }

    return cambios;
  }

  private construirFiltrosAplicados(filtros: FiltroUsuariosDto): any[] {
    const aplicados = [];

    if (filtros.texto) aplicados.push({ campo: 'texto', etiqueta: 'Búsqueda', valor: filtros.texto });
    if (filtros.estado) aplicados.push({ campo: 'estado', etiqueta: 'Estado', valor: filtros.estado });
    if (filtros.departamento) aplicados.push({ campo: 'departamento', etiqueta: 'Departamento', valor: filtros.departamento });
    if (filtros.soloConConflictoIntereses) aplicados.push({ campo: 'conflicto', etiqueta: 'Con conflicto', valor: 'Sí' });
    if (filtros.soloActivos) aplicados.push({ campo: 'activos', etiqueta: 'Solo activos', valor: 'Sí' });

    return aplicados;
  }

  private construirFiltrosAplicadosAvanzados(criterios: CriteriosBusquedaAvanzada): string[] {
    const filtros = [];

    if (criterios.texto) filtros.push(`Texto: ${criterios.texto}`);
    if (criterios.departamentos) filtros.push(`Departamentos: ${criterios.departamentos.join(', ')}`);
    if (criterios.estados) filtros.push(`Estados: ${criterios.estados.join(', ')}`);
    if (criterios.soloConConflictoIntereses) filtros.push('Solo con conflicto de intereses');
    if (criterios.soloActivos) filtros.push('Solo usuarios activos');

    return filtros;
  }

  private obtenerValorCampo(usuario: Usuario, campo: string): string {
    switch (campo) {
      case 'nombre': return usuario.nombre;
      case 'apellido': return usuario.apellido;
      case 'email': return usuario.emailValue;
      case 'cargo': return usuario.cargo;
      case 'departamento': return usuario.departamentoValue;
      case 'estado': return usuario.estadoValue;
      case 'id': return usuario.getId().toString();
      default: return '';
    }
  }
} 