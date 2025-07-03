import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { UserSessionService } from '../../../services/user-session.service';
import { BackendService } from '../../../services/backend.service';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent implements OnInit {
  vehicleForm!: FormGroup;
  years: number[] = [];
  isLoading = false;
  vehiculos: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private formNavigationService: FormNavigationService,
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private vehiculoService: VehiculoService,
    private userSessionService: UserSessionService,
    private backendService: BackendService,
    private authService: AuthService
  ) {
    this.generateYears();
  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      vehiculo: ['', Validators.required],
      tipo_vehiculo: [{ value: '', disabled: true }],
      marca: [{ value: '', disabled: true }],
      placa: [{ value: '', disabled: true }],
      año: [{ value: '', disabled: true }, Validators.required],
      prop_vehiculo: [{ value: '', disabled: true }]
    });

    this.vehicleForm.get('vehiculo')?.valueChanges.subscribe(value => {
      this.toggleVehicleFields(value);
    });

    // Cargar datos guardados si existen
    this.loadFormState();
  }

  loadFormState(): void {
    // Componente simplificado - no cargar datos de vehículos ya que el proyecto 
    // se enfoca solo en información personal
    console.log('ℹ️ Componente de vehículo disponible pero no utilizado en el flujo simplificado');
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 2; year >= 1960; year--) {
      this.years.push(year);
    }
  }

  toggleVehicleFields(value: string): void {
    const fields = ['tipo_vehiculo', 'marca', 'placa', 'año', 'prop_vehiculo'];

    if (value === '2') {
      fields.forEach(field => {
        this.vehicleForm.get(field)?.enable();
        if (field !== 'año') {
          this.vehicleForm.get(field)?.setValidators(Validators.required);
        }
      });
    } else {
      fields.forEach(field => {
        this.vehicleForm.get(field)?.disable();
        this.vehicleForm.get(field)?.clearValidators();
        this.vehicleForm.get(field)?.setValue("");
        this.vehicleForm.get(field)?.updateValueAndValidity();
      });
      // Si cambió a "No tiene vehículo", limpiar la lista
      this.vehiculos = [];
    }
  }

  canAddVehicle(): boolean {
    const requiredFields = ['tipo_vehiculo', 'marca', 'placa', 'año', 'prop_vehiculo'];
    return this.vehicleForm.get('vehiculo')?.value === '2' && 
           requiredFields.every(field => {
             const control = this.vehicleForm.get(field);
             return control && control.value && control.value.toString().trim() !== '';
           });
  }

  agregarVehiculo(): void {
    if (!this.canAddVehicle()) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.vehicleForm.controls).forEach(key => {
        this.vehicleForm.get(key)?.markAsTouched();
      });
      
      this.notificationService.showWarning(
        '⚠️ Campos incompletos',
        'Por favor, completa todos los campos del vehículo'
      );
      return;
    }

    const vehicleData = {
      tipo_vehiculo: this.vehicleForm.get('tipo_vehiculo')?.value,
      marca: this.vehicleForm.get('marca')?.value,
      placa: this.vehicleForm.get('placa')?.value.toUpperCase(),
      anio: this.vehicleForm.get('año')?.value,
      propietario: this.vehicleForm.get('prop_vehiculo')?.value
    };

    // Verificar que no sea un vehículo duplicado (por placa)
    const vehiculoExiste = this.vehiculos.some(vehiculo => 
      vehiculo.placa.toLowerCase() === vehicleData.placa.toLowerCase()
    );

    if (vehiculoExiste) {
      this.notificationService.showWarning(
        '⚠️ Vehículo duplicado',
        'Ya existe un vehículo con esta placa'
      );
      return;
    }

    // En el flujo simplificado, solo guardamos localmente
    this.vehiculos.push(vehicleData);

    // Limpiar solo los campos del vehículo, no el radio button
    ['tipo_vehiculo', 'marca', 'placa', 'año', 'prop_vehiculo'].forEach(field => {
      this.vehicleForm.get(field)?.setValue('');
      this.vehicleForm.get(field)?.markAsUntouched();
    });

    this.notificationService.showSuccess(
      '✅ Vehículo agregado',
      `Se agregó el vehículo ${vehicleData.marca} - ${vehicleData.placa}`
    );
  }

  eliminarVehiculo(index: number): void {
    const vehiculo = this.vehiculos[index];
    
    // Eliminar de la lista local
    this.vehiculos.splice(index, 1);
    
    this.notificationService.showInfo(
      'ℹ️ Vehículo eliminado',
      `Se eliminó el vehículo ${vehiculo.marca} - ${vehiculo.placa}`
    );

    // Si no quedan vehículos, cambiar a "No tiene vehículo"
    if (this.vehiculos.length === 0) {
      this.vehicleForm.get('vehiculo')?.setValue('1');
    }
  }

  previous() {
    this.formNavigationService.previous();
  }

  async validateAndNext(): Promise<void> {
    const idUsuario = this.userSessionService.getCurrentUserId();
    if (!idUsuario) {
      this.notificationService.showError(
        '❌ Error',
        'No hay usuario en sesión. Por favor vuelva al paso anterior.'
      );
      return;
    }

    this.isLoading = true;
    
    try {
      console.log('🚗 Guardando vehículos en base de datos...');
      
      // Preparar datos de vehículos - CORREGIDO para coincidir con la tabla VEHICULO
      const vehiculosData = this.vehiculos.map(vehiculo => ({
        tipoVehiculo: vehiculo.tipo_vehiculo,
        marca: vehiculo.marca,
        placa: vehiculo.placa,
        anio: vehiculo.anio,
        propietario: vehiculo.propietario
      }));

      console.log('📤 Datos de vehículos a guardar:', vehiculosData);

      // Guardar en el backend usando el endpoint directo
      const response = await firstValueFrom(
        this.backendService.getHttpClient().post<{success: boolean, data: any, message?: string}>(
          `${this.backendService.getApiUrl()}/formulario/vehiculo/guardar?idUsuario=${idUsuario}`, 
          vehiculosData,
          this.backendService.getHttpOptions()
        ).pipe(
          map((res: any) => res),
          catchError((error) => {
            console.error('❌ Error en backend:', error);
            throw error;
          })
        )
      );
      
      console.log('✅ Vehículos guardados exitosamente:', response);
      
      if (response.success) {
        // Guardar en el estado del formulario también
        this.formStateService.setVehiculos(this.vehiculos);
        
        this.notificationService.showSuccess(
          '✅ Éxito',
          'Vehículos guardados exitosamente en la base de datos'
        );
        
        // Navegar al siguiente paso
        this.formNavigationService.next();
      } else {
        throw new Error(response.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('❌ Error al guardar vehículos:', error);
      
      this.notificationService.showError(
        '❌ Error',
        'No se pudieron guardar los vehículos: ' + (error as Error).message
      );
    } finally {
      this.isLoading = false;
    }
  }
}
