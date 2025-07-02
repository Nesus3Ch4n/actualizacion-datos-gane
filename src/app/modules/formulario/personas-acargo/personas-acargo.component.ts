import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { PersonaACargoService } from '../../../services/persona-acargo.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { firstValueFrom } from 'rxjs';
import { UserSessionService } from '../../../services/user-session.service';

@Component({
  selector: 'app-personas-acargo',
  templateUrl: './personas-acargo.component.html',
  styleUrls: ['./personas-acargo.component.scss']
})
export class PersonasAcargoComponent implements OnInit {
  personasACargoForm!: FormGroup;
  personas: Array<any> = [];
  isLoading = false;

  parentescos: string[] = [
    'Padre',
    'Madre',
    'Hermano(a)',
    'Hijo(a)',
    'Abuelo(a)',
    'Tío(a)',
    'Sobrino(a)',
    'Primo(a)',
    'Esposo(a)',
    'Amigo(a)',
    'Otro'
  ];

  constructor(
    private fb: FormBuilder, 
    private datePipe: DatePipe, 
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private formNavigationService: FormNavigationService,
    private personaACargoService: PersonaACargoService,
    private usuarioSessionService: UsuarioSessionService,
    private userSessionService: UserSessionService
  ) {}

  ngOnInit(): void {
    this.personasACargoForm = this.fb.group({
      persona_acargo: ['', Validators.required],
      nombre: [{ value: '', disabled: true }],
      parentesco: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }],
      fecha_nacimiento: [{ value: '', disabled: true }]
    });

    this.personasACargoForm.get('persona_acargo')?.valueChanges.subscribe(value => {
      this.togglePersonalFields(value);
    });

    // Cargar datos guardados si existen
    this.loadFormState();
    this.loadExistingPersons();
  }

  async loadExistingPersons(): Promise<void> {
    try {
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (idUsuario) {
        console.log('📋 Cargando personas a cargo existentes para usuario ID:', idUsuario);
        const personasExistentes = await firstValueFrom(
          this.personaACargoService.obtenerPersonasPorUsuario(idUsuario)
        );
        
        if (personasExistentes && personasExistentes.length > 0) {
          this.personas = personasExistentes;
          this.personasACargoForm.get('persona_acargo')?.setValue('2'); // Marcar como que tiene personas a cargo
          this.togglePersonalFields('2');
          console.log('✅ Personas a cargo cargadas desde BD:', this.personas);
          this.notificationService.showInfo(
            '📋 Personas cargadas',
            `Se cargaron ${this.personas.length} persona(s) a cargo existente(s)`
          );
        }
      }
    } catch (error) {
      console.error('Error al cargar personas existentes:', error);
      // No mostrar error si no hay personas (es normal)
    }
  }

  loadFormState(): void {
    // Componente simplificado - no cargar datos de personas a cargo ya que el proyecto 
    // se enfoca solo en información personal
    console.log('ℹ️ Componente de personas a cargo disponible pero no utilizado en el flujo simplificado');
  }

  togglePersonalFields(value: string): void {
    const fields = ['nombre', 'parentesco', 'edad', 'fecha_nacimiento'];

    if (value === '2') { // Si tiene personas a cargo
      fields.forEach(field => {
        const control = this.personasACargoForm.get(field);
        if (control) {
          control.enable();
          control.setValidators(Validators.required);
          control.updateValueAndValidity();
        }
      });
    } else if (value === '1') { // Si no tiene personas a cargo
      // Limpiar todos los campos y deshabilitarlos
      fields.forEach(field => {
        const control = this.personasACargoForm.get(field);
        if (control) {
          control.disable();
          control.clearValidators();
          control.setValue('');
          control.updateValueAndValidity();
        }
      });
      // Limpiar lista de personas
      this.personas = [];
    }
  }

  canAddPerson(): boolean {
    if (this.personasACargoForm.get('persona_acargo')?.value !== '2') {
      return false;
    }

    const requiredFields = ['nombre', 'parentesco', 'edad', 'fecha_nacimiento'];
    return requiredFields.every(field => {
      const control = this.personasACargoForm.get(field);
      return control && control.value && control.value.toString().trim() !== '';
    });
  }

  async agregarPersonaACargo(): Promise<void> {
    const requiredFields = ['nombre', 'parentesco', 'edad', 'fecha_nacimiento'];

    // Verificar que la pregunta principal esté respondida como "Sí"
    if (this.personasACargoForm.get('persona_acargo')?.value !== '2') {
      return;
    }

    // Verificar que los campos requeridos estén completos
    if (!this.canAddPerson()) {
      // Marcar todos los campos como tocados para mostrar errores
      requiredFields.forEach(field => {
        this.personasACargoForm.get(field)?.markAsTouched();
      });
      
      this.notificationService.showWarning(
        '⚠️ Campos incompletos',
        'Por favor, completa todos los campos de la persona a cargo'
      );
      return;
    }

    try {
      // Obtener fecha de nacimiento del formulario
      let fechaNacimiento = this.personasACargoForm.get('fecha_nacimiento')?.value;
      
      // Convertir a formato YYYY-MM-DD para el backend
      let fechaBackend = '';
      if (fechaNacimiento) {
        fechaBackend = this.datePipe.transform(fechaNacimiento, 'yyyy-MM-dd') || '';
      }
      
      // Formatear para mostrar en la interfaz (DD/MM/YYYY)
      let fechaDisplay = '';
      if (fechaNacimiento) {
        fechaDisplay = this.datePipe.transform(fechaNacimiento, 'dd/MM/yyyy') || '';
      }

      // Agregar la persona a la lista
      const nuevaPersona = {
        nombre: this.personasACargoForm.get('nombre')?.value,
        parentesco: this.personasACargoForm.get('parentesco')?.value,
        edad: this.personasACargoForm.get('edad')?.value,
        fecha_nacimiento: fechaDisplay, // Para mostrar en la interfaz
        fechaNacimiento: fechaBackend   // Para enviar al backend
      };

      // En el flujo simplificado, solo guardamos localmente
      this.personas.push(nuevaPersona);

      this.notificationService.showSuccess(
        '✅ Persona agregada',
        `Se agregó ${nuevaPersona.nombre} (${nuevaPersona.parentesco}) a tu familia`
      );

      // Limpiar solo los campos del formulario de agregar, mantener habilitados
      requiredFields.forEach(field => {
        const control = this.personasACargoForm.get(field);
        if (control) {
          control.setValue('');
          control.markAsUntouched();
          // Mantener las validaciones y el estado habilitado
        }
      });

    } catch (error) {
      console.error('Error al agregar persona a cargo:', error);
      this.notificationService.showError(
        '❌ Error al agregar persona',
        'No se pudo guardar la información. Por favor, intenta de nuevo.'
      );
    }
  }

  eliminarPersona(index: number): void {
    const persona = this.personas[index];
    
    // Eliminar de la lista local
    this.personas.splice(index, 1);
    
    this.notificationService.showInfo(
      'ℹ️ Persona eliminada',
      `Se eliminó ${persona.nombre} de la lista`
    );
  }

  getParentescoIcon(parentesco: string): string {
    const iconMap: { [key: string]: string } = {
      'Padre': 'man',
      'Madre': 'woman',
      'Hermano(a)': 'people',
      'Hijo(a)': 'child_care',
      'Abuelo(a)': 'elderly',
      'Tío(a)': 'person',
      'Sobrino(a)': 'child_friendly',
      'Primo(a)': 'group',
      'Esposo(a)': 'favorite',
      'Amigo(a)': 'person_outline',
      'Otro': 'person_pin'
    };
    
    return iconMap[parentesco] || 'person';
  }

  previous() {
    this.formNavigationService.previous();
  }

  async validateAndNext(): Promise<void> {
    // Validar que se haya respondido la pregunta principal
    if (!this.personasACargoForm.get('persona_acargo')?.value) {
      this.personasACargoForm.get('persona_acargo')?.markAsTouched();
      
      this.notificationService.showWarning(
        '⚠️ Respuesta requerida',
        'Por favor, indica si tienes personas a cargo'
      );
      return;
    }

    try {
      this.isLoading = true;

      // Obtener ID del usuario actual
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      
      if (!idUsuario) {
        // Intentar recuperar de userSessionService como fallback
        const idFallback = this.userSessionService.getCurrentUserId();
        
        if (idFallback) {
          console.log('⚠️ Usando ID del userSessionService como fallback:', idFallback);
          // Intentar reconstruir la sesión del usuarioSessionService
          const usuarioMinimo = { id: idFallback };
          this.usuarioSessionService.setUsuarioActual(usuarioMinimo);
          
          throw new Error(`Sesión incompleta detectada. Se usó el ID ${idFallback} como fallback. Complete primero la información personal si persiste el problema.`);
        } else {
        throw new Error('No hay usuario activo. Complete primero la información personal.');
        }
      }

      console.log('👤 Procesando personas a cargo para usuario ID:', idUsuario);

      // Si el usuario tiene personas a cargo (opción "2"), validar que haya agregado al menos una
      if (this.personasACargoForm.get('persona_acargo')?.value === '2') {
        if (this.personas.length === 0) {
          this.notificationService.showWarning(
            '⚠️ Sin personas agregadas',
            'Por favor, agrega al menos una persona a cargo antes de continuar'
          );
          return;
        }

        // Guardar personas a cargo en el backend usando el servicio
        console.log('💾 Guardando personas a cargo en el backend...');
        
        // Preparar datos para el backend
        const personasData = this.personas.map(persona => ({
          nombre: persona.nombre,
          parentesco: persona.parentesco,
          fechaNacimiento: persona.fechaNacimiento,
          edad: persona.edad
          // version: 1, // Descomenta si tu backend lo requiere
          // idUsuario: idUsuario // Descomenta si tu backend lo requiere
        }));

        // Guardar usando el servicio
        const resultado = await firstValueFrom(
          this.personaACargoService.guardarPersonasACargo(idUsuario, personasData)
        );
        
        console.log('✅ Personas a cargo guardadas en BD:', resultado);
        
        this.notificationService.showSuccess(
          '✅ Personas a cargo guardadas',
          `Se registraron ${this.personas.length} persona(s) a cargo en la base de datos`
        );
      } else {
        // Usuario no tiene personas a cargo - guardar lista vacía
        await firstValueFrom(
          this.personaACargoService.guardarPersonasACargo(idUsuario, [])
        );
        
        this.notificationService.showInfo(
          'ℹ️ Sin personas a cargo',
          'Se registró que no tienes personas a cargo'
        );
      }

      // Continuar al siguiente paso
      this.formNavigationService.next();

    } catch (error) {
      console.error('Error al validar personas a cargo:', error);
      this.notificationService.showError(
        '❌ Error',
        'No se pudieron guardar las personas a cargo: ' + (error as Error).message
      );
    } finally {
      this.isLoading = false;
    }
  }
}
