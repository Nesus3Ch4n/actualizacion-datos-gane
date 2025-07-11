import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { AdminService, UsuarioAdmin } from '../../services/admin.service';
import { UsuarioDetalleModalComponent } from '../../../admin-panel/presentation/components/usuario-detalle-modal.component';
import { ObtenerUsuarioDetalleCompletoUseCase } from '../../../admin-panel/application/use-cases/obtener-usuario-detalle-completo.use-case';
import { ExcelExportService } from '../../services/excel-export.service';
import { NotificationService } from '../../services/notification.service';

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
    },
    {
      tipo: 'vehiculos',
      nombre: 'Reporte de Vehículos',
      descripcion: 'Información de vehículos de los empleados',
      icono: 'directions_car',
      columnas: ['nombre', 'apellido', 'tipoVehiculo', 'marca', 'placa', 'ano', 'propietario']
    },
    {
      tipo: 'viviendas',
      nombre: 'Reporte de Viviendas',
      descripcion: 'Información de viviendas de los empleados',
      icono: 'home',
      columnas: ['nombre', 'apellido', 'tipoVivienda', 'direccion', 'ciudad', 'barrio', 'tipoAdquisicion', 'ano']
    }
  ];

  departamentos = ['Todos', 'Ventas', 'Tecnología', 'Recursos Humanos', 'Finanzas', 'Marketing'];
  estados = ['Todos', 'activo', 'inactivo'];

  cargando = false;
  error = '';

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private obtenerUsuarioDetalleCompleto: ObtenerUsuarioDetalleCompletoUseCase,
    private excelExportService: ExcelExportService,
    private notificationService: NotificationService
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
    console.log('🔄 AdminPanel: Iniciando carga de usuarios...');
    this.cargando = true;
    this.error = '';

    this.adminService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        console.log('✅ AdminPanel: Usuarios cargados del backend:', usuarios);
        console.log('📊 AdminPanel: Total usuarios:', usuarios.length);
        if (usuarios.length > 0) {
          console.log('👤 AdminPanel: Primer usuario:', usuarios[0]);
          console.log('🆔 AdminPanel: ID del primer usuario:', usuarios[0].id);
        }
        this.dataSource.data = usuarios;
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ AdminPanel: Error cargando usuarios:', error);
        this.error = 'Error al cargar usuarios: ' + error.message;
        this.cargando = false;
        
        console.log('⚠️ AdminPanel: Usando usuarios de prueba debido al error...');
        // Si hay error, usar usuarios de prueba
        this.adminService.obtenerUsuariosPrueba().subscribe(usuariosPrueba => {
          console.log('🔄 AdminPanel: Usuarios de prueba cargados:', usuariosPrueba);
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
    console.log(`Generando reporte: ${tipoReporte}`);

    this.notificationService.showInfo('Generando archivo Excel...', 'Procesando');

    let reporteObservable: Observable<Blob>;

    switch (tipoReporte) {
      case 'integrantes':
        reporteObservable = this.adminService.generarReporteIntegrantes();
        break;
      case 'conflicto-intereses':
        reporteObservable = this.adminService.generarReporteConflictoIntereses();
        break;
      case 'estudios':
        reporteObservable = this.adminService.generarReporteEstudios();
        break;
      case 'contacto':
        reporteObservable = this.adminService.generarReporteContacto();
        break;
      case 'personas-cargo':
        reporteObservable = this.adminService.generarReportePersonasCargo();
        break;
      case 'vehiculos':
        reporteObservable = this.adminService.generarReporteVehiculos();
        break;
      case 'viviendas':
        reporteObservable = this.adminService.generarReporteViviendas();
        break;
      default:
        this.notificationService.showError('Tipo de reporte no válido', 'Error');
        return;
    }

    reporteObservable.subscribe({
      next: (blob: Blob) => {
        // Crear URL del blob y descargar
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generar nombre del archivo
        const fecha = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();
        link.download = `Reporte_${tipoReporte}_${fecha}_${timestamp}.xlsx`;
        
        // Descargar archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL
        window.URL.revokeObjectURL(url);
        
        this.notificationService.showSuccess(
          `Archivo Excel generado exitosamente`,
          'Éxito'
        );
      },
      error: (error: any) => {
        console.error('Error al generar reporte:', error);
        this.notificationService.showError('Error al generar el archivo Excel', 'Error');
      }
    });
  }

  // Acciones de usuario
  verDetalle(usuario: UsuarioAdmin): void {
    console.log('=== SOLICITANDO DETALLE DE USUARIO ===');
    console.log('Usuario seleccionado completo:', usuario);
    console.log('ID del usuario:', usuario.id);
    console.log('Tipo de ID:', typeof usuario.id);
    console.log('¿ID es undefined?', usuario.id === undefined);
    console.log('¿ID es null?', usuario.id === null);
    
    if (usuario.id === undefined || usuario.id === null) {
      console.error('❌ ERROR: El ID del usuario es undefined o null');
      alert('Error: No se puede obtener el detalle del usuario porque el ID no está disponible');
      return;
    }
    
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
    if (confirm(`¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?\n\nEsta acción no se puede deshacer.`)) {
      console.log('🗑️ Eliminando usuario:', usuario);
      
      // Obtener información del administrador actual (por ahora hardcodeado, pero se puede obtener del servicio de autenticación)
      const adminCedula = '1006101211'; // Cédula del administrador
      const adminNombre = 'JESUS FELIPE CORDOBA ECHANDIA'; // Nombre del administrador
      
      this.adminService.eliminarUsuario(usuario.id, adminCedula, adminNombre).subscribe({
        next: (response) => {
          console.log('✅ Usuario eliminado exitosamente:', response);
          this.notificationService.showSuccess(
            `Usuario ${usuario.nombre} ${usuario.apellido} eliminado exitosamente`,
            'Eliminación completada'
          );
          
          // Recargar la lista de usuarios
          this.cargarUsuarios();
        },
        error: (error) => {
          console.error('❌ Error al eliminar usuario:', error);
          this.notificationService.showError(
            `Error al eliminar usuario: ${error.message || 'Error desconocido'}`,
            'Error de eliminación'
          );
        }
      });
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
    
    this.notificationService.showInfo('Generando reporte completo...', 'Procesando');

    this.adminService.exportarTodo().subscribe({
      next: (blob: Blob) => {
        // Crear URL del blob y descargar
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generar nombre del archivo
        const fecha = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();
        link.download = `Reporte_Completo_${fecha}_${timestamp}.xlsx`;
        
        // Descargar archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar URL
        window.URL.revokeObjectURL(url);
        
        this.notificationService.showSuccess(
          'Reporte completo generado exitosamente',
          'Éxito'
        );
      },
      error: (error: any) => {
        console.error('Error al exportar todo:', error);
        this.notificationService.showError('Error al generar el reporte completo', 'Error');
      }
    });
  }
}