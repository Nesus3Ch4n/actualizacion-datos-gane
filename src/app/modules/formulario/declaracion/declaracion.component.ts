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
    
    // Cargar declaraciones de conflicto automáticamente
    this.cargarDeclaracionesConflicto();
  }

  saveFormState(): void {
    if (this.conflictForm.get('opcion_conflicto')?.value === '1') {
      // Solo conservar el estado local en el flujo simplificado
      console.log('ℹ️ Guardando estado de declaraciones localmente');
    }
  }

  loadFormState(): void {
    // Cargar datos del estado del formulario si existen
    const declaracionesGuardadas = this.formStateService.getDeclaraciones();
    if (declaracionesGuardadas && declaracionesGuardadas.length > 0) {
      console.log('📋 Declaraciones de conflicto cargadas desde estado del formulario:', declaracionesGuardadas);
      // Tomar la primera declaración si existe
      const primeraDeclaracion = declaracionesGuardadas[0];
      this.cargarDatosEnFormulario(primeraDeclaracion);
    }
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

      console.log('🚀 Iniciando envío de declaraciones de conflicto...');

      // Obtener el ID del usuario actual
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (!idUsuario) {
        throw new Error('No hay usuario activo. Complete primero la información personal.');
      }

      console.log('👤 Usuario ID:', idUsuario);

      // Verificar si ya existen declaraciones de conflicto para este usuario
      const declaracionesExistentes = await this.declaracionConflictoService.obtenerDeclaracionesPorUsuario(idUsuario);
      const tieneDeclaracionesExistentes = declaracionesExistentes && declaracionesExistentes.length > 0;

      // Guardar solo las declaraciones de conflicto si las hay
      if (this.conflictForm.get('opcion_conflicto')?.value === '1' && this.personasConflicto.length > 0) {
        console.log('📝 Guardando declaraciones de conflicto...');
        
        // Guardar declaraciones de conflicto en la base de datos
        const resultado = await this.declaracionConflictoService.guardarDeclaracionesConflicto(idUsuario, this.personasConflicto);
        
        if (resultado && resultado.success) {
          // Mostrar mensaje apropiado según si existían datos previos
          if (tieneDeclaracionesExistentes) {
            this.notificationService.showSuccess(
              '✅ Declaraciones actualizadas',
              'Las declaraciones de conflicto han sido actualizadas correctamente en la base de datos'
            );
          } else {
          this.notificationService.showSuccess(
            '✅ Declaraciones guardadas',
            'Las declaraciones de conflicto han sido guardadas correctamente en la base de datos'
          );
          }
        } else {
          throw new Error('Error al guardar declaraciones de conflicto');
        }
      } else {
        console.log('ℹ️ No hay declaraciones de conflicto para guardar');
        
        // Si no hay declaraciones pero existían antes, limpiar la base de datos
        if (tieneDeclaracionesExistentes) {
          await this.declaracionConflictoService.guardarDeclaracionesConflicto(idUsuario, []);
          this.notificationService.showInfo(
            'ℹ️ Datos actualizados',
            'Se actualizó el registro indicando que no tienes declaraciones de conflicto'
          );
        } else {
        this.notificationService.showInfo(
          'ℹ️ Sin declaraciones',
          'No se encontraron declaraciones de conflicto para guardar'
        );
        }
      }

      // Si estamos en modo conflict-only, resetear el modo
      if (this.navigationModeService.isConflictOnlyMode()) {
        this.navigationModeService.resetToCompleteMode();
      }

      console.log('✅ Proceso completado exitosamente');
      
      // Navegar a página de confirmación
      this.router.navigate(['/completado']);

    } catch (error) {
      console.error('❌ Error al enviar declaraciones:', error);
      
      this.notificationService.showError(
        '❌ Error al guardar',
        'No se pudieron guardar las declaraciones de conflicto. Verifica tu conexión e intenta de nuevo.'
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
    console.log('Formulario completo:', this.formDataService.getFormularioCompleto());
  }

  cargarPersonasConflicto(): void {
    // Método para cargar personas de conflicto desde el backend
    console.log('📋 Cargando personas de conflicto desde el backend...');
  }

  async cargarDeclaracionesConflicto(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('📋 Cargando declaraciones de conflicto automáticamente...');
      
      // Obtener la cédula del usuario desde el servicio de sesión
      const cedula = this.usuarioSessionService.getCedulaUsuarioActual();
      if (!cedula) {
        console.log('⚠️ No hay cédula disponible para cargar declaraciones');
        return;
      }

      // Obtener todos los datos del usuario incluyendo declaraciones de conflicto
      const datosCompletos = await this.formDataService.obtenerDatosCompletos(cedula.toString());
      
      if (datosCompletos && datosCompletos.declaracionesConflicto) {
        const declaraciones = datosCompletos.declaracionesConflicto;
        console.log('✅ Declaraciones cargadas desde datos completos:', declaraciones);
        
        if (declaraciones.length > 0) {
          // Convertir las declaraciones al formato del componente
          this.personasConflicto = declaraciones.map((decl: any) => ({
            nombre: decl.nombre || decl.nombreCompleto || '',
            parentesco: decl.parentesco || '',
            tipoParteInteresada: decl.tipoParteInteresada || decl.tipoParteAsoc || ''
          }));
          
          // Si hay declaraciones, cambiar la opción a "Sí"
          this.conflictForm.patchValue({
            opcion_conflicto: '1'
          });
          
          this.notificationService.showSuccess(
            '✅ Datos cargados',
            `Se cargaron ${this.personasConflicto.length} declaraciones de conflicto`
          );
        } else {
          console.log('ℹ️ No hay declaraciones de conflicto para cargar');
        }
      } else {
        console.log('ℹ️ No se encontraron declaraciones de conflicto en los datos completos');
      }
      
    } catch (error) {
      console.error('❌ Error al cargar declaraciones de conflicto:', error);
      this.notificationService.showWarning(
        '⚠️ Error al cargar datos',
        'No se pudieron cargar las declaraciones de conflicto'
      );
    } finally {
      this.isLoading = false;
    }
  }

  cargarDatosEnFormulario(declaracion: any): void {
    // Cargar datos en el formulario
    this.conflictForm.patchValue({
      dconf_nombre: declaracion.dconf_nombre || '',
      dconf_parentesco: declaracion.dconf_parentesco || '',
      dconf_parte: declaracion.dconf_parte || ''
    });

    // Habilitar campos según la respuesta
    if (declaracion.opcion_conflicto === '1') {
      this.toggleConflictFields('1');
    }
  }

  verificarConflicto(cedula: string): boolean {
    // En el flujo simplificado, no verificamos conflictos contra listas externas
    return false;
  }
}
