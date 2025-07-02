import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

// Application layer imports
import { ObtenerUsuariosUseCase } from '../../application/use-cases/obtener-usuarios.use-case';
import { GenerarReporteUseCase } from '../../application/use-cases/generar-reporte.use-case';
import { FiltrarUsuariosUseCase } from '../../application/use-cases/filtrar-usuarios.use-case';
import { UsuarioDto } from '../../application/dto/usuario.dto';
import { ReporteDto } from '../../application/dto/reporte.dto';
import { FiltroUsuariosDto } from '../../application/dto/filtro-usuarios.dto';

// Domain layer imports
import { Usuario } from '../../domain/entities/usuario.entity';
import { TipoReporte } from '../../domain/value-objects/tipo-reporte.vo';
import { EstadoUsuario } from '../../domain/value-objects/estado-usuario.vo';

@Component({
  selector: 'app-admin-panel-screaming',
  templateUrl: './admin-panel-screaming.component.html',
  styleUrls: ['./admin-panel-screaming.component.scss']
})
export class AdminPanelScreamingComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'select',
    'id',
    'nombre',
    'apellido', 
    'email',
    'cargo',
    'departamento',
    'fechaIngreso',
    'estado',
    'ultimaActualizacion',
    'conflictoIntereses',
    'acciones'
  ];

  dataSource = new MatTableDataSource<UsuarioDto>();
  selection = new SelectionModel<UsuarioDto>(true, []);
  filtroTexto = '';
  filtroEstado = '';
  filtroDepartamento = '';

  reportesConfig: ReporteDto[] = [];
  departamentos: string[] = [];
  estados: string[] = [];

  // Propiedades faltantes
  generandoReporte = false;

  constructor(
    private obtenerUsuariosUseCase: ObtenerUsuariosUseCase,
    private generarReporteUseCase: GenerarReporteUseCase,
    private filtrarUsuariosUseCase: FiltrarUsuariosUseCase,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarDatosIniciales();
    this.configurarFiltros();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private async cargarDatosIniciales(): Promise<void> {
    try {
      // Cargar usuarios usando el caso de uso
      const usuarios = await this.obtenerUsuariosUseCase.execute();
      this.dataSource.data = usuarios;

      // Cargar configuración de reportes
      this.reportesConfig = await this.obtenerUsuariosUseCase.obtenerConfiguracionReportes();

      // Cargar opciones de filtros
      this.departamentos = await this.obtenerUsuariosUseCase.obtenerDepartamentos();
      this.estados = await this.obtenerUsuariosUseCase.obtenerEstados();

    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  private configurarFiltros(): void {
    this.dataSource.filterPredicate = (data: UsuarioDto, filter: string) => {
      return this.filtrarUsuariosUseCase.aplicarFiltro(data, filter);
    };
  }

  // Métodos de filtrado
  async aplicarFiltros(): Promise<void> {
    const filtro: FiltroUsuariosDto = {
      texto: this.filtroTexto,
      estado: this.filtroEstado,
      departamento: this.filtroDepartamento
    };

    const filtroCompleto = await this.filtrarUsuariosUseCase.crearFiltro(filtro);
    this.dataSource.filter = filtroCompleto;
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroDepartamento = '';
    this.dataSource.filter = '';
  }

  // Métodos de selección
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: UsuarioDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deseleccionar' : 'seleccionar'} todos`;
    }
    return `${this.selection.isSelected(row) ? 'deseleccionar' : 'seleccionar'} fila ${row.id}`;
  }

  // Métodos de estadísticas
  getUsuariosActivos(): number {
    return this.dataSource.data.filter(u => u.estado === 'activo').length;
  }

  getUsuariosConConflicto(): number {
    return this.dataSource.data.filter(u => u.tieneConflictoIntereses).length;
  }

  // Métodos de UI
  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'activo': return 'check_circle';
      case 'inactivo': return 'cancel';
      default: return 'help';
    }
  }

  getDepartamentoColor(departamento: string): string {
    const colores: { [key: string]: string } = {
      'Recursos Humanos': 'primary',
      'Tecnología': 'accent',
      'Finanzas': 'warn'
    };
    return colores[departamento] || 'primary';
  }

  async exportarSeleccionados(): Promise<void> {
    await this.generarReporte('integrantes');
  }

  // Generación de reportes usando casos de uso
  async generarReporte(tipoReporte: string): Promise<void> {
    try {
      this.generandoReporte = true;
      const usuariosSeleccionados = this.selection.selected.length > 0 
        ? this.selection.selected 
        : this.dataSource.filteredData;

      const reporte = await this.generarReporteUseCase.execute({
        tipo: new TipoReporte(tipoReporte),
        usuarios: usuariosSeleccionados,
        filtros: {
          texto: this.filtroTexto,
          estado: this.filtroEstado,
          departamento: this.filtroDepartamento
        },
        solicitadoPor: 1 // ID del usuario administrador
      });

      this.mostrarNotificacionDescarga(reporte.nombreArchivo);

    } catch (error) {
      console.error('Error generando reporte:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      this.generandoReporte = false;
    }
  }

  async exportarTodo(): Promise<void> {
    await this.generarReporte('completo');
  }

  // Acciones de usuario (delegadas a casos de uso)
  async verDetalle(usuario: UsuarioDto): Promise<void> {
    try {
      const detalleCompleto = await this.obtenerUsuariosUseCase.obtenerDetalleUsuario(usuario.id);
      // Aquí abriríamos un modal con los detalles completos
      console.log('Detalle del usuario:', detalleCompleto);
    } catch (error) {
      console.error('Error obteniendo detalle del usuario:', error);
    }
  }

  async editarUsuario(usuario: UsuarioDto): Promise<void> {
    // Aquí abriríamos un formulario de edición
    console.log('Editar usuario:', usuario);
  }

  async eliminarUsuario(usuario: UsuarioDto): Promise<void> {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      try {
        // Aquí llamaríamos al caso de uso de eliminación
        console.log('Eliminar usuario:', usuario);
      } catch (error) {
        console.error('Error eliminando usuario:', error);
      }
    }
  }

  // Métodos de utilidad para la vista
  getEstadoColor(estado: string): string {
    return EstadoUsuario.obtenerColor(estado);
  }

  getConflictoIcon(tieneConflicto: boolean): string {
    return tieneConflicto ? 'warning' : 'check_circle';
  }

  getConflictoColor(tieneConflicto: boolean): string {
    return tieneConflicto ? 'warn' : 'primary';
  }

  private mostrarNotificacionDescarga(nombreArchivo: string): void {
    setTimeout(() => {
      alert(`✅ Reporte generado exitosamente!\n📁 Archivo: ${nombreArchivo}\n\n(Simulación con Arquitectura Screaming)`);
    }, 1000);
  }
} 