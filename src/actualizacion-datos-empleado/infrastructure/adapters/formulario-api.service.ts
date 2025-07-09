import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// DTOs que coinciden con el backend
export interface InformacionPersonalDTO {
  nombre: string;
  cedula: number;
  correo: string;
  numeroFijo?: number;
  numeroCelular?: number;
  numeroCorp?: number;
  cedulaExpedicion?: string;
  paisNacimiento?: string;
  ciudadNacimiento?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  tipoSangre?: string;
  cargo?: string;
  area?: string;
  version?: number;
}

export interface EstudioAcademicoDTO {
  id?: number;
  idUsuario?: number;
  tipoEducacion: string;
  nombreInstitucion: string;
  tituloObtenido: string;
  fechaInicio: string;
  fechaFin?: string;
  activo?: boolean;
}

export interface VehiculoDTO {
  id?: number;
  idUsuario?: number;
  tipoVehiculo: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  soatVigente: boolean;
  fechaVencimientoSoat?: string;
  tecnomecanicoVigente: boolean;
  fechaVencimientoTecnomecanico?: string;
  activo?: boolean;
}

export interface ViviendaDTO {
  id?: number;
  idUsuario?: number;
  tipoVivienda: string;
  tipoAdquisicion: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  departamento: string;
  valorVivienda?: number;
  valorArriendo?: number;
  personasVivenCasa: number;
  estrato: number;
  activo?: boolean;
}

export interface PersonaACargoDTO {
  id?: number;
  idUsuario?: number;
  nombreCompleto: string;
  relacion: string;
  fechaNacimiento: string;
  viveConEmpleado: boolean;
  beneficiario: boolean;
  activo?: boolean;
}

export interface ContactoEmergenciaDTO {
  id?: number;
  idUsuario?: number;
  nombreCompleto: string;
  relacion: string;
  telefonoFijo?: string;
  telefonoCelular: string;
  direccion: string;
  prioridad: number;
  activo?: boolean;
}

// Interfaces para respuestas del backend
export interface ApiResponse {
  mensaje: string;
  cedula: string;
  paso: string;
  cantidad?: string;
  timestamp: string;
}

export interface EstadoFormulario {
  cedula: number;
  informacionPersonal: boolean;
  estudios: boolean;
  vehiculos: boolean;
  vivienda: boolean;
  personasACargo: boolean;
  contactosEmergencia: boolean;
  formularioCompleto: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormularioApiService {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  // ========== MÉTODOS DE GUARDADO TEMPORAL ==========

  guardarInformacionPersonalTemporal(info: InformacionPersonalDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/formulario/paso1/informacion-personal`,
      info,
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Información personal guardada temporalmente:', response);
        return response;
      }),
      catchError(this.handleError<ApiResponse>('guardarInformacionPersonalTemporal'))
    );
  }

  guardarEstudiosTemporal(cedula: number, estudios: EstudioAcademicoDTO[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/formulario/paso2/estudios/${cedula}`,
      estudios,
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Estudios guardados temporalmente:', response);
        return response;
      }),
      catchError(this.handleError<ApiResponse>('guardarEstudiosTemporal'))
    );
  }

  guardarVehiculosTemporal(cedula: number, vehiculos: VehiculoDTO[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/formulario/paso3/vehiculos/${cedula}`,
      vehiculos,
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Vehículos guardados temporalmente:', response);
        return response;
      }),
      catchError(this.handleError<ApiResponse>('guardarVehiculosTemporal'))
    );
  }

  guardarViviendaTemporal(cedula: number, vivienda: ViviendaDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/formulario/paso4/vivienda/${cedula}`,
      vivienda,
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Vivienda guardada temporalmente:', response);
        return response;
      }),
      catchError(this.handleError<ApiResponse>('guardarViviendaTemporal'))
    );
  }

  guardarPersonasACargoTemporal(cedula: number, personas: PersonaACargoDTO[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/formulario/paso5/personas-cargo/${cedula}`,
      personas,
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Personas a cargo guardadas temporalmente:', response);
        return response;
      }),
      catchError(this.handleError<ApiResponse>('guardarPersonasACargoTemporal'))
    );
  }

  guardarContactosEmergenciaTemporal(cedula: number, contactos: ContactoEmergenciaDTO[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/formulario/paso6/contactos-emergencia/${cedula}`,
      contactos,
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Contactos de emergencia guardados temporalmente:', response);
        return response;
      }),
      catchError(this.handleError<ApiResponse>('guardarContactosEmergenciaTemporal'))
    );
  }

  // ========== MÉTODOS DE CONSULTA TEMPORAL ==========

  obtenerInformacionPersonalTemporal(cedula: number): Observable<InformacionPersonalDTO | null> {
    return this.http.get<InformacionPersonalDTO>(
      `${this.apiUrl}/formulario/temporal/${cedula}/informacion-personal`
    ).pipe(
      catchError(error => {
        if (error.status === 404) {
          return throwError(() => null);
        }
        return this.handleError<InformacionPersonalDTO>('obtenerInformacionPersonalTemporal')(error);
      })
    );
  }

  obtenerEstudiosTemporal(cedula: number): Observable<EstudioAcademicoDTO[]> {
    return this.http.get<EstudioAcademicoDTO[]>(
      `${this.apiUrl}/formulario/temporal/${cedula}/estudios`
    ).pipe(
      catchError(this.handleError<EstudioAcademicoDTO[]>('obtenerEstudiosTemporal'))
    );
  }

  obtenerVehiculosTemporal(cedula: number): Observable<VehiculoDTO[]> {
    return this.http.get<VehiculoDTO[]>(
      `${this.apiUrl}/formulario/temporal/${cedula}/vehiculos`
    ).pipe(
      catchError(this.handleError<VehiculoDTO[]>('obtenerVehiculosTemporal'))
    );
  }

  obtenerViviendaTemporal(cedula: number): Observable<ViviendaDTO | null> {
    return this.http.get<ViviendaDTO>(
      `${this.apiUrl}/formulario/temporal/${cedula}/vivienda`
    ).pipe(
      catchError(error => {
        if (error.status === 404) {
          return throwError(() => null);
        }
        return this.handleError<ViviendaDTO>('obtenerViviendaTemporal')(error);
      })
    );
  }

  obtenerPersonasACargoTemporal(cedula: number): Observable<PersonaACargoDTO[]> {
    return this.http.get<PersonaACargoDTO[]>(
      `${this.apiUrl}/formulario/temporal/${cedula}/personas-cargo`
    ).pipe(
      catchError(this.handleError<PersonaACargoDTO[]>('obtenerPersonasACargoTemporal'))
    );
  }

  obtenerContactosEmergenciaTemporal(cedula: number): Observable<ContactoEmergenciaDTO[]> {
    return this.http.get<ContactoEmergenciaDTO[]>(
      `${this.apiUrl}/formulario/temporal/${cedula}/contactos-emergencia`
    ).pipe(
      catchError(this.handleError<ContactoEmergenciaDTO[]>('obtenerContactosEmergenciaTemporal'))
    );
  }

  // ========== MÉTODO DE GUARDADO DEFINITIVO ==========

  guardarFormularioDefinitivo(cedula: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/formulario/guardar-definitivo/${cedula}`,
      {},
      { headers: this.headers }
    ).pipe(
      map(response => {
        console.log('Formulario guardado definitivamente:', response);
        return response;
      }),
      catchError(this.handleError<any>('guardarFormularioDefinitivo'))
    );
  }

  // ========== MÉTODOS DE CONSULTA DE BASE DE DATOS ==========

  obtenerInformacionPersonalBD(cedula: number): Observable<InformacionPersonalDTO | null> {
    return this.http.get<InformacionPersonalDTO>(
      `${this.apiUrl}/consulta/informacion-personal/${cedula}`
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo información personal de BD:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerEstudiosBD(cedula: number): Observable<EstudioAcademicoDTO[]> {
    return this.http.get<EstudioAcademicoDTO[]>(
      `${this.apiUrl}/consulta/estudios-academicos/${cedula}`
    ).pipe(
      catchError(this.handleError<EstudioAcademicoDTO[]>('obtenerEstudiosBD'))
    );
  }

  obtenerVehiculosBD(cedula: number): Observable<VehiculoDTO[]> {
    return this.http.get<VehiculoDTO[]>(
      `${this.apiUrl}/consulta/vehiculos/${cedula}`
    ).pipe(
      catchError(this.handleError<VehiculoDTO[]>('obtenerVehiculosBD'))
    );
  }

  obtenerViviendaBD(cedula: number): Observable<ViviendaDTO | null> {
    return this.http.get<ViviendaDTO>(
      `${this.apiUrl}/consulta/viviendas/${cedula}`
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo vivienda de BD:', error);
        return throwError(() => error);
      })
    );
  }

  obtenerPersonasACargoBD(cedula: number): Observable<PersonaACargoDTO[]> {
    return this.http.get<PersonaACargoDTO[]>(
      `${this.apiUrl}/consulta/personas-acargo/${cedula}`
    ).pipe(
      catchError(this.handleError<PersonaACargoDTO[]>('obtenerPersonasACargoBD'))
    );
  }

  obtenerContactosEmergenciaBD(cedula: number): Observable<ContactoEmergenciaDTO[]> {
    return this.http.get<ContactoEmergenciaDTO[]>(
      `${this.apiUrl}/consulta/contactos-emergencia/${cedula}`
    ).pipe(
      catchError(this.handleError<ContactoEmergenciaDTO[]>('obtenerContactosEmergenciaBD'))
    );
  }

  obtenerDatosCompletosBD(cedula: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/consulta/datos-completos/${cedula}`
    ).pipe(
      catchError(this.handleError<any>('obtenerDatosCompletosBD'))
    );
  }

  // ========== MÉTODOS DE UTILIDAD ==========

  obtenerEstadoFormulario(cedula: number): Observable<EstadoFormulario> {
    return this.http.get<EstadoFormulario>(
      `${this.apiUrl}/formulario/estado/${cedula}`
    ).pipe(
      catchError(this.handleError<EstadoFormulario>('obtenerEstadoFormulario'))
    );
  }

  limpiarDatosTemporales(cedula: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/formulario/limpiar/${cedula}`
    ).pipe(
      catchError(this.handleError<any>('limpiarDatosTemporales'))
    );
  }

  verificarExistencia(cedula: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/consulta/existe/${cedula}`
    ).pipe(
      catchError(this.handleError<any>('verificarExistencia'))
    );
  }

  // Validaciones
  validarCedula(cedula: number): boolean {
    return !!(cedula && cedula > 0 && Number.isInteger(cedula));
  }

  validarEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0];
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      if (error.error && error.error.message) {
        return throwError(() => new Error(error.error.message));
      }
      
      return throwError(() => new Error(`Error en ${operation}: ${error.message || error}`));
    };
  }
} 