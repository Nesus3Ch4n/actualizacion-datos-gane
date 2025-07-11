import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { PersonaACargoService } from '../../../services/persona-acargo.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { AutoSaveService } from '../../../services/auto-save.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { BackendService } from '../../../services/backend.service';
import { AuthService } from '../../../services/auth.service';
import { FormDataService } from '../../../services/form-data.service';

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
    private formNavigationService: FormNavigationService,
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private personaACargoService: PersonaACargoService,
    private usuarioSessionService: UsuarioSessionService,
    private backendService: BackendService,
    private authService: AuthService,
    private formDataService: FormDataService,
    private autoSaveService: AutoSaveService,
    private datePipe: DatePipe
  ) {
    this.generateYears();
  }

  generateYears(): void {
    // Este método no es necesario para el componente de personas a cargo
    // Se puede eliminar la llamada en el constructor
  }

  ngOnInit(): void {
    this.personasACargoForm = this.fb.group({
      persona_acargo: ['', Validators.required],
      nombre: [{ value: '', disabled: true }],
      parentesco: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }], // Deshabilitado
      fecha_nacimiento: [{ value: '', disabled: true }]
    });

    // Calcular edad automáticamente al cambiar la fecha de nacimiento
    this.personasACargoForm.get('fecha_nacimiento')?.valueChanges.subscribe((fecha: any) => {
      if (fecha) {
        const edad = this.calcularEdad(fecha);
        this.personasACargoForm.get('edad')?.setValue(edad, { emitEvent: false });
      } else {
        this.personasACargoForm.get('edad')?.setValue('', { emitEvent: false });
      }
    });

    // Establecer el paso actual en el servicio de auto-guardado
    this.autoSaveService.setCurrentStep('personas-acargo');

    this.personasACargoForm.get('persona_acargo')?.valueChanges.subscribe(value => {
      this.togglePersonalFields(value);
    });

    // Cargar datos guardados si existen
    this.loadFormState();
    
    // Cargar datos de personas a cargo automáticamente
    this.cargarPersonasExistentes();
  }

  loadFormState(): void {
    // Cargar datos del estado del formulario si existen
    const personasGuardadas = this.formStateService.getPersonasACargo();
    if (personasGuardadas && personasGuardadas.length > 0) {
      console.log('📋 Personas a cargo cargadas desde estado del formulario:', personasGuardadas);
      this.personas = personasGuardadas;
    }
  }

  async cargarPersonasExistentes(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('👥 Cargando datos de personas a cargo existentes...');
      
      // Obtener el ID del usuario desde el servicio de sesión
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (!idUsuario) {
        console.log('⚠️ No hay ID de usuario disponible para cargar personas a cargo');
        return;
      }

      // Obtener todos los datos del usuario incluyendo personas a cargo
      const datosCompletos = await this.formDataService.obtenerDatosCompletosPorId(idUsuario);
      
      if (datosCompletos && datosCompletos.personasACargo) {
        const personas = datosCompletos.personasACargo;
        console.log('✅ Personas a cargo cargadas desde datos completos:', personas);
        
        // Convertir las personas al formato del componente
        this.personas = personas.map((persona: any) => ({
          nombre: persona.nombre || '',
          parentesco: persona.parentesco || '',
          fecha_nacimiento: persona.fechaNacimientoFormateada || persona.fechaNacimiento || persona.fecha_nacimiento || '',
          edad: persona.edad || '',
          ocupacion: persona.ocupacion || '',
          ingresos: persona.ingresos || ''
        }));
        
        this.notificationService.showSuccess(
          '✅ Datos cargados',
          `Se cargaron ${this.personas.length} personas a cargo`
        );
      } else {
        console.log('ℹ️ No se encontraron personas a cargo en los datos completos');
      }
      
    } catch (error) {
      console.error('❌ Error al cargar personas a cargo:', error);
      this.notificationService.showWarning(
        '⚠️ Error al cargar datos',
        'No se pudieron cargar las personas a cargo'
      );
    } finally {
      this.isLoading = false;
    }
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

      // Preparar datos para el auto-guardado
      const personasData = {
        tienePersonasACargo: this.personasACargoForm.get('persona_acargo')?.value === '2',
        personas: this.personas.map(persona => ({
          nombre: persona.nombre,
          parentesco: persona.parentesco,
          fechaNacimiento: persona.fechaNacimiento,
          edad: persona.edad
        }))
      };

      // Usar el servicio de auto-guardado para guardar con detección de cambios
      const success = await this.autoSaveService.saveStepData('personas-acargo', personasData);
      
      if (success) {
        this.notificationService.showSuccess(
          '✅ Éxito', 
          'Información de personas a cargo guardada exitosamente'
        );
        
        // Guardar en el estado del formulario
        this.formStateService.setPersonasACargo(this.personas);
        
        // Navegar al siguiente paso
        this.formNavigationService.next();
      } else {
        throw new Error('No se pudo guardar la información de personas a cargo');
      }

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

  /**
   * Calcula la edad a partir de una fecha de nacimiento
   */
  calcularEdad(fechaNacimiento: string | Date): number {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const fecha = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }
}
