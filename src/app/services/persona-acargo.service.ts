import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaACargoService {
  private apiUrl = 'http://localhost:8080/api/personas-cargo';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Guardar personas a cargo de un usuario específico
  guardarPersonasACargo(idUsuario: number, personas: any[]): Observable<any> {
    console.log(`👨‍👩‍👧‍👦 Guardando ${personas.length} personas a cargo para usuario ID: ${idUsuario}`);
    
    return this.http.post<any>(`${this.apiUrl}/usuario/${idUsuario}`, personas, this.httpOptions)
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
    
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al obtener personas a cargo:', error);
          return throwError(() => new Error(`Error al obtener personas a cargo: ${error.message || error}`));
        })
      );
  }
} 