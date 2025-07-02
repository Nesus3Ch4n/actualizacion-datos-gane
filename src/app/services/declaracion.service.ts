import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeclaracionService {
  private apiUrl = 'http://localhost:8080/api/declaraciones';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Guardar declaraciones de conflicto de un usuario específico
  guardarDeclaraciones(idUsuario: number, declaraciones: any[]): Observable<any> {
    console.log(`⚖️ Guardando ${declaraciones.length} declaraciones de conflicto para usuario ID: ${idUsuario}`);
    
    return this.http.post<any>(`${this.apiUrl}/usuario/${idUsuario}`, declaraciones, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('❌ Error al guardar declaraciones:', error);
          return throwError(() => new Error(`Error al guardar declaraciones: ${error.message || error}`));
        })
      );
  }

  // Obtener declaraciones de conflicto de un usuario específico
  obtenerDeclaracionesPorUsuario(idUsuario: number): Observable<any[]> {
    console.log(`📋 Obteniendo declaraciones de conflicto para usuario ID: ${idUsuario}`);
    
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error al obtener declaraciones:', error);
          return throwError(() => new Error(`Error al obtener declaraciones: ${error.message || error}`));
        })
      );
  }
} 