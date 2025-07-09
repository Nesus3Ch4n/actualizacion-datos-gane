import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { BackendService } from '../../../services/backend.service';
import { AuthService } from '../../../services/auth.service';
import { FormDataService } from '../../../services/form-data.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { InformacionPersonalService } from '../../../services/informacion-personal.service';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss']
})
export class InformacionPersonalComponent implements OnInit {
  myForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private formNavigationService: FormNavigationService,
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private informacionPersonalService: InformacionPersonalService,
    private usuarioSessionService: UsuarioSessionService,
    private backendService: BackendService,
    private authService: AuthService,
    private formDataService: FormDataService
  ) {
    this.generateYears();
  }

  generateYears(): void {
    // Este método no es necesario para el componente de información personal
    // Se puede eliminar la llamada en el constructor
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      documento: ['', Validators.required],
      cedula_expedida: ['', Validators.required],
      nombre_intg: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      pais_nacimiento: ['', Validators.required],
      ciudad_nacimiento: ['', Validators.required],
      cargo: ['', Validators.required],
      area: ['', Validators.required],
      estadocivil: ['', Validators.required],
      tipo_sangre: ['', Validators.required],
      num_celular: ['', Validators.required],
      num_fijo: [''],
      num_corporativo: [''],
      correo_personal: ['', [Validators.required, Validators.email]]
    });

    // Cargar datos existentes de la base de datos
    this.loadExistingData();

    // Cargar datos guardados si existen
    this.loadFormState();

    // Guardar automáticamente en memoria cuando cambien los valores
    this.myForm.valueChanges.subscribe(() => {
      this.saveFormState();
    });
  }

  /**
   * Cargar datos existentes de la base de datos
   */
  async loadExistingData(): Promise<void> {
    try {
      // Obtener cédula del sessionStorage
      const cedula = sessionStorage.getItem('cedula');
      if (!cedula) {
        console.log('ℹ️ No hay cédula en sesión, no se cargarán datos existentes');
        return;
      }

      console.log('📋 Cargando información personal existente para cédula:', cedula);
      
      // Obtener información personal de la base de datos
      const informacionExistente = await this.formDataService.obtenerDatosCompletos(cedula);
      
      if (informacionExistente) {
        console.log('✅ Información personal encontrada:', informacionExistente);
        
        // Mapear datos de la base de datos al formulario (los datos vienen directamente en el objeto raíz)
        this.myForm.patchValue({
          documento: informacionExistente.documento || informacionExistente.cedula || '',
          cedula_expedida: informacionExistente.cedulaExpedicion || '',
          nombre_intg: informacionExistente.nombre || '',
          fecha_nacimiento: informacionExistente.fechaNacimiento || '',
          pais_nacimiento: informacionExistente.paisNacimiento || '',
          ciudad_nacimiento: informacionExistente.ciudadNacimiento || '',
          cargo: informacionExistente.cargo || '',
          area: informacionExistente.area || '',
          estadocivil: informacionExistente.estadoCivil || '',
          tipo_sangre: informacionExistente.tipoSangre || '',
          num_celular: informacionExistente.numeroCelular || '',
          num_fijo: informacionExistente.numeroFijo || '',
          num_corporativo: informacionExistente.numeroCorp || '',
          correo_personal: informacionExistente.correo || ''
        });

        // Guardar en el estado del formulario
        const mappedData = {
          cedula: informacionExistente.documento || informacionExistente.cedula,
          cedulaExpedicion: informacionExistente.cedulaExpedicion,
          nombre: informacionExistente.nombre,
          fechaNacimiento: informacionExistente.fechaNacimiento,
          paisNacimiento: informacionExistente.paisNacimiento,
          ciudadNacimiento: informacionExistente.ciudadNacimiento,
          cargo: informacionExistente.cargo,
          area: informacionExistente.area,
          estadoCivil: informacionExistente.estadoCivil,
          tipoSangre: informacionExistente.tipoSangre,
          numeroCelular: informacionExistente.numeroCelular,
          numeroFijo: informacionExistente.numeroFijo,
          numeroCorp: informacionExistente.numeroCorp,
          correo: informacionExistente.correo
        };

        this.formStateService.setInformacionPersonal(mappedData);
        
        // Establecer el usuario en el servicio de sesión
        if (informacionExistente.idUsuario) {
          this.usuarioSessionService.setUsuarioActual(informacionExistente);
        }

        this.notificationService.showInfo(
          'ℹ️ Datos Cargados', 
          'Se han cargado los datos existentes de la base de datos'
        );
      } else {
        console.log('ℹ️ No se encontró información personal para la cédula, permitiendo crear nuevo registro');
        // Pre-llenar la cédula desde el token
        this.myForm.patchValue({
          documento: cedula
        });
        
        this.notificationService.showInfo(
          'ℹ️ Nuevo Usuario', 
          'No se encontraron datos existentes. Puede crear un nuevo registro.'
        );
      }
    } catch (error: any) {
      console.error('❌ Error cargando datos existentes:', error);
      
      // Pre-llenar la cédula desde el token sin importar el error
      const cedula = sessionStorage.getItem('cedula');
      if (cedula) {
        this.myForm.patchValue({
          documento: cedula
        });
        
        // Mostrar mensaje apropiado según el tipo de error
        if (error.status === 0) {
          this.notificationService.showWarning(
            '⚠️ Backend No Disponible', 
            'El servidor no está disponible. Puede completar el formulario y guardar cuando el servidor esté activo.'
          );
        } else {
          this.notificationService.showInfo(
            'ℹ️ Nuevo Usuario', 
            'No se encontraron datos existentes. Puede crear un nuevo registro.'
          );
        }
      }
    }
  }

  saveFormState(): void {
    if (this.myForm.value && Object.keys(this.myForm.value).length > 0) {
      // Mapear campos del formulario a formato esperado
      const mappedData = {
        cedula: this.myForm.get('documento')?.value,
        cedulaExpedicion: this.myForm.get('cedula_expedida')?.value,
        nombre: this.myForm.get('nombre_intg')?.value,
        fechaNacimiento: this.myForm.get('fecha_nacimiento')?.value,
        paisNacimiento: this.myForm.get('pais_nacimiento')?.value,
        ciudadNacimiento: this.myForm.get('ciudad_nacimiento')?.value,
        cargo: this.myForm.get('cargo')?.value,
        area: this.myForm.get('area')?.value,
        estadoCivil: this.myForm.get('estadocivil')?.value,
        tipoSangre: this.myForm.get('tipo_sangre')?.value,
        numeroCelular: this.myForm.get('num_celular')?.value,
        numeroFijo: this.myForm.get('num_fijo')?.value,
        numeroCorp: this.myForm.get('num_corporativo')?.value,
        correo: this.myForm.get('correo_personal')?.value
      };

      // Guardar en memoria (FormStateService)
      this.formStateService.setInformacionPersonal(mappedData);
    }
  }

  loadFormState(): void {
    const savedData = this.formStateService.getInformacionPersonal();
    if (savedData && Object.keys(savedData).length > 0) {
      // Mapear datos guardados de vuelta al formulario
      this.myForm.patchValue({
        documento: savedData.cedula || '',
        cedula_expedida: savedData.cedulaExpedicion || '',
        nombre_intg: savedData.nombre || '',
        fecha_nacimiento: savedData.fechaNacimiento || '',
        pais_nacimiento: savedData.paisNacimiento || '',
        ciudad_nacimiento: savedData.ciudadNacimiento || '',
        cargo: savedData.cargo || '',
        area: savedData.area || '',
        estadocivil: savedData.estadoCivil || '',
        tipo_sangre: savedData.tipoSangre || '',
        num_celular: savedData.numeroCelular || '',
        num_fijo: savedData.numeroFijo || '',
        num_corporativo: savedData.numeroCorp || '',
        correo_personal: savedData.correo || ''
      });
    }
  }

  previous() {
    this.saveFormState();
    this.formNavigationService.previous();
  }

  async validateAndNext(): Promise<void> {
    if (this.myForm.valid) {
      this.isLoading = true;
      
      try {
        console.log('📋 Validando y guardando información personal...');
        
        // Preparar datos del formulario - MAPEAR CORRECTAMENTE
        const formData = this.myForm.value;
        
        // Mapear campos del formulario al formato esperado por el servicio
        const mappedData = {
          cedula: formData.documento,
          cedulaExpedicion: formData.cedula_expedida,
          nombre: formData.nombre_intg,
          fechaNacimiento: formData.fecha_nacimiento,
          paisNacimiento: formData.pais_nacimiento,
          ciudadNacimiento: formData.ciudad_nacimiento,
          cargo: formData.cargo,
          area: formData.area,
          estadoCivil: formData.estadocivil,
          tipoSangre: formData.tipo_sangre,
          numeroCelular: formData.num_celular,
          numeroFijo: formData.num_fijo,
          numeroCorp: formData.num_corporativo,
          correo: formData.correo_personal
        };
        
        // Verificar si el backend está disponible antes de intentar guardar
        const backendDisponible = await this.formDataService.verificarConexionBackend();
        
        if (backendDisponible) {
          // Obtener ID del usuario del sessionStorage
          const idUsuario = sessionStorage.getItem('id_usuario');
          const idUsuarioNum = idUsuario ? parseInt(idUsuario) : 1;
          
          // Guardar en base de datos y obtener el usuario creado/actualizado
          const usuarioId = await this.formDataService.guardarInformacionPersonal(mappedData);
          
          // Verificar que el ID existe
          if (!usuarioId) {
            throw new Error('El backend no retornó el ID del usuario correctamente.');
          }
          
          console.log('✅ Usuario guardado con ID:', usuarioId);
          
          // Establecer el ID del usuario en el servicio de sesión
          // IMPORTANTE: También establecer el usuario completo en UsuarioSessionService
          // para que funcione con otros componentes que lo usan
          const usuarioCompleto = { ...mappedData, idUsuario: parseInt(usuarioId) };
          this.usuarioSessionService.setUsuarioActual(usuarioCompleto);
          
          // Verificar que la sesión se estableció correctamente
          const idVerificacion = this.usuarioSessionService.getIdUsuarioActual();
          
          if (!idVerificacion) {
            throw new Error('Error: No se pudo establecer la sesión del usuario correctamente');
          }
          
          this.notificationService.showSuccess(
            '✅ Éxito', 
            `Información personal guardada exitosamente. Usuario ID: ${usuarioId}`
          );
        } else {
          // Backend no disponible, solo guardar en memoria
          console.log('⚠️ Backend no disponible, guardando solo en memoria');
          
          this.notificationService.showWarning(
            '⚠️ Modo Sin Conexión', 
            'El servidor no está disponible. Los datos se guardarán en memoria y se sincronizarán cuando el servidor esté activo.'
          );
        }
        
        // Guardar en el estado del formulario (usar los datos mapeados)
        this.formStateService.setInformacionPersonal(mappedData);
        
        // Navegar al siguiente paso
        this.formNavigationService.next();
        
      } catch (error: any) {
        console.error('❌ Error en validateAndNext:', error);
        
        // Si es error de conexión, permitir continuar
        if (error.status === 0 || error.message?.includes('conexión') || error.message?.includes('servidor')) {
          this.notificationService.showWarning(
            '⚠️ Sin Conexión', 
            'No se pudo conectar al servidor. Los datos se guardarán en memoria y podrá continuar con el formulario.'
          );
          
          // Guardar en memoria y continuar
          const formData = this.myForm.value;
          const mappedData = {
            cedula: formData.documento,
            cedulaExpedicion: formData.cedula_expedida,
            nombre: formData.nombre_intg,
            fechaNacimiento: formData.fecha_nacimiento,
            paisNacimiento: formData.pais_nacimiento,
            ciudadNacimiento: formData.ciudad_nacimiento,
            cargo: formData.cargo,
            area: formData.area,
            estadoCivil: formData.estadocivil,
            tipoSangre: formData.tipo_sangre,
            numeroCelular: formData.num_celular,
            numeroFijo: formData.num_fijo,
            numeroCorp: formData.num_corporativo,
            correo: formData.correo_personal
          };
          
          this.formStateService.setInformacionPersonal(mappedData);
          this.formNavigationService.next();
        } else {
          this.notificationService.showError(
            '❌ Error', 
            'Error al guardar la información: ' + (error as Error).message
          );
        }
      } finally {
        this.isLoading = false;
      }
    } else {
      this.notificationService.showWarning(
        '⚠️ Formulario Incompleto', 
        'Por favor complete todos los campos requeridos'
      );
      this.markFormGroupTouched(this.myForm);
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
}
