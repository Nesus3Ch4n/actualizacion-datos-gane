import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaACargoService {
  private apiUrl = 'http://localhost:8080/api';

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
    console.log(`👨‍👩‍👧‍👦 Guardando ${personas.length} personas a cargo para usuario ID: ${idUsuario}`);
    
    return this.http.post<any>(`${this.apiUrl}/formulario/personas-acargo/guardar?idUsuario=${idUsuario}`, personas, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar personas a cargo:', error);
          return throwError(() => new Error(`Error al guardar personas a cargo: ${error.message || error}`));
        })
      );
  }

  // Obtener personas a cargo de un usuario específico
  obtenerPersonasPorUsuario(idUsuario: number): Observable<any[]> {
    console.log(`📋 Obteniendo personas a cargo para usuario ID: ${idUsuario}`);
    
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/formulario/personas-acargo/obtener?idUsuario=${idUsuario}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data || [];
          } else {
            return [];
          }
        }),
        catchError(error => {
          console.error('❌ Error al obtener personas a cargo:', error);
          return throwError(() => new Error(`Error al obtener personas a cargo: ${error.message || error}`));
        })
      );
  }
} 