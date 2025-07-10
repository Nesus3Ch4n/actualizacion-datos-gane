import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { ViviendaService } from '../../../services/vivienda.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { BackendService } from '../../../services/backend.service';
import { AuthService } from '../../../services/auth.service';
import { FormDataService } from '../../../services/form-data.service';
import { AutoSaveService } from '../../../services/auto-save.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-vivienda',
  templateUrl: './vivienda.component.html',
  styleUrls: ['./vivienda.component.scss']
})
export class ViviendaComponent implements OnInit {
  housingForm!: FormGroup;
  years: number[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private formNavigationService: FormNavigationService,
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private viviendaService: ViviendaService,
    private usuarioSessionService: UsuarioSessionService,
    private backendService: BackendService,
    private authService: AuthService,
    private formDataService: FormDataService,
    private autoSaveService: AutoSaveService
  ) {
    this.generateYears();
  }

  ngOnInit(): void {
    this.housingForm = this.fb.group({
      cdir1: ['', Validators.required],
      cdir2: ['', Validators.required],
      cdir3: ['', Validators.required],
      cdir4: ['', Validators.required],
      dir_adicional: [''],
      barrio: ['', Validators.required],
      ciudad: ['', Validators.required],
      tipovivienda: ['', Validators.required],
      viviendaes: ['', Validators.required],
      tipo_adquisicion: [{ value: '', disabled: true }],
      tipo_adquisicion2: [{ value: '', disabled: true }],
      entidad_vivienda: [{ value: '', disabled: true }],
      año_vivienda: [{ value: '', disabled: true }]
    });

    // Establecer el paso actual en el servicio de auto-guardado
    this.autoSaveService.setCurrentStep('vivienda');

    this.housingForm.get('viviendaes')?.valueChanges.subscribe(value => {
      this.toggleHousingFields(value);
    });

    this.housingForm.get('tipo_adquisicion')?.valueChanges.subscribe(value => {
      this.toggleAdquisicionOtroField(value);
    });

    // Cargar datos guardados si existen
    this.loadFormState();
    
    // Cargar datos de vivienda automáticamente
    this.cargarViviendaExistente();
  }

  loadFormState(): void {
    // Cargar datos del estado del formulario si existen
    const viviendaGuardada = this.formStateService.getVivienda();
    if (viviendaGuardada && Object.keys(viviendaGuardada).length > 0) {
      console.log('📋 Vivienda cargada desde estado del formulario:', viviendaGuardada);
      this.cargarDatosEnFormulario(viviendaGuardada);
    }
  }

  async cargarViviendaExistente(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('🏠 Cargando datos de vivienda existentes...');
      
      // Obtener el ID del usuario desde el servicio de sesión
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (!idUsuario) {
        console.log('⚠️ No hay ID de usuario disponible para cargar vivienda');
        return;
      }

      // Obtener todos los datos del usuario incluyendo vivienda
      const datosCompletos = await this.formDataService.obtenerDatosCompletosPorId(idUsuario);
      
      if (datosCompletos && datosCompletos.viviendas && datosCompletos.viviendas.length > 0) {
        const vivienda = datosCompletos.viviendas[0]; // Tomar la primera vivienda
        console.log('✅ Vivienda cargada desde datos completos:', vivienda);
        
        // Cargar datos en el formulario
        this.cargarDatosEnFormulario(vivienda);
        
        this.notificationService.showSuccess(
          '✅ Datos cargados',
          'Se cargaron los datos de vivienda existentes'
        );
      } else {
        console.log('ℹ️ No se encontraron datos de vivienda en los datos completos');
        console.log('📋 Datos completos recibidos:', datosCompletos);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar datos de vivienda:', error);
      this.notificationService.showWarning(
        '⚠️ Error al cargar datos',
        'No se pudieron cargar los datos de vivienda'
      );
    } finally {
      this.isLoading = false;
    }
  }

  cargarDatosEnFormulario(vivienda: any): void {
    // Separar la dirección en sus componentes
    let direccion = vivienda.direccion || '';
    let cdir1 = '', cdir2 = '', cdir3 = '', cdir4 = '';
    
    if (direccion) {
      // Para el formato "CRA 39e # 40 - 45"
      // Primero separar por "#" para obtener la parte principal y los números
      const partesPorHash = direccion.split('#');
      
      if (partesPorHash.length >= 2) {
        // Parte principal: "CRA 39e"
        const partePrincipal = partesPorHash[0].trim();
        
        // Separar la parte principal por espacios para obtener tipo y número
        const partesPrincipales = partePrincipal.split(/\s+/);
        if (partesPrincipales.length >= 2) {
          cdir1 = partesPrincipales[0]; // "CRA"
          cdir2 = partesPrincipales.slice(1).join(' '); // "39e"
        } else {
          cdir1 = partePrincipal;
        }
        
        // Parte de números: "40 - 45"
        const parteNumeros = partesPorHash[1].trim();
        const partesNumeros = parteNumeros.split('-');
        
        if (partesNumeros.length >= 2) {
          cdir3 = partesNumeros[0].trim(); // "40"
          cdir4 = partesNumeros[1].trim(); // "45"
        } else {
          cdir3 = parteNumeros;
        }
      } else {
        // Si no hay "#", intentar separar por espacios
        const partes = direccion.split(/\s+/);
        if (partes.length >= 2) {
          cdir1 = partes[0];
          cdir2 = partes.slice(1).join(' ');
        } else {
          cdir1 = direccion;
        }
      }
    }

    console.log('🏠 Dirección separada:', { cdir1, cdir2, cdir3, cdir4 });

    // Cargar datos en el formulario
    this.housingForm.patchValue({
      cdir1: cdir1,
      cdir2: cdir2,
      cdir3: cdir3,
      cdir4: cdir4,
      dir_adicional: vivienda.infoAdicional || '',
      barrio: vivienda.barrio || '',
      ciudad: vivienda.ciudad || '',
      tipovivienda: vivienda.tipoVivienda || '',
      viviendaes: vivienda.vivienda || '',
      tipo_adquisicion: vivienda.tipoAdquisicion || '',
      tipo_adquisicion2: vivienda.tipoAdquisicionOtro || '',
      entidad_vivienda: vivienda.entidad || '',
      año_vivienda: vivienda.anio || ''
    });

    // Habilitar campos según el tipo de vivienda
    if (vivienda.vivienda === 'Propia') {
      this.toggleHousingFields('Propia');
    }
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
      this.years.push(year);
    }
  }

  toggleHousingFields(value: string): void {
    const fields = ['tipo_adquisicion', 'tipo_adquisicion2', 'entidad_vivienda', 'año_vivienda'];

    if (value === 'Propia') { // Si selecciona "Propia"
      fields.forEach(field => {
        this.housingForm.get(field)?.enable();
        this.toggleAdquisicionOtroField("");
        this.housingForm.get(field)?.setValidators(Validators.required);
        this.housingForm.get(field)?.updateValueAndValidity();
      });
    } else { // Si selecciona cualquier otra opción
      fields.forEach(field => {
        this.housingForm.get(field)?.disable();
        this.housingForm.get(field)?.clearValidators();
        this.housingForm.get(field)?.setValue("");
        this.housingForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  toggleAdquisicionOtroField(value: string): void {
    const otroField = this.housingForm.get('tipo_adquisicion2');

    if (value === '4') { 
      otroField?.enable();
      otroField?.setValidators(Validators.required);
    } else {
      otroField?.disable();
      otroField?.clearValidators();
      otroField?.setValue("");
    }
    otroField?.updateValueAndValidity();
  }

  previous() {
    this.formNavigationService.previous();
  }

  async validateAndNext(): Promise<void> {
    if (this.housingForm.valid) {
      this.isLoading = true;
      
      try {
        // Preparar datos para el auto-guardado
        const housingData = {
          tipoVivienda: this.housingForm.get('tipovivienda')?.value,
          direccion: `${this.housingForm.get('cdir1')?.value} ${this.housingForm.get('cdir2')?.value} # ${this.housingForm.get('cdir3')?.value} - ${this.housingForm.get('cdir4')?.value}`,
          infoAdicional: this.housingForm.get('dir_adicional')?.value || '',
          barrio: this.housingForm.get('barrio')?.value,
          ciudad: this.housingForm.get('ciudad')?.value,
          vivienda: this.housingForm.get('viviendaes')?.value,
          entidad: this.housingForm.get('entidad_vivienda')?.value || '',
          anio: this.housingForm.get('año_vivienda')?.value || null,
          tipoAdquisicion: this.getTipoAdquisicionValue()
        };

        // Usar el servicio de auto-guardado para guardar con detección de cambios
        const success = await this.autoSaveService.saveStepData('vivienda', housingData);
        
        if (success) {
          this.notificationService.showSuccess(
            '✅ Éxito', 
            'Información de vivienda guardada exitosamente'
          );
          
          // Guardar en el estado del formulario
          this.formStateService.setVivienda(housingData);
          
          // Navegar al siguiente paso
          this.formNavigationService.next();
        } else {
          throw new Error('No se pudo guardar la información de vivienda');
        }

      } catch (error) {
        console.error('Error al validar vivienda:', error);
        this.notificationService.showError(
          '❌ Error',
          'No se pudo guardar la vivienda: ' + (error as Error).message
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.notificationService.showWarning(
        '⚠️ Formulario Incompleto',
        'Por favor complete todos los campos requeridos'
      );
      this.markFormGroupTouched(this.housingForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      }
    });
  }

  getTipoAdquisicionValue(): string {
    const tipoAdquisicion = this.housingForm.get('tipo_adquisicion')?.value;
    if (tipoAdquisicion === '4') {
      return this.housingForm.get('tipo_adquisicion2')?.value || '';
    } else {
      return tipoAdquisicion || '';
    }
  }
}
