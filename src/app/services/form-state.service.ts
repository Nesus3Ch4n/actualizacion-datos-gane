import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FormularioCompleto {
  informacionPersonal: any;
  estudiosAcademicos: any[];
  vehiculos: any[];
  vivienda: any;
  personasACargo: any[];
  contactosEmergencia: any[];
  declaraciones: any[];
}

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private formularioCompleto: FormularioCompleto = {
    informacionPersonal: {},
    estudiosAcademicos: [],
    vehiculos: [],
    vivienda: {},
    personasACargo: [],
    contactosEmergencia: [],
    declaraciones: []
  };

  // Observable para cambios en el formulario
  private formularioCompleto$ = new BehaviorSubject<FormularioCompleto>(this.formularioCompleto);

  // Métodos para Información Personal
  setInformacionPersonal(data: any): void {
    this.formularioCompleto.informacionPersonal = { ...data };
    this.notifyChange();
  }

  getInformacionPersonal(): any {
    return this.formularioCompleto.informacionPersonal;
  }

  // Métodos para Estudios Académicos
  setEstudiosAcademicos(estudios: any[]): void {
    this.formularioCompleto.estudiosAcademicos = [...estudios];
    this.notifyChange();
  }

  getEstudiosAcademicos(): any[] {
    return [...this.formularioCompleto.estudiosAcademicos];
  }

  // Métodos para Vehículos
  setVehiculos(vehiculos: any[]): void {
    this.formularioCompleto.vehiculos = [...vehiculos];
    this.notifyChange();
  }

  getVehiculos(): any[] {
    return [...this.formularioCompleto.vehiculos];
  }

  // Métodos para Vivienda
  setVivienda(vivienda: any): void {
    this.formularioCompleto.vivienda = { ...vivienda };
    this.notifyChange();
  }

  getVivienda(): any {
    return { ...this.formularioCompleto.vivienda };
  }

  // Métodos para Personas a Cargo
  setPersonasACargo(personas: any[]): void {
    this.formularioCompleto.personasACargo = [...personas];
    this.notifyChange();
  }

  getPersonasACargo(): any[] {
    return [...this.formularioCompleto.personasACargo];
  }

  // Métodos para Contactos de Emergencia
  setContactosEmergencia(contactos: any[]): void {
    this.formularioCompleto.contactosEmergencia = [...contactos];
    this.notifyChange();
  }

  getContactosEmergencia(): any[] {
    return [...this.formularioCompleto.contactosEmergencia];
  }

  // Métodos para Declaraciones de Conflicto
  setDeclaraciones(declaraciones: any[]): void {
    this.formularioCompleto.declaraciones = [...declaraciones];
    this.notifyChange();
  }

  getDeclaraciones(): any[] {
    return [...this.formularioCompleto.declaraciones];
  }

  // Obtener todo el formulario
  getFormularioCompleto(): FormularioCompleto {
    return { ...this.formularioCompleto };
  }

  // Observable para suscribirse a cambios
  getFormularioCompleto$() {
    return this.formularioCompleto$.asObservable();
  }

  // Limpiar todo el formulario
  limpiarFormulario(): void {
    this.formularioCompleto = {
      informacionPersonal: {},
      estudiosAcademicos: [],
      vehiculos: [],
      vivienda: {},
      personasACargo: [],
      contactosEmergencia: [],
      declaraciones: []
    };
    this.notifyChange();
  }

  // Validar si el formulario está completo
  isFormularioCompleto(): boolean {
    const { informacionPersonal } = this.formularioCompleto;
    
    // Validación básica de información personal
    return !!(
      informacionPersonal && 
      Object.keys(informacionPersonal).length > 0 &&
      informacionPersonal.nombre &&
      informacionPersonal.cedula &&
      informacionPersonal.correo
    );
  }

  // Obtener resumen del formulario
  getResumenFormulario(): any {
    return {
      informacionPersonal: !!this.formularioCompleto.informacionPersonal.nombre,
      estudiosAcademicos: this.formularioCompleto.estudiosAcademicos.length > 0,
      vehiculos: this.formularioCompleto.vehiculos.length > 0,
      vivienda: !!this.formularioCompleto.vivienda.tipoVivienda,
      personasACargo: this.formularioCompleto.personasACargo.length > 0,
      contactosEmergencia: this.formularioCompleto.contactosEmergencia.length > 0,
      declaraciones: this.formularioCompleto.declaraciones.length > 0
    };
  }

  // Notificar cambios
  private notifyChange(): void {
    this.formularioCompleto$.next({ ...this.formularioCompleto });
  }
}
