import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { AdminService, UsuarioAdmin } from '../../services/admin.service';
import { UsuarioDetalleModalComponent } from '../../../admin-panel/presentation/components/usuario-detalle-modal.component';
import { ObtenerUsuarioDetalleCompletoUseCase } from '../../../admin-panel/application/use-cases/obtener-usuario-detalle-completo.use-case';

export interface ReporteConfig {
  tipo: string;
  nombre: string;
  descripcion: string;
  icono: string;
  columnas: string[];
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'select',
    'nombre',
    'email',
    'cargo',
    'departamento',
    'estado',
    'conflictoIntereses',
    'acciones'
  ];

  dataSource = new MatTableDataSource<UsuarioAdmin>();
  selection = new SelectionModel<UsuarioAdmin>(true, []);
  filtroTexto = '';
  filtroEstado = '';
  filtroDepartamento = '';

  // Configuración de reportes disponibles
  reportesConfig: ReporteConfig[] = [
    {
      tipo: 'integrantes',
      nombre: 'Reporte de Integrantes',
      descripcion: 'Información general de todos los empleados',
      icono: 'people',
      columnas: ['nombre', 'apellido', 'email', 'cargo', 'departamento', 'fechaIngreso', 'estado']
    },
    {
      tipo: 'conflicto-intereses',
      nombre: 'Reporte Conflicto de Intereses',
      descripcion: 'Empleados con declaraciones de conflicto de intereses',
      icono: 'gavel',
      columnas: ['nombre', 'apellido', 'email', 'cargo', 'tieneConflictoIntereses', 'ultimaActualizacion']
    },
    {
      tipo: 'estudios',
      nombre: 'Reporte de Estudios',
      descripcion: 'Información académica de los empleados',
      icono: 'school',
      columnas: ['nombre', 'apellido', 'email', 'nivelEducativo', 'institucion', 'titulo']
    },
    {
      tipo: 'contacto',
      nombre: 'Reporte Personas de Contacto',
      descripcion: 'Información de contacto de emergencia',
      icono: 'contact_phone',
      columnas: ['nombre', 'apellido', 'telefonoEmergencia', 'contactoEmergencia', 'direccion']
    },
    {
      tipo: 'personas-cargo',
      nombre: 'Reporte Personas a Cargo',
      descripcion: 'Información sobre personas a cargo de empleados',
      icono: 'family_restroom',
      columnas: ['nombre', 'apellido', 'personasACargo', 'numeroPersonas', 'edades']
    }
  ];

  departamentos = ['Todos', 'Ventas', 'Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing'];
  estados = ['Todos', 'activo', 'inactivo'];

  cargando = false;
  error = '';

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private obtenerUsuarioDetalleCompleto: ObtenerUsuarioDetalleCompletoUseCase
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Cargar usuarios de la base de datos
   */
  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.adminService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        console.log('Usuarios cargados:', usuarios);
        this.dataSource.data = usuarios;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.error = 'Error al cargar usuarios: ' + error.message;
        this.cargando = false;
        
        // Si hay error, usar usuarios de prueba
        this.adminService.obtenerUsuariosPrueba().subscribe(usuariosPrueba => {
          this.dataSource.data = usuariosPrueba;
        });
      }
    });
  }

  // Filtros
  aplicarFiltros(): void {
    const filtroCompleto = {
      texto: this.filtroTexto.toLowerCase(),
      estado: this.filtroEstado,
      departamento: this.filtroDepartamento
    };
    this.dataSource.filter = JSON.stringify(filtroCompleto);
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.filtroDepartamento = '';
    this.dataSource.filter = '';
  }

  private createFilter(): (data: UsuarioAdmin, filter: string) => boolean {
    return (data: UsuarioAdmin, filter: string): boolean => {
      if (!filter) return true;

      const filtroObj = JSON.parse(filter);
      
      // Filtro por texto
      const nombreCompleto = `${data.nombre} ${data.apellido}`.toLowerCase();
      const textoMatch = !filtroObj.texto || 
        nombreCompleto.includes(filtroObj.texto) ||
        data.email.toLowerCase().includes(filtroObj.texto) ||
        data.cargo.toLowerCase().includes(filtroObj.texto);

      // Filtro por estado
      const estadoMatch = !filtroObj.estado || filtroObj.estado === 'Todos' || 
        data.estado === filtroObj.estado;

      // Filtro por departamento
      const departamentoMatch = !filtroObj.departamento || filtroObj.departamento === 'Todos' || 
        data.departamento === filtroObj.departamento;

      return textoMatch && estadoMatch && departamentoMatch;
    };
  }

  // Selección
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

  checkboxLabel(row?: UsuarioAdmin): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deseleccionar' : 'seleccionar'} todos`;
    }
    return `${this.selection.isSelected(row) ? 'deseleccionar' : 'seleccionar'} fila ${row.id}`;
  }

  // Generación de reportes
  generarReporte(tipoReporte: string): void {
    const usuariosSeleccionados = this.selection.selected.length > 0 
      ? this.selection.selected 
      : this.dataSource.filteredData;

    console.log(`Generando reporte: ${tipoReporte}`);
    console.log('Usuarios seleccionados:', usuariosSeleccionados);

    // Simular descarga de Excel
    this.simularDescargaExcel(tipoReporte, usuariosSeleccionados);
  }

  private simularDescargaExcel(tipoReporte: string, usuarios: UsuarioAdmin[]): void {
    const reporteConfig = this.reportesConfig.find(r => r.tipo === tipoReporte);
    if (!reporteConfig) return;

    // Aquí iría la lógica real de generación de Excel
    // Por ahora solo simulamos la descarga
    const nombreArchivo = `${reporteConfig.nombre}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    console.log(`📊 Generando ${reporteConfig.nombre}`);
    console.log(`📁 Archivo: ${nombreArchivo}`);
    console.log(`👥 Usuarios incluidos: ${usuarios.length}`);
    console.log(`📋 Columnas: ${reporteConfig.columnas.join(', ')}`);

    // Mostrar notificación de éxito
    this.mostrarNotificacionDescarga(nombreArchivo);
  }

  private mostrarNotificacionDescarga(nombreArchivo: string): void {
    // Simular proceso de descarga
    setTimeout(() => {
      alert(`✅ Reporte generado exitosamente!\n📁 Archivo: ${nombreArchivo}\n\n(Esta es una simulación - En producción se descargaría el archivo Excel real)`);
    }, 1000);
  }

  // Acciones de usuario
  verDetalle(usuario: UsuarioAdmin): void {
    console.log('=== SOLICITANDO DETALLE DE USUARIO ===');
    console.log('Usuario seleccionado:', usuario);
    console.log('ID del usuario:', usuario.id);
    
    this.obtenerUsuarioDetalleCompleto.execute(usuario.id).subscribe({
      next: (detalle) => {
        console.log('=== DETALLE OBTENIDO DEL BACKEND ===');
        console.log('Detalle completo recibido:', detalle);
        console.log('=====================================');
        
        this.dialog.open(UsuarioDetalleModalComponent, {
          width: '600px',
          data: detalle
        });
      },
      error: (error) => {
        console.error('Error obteniendo detalle del usuario:', error);
        alert('Error al obtener los detalles del usuario: ' + error.message);
      }
    });
  }

  editarUsuario(usuario: UsuarioAdmin): void {
    console.log('Editar usuario:', usuario);
    alert(`Editar usuario: ${usuario.nombre} ${usuario.apellido}\n(Funcionalidad pendiente de implementar)`);
  }

  eliminarUsuario(usuario: UsuarioAdmin): void {
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`)) {
      console.log('Eliminar usuario:', usuario);
      // Aquí haríamos la eliminación real
      alert('Usuario eliminado (simulación)');
    }
  }

  // Métodos de utilidad
  getEstadoColor(estado: string): string {
    return estado === 'activo' ? 'primary' : 'warn';
  }

  getConflictoIcon(tieneConflicto: boolean): string {
    return tieneConflicto ? 'warning' : 'check_circle';
  }

  getConflictoColor(tieneConflicto: boolean): string {
    return tieneConflicto ? 'warn' : 'primary';
  }

  exportarTodo(): void {
    console.log('Exportando todos los datos...');
    // Generar un reporte completo con todos los usuarios
    this.generarReporte('integrantes');
  }
}