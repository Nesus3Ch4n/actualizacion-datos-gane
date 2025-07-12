import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditoriaService, AuditoriaDTO, FiltroAuditoria } from '../../services/auditoria.service';
import { ActualizacionService, EstadisticasActualizacion, ControlActualizacion } from '../../services/actualizacion.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuditoriaDetalleModalComponent } from './auditoria-detalle-modal.component';
import { UsuariosPendientesModalComponent } from './usuarios-pendientes-modal.component';
import { ExcelExportService } from '../../services/excel-export.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {
  
  auditorias: AuditoriaDTO[] = [];
  auditoriasFiltradas: AuditoriaDTO[] = [];
  filtroForm: FormGroup;
  cargando = false;
  totalRegistros = 0;
  
  // Opciones para filtros
  tablasDisponibles: string[] = [];
  tiposPeticionDisponibles: string[] = [];
  
  // Paginación
  paginaActual = 1;
  registrosPorPagina = 20;
  totalPaginas = 0;

  // Columnas de la tabla
  columnasMostradas: string[] = ['fecha', 'tabla', 'tipoPeticion', 'usuario', 'idUsuario', 'descripcion', 'detalles', 'ip', 'acciones'];

  // Estadísticas de actualizaciones
  estadisticasActualizacion: EstadisticasActualizacion | null = null;
  controlesPendientes: ControlActualizacion[] = [];
  controlesVencidos: ControlActualizacion[] = [];
  cargandoEstadisticas = false;

  // Gráfico de pastel
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Estado de Actualizaciones Anuales'
      }
    }
  };
  
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Completadas', 'Pendientes', 'Vencidas'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
      borderColor: ['#27ae60', '#f39c12', '#e74c3c'],
      borderWidth: 2
    }]
  };
  
  public pieChartType: ChartType = 'pie';

  constructor(
    private auditoriaService: AuditoriaService,
    private actualizacionService: ActualizacionService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private excelExportService: ExcelExportService
  ) {
    this.filtroForm = this.fb.group({
      idUsuario: [''],
      tablaModificada: [''],
      tipoPeticion: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });
  }

  ngOnInit(): void {
    this.cargarOpcionesFiltros();
    this.cargarTodasAuditorias();
    this.cargarEstadisticasActualizaciones();
  }

  cargarOpcionesFiltros(): void {
    this.tablasDisponibles = this.auditoriaService.obtenerTablasDisponibles();
    this.tiposPeticionDisponibles = this.auditoriaService.obtenerTiposPeticionDisponibles();
  }

  cargarAuditoriasRecientes(): void {
    this.cargando = true;
    this.auditoriaService.obtenerAuditoriasRecientes().subscribe({
      next: (data) => {
        console.log('📊 Auditorías cargadas:', data);
        this.auditorias = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar auditorías:', error);
        this.notificationService.showError('Error al cargar las auditorías', 'Error');
        this.cargando = false;
      }
    });
  }

  cargarTodasAuditorias(): void {
    this.cargando = true;
    this.auditoriaService.obtenerTodasAuditorias().subscribe({
      next: (data) => {
        console.log('📊 Todas las auditorías cargadas:', data);
        this.auditorias = data;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar auditorías:', error);
        this.notificationService.showError('Error al cargar las auditorías', 'Error');
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const filtros = this.filtroForm.value;
    
    // Si no hay filtros aplicados, mostrar todas las auditorías
    if (!filtros.idUsuario && !filtros.tablaModificada && !filtros.tipoPeticion && !filtros.fechaInicio && !filtros.fechaFin) {
      this.auditoriasFiltradas = [...this.auditorias];
    } else {
      // Aplicar filtros usando el servicio
      this.cargando = true;
      this.auditoriaService.obtenerAuditoriasConFiltros(filtros).subscribe({
        next: (data) => {
          this.auditoriasFiltradas = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al aplicar filtros:', error);
          this.notificationService.showError('Error al aplicar los filtros', 'Error');
          this.cargando = false;
        }
      });
    }
    
    this.calcularPaginacion();
  }

  limpiarFiltros(): void {
    this.filtroForm.reset();
    this.auditoriasFiltradas = [...this.auditorias];
    this.calcularPaginacion();
  }

  calcularPaginacion(): void {
    this.totalRegistros = this.auditoriasFiltradas.length;
    this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
    this.paginaActual = 1;
  }

  obtenerAuditoriasPaginadas(): AuditoriaDTO[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.auditoriasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  obtenerPaginas(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(1, this.paginaActual - 2);
    const fin = Math.min(this.totalPaginas, this.paginaActual + 2);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  obtenerFinPagina(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.totalRegistros);
  }

  // Métodos de utilidad para el template
  formatearFecha(fecha: string): string {
    return this.auditoriaService.formatearFecha(fecha);
  }

  obtenerNombreLegibleTabla(tabla: string): string {
    return this.auditoriaService.obtenerNombreLegibleTabla(tabla);
  }

  obtenerNombreLegibleTipoPeticion(tipo: string): string {
    return this.auditoriaService.obtenerNombreLegibleTipoPeticion(tipo);
  }

  obtenerClaseTipoPeticion(tipo: string): string {
    return this.auditoriaService.obtenerClaseTipoPeticion(tipo);
  }

  exportarAuditorias(): void {
    try {
      if (this.auditoriasFiltradas.length === 0) {
        this.notificationService.showWarning('No hay auditorías para exportar', 'Advertencia');
        return;
      }
      
      this.notificationService.showInfo('Generando archivo Excel...', 'Procesando');
      
      // Exportar auditorías filtradas agrupadas por fecha
      this.excelExportService.exportAuditoriasPorFecha(this.auditoriasFiltradas);
      
      this.notificationService.showSuccess(
        `Archivo Excel generado exitosamente con ${this.auditoriasFiltradas.length} auditorías`,
        'Éxito'
      );
      
    } catch (error) {
      console.error('Error al exportar auditorías:', error);
      this.notificationService.showError('Error al generar el archivo Excel', 'Error');
    }
  }

  obtenerResumenAuditorias(): any {
    const resumen = {
      total: this.auditoriasFiltradas.length,
      creaciones: this.auditoriasFiltradas.filter(a => a.tipoPeticion === 'INSERT').length,
      actualizaciones: this.auditoriasFiltradas.filter(a => a.tipoPeticion === 'UPDATE').length,
      eliminaciones: this.auditoriasFiltradas.filter(a => a.tipoPeticion === 'DELETE').length
    };
    return resumen;
  }

  /**
   * Cargar estadísticas de actualizaciones anuales
   */
  cargarEstadisticasActualizaciones(): void {
    this.cargandoEstadisticas = true;
    
    this.actualizacionService.obtenerEstadisticas().subscribe({
      next: (estadisticas) => {
        this.estadisticasActualizacion = estadisticas;
        this.cargandoEstadisticas = false;
        console.log('📊 Estadísticas de actualizaciones cargadas:', estadisticas);
        
        // Actualizar datos del gráfico
        this.actualizarGraficoPie();
      },
      error: (error) => {
        console.error('Error al cargar estadísticas de actualizaciones:', error);
        this.notificationService.showError('Error al cargar estadísticas de actualizaciones', 'Error');
        this.cargandoEstadisticas = false;
      }
    });
  }

  /**
   * Actualizar datos del gráfico de pastel
   */
  actualizarGraficoPie(): void {
    if (this.estadisticasActualizacion) {
      this.pieChartData.datasets[0].data = [
        this.estadisticasActualizacion.completadas,
        this.estadisticasActualizacion.pendientes,
        this.estadisticasActualizacion.vencidas
      ];
      
      // Actualizar etiquetas con porcentajes
      this.pieChartData.labels = [
        `Completadas (${this.estadisticasActualizacion.porcentajeCompletadas.toFixed(1)}%)`,
        `Pendientes (${this.estadisticasActualizacion.porcentajePendientes.toFixed(1)}%)`,
        `Vencidas (${this.estadisticasActualizacion.porcentajeVencidas.toFixed(1)}%)`
      ];
      
      // Forzar actualización del gráfico
      if (this.chart) {
        this.chart.update();
      }
    }
  }

  /**
   * Cargar controles pendientes de actualización
   */
  cargarControlesPendientes(): void {
    this.actualizacionService.obtenerPendientes().subscribe({
      next: (pendientes) => {
        this.controlesPendientes = pendientes;
        console.log('📋 Controles pendientes cargados:', pendientes.length);
        this.mostrarUsuariosPendientes();
      },
      error: (error) => {
        console.error('Error al cargar controles pendientes:', error);
        this.notificationService.showError('Error al cargar controles pendientes', 'Error');
      }
    });
  }

  /**
   * Cargar controles vencidos
   */
  cargarControlesVencidos(): void {
    this.actualizacionService.obtenerVencidas().subscribe({
      next: (vencidas) => {
        this.controlesVencidos = vencidas;
        console.log('⏰ Controles vencidos cargados:', vencidas.length);
        this.mostrarUsuariosVencidos();
      },
      error: (error) => {
        console.error('Error al cargar controles vencidos:', error);
        this.notificationService.showError('Error al cargar controles vencidos', 'Error');
      }
    });
  }

  /**
   * Mostrar modal de usuarios pendientes
   */
  mostrarUsuariosPendientes(): void {
    this.dialog.open(UsuariosPendientesModalComponent, {
      width: '90vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: {
        tipo: 'pendientes',
        usuarios: this.controlesPendientes
      },
      disableClose: false,
      autoFocus: false
    });
  }

  /**
   * Mostrar modal de usuarios vencidos
   */
  mostrarUsuariosVencidos(): void {
    this.dialog.open(UsuariosPendientesModalComponent, {
      width: '90vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: {
        tipo: 'vencidos',
        usuarios: this.controlesVencidos
      },
      disableClose: false,
      autoFocus: false
    });
  }

  /**
   * Refrescar todas las estadísticas
   */
  refrescarEstadisticas(): void {
    this.cargarEstadisticasActualizaciones();
    this.cargarControlesPendientes();
    this.cargarControlesVencidos();
  }

  /**
   * Inicializar datos de prueba
   */
  inicializarDatos(): void {
    this.notificationService.showInfo('Inicializando datos de prueba...', 'Procesando');
    
    this.actualizacionService.inicializarDatos().subscribe({
      next: (response) => {
        console.log('✅ Datos inicializados:', response);
        this.notificationService.showSuccess(
          `Datos inicializados: ${response.controlesCreados} controles creados de ${response.usuariosProcesados} usuarios`,
          'Éxito'
        );
        
        // Refrescar estadísticas después de inicializar
        this.refrescarEstadisticas();
      },
      error: (error) => {
        console.error('❌ Error inicializando datos:', error);
        this.notificationService.showError('Error al inicializar datos', 'Error');
      }
    });
  }
  
  verDetalles(auditoria: AuditoriaDTO): void {
    console.log('🔍 Detalles de auditoría:', auditoria);
    
    // Abrir modal con los detalles de auditoría
    this.dialog.open(AuditoriaDetalleModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: auditoria,
      disableClose: false,
      autoFocus: false
    });
  }
} 