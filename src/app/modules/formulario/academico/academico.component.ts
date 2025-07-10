import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormStateService } from '../../../services/form-state.service';
import { NotificationService } from '../../../services/notification.service';
import { FormNavigationService } from '../../../services/form-navigation.service';
import { EstudioAcademicoService } from '../../../services/estudio-academico.service';
import { UsuarioSessionService } from '../../../services/usuario-session.service';
import { BackendService } from '../../../services/backend.service';
import { AuthService } from '../../../services/auth.service';
import { FormDataService } from '../../../services/form-data.service';
import { AutoSaveService } from '../../../services/auto-save.service';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-academico',
  templateUrl: './academico.component.html',
  styleUrls: ['./academico.component.scss']
})
export class AcademicoComponent implements OnInit {
  academicoForm!: FormGroup;
  estudios: Array<any> = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder, 
    private formNavigationService: FormNavigationService,
    private formStateService: FormStateService,
    private notificationService: NotificationService,
    private estudioAcademicoService: EstudioAcademicoService,
    private usuarioSessionService: UsuarioSessionService,
    private backendService: BackendService,
    private authService: AuthService,
    private formDataService: FormDataService,
    private autoSaveService: AutoSaveService
  ) {
    this.generateYears();
  }

  generateYears(): void {
    // Este método no es necesario para el componente académico
    // Se puede eliminar la llamada en el constructor
  }

  ngOnInit(): void {
    this.academicoForm = this.fb.group({
      academico: ['', Validators.required],
      nivel_academico: [{ value: '', disabled: true }],
      programa_academico: [{ value: '', disabled: true }],
      institucion_educativa: [{ value: '', disabled: true }],
      semestre_actual: [{ value: '', disabled: true }],
      graduado: [{ value: '', disabled: true }],
      fecha_grado: [{ value: '', disabled: true }]
    });

    // Establecer el paso actual en el servicio de auto-guardado
    this.autoSaveService.setCurrentStep('academico');

    this.academicoForm.get('academico')?.valueChanges.subscribe(value => {
      this.toggleAcademicoFields(value);
      this.saveFormState();
    });

    this.academicoForm.get('graduado')?.valueChanges.subscribe(value => {
      this.toggleGraduationField(value);
    });

    this.loadFormState();
    this.loadExistingStudies();
  }

  async loadExistingStudies(): Promise<void> {
    try {
      // Obtener la cédula del usuario actual
      const usuarioActual = this.usuarioSessionService.getUsuarioActual();
      const cedula = usuarioActual?.cedula || usuarioActual?.documento;
      
      if (!cedula) {
        // Intentar obtener la cédula desde sessionStorage como fallback
        const cedulaSession = sessionStorage.getItem('cedula');
        
        if (cedulaSession) {
          console.log('⚠️ Usando cédula de sessionStorage como fallback:', cedulaSession);
          // Intentar cargar datos usando la cédula de sessionStorage
          await this.cargarEstudiosExistentes();
          return;
        } else {
          throw new Error('No hay usuario activo. Complete primero la información personal.');
        }
      }
      
      console.log('📋 Cargando estudios académicos existentes para cédula:', cedula);
      
      // Usar el método que carga desde datos completos
      await this.cargarEstudiosExistentes();
      
    } catch (error) {
      console.error('Error al cargar estudios existentes:', error);
      // No mostrar error si no hay estudios (es normal)
    }
  }

  saveFormState(): void {
    // Guardar el estado del formulario en el servicio de estado
    if (this.academicoForm.value && Object.keys(this.academicoForm.value).length > 0) {
      this.formStateService.setEstudiosAcademicos(this.estudios);
    }
  }

  loadFormState(): void {
    // Cargar datos del estado del formulario si existen
    const estudiosGuardados = this.formStateService.getEstudiosAcademicos();
    if (estudiosGuardados && estudiosGuardados.length > 0) {
      console.log('📋 Estudios académicos cargados desde estado del formulario:', estudiosGuardados);
      this.estudios = estudiosGuardados;
    }
  }

  async cargarEstudiosExistentes(): Promise<void> {
    try {
      this.isLoading = true;
      console.log('🎓 Cargando datos académicos existentes...');
      
      // Obtener la cédula del usuario desde el servicio de sesión
      const usuarioActual = this.usuarioSessionService.getUsuarioActual();
      const cedula = usuarioActual?.cedula || usuarioActual?.documento || sessionStorage.getItem('cedula');
      
      if (!cedula) {
        console.log('⚠️ No hay cédula disponible para cargar estudios académicos');
        return;
      }

      console.log('📋 Cargando estudios para cédula:', cedula);

      // Obtener todos los datos del usuario incluyendo estudios académicos
      const datosCompletos = await this.formDataService.obtenerDatosCompletos(cedula.toString());
      
      if (datosCompletos && datosCompletos.estudios && datosCompletos.estudios.length > 0) {
        const estudios = datosCompletos.estudios;
        console.log('✅ Estudios académicos cargados desde datos completos:', estudios);
        
        // Convertir los estudios al formato que espera el template
        this.estudios = estudios.map((estudio: any) => ({
          programa: estudio.programa || estudio.tituloObtenido || estudio.titulo || '',
          nivelAcademico: estudio.nivelAcademico || estudio.tipoEducacion || estudio.nivelEducativo || estudio.nivel_academico || '',
          institucion: estudio.institucion || estudio.nombreInstitucion || estudio.institucion_educativa || '',
          semestre: estudio.semestre || estudio.semestreActual || '',
          graduacion: estudio.graduacion || estudio.fechaFin || estudio.fechaFinalizacion || estudio.fecha_grado || estudio.anioGraduacion || '',
          ciudad: estudio.ciudad || '',
          graduado: estudio.activo === false || estudio.graduado || false,
          enCurso: estudio.activo === true || estudio.enCurso || false
        }));
        
        // Marcar el formulario como que tiene estudios
        this.academicoForm.get('academico')?.setValue('2');
        this.toggleAcademicoFields('2');
        
        this.notificationService.showSuccess(
          '✅ Datos cargados',
          `Se cargaron ${this.estudios.length} estudios académicos`
        );
      } else {
        console.log('ℹ️ No se encontraron estudios académicos en los datos completos');
        // Marcar el formulario como que no tiene estudios
        this.academicoForm.get('academico')?.setValue('1');
        this.toggleAcademicoFields('1');
      }
      
    } catch (error) {
      console.error('❌ Error al cargar estudios académicos:', error);
      this.notificationService.showWarning(
        '⚠️ Error al cargar datos',
        'No se pudieron cargar los estudios académicos'
      );
    } finally {
      this.isLoading = false;
    }
  }

  toggleAcademicoFields(value: string): void {
    const fields = ['nivel_academico', 'programa_academico', 'institucion_educativa', 'semestre_actual', 'graduado', 'fecha_grado'];

    if (value === '2') { // Sí tiene estudios
      const requiredFields = ['nivel_academico', 'programa_academico', 'institucion_educativa', 'semestre_actual'];
      
      fields.forEach(field => {
        this.academicoForm.get(field)?.enable();
        if (requiredFields.includes(field)) {
          this.academicoForm.get(field)?.setValidators(Validators.required);
        }
        this.academicoForm.get(field)?.updateValueAndValidity();
      });
    } else { // No tiene estudios
      fields.forEach(field => {
        this.academicoForm.get(field)?.disable();
        this.academicoForm.get(field)?.clearValidators();
        this.academicoForm.get(field)?.setValue("");
        this.academicoForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  toggleGraduationField(value: string): void {
    const fechaControl = this.academicoForm.get('fecha_grado');

    if (value === 'true') { // Si está graduado
      fechaControl?.enable();
      fechaControl?.setValidators(Validators.required);
    } else { // Si no está graduado o en curso
      fechaControl?.disable();
      fechaControl?.clearValidators();
      fechaControl?.setValue('');
    }
    fechaControl?.updateValueAndValidity();
  }

  canAddStudy(): boolean {
    if (this.academicoForm.get('academico')?.value !== '2') {
      return false;
    }

    const requiredFields = ['nivel_academico', 'programa_academico', 'institucion_educativa', 'semestre_actual'];
    return requiredFields.every(field => {
      const control = this.academicoForm.get(field);
      return control && control.value && control.value.toString().trim() !== '';
    });
  }

  agregarEstudio(): void {
    if (!this.canAddStudy()) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.academicoForm.controls).forEach(key => {
        if (key !== 'academico') {
          this.academicoForm.get(key)?.markAsTouched();
        }
      });
      
      this.notificationService.showWarning(
        '⚠️ Campos incompletos',
        'Por favor, completa todos los campos del estudio'
      );
      return;
    }

    const semestreValue = this.academicoForm.get('semestre_actual')?.value;
    let semestre = null;
    
    if (semestreValue) {
      if (semestreValue === 'Graduado') {
        semestre = 'Graduado';
      } else {
        // Intentar convertir a número para validar que sea un semestre válido
        const semestreNum = parseInt(semestreValue);
        if (!isNaN(semestreNum)) {
          semestre = semestreNum; // Guardar como número para el backend
        }
      }
    }

    const nuevoEstudio = {
      nivelEducativo: this.academicoForm.get('nivel_academico')?.value,
      titulo: this.academicoForm.get('programa_academico')?.value,
      institucion: this.academicoForm.get('institucion_educativa')?.value,
      semestre: semestre,
      modalidad: 'Presencial', // Por defecto
      fechaInicio: new Date().toISOString().split('T')[0], // Fecha actual
      fechaFinalizacion: this.academicoForm.get('fecha_grado')?.value || null,
      graduado: semestreValue === 'Graduado' || this.academicoForm.get('graduado')?.value === 'true',
      enCurso: semestreValue !== 'Graduado' && this.academicoForm.get('graduado')?.value === 'false',
      observaciones: `Semestre actual: ${semestreValue}`
    };

    // Agregar a la lista local
    this.estudios.push(nuevoEstudio);

    // Guardar en el servicio de estado
    this.saveFormState();

    // Limpiar solo los campos del formulario
    ['nivel_academico', 'programa_academico', 'institucion_educativa', 'semestre_actual', 'graduado', 'fecha_grado'].forEach(field => {
      this.academicoForm.get(field)?.setValue('');
      this.academicoForm.get(field)?.markAsUntouched();
    });

    this.notificationService.showSuccess(
      '✅ Estudio agregado',
      `Se agregó ${nuevoEstudio.titulo} en ${nuevoEstudio.institucion}`
    );
  }

  eliminarEstudio(index: number): void {
    const estudio = this.estudios[index];
    
    // Eliminar de la lista local
    this.estudios.splice(index, 1);
    
    // Actualizar el servicio de estado
    this.saveFormState();
    
    this.notificationService.showInfo(
      'ℹ️ Estudio eliminado',
      `Se eliminó ${estudio.titulo} de la lista`
    );
  }

  previous() {
    this.saveFormState();
    this.formNavigationService.previous();
  }

  async validateAndNext(): Promise<void> {
    // Validar que se haya respondido la pregunta principal
    if (!this.academicoForm.get('academico')?.value) {
      this.academicoForm.get('academico')?.markAsTouched();
      
      this.notificationService.showWarning(
        '⚠️ Respuesta requerida',
        'Por favor, indica si tienes estudios académicos'
      );
      return;
    }

    try {
      this.isLoading = true;

      // Preparar datos para el auto-guardado
      const academicData = {
        tieneEstudios: this.academicoForm.get('academico')?.value === '2',
        estudios: this.estudios.map(estudio => ({
          nivelEducativo: estudio.nivelEducativo,
          titulo: estudio.titulo,
          institucion: estudio.institucion,
          semestre: estudio.semestre,
          graduado: estudio.graduado,
          enCurso: estudio.enCurso
        }))
      };

      // Usar el servicio de auto-guardado para guardar con detección de cambios
      const success = await this.autoSaveService.saveStepData('academico', academicData);
      
      if (success) {
        this.notificationService.showSuccess(
          '✅ Éxito', 
          'Información académica guardada exitosamente'
        );
        
        // Guardar en el estado del formulario
        this.formStateService.setEstudiosAcademicos(this.estudios);
        
        // Continuar al siguiente paso
        this.formNavigationService.next();
      } else {
        throw new Error('No se pudo guardar la información académica');
      }

    } catch (error) {
      console.error('Error al validar estudios:', error);
      this.notificationService.showError(
        '❌ Error',
        'No se pudieron guardar los estudios académicos: ' + (error as Error).message
      );
    } finally {
      this.isLoading = false;
    }
  }
}