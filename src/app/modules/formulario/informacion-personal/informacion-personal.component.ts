import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { InformacionPersonalService } from '../../../services/informacion-personal.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { UserSessionService } from '../../../services/user-session.service';

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
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private formNavigationService: FormNavigationService,
    private informacionPersonalService: InformacionPersonalService,
    private usuarioSessionService: UsuarioSessionService,
    private userSessionService: UserSessionService
  ) {}

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

    // Cargar datos guardados si existen
    this.loadFormState();

    // Guardar automáticamente en memoria cuando cambien los valores
    this.myForm.valueChanges.subscribe(() => {
      this.saveFormState();
    });
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
        
        // Guardar en base de datos y obtener el usuario creado/actualizado
        const usuarioGuardado = await this.informacionPersonalService.guardarInformacionPersonal(mappedData);
        
        // Verificar que el ID existe
        if (!usuarioGuardado || !usuarioGuardado.id) {
          throw new Error('El backend no retornó el ID del usuario correctamente. Respuesta: ' + JSON.stringify(usuarioGuardado));
        }
        
        console.log('✅ Usuario guardado con ID:', usuarioGuardado.id);
        
        // Guardar en el estado del formulario (usar los datos mapeados)
        this.formStateService.setInformacionPersonal(mappedData);
        
        // Establecer el ID del usuario en ambos servicios para compatibilidad
        this.userSessionService.setCurrentUserId(usuarioGuardado.id);
        
        // IMPORTANTE: También establecer el usuario completo en UsuarioSessionService
        // para que funcione con otros componentes que lo usan
        this.usuarioSessionService.setUsuarioActual(usuarioGuardado);
        
        // Verificar que la sesión se estableció correctamente
        const idVerificacion = this.usuarioSessionService.getIdUsuarioActual();
        
        if (!idVerificacion) {
          throw new Error('Error: No se pudo establecer la sesión del usuario correctamente');
        }
        
        this.notificationService.showSuccess(
          '✅ Éxito', 
          `Información personal guardada exitosamente. Usuario ID: ${usuarioGuardado.id}`
        );
        
        // Navegar al siguiente paso
        this.formNavigationService.next();
        
      } catch (error) {
        console.error('❌ Error en validateAndNext:', error);
        this.notificationService.showError(
          '❌ Error', 
          'Error al guardar la información: ' + (error as Error).message
        );
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
