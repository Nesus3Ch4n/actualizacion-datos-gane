import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { ContactoEmergenciaService } from '../../../services/contacto-emergencia.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent implements OnInit {
  contactoEmergenciaForm!: FormGroup;
  contactos: Array<{ 
    nombre: string, 
    parentesco: string, 
    telefono: string,
    email?: string,
    direccion?: string,
    observaciones?: string
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
    private usuarioSessionService: UsuarioSessionService
  ) {}

  ngOnInit(): void {
    this.contactoEmergenciaForm = this.fb.group({
      nombre_dtcontacto: ['', Validators.required],
      parentesco_dtcontacto: ['', Validators.required],
      telefono_dtcontacto: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]]
    });

    // Cargar datos guardados si existen
    this.loadFormState();
    this.loadExistingContacts();
  }

  async loadExistingContacts(): Promise<void> {
    try {
      const idUsuario = this.usuarioSessionService.getIdUsuarioActual();
      if (idUsuario) {
        console.log('📋 Cargando contactos de emergencia existentes para usuario ID:', idUsuario);
        const contactosExistentes = await this.contactoEmergenciaService.obtenerContactosPorUsuario(idUsuario);
        
        if (contactosExistentes && contactosExistentes.length > 0) {
          this.contactos = contactosExistentes;
          console.log('✅ Contactos de emergencia cargados desde BD:', this.contactos);
          this.notificationService.showInfo(
            '📋 Contactos cargados',
            `Se cargaron ${this.contactos.length} contacto(s) de emergencia existente(s)`
          );
        }
      }
    } catch (error) {
      console.error('Error al cargar contactos existentes:', error);
      // No mostrar error si no hay contactos (es normal)
    }
  }

  loadFormState(): void {
    // Componente simplificado - no cargar datos de contactos ya que el proyecto 
    // se enfoca solo en información personal
    console.log('ℹ️ Componente de contacto disponible pero no utilizado en el flujo simplificado');
  }

  canAddContact(): boolean {
    const requiredFields = ['nombre_dtcontacto', 'parentesco_dtcontacto', 'telefono_dtcontacto'];
    return requiredFields.every(field => {
      const control = this.contactoEmergenciaForm.get(field);
      return control && control.value && control.value.toString().trim() !== '';
    });
  }
  
  agregarContacto(): void {
    if (!this.canAddContact()) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.contactoEmergenciaForm.controls).forEach(key => {
        this.contactoEmergenciaForm.get(key)?.markAsTouched();
      });
      
      this.notificationService.showWarning(
        '⚠️ Campos incompletos',
        'Por favor, completa todos los campos de contacto'
      );
      return;
    }

    try {
      const nuevoContacto = {
        nombre: this.contactoEmergenciaForm.get('nombre_dtcontacto')?.value,
        parentesco: this.contactoEmergenciaForm.get('parentesco_dtcontacto')?.value,
        telefono: this.contactoEmergenciaForm.get('telefono_dtcontacto')?.value
      };

      // En el flujo simplificado, solo guardamos localmente
      this.contactos.push(nuevoContacto);

      this.notificationService.showSuccess(
        '✅ Contacto agregado',
        `Se agregó ${nuevoContacto.nombre} ${nuevoContacto.parentesco}`
      );

      // Limpiar el formulario
      this.contactoEmergenciaForm.reset();
      
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
      
      // Guardar contactos de emergencia en el backend usando el servicio
      const resultado = await this.contactoEmergenciaService.guardarContactosEmergencia(idUsuario, this.contactos);
      
      console.log('✅ Contactos de emergencia guardados en BD:', resultado);
      
      // Verificar que se guardaron correctamente
      if (resultado && resultado.success) {
        this.notificationService.showSuccess(
          '✅ Contactos de emergencia guardados',
          `Se registraron ${this.contactos.length} contactos de emergencia en la base de datos`
        );
        
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
