import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { ContactoEmergenciaService } from '../../../services/contacto-emergencia.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { firstValueFrom } from 'rxjs';
import { FormDataService } from '../../../services/form-data.service'; // Added import

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  emergencyContactForm!: FormGroup; // Changed variable name
  contactos: Array<{ 
    nombre: string, 
    parentesco: string, 
    telefono: string
  }> = [];
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
    'Otro - Conocido'
  ];

  constructor(
    private fb: FormBuilder, 
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private formNavigationService: FormNavigationService,
    private contactoEmergenciaService: ContactoEmergenciaService,
    private usuarioSessionService: UsuarioSessionService,
    private formDataService: FormDataService // Added injection
  ) {}

  ngOnInit(): void {
    this.emergencyContactForm = this.fb.group({
      nombre: ['', Validators.required],
      parentesco: ['', Validators.required],
      telefono: ['', Validators.required]
    });

    // Cargar datos guardados si existen
    this.loadFormState();
    
    // Cargar datos de contacto de emergencia automáticamente
    this.cargarContactoExistente();
  }

  loadFormState(): void {
    // Cargar datos del estado del formulario si existen
    const contactosGuardados = this.formStateService.getContactosEmergencia();
    if (contactosGuardados && contactosGuardados.length > 0) {
      console.log('📋 Contactos de emergencia cargados desde estado del formulario:', contactosGuardados);
      // Tomar el primer contacto si existe
      const primerContacto = contactosGuardados[0];
      this.cargarDatosEnFormulario(primerContacto);
    }
  }

  async cargarContactoExistente(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('📞 Cargando datos de contacto de emergencia existentes...');
      
      // Obtener el ID del usuario desde el servicio de sesión
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (!idUsuario) {
        console.log('⚠️ No hay ID de usuario disponible para cargar contacto de emergencia');
        return;
      }

      // Obtener todos los datos del usuario incluyendo contacto de emergencia
      const datosCompletos = await this.formDataService.obtenerDatosCompletosPorId(idUsuario);
      
      if (datosCompletos && datosCompletos.contactosEmergencia) {
        const contactos = datosCompletos.contactosEmergencia;
        console.log('✅ Contactos de emergencia cargados desde datos completos:', contactos);
        
        // Convertir los contactos al formato del componente
        this.contactos = contactos.map((contacto: any) => ({
          nombre: contacto.nombreCompleto || contacto.nombre || '',
          parentesco: contacto.parentesco || '',
          telefono: contacto.numeroCelular || contacto.telefono || ''
        }));
        
        this.notificationService.showSuccess(
          '✅ Datos cargados',
          `Se cargaron ${this.contactos.length} contactos de emergencia`
        );
      } else {
        console.log('ℹ️ No se encontraron datos de contacto de emergencia en los datos completos');
      }
      
    } catch (error) {
      console.error('❌ Error al cargar datos de contacto de emergencia:', error);
      this.notificationService.showWarning(
        '⚠️ Error al cargar datos',
        'No se pudieron cargar los datos de contacto de emergencia'
      );
    } finally {
      this.isLoading = false;
    }
  }

  cargarDatosEnFormulario(contacto: any): void {
    // Cargar datos en el formulario
    this.emergencyContactForm.patchValue({
      nombre: contacto.nombre || '',
      parentesco: contacto.parentesco || '',
      telefono: contacto.telefono || ''
    });
  }

  canAddContact(): boolean {
    const requiredFields = ['nombre', 'parentesco', 'telefono'];
    return requiredFields.every(field => {
      const control = this.emergencyContactForm.get(field);
      return control && control.value && control.value.toString().trim() !== '';
    });
  }
  
  agregarContacto(): void {
    if (!this.canAddContact()) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.emergencyContactForm.controls).forEach(key => { // Changed variable name
        this.emergencyContactForm.get(key)?.markAsTouched();
      });
      
      this.notificationService.showWarning(
        '⚠️ Campos incompletos',
        'Por favor, completa todos los campos de contacto'
      );
      return;
    }

    try {
      const nuevoContacto = {
        nombre: this.emergencyContactForm.get('nombre')?.value, // Changed variable name
        parentesco: this.emergencyContactForm.get('parentesco')?.value, // Changed variable name
        telefono: this.emergencyContactForm.get('telefono')?.value // Changed variable name
      };

      // En el flujo simplificado, solo guardamos localmente
      this.contactos.push(nuevoContacto);

      this.notificationService.showSuccess(
        '✅ Contacto agregado',
        `Se agregó ${nuevoContacto.nombre} ${nuevoContacto.parentesco}`
      );

      // Limpiar el formulario
      this.emergencyContactForm.reset(); // Changed variable name
      
    } catch (error) {
      console.error('Error al agregar contacto:', error);
      this.notificationService.showError(
        '❌ Error',
        'No se pudo agregar el contacto'
      );
    }
  }

  eliminarContacto(index: number): void {
    const contacto = this.contactos[index];
    
    // Eliminar de la lista local
    this.contactos.splice(index, 1);
    
    this.notificationService.showInfo(
      'ℹ️ Contacto eliminado',
      `Se eliminó ${contacto.nombre} ${contacto.parentesco}`
    );
  }

  previous() {
    this.formNavigationService.previous();
  }

  async validateAndNext(): Promise<void> {
    if (this.contactos.length < 2) {
      this.notificationService.showWarning(
        '⚠️ Contactos insuficientes',
        `Debes agregar al menos 2 contactos de emergencia. Actualmente tienes ${this.contactos.length}`
      );
      return;
    }

    this.isLoading = true;
    
    try {
      console.log('📋 Validando y guardando contactos de emergencia...');
      
      // Obtener ID del usuario actual
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (!idUsuario) {
        throw new Error('No hay usuario activo. Complete primero la información personal.');
      }

      console.log('👤 Usuario ID para guardar contactos:', idUsuario);
      
      // Verificar si ya existen contactos de emergencia para este usuario
      const contactosExistentes = await this.contactoEmergenciaService.obtenerContactosPorUsuario(idUsuario);
      const tieneContactosExistentes = contactosExistentes && contactosExistentes.length > 0;
      
      // Guardar contactos de emergencia en el backend usando el servicio
      const resultado = await this.contactoEmergenciaService.guardarContactosEmergencia(idUsuario, this.contactos);
      
      console.log('✅ Contactos de emergencia guardados en BD:', resultado);
      
      // Verificar que se guardaron correctamente
      if (resultado && resultado.success) {
        // Mostrar mensaje apropiado según si existían datos previos
        if (tieneContactosExistentes) {
          this.notificationService.showSuccess(
            '✅ Contactos de emergencia actualizados',
            `Se actualizaron ${this.contactos.length} contactos de emergencia en la base de datos`
          );
        } else {
        this.notificationService.showSuccess(
          '✅ Contactos de emergencia guardados',
          `Se registraron ${this.contactos.length} contactos de emergencia en la base de datos`
        );
        }
        
        // Continuar al siguiente paso
        this.formNavigationService.next();
      } else {
        throw new Error('El backend no confirmó el guardado de los contactos');
      }
      
    } catch (error) {
      console.error('❌ Error en validateAndNext:', error);
      
      let errorMessage = 'Error al guardar los contactos de emergencia';
      if (error instanceof Error) {
        errorMessage += ': ' + error.message;
      }
      
      this.notificationService.showError(
        '❌ Error', 
        errorMessage
      );
    } finally {
      this.isLoading = false;
    }
  }
}
