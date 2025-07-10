import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuditoriaService, AuditoriaDTO, FiltroAuditoria } from '../../services/auditoria.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { AuditoriaDetalleModalComponent } from './auditoria-detalle-modal.component';

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

  constructor(
    private auditoriaService: AuditoriaService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialog: MatDialog
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
    // Implementar exportación a Excel o CSV
    this.notificationService.showInfo('Función de exportación en desarrollo', 'Información');
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