import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuditoriaDTO } from '../../services/auditoria.service';

@Component({
  selector: 'app-auditoria-detalle-modal',
  templateUrl: './auditoria-detalle-modal.component.html',
  styleUrls: ['./auditoria-detalle-modal.component.scss']
})
export class AuditoriaDetalleModalComponent {
  
  constructor(
    public dialogRef: MatDialogRef<AuditoriaDetalleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuditoriaDTO
  ) {
    console.log('=== DETALLES DE AUDITORÍA ===');
    console.log('Datos completos:', data);
    console.log('=============================');
  }

  close(): void {
    this.dialogRef.close();
  }

  // Métodos de utilidad para formatear datos
  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return fecha;
    }
  }

  obtenerNombreLegibleTabla(tabla: string): string {
    const nombres: { [key: string]: string } = {
      'USUARIO': 'Información Personal',
      'ESTUDIO_ACADEMICO': 'Estudios Académicos',
      'VEHICULO': 'Vehículos',
      'VIVIENDA': 'Vivienda',
      'PERSONA_A_CARGO': 'Personas a Cargo',
      'CONTACTO_EMERGENCIA': 'Contactos de Emergencia',
      'RELACION_CONF': 'Declaraciones de Conflicto'
    };
    return nombres[tabla] || tabla;
  }

  obtenerNombreLegibleTipoPeticion(tipo: string): string {
    const nombres: { [key: string]: string } = {
      'INSERT': 'Creación',
      'UPDATE': 'Actualización',
      'DELETE': 'Eliminación'
    };
    return nombres[tipo] || tipo;
  }

  obtenerClaseTipoPeticion(tipo: string): string {
    const clases: { [key: string]: string } = {
      'INSERT': 'badge-success',
      'UPDATE': 'badge-warning',
      'DELETE': 'badge-danger'
    };
    return clases[tipo] || 'badge-secondary';
  }
} 