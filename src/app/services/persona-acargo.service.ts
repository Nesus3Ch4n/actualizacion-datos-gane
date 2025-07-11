import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaACargoService {
  private apiUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Guardar personas a cargo de un usuario específico
  guardarPersonasACargo(idUsuario: number, personas: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formulario/personas-acargo/guardar?idUsuario=${idUsuario}`, personas, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar personas a cargo:', error);
          return throwError(() => new Error(`Error al guardar personas a cargo: ${error.message || error}`));
        })
      );
  }

  // Obtener personas a cargo de un usuario específico
  obtenerPersonasPorIdUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/consulta/personas-acargo-id/${idUsuario}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar personas a cargo:', error);
          return throwError(() => new Error(`Error al guardar personas a cargo: ${error.message || error}`));
        })
      );
  }
} 