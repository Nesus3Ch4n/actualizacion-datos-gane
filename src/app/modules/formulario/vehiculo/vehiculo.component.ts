import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { VehiculoService } from '../../../services/vehiculo.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { BackendService } from '../../../services/backend.service';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormDataService } from '../../../services/form-data.service';

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
    private usuarioSessionService: UsuarioSessionService,
    private backendService: BackendService,
    private authService: AuthService,
    private formDataService: FormDataService
  ) {
    this.generateYears();
  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      vehiculo: ['', Validators.required], // Cambiado de 'tiene_vehiculo' a 'vehiculo'
      tipo_vehiculo: [{ value: '', disabled: true }],
      marca: [{ value: '', disabled: true }],
      modelo: [{ value: '', disabled: true }],
      año: [{ value: '', disabled: true }],
      placa: [{ value: '', disabled: true }],
      valor_comercial: [{ value: '', disabled: true }],
      deudas_vehiculo: [{ value: '', disabled: true }],
      entidad_financiera: [{ value: '', disabled: true }],
      cuota_mensual: [{ value: '', disabled: true }],
      prop_vehiculo: [{ value: '', disabled: true }] // Agregado campo propietario
    });

    this.vehicleForm.get('vehiculo')?.valueChanges.subscribe(value => {
      this.toggleVehicleFields(value);
    });

    this.vehicleForm.get('deudas_vehiculo')?.valueChanges.subscribe(value => {
      this.toggleDebtFields(value);
    });

    // Cargar datos guardados si existen
    this.loadFormState();
    
    // Cargar datos de vehículo automáticamente
    this.cargarVehiculoExistente();
  }

  loadFormState(): void {
    // Cargar datos del estado del formulario si existen
    const vehiculosGuardados = this.formStateService.getVehiculos();
    if (vehiculosGuardados && vehiculosGuardados.length > 0) {
      console.log('📋 Vehículos cargados desde estado del formulario:', vehiculosGuardados);
      // Tomar el primer vehículo si existe
      const primerVehiculo = vehiculosGuardados[0];
      this.cargarDatosEnFormulario(primerVehiculo);
    }
  }

  async cargarVehiculoExistente(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('🚗 Cargando datos de vehículo existentes...');
      
      // Obtener la cédula del usuario desde el servicio de sesión
      const cedula = this.usuarioSessionService.getCedulaUsuarioActual();
      if (!cedula) {
        console.log('⚠️ No hay cédula disponible para cargar vehículo');
        return;
      }

      // Obtener todos los datos del usuario incluyendo vehículos
      const datosCompletos = await this.formDataService.obtenerDatosCompletos(cedula.toString());
      
      if (datosCompletos && datosCompletos.vehiculos && datosCompletos.vehiculos.length > 0) {
        const vehiculos = datosCompletos.vehiculos;
        console.log('✅ Vehículos cargados desde datos completos:', vehiculos);
        
        // Convertir los vehículos al formato que espera el componente
        this.vehiculos = vehiculos.map((vehiculo: any) => ({
          tipo_vehiculo: vehiculo.tipoVehiculo || '',
          marca: vehiculo.marca || '',
          placa: vehiculo.placa || '',
          anio: vehiculo.anio || '',
          propietario: vehiculo.propietario || ''
        }));
        
        // Marcar como que tiene vehículos
        this.vehicleForm.patchValue({
          vehiculo: '2' // Sí tiene vehículos
        });
        
        this.notificationService.showSuccess(
          '✅ Datos cargados',
          `Se cargaron ${this.vehiculos.length} vehículos existentes`
        );
      } else {
        console.log('ℹ️ No se encontraron vehículos en los datos completos');
        // Marcar como que no tiene vehículos
        this.vehicleForm.patchValue({
          vehiculo: '1' // No tiene vehículos
        });
      }
      
    } catch (error) {
      console.error('❌ Error al cargar datos de vehículo:', error);
      this.notificationService.showWarning(
        '⚠️ Error al cargar datos',
        'No se pudieron cargar los datos de vehículo'
      );
    } finally {
      this.isLoading = false;
    }
  }

  cargarDatosEnFormulario(vehiculo: any): void {
    // Cargar datos en el formulario
    this.vehicleForm.patchValue({
      vehiculo: vehiculo.tieneVehiculo || '',
      tipo_vehiculo: vehiculo.tipoVehiculo || '',
      marca: vehiculo.marca || '',
      modelo: vehiculo.modelo || '',
      año: vehiculo.anio || '',
      placa: vehiculo.placa || '',
      valor_comercial: vehiculo.valorComercial || '',
      deudas_vehiculo: vehiculo.tieneDeudas || '',
      entidad_financiera: vehiculo.entidadFinanciera || '',
      cuota_mensual: vehiculo.cuotaMensual || '',
      prop_vehiculo: vehiculo.propietario || '' // Mapeo del propietario
    });

    // Habilitar campos según las respuestas
    if (vehiculo.tieneVehiculo === 'Sí') {
      this.toggleVehicleFields('Sí');
    }
    
    if (vehiculo.tieneDeudas === 'Sí') {
      this.toggleDebtFields('Sí');
    }
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear + 2; year >= 1960; year--) {
      this.years.push(year);
    }
  }

  toggleVehicleFields(value: string): void {
    const fields = ['tipo_vehiculo', 'marca', 'modelo', 'año', 'placa', 'valor_comercial', 'deudas_vehiculo', 'prop_vehiculo'];
    
    if (value === '2') { // Sí tiene vehículo
      fields.forEach(field => {
        this.vehicleForm.get(field)?.enable();
      });
    } else {
      fields.forEach(field => {
        this.vehicleForm.get(field)?.disable();
        this.vehicleForm.get(field)?.setValue('');
      });
    }
  }

  toggleDebtFields(value: string): void {
    const debtFields = ['entidad_financiera', 'cuota_mensual'];
    
    if (value === 'Sí') {
      debtFields.forEach(field => {
        this.vehicleForm.get(field)?.enable();
      });
    } else {
      debtFields.forEach(field => {
        this.vehicleForm.get(field)?.disable();
        this.vehicleForm.get(field)?.setValue('');
      });
    }
  }

  canAddVehicle(): boolean {
    const requiredFields = ['tipo_vehiculo', 'marca', 'año', 'placa', 'prop_vehiculo'];
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
      modelo: this.vehicleForm.get('modelo')?.value,
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
    ['tipo_vehiculo', 'marca', 'modelo', 'placa', 'año', 'valor_comercial', 'deudas_vehiculo', 'entidad_financiera', 'cuota_mensual'].forEach(field => {
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
    const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
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
