import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { ViviendaService } from '../../../services/vivienda.service';
import { UserSessionService } from '../../../services/user-session.service';
import { BackendService } from '../../../services/backend.service';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

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
    private userSessionService: UserSessionService,
    private backendService: BackendService
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

    this.housingForm.get('viviendaes')?.valueChanges.subscribe(value => {
      this.toggleHousingFields(value);
    });

    this.housingForm.get('tipo_adquisicion')?.valueChanges.subscribe(value => {
      this.toggleAdquisicionOtroField(value);
    });

    // Cargar datos guardados si existen
    this.loadFormState();
  }

  loadFormState(): void {
    // Componente simplificado - no cargar datos de vivienda ya que el proyecto 
    // se enfoca solo en información personal
    console.log('ℹ️ Componente de vivienda disponible pero no utilizado en el flujo simplificado');
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
        // Obtener el ID del usuario actual
        const idUsuario = this.userSessionService.getCurrentUserId();
        if (!idUsuario) {
          this.notificationService.showError(
            '❌ Error',
            'No hay usuario en sesión. Por favor vuelva al paso anterior.'
          );
          return;
        }

        console.log('🏠 Guardando vivienda en base de datos...');
        
        // Preparar datos de vivienda
        const viviendaData = {
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

        console.log('📤 Datos de vivienda a guardar:', viviendaData);

        // Guardar en el backend usando el nuevo endpoint directo
        const response = await firstValueFrom(
          this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
            `${this.backendService.getApiUrl()}/formulario/vivienda/guardar?idUsuario=${idUsuario}`, 
            viviendaData,
            this.backendService.getHttpOptions()
          ).pipe(
            map((res: any) => res)
          )
        );
        
        console.log('✅ Vivienda guardada exitosamente:', response);
        
        if (response.success) {
          // Guardar en el estado del formulario también
          this.formStateService.setVivienda(viviendaData);
          
          this.notificationService.showSuccess(
            '✅ Éxito',
            'Vivienda guardada exitosamente en la base de datos'
          );
          
          // Navegar al siguiente paso
          this.formNavigationService.next();
        } else {
          throw new Error(response.message || 'Error desconocido');
        }

      } catch (error) {
        console.error('❌ Error al guardar vivienda:', error);
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
