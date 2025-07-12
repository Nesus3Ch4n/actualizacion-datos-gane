import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ControlActualizacion } from '../../services/actualizacion.service';
import { NotificationService } from '../../services/notification.service';
import { ExcelExportService } from '../../services/excel-export.service';

export interface UsuariosModalData {
  tipo: 'pendientes' | 'vencidos';
  usuarios: ControlActualizacion[];
}

@Component({
  selector: 'app-usuarios-pendientes-modal',
  templateUrl: './usuarios-pendientes-modal.component.html',
  styleUrls: ['./usuarios-pendientes-modal.component.scss']
})
export class UsuariosPendientesModalComponent implements OnInit {
  
  displayedColumns: string[] = ['cedula', 'nombre', 'estado', 'fechaProxima', 'diasRestantes'];
  dataSource: any[] = [];
  
  constructor(
    public dialogRef: MatDialogRef<UsuariosPendientesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuariosModalData,
    private notificationService: NotificationService,
    private excelExportService: ExcelExportService
  ) {}
  
  ngOnInit(): void {
    this.procesarDatos();
  }
  
  procesarDatos(): void {
    this.dataSource = this.data.usuarios.map(control => ({
      cedula: control.usuario?.documento || 'N/A',
      nombre: control.usuario?.nombre || 'N/A',
      estado: this.obtenerEstadoLegible(control.estadoActualizacion),
      fechaProxima: this.formatearFecha(control.fechaProximaActualizacion),
      diasRestantes: this.calcularDiasRestantes(control.fechaProximaActualizacion),
      mensajeDias: this.obtenerMensajeDiasRestantes(this.calcularDiasRestantes(control.fechaProximaActualizacion)),
      claseEstado: this.obtenerClaseEstado(control.estadoActualizacion)
    }));
  }
  
  obtenerEstadoLegible(estado: string): string {
    const estados: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'COMPLETADA': 'Completada',
      'VENCIDA': 'Vencida'
    };
    return estados[estado] || estado;
  }
  
  obtenerClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'estado-pendiente',
      'COMPLETADA': 'estado-completada',
      'VENCIDA': 'estado-vencida'
    };
    return clases[estado] || 'estado-default';
  }
  
  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
  }
  
  calcularDiasRestantes(fechaProxima: string): number {
    if (!fechaProxima) return 0;
    
    try {
      const proxima = new Date(fechaProxima);
      const ahora = new Date();
      const diffTime = proxima.getTime() - ahora.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 0;
    }
  }
  
  obtenerMensajeDiasRestantes(dias: number): string {
    if (dias < 0) {
      return `Vencida hace ${Math.abs(dias)} días`;
    } else if (dias === 0) {
      return 'Vence hoy';
    } else if (dias === 1) {
      return 'Vence mañana';
    } else if (dias <= 7) {
      return `Vence en ${dias} días`;
    } else if (dias <= 30) {
      return `Vence en ${dias} días`;
    } else {
      const meses = Math.floor(dias / 30);
      return `Vence en ${meses} mes${meses > 1 ? 'es' : ''}`;
    }
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }
  
  exportarExcel(): void {
    if (this.dataSource.length === 0) {
      this.notificationService.showWarning('No hay usuarios para exportar', 'Advertencia');
      return;
    }
    const nombre = this.data.tipo === 'pendientes' ? 'usuarios_pendientes' : 'usuarios_vencidos';
    const fecha = new Date().toISOString().slice(0, 10);
    const fileName = `${nombre}_${fecha}.xlsx`;
    const datos = this.dataSource.map(u => ({
      'Cédula': u.cedula,
      'Nombre Completo': u.nombre,
      'Estado': u.estado,
      'Fecha Próxima Actualización': u.fechaProxima,
      'Estado Temporal': u.mensajeDias
    }));
    this.excelExportService.exportarSimple(datos, fileName);
    this.notificationService.showSuccess('Archivo Excel generado exitosamente', 'Éxito');
  }
} 