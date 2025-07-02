import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  departamento: string;
  fechaIngreso: Date;
  estado: 'activo' | 'inactivo';
  ultimaActualizacion: Date;
  tieneConflictoIntereses: boolean;
}

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

  dataSource = new MatTableDataSource<Usuario>();
  selection = new SelectionModel<Usuario>(true, []);
  filtroTexto = '';
  filtroEstado = '';
  filtroDepartamento = '';

  // Datos quemados de usuarios para prueba
  usuariosData: Usuario[] = [
    {
      id: 1,
      nombre: 'María',
      apellido: 'García López',
      email: 'maria.garcia@empresa.com',
      cargo: 'Gerente de Ventas',
      departamento: 'Ventas',
      fechaIngreso: new Date('2020-03-15'),
      estado: 'activo',
      ultimaActualizacion: new Date('2024-01-15'),
      tieneConflictoIntereses: false
    },
    {
      id: 2,
      nombre: 'Carlos',
      apellido: 'Rodríguez Martín',
      email: 'carlos.rodriguez@empresa.com',
      cargo: 'Desarrollador Senior',
      departamento: 'Tecnología',
      fechaIngreso: new Date('2019-07-22'),
      estado: 'activo',
      ultimaActualizacion: new Date('2024-02-20'),
      tieneConflictoIntereses: true
    },
    {
      id: 3,
      nombre: 'Ana',
      apellido: 'Fernández Cruz',
      email: 'ana.fernandez@empresa.com',
      cargo: 'Coordinadora de RRHH',
      departamento: 'Recursos Humanos',
      fechaIngreso: new Date('2021-01-10'),
      estado: 'activo',
      ultimaActualizacion: new Date('2024-01-30'),
      tieneConflictoIntereses: false
    },
    {
      id: 4,
      nombre: 'Luis',
      apellido: 'Mendoza Silva',
      email: 'luis.mendoza@empresa.com',
      cargo: 'Analista Financiero',
      departamento: 'Finanzas',
      fechaIngreso: new Date('2018-11-05'),
      estado: 'inactivo',
      ultimaActualizacion: new Date('2023-12-01'),
      tieneConflictoIntereses: false
    },
    {
      id: 5,
      nombre: 'Patricia',
      apellido: 'Jiménez Torres',
      email: 'patricia.jimenez@empresa.com',
      cargo: 'Jefe de Marketing',
      departamento: 'Marketing',
      fechaIngreso: new Date('2022-05-18'),
      estado: 'activo',
      ultimaActualizacion: new Date('2024-02-28'),
      tieneConflictoIntereses: true
    }
  ];

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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = this.usuariosData;
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  private createFilter(): (data: Usuario, filter: string) => boolean {
    return (data: Usuario, filter: string): boolean => {
      if (!filter) return true;

      const filtroObj = JSON.parse(filter);
      
      // Filtro por texto
      const textoMatch = !filtroObj.texto || 
        data.nombre.toLowerCase().includes(filtroObj.texto) ||
        data.apellido.toLowerCase().includes(filtroObj.texto) ||
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

  checkboxLabel(row?: Usuario): string {
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

  private simularDescargaExcel(tipoReporte: string, usuarios: Usuario[]): void {
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
  verDetalle(usuario: Usuario): void {
    console.log('Ver detalle del usuario:', usuario);
    alert(`Ver detalle de: ${usuario.nombre} ${usuario.apellido}\nEmail: ${usuario.email}\nCargo: ${usuario.cargo}`);
  }

  editarUsuario(usuario: Usuario): void {
    console.log('Editar usuario:', usuario);
    alert(`Editar usuario: ${usuario.nombre} ${usuario.apellido}\n(Funcionalidad pendiente de implementar)`);
  }

  eliminarUsuario(usuario: Usuario): void {
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
    this.generarReporte('completo');
  }
} 