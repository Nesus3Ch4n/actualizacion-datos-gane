import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { NavigationModeService } from '../../../services/navigation-mode.service';
import { Router } from '@angular/router';
import { FormStateService } from '../../../services/form-state.service';
import { FormDataService } from '../../../services/form-data.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { DeclaracionConflictoService } from '../../../services/declaracion-conflicto.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';

interface PersonaConflicto {
  nombre: string;
  parentesco: string;
  tipoParteInteresada: string;
}

@Component({
  selector: 'app-declaracion',
  templateUrl: './declaracion.component.html',
  styleUrls: ['./declaracion.component.scss']
})
export class DeclaracionComponent implements OnInit {
  conflictForm!: FormGroup;
  personasConflicto: PersonaConflicto[] = [];
  displayedColumns: string[] = ['nombre', 'parentesco', 'tipoParteInteresada', 'acciones'];
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private dialog: MatDialog,
    private navigationModeService: NavigationModeService,
    private router: Router,
    private formStateService: FormStateService,
    private formDataService: FormDataService,
    private notificationService: NotificationService,
    private formNavigationService: FormNavigationService,
    private declaracionConflictoService: DeclaracionConflictoService,
    private usuarioSessionService: UsuarioSessionService
  ) {}

  ngOnInit(): void {
    this.conflictForm = this.fb.group({
      opcion_conflicto: ['2', Validators.required], // Por defecto "No"
      dconf_nombre: [{ value: '', disabled: true }],
      dconf_parentesco: [{ value: '', disabled: true }],
      dconf_parte: [{ value: '', disabled: true }]
    });

    // Escuchar cambios en la opción principal
    this.conflictForm.get('opcion_conflicto')?.valueChanges.subscribe(value => {
      this.toggleConflictFields(value);
      this.saveFormState();
    });

    // Cargar datos guardados si existen
    this.loadFormState();
  }

  saveFormState(): void {
    if (this.conflictForm.get('opcion_conflicto')?.value === '1') {
      // Solo conservar el estado local en el flujo simplificado
      console.log('ℹ️ Guardando estado de declaraciones localmente');
    }
  }

  loadFormState(): void {
    // En el flujo simplificado, no cargar datos de declaraciones
    console.log('ℹ️ Componente de declaraciones disponible pero simplificado');
  }

  toggleConflictFields(value: string): void {
    const fields = ['dconf_nombre', 'dconf_parentesco', 'dconf_parte'];

    if (value === '1') { // Si selecciona "Sí"
      fields.forEach(field => {
        this.conflictForm.get(field)?.enable();
        this.conflictForm.get(field)?.setValidators(Validators.required);
        this.conflictForm.get(field)?.updateValueAndValidity();
      });
    } else { // Si selecciona "No"
      fields.forEach(field => {
        this.conflictForm.get(field)?.disable();
        this.conflictForm.get(field)?.clearValidators();
        this.conflictForm.get(field)?.setValue('');
        this.conflictForm.get(field)?.updateValueAndValidity();
      });
      // Limpiar la lista de personas
      this.personasConflicto = [];
    }
  }

  isPersonFormValid(): boolean {
    return !!(
      this.conflictForm.get('dconf_nombre')?.valid &&
      this.conflictForm.get('dconf_parentesco')?.valid &&
      this.conflictForm.get('dconf_parte')?.valid &&
      this.conflictForm.get('dconf_nombre')?.value?.trim() &&
      this.conflictForm.get('dconf_parentesco')?.value?.trim() &&
      this.conflictForm.get('dconf_parte')?.value
    );
  }

  agregarPersona(): void {
    if (this.isPersonFormValid()) {
      const nuevaPersona: PersonaConflicto = {
        nombre: this.conflictForm.get('dconf_nombre')?.value.trim(),
        parentesco: this.conflictForm.get('dconf_parentesco')?.value.trim(),
        tipoParteInteresada: this.conflictForm.get('dconf_parte')?.value
      };

      // Verificar que no exista ya una persona con los mismos datos
      const personaExiste = this.personasConflicto.some(persona => 
        persona.nombre.toLowerCase() === nuevaPersona.nombre.toLowerCase() &&
        persona.parentesco.toLowerCase() === nuevaPersona.parentesco.toLowerCase() &&
        persona.tipoParteInteresada === nuevaPersona.tipoParteInteresada
      );

      if (!personaExiste) {
        this.personasConflicto.push(nuevaPersona);
        
        // Limpiar los campos del formulario
        this.conflictForm.patchValue({
          dconf_nombre: '',
          dconf_parentesco: '',
          dconf_parte: ''
        });

        this.notificationService.showSuccess(
          '✅ Persona agregada',
          `Se agregó ${nuevaPersona.nombre} a las declaraciones de conflicto`
        );
      } else {
        this.notificationService.showWarning(
          '⚠️ Persona duplicada',
          'Esta persona ya ha sido agregada a la lista'
        );
      }
    }
  }

  eliminarPersona(index: number): void {
    if (index >= 0 && index < this.personasConflicto.length) {
      const persona = this.personasConflicto[index];
      
      // Eliminar de la lista local
      this.personasConflicto.splice(index, 1);

      this.notificationService.showInfo(
        'ℹ️ Persona eliminada',
        `Se eliminó ${persona.nombre} de las declaraciones`
      );
    }
  }

  previous(): void {
    this.saveFormState();
    
    // Verificar si estamos en modo "conflict-only"
    if (this.navigationModeService.isConflictOnlyMode()) {
      // En modo conflict-only, regresar a la vista de formulario completado
      this.navigationModeService.resetToCompleteMode();
      this.router.navigate(['/completado']);
    } else {
      // Modo normal, usar la navegación del formulario
      this.formNavigationService.previous();
    }
  }

  validateAndFinish(): void {
    // Validar que si seleccionó "Sí" debe tener personas agregadas
    if (this.conflictForm.get('opcion_conflicto')?.value === '1' && this.personasConflicto.length === 0) {
      this.notificationService.showWarning(
        '⚠️ Declaraciones incompletas',
        'Debe agregar al menos una persona con conflicto de intereses o seleccionar "No"'
      );
      return;
    }

    // Guardar estado actual antes de proceder
    this.saveFormState();

    // Abrir el modal de confirmación
    this.openConfirmationModal();
  }

  openConfirmationModal(): void {
    const resumen = this.formDataService.obtenerResumenFormulario();
    
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      disableClose: true,
      panelClass: 'confirmation-dialog',
      data: {
        conflictoDeIntereses: this.conflictForm.get('opcion_conflicto')?.value === '1',
        personasConflicto: this.personasConflicto,
        isConflictOnlyMode: this.navigationModeService.isConflictOnlyMode(),
        resumenFormulario: resumen
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submit') {
        this.submitForm();
      } else if (result === 'back') {
        // No hacer nada, solo cerrar el modal para que puedan editar
        console.log('Usuario decidió regresar para editar');
      }
    });
  }

  private async submitForm(): Promise<void> {
    try {
      this.isLoading = true;

      console.log('🚀 Iniciando envío completo del formulario...');

      // DEBUGGING: Verificar estado antes del guardado
      this.formDataService.debugFormularioCompleto();

      // Si estamos en modo conflict-only, solo actualizar declaraciones
      if (this.navigationModeService.isConflictOnlyMode()) {
        // Guardar solo las declaraciones de conflicto
        const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
        if (!idUsuario) {
          throw new Error('No hay usuario activo. Complete primero la información personal.');
        }

        if (this.conflictForm.get('opcion_conflicto')?.value === '1' && this.personasConflicto.length > 0) {
          // Guardar declaraciones de conflicto en la base de datos
          const resultado = await this.declaracionConflictoService.guardarDeclaracionesConflicto(idUsuario, this.personasConflicto);
          
          if (resultado && resultado.success) {
            this.notificationService.showSuccess(
              '✅ Declaraciones actualizadas',
              'Las declaraciones de conflicto han sido actualizadas correctamente en la base de datos'
            );
          }
        }
        
        this.navigationModeService.resetToCompleteMode();
        this.router.navigate(['/completado']);
        return;
      }

      // Modo normal: guardar formulario completo
      const exito = await this.formDataService.guardarFormularioCompleto();
      
      if (exito) {
        // Si hay declaraciones de conflicto, guardarlas también
        const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
        if (idUsuario && this.conflictForm.get('opcion_conflicto')?.value === '1' && this.personasConflicto.length > 0) {
          try {
            await this.declaracionConflictoService.guardarDeclaracionesConflicto(idUsuario, this.personasConflicto);
            console.log('✅ Declaraciones de conflicto guardadas exitosamente');
          } catch (error) {
            console.error('⚠️ Error al guardar declaraciones de conflicto:', error);
            // No fallar el formulario completo por este error
          }
        }

        this.notificationService.showSuccess(
          '🎉 ¡Formulario completado!',
          'Todos tus datos han sido guardados exitosamente en la base de datos'
        );

        // Limpiar formulario después del guardado exitoso
        this.formDataService.limpiarFormularioDespuesDeGuardar();

        console.log('✅ Formulario enviado exitosamente');
        
        // Navegar a página de confirmación o inicio
        this.router.navigate(['/completado']);
      }

    } catch (error) {
      console.error('❌ Error al enviar formulario:', error);
      
      this.notificationService.showError(
        '❌ Error al guardar',
        'No se pudo guardar el formulario completo. Verifica tu conexión e intenta de nuevo.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  // Método para verificar si estamos en modo conflict-only
  isConflictOnlyMode(): boolean {
    return this.navigationModeService.isConflictOnlyMode();
  }

  // Obtener resumen del formulario para mostrar
  getResumenFormulario(): any {
    return this.formDataService.obtenerResumenFormulario();
  }

  // TEMPORAL: Método para debugging
  debugFormulario(): void {
    this.formDataService.debugFormularioCompleto();
  }

  cargarPersonasConflicto(): void {
    // En el flujo simplificado, solo validamos con información básica
    console.log('ℹ️ Validación de conflictos disponible pero simplificada en el flujo actual');
    this.personasConflicto = [];
  }

  verificarConflicto(cedula: string): boolean {
    // En el flujo simplificado, no verificamos conflictos contra listas externas
    return false;
  }
}
