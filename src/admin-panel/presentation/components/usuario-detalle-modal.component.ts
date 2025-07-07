import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioDetalleCompletoDTO } from '../../application/dto/usuario-detalle-completo.dto';

@Component({
  selector: 'app-usuario-detalle-modal',
  templateUrl: './usuario-detalle-modal.component.html',
  styleUrls: ['./usuario-detalle-modal.component.scss']
})
export class UsuarioDetalleModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UsuarioDetalleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDetalleCompletoDTO
  ) {
    console.log('=== DATOS RECIBIDOS EN EL MODAL ===');
    console.log('Datos completos:', data);
    console.log('Usuario:', data.usuario);
    console.log('Contactos de emergencia:', data.contactosEmergencia);
    console.log('Estudios académicos:', data.estudiosAcademicos);
    console.log('Personas a cargo:', data.personasACargo);
    console.log('Relaciones de conflicto:', data.relacionesConflicto);
    console.log('Vehículos:', data.vehiculos);
    console.log('Vivienda:', data.vivienda);
    console.log('=====================================');
  }

  close(): void {
    this.dialogRef.close();
  }
} 